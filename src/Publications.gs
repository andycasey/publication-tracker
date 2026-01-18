/**
 * Publications Module
 * Handles publication data management and spreadsheet operations
 */

/**
 * Create publication data array from publication object
 */
function publicationData(pub) {
  const now = (new Date()).toISOString();

  // Truncate long fields to avoid Google Sheets 50,000 character limit
  const maxLength = 49000;
  const truncate = (str) => {
    if (!str) return str;
    return str.length > maxLength ? str.substring(0, maxLength) + '...[truncated]' : str;
  };

  return [
    truncate(pub.tldr),
    pub.figure_url,
    truncate(pub.byline_citation),
    pub.id,
    pub.bibcode,
    pub.arxiv_identifier,
    pub.doi,
    truncate(pub.title),
    truncate(pub.authors),
    truncate(pub.pub),
    pub.bibstem,
    truncate(pub.publisher),
    truncate(pub.copyright),
    truncate(pub.abstract),
    pub.volume,
    pub.issue,
    pub.page,
    pub.posted_year,
    pub.pub_year,
    pub.pub_month,
    pub.ads_url,
    pub.arxiv_url,
    pub.arxiv_html_url,
    pub.citation_count,
    pub.read_count,
    pub.cite_read_boost,
    pub.classic_factor,
    pub.pubdate,
    now, // updated
    now, // added
  ];
}

/**
 * Main synchronization function
 */
function synchronizeSheet(limit=null, do_google_scholar=false) {
  const constants = getConstants();
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  var updated = {
    new_pre_prints: 0,
    new_pre_prints_from_google_scholar: 0,
    new_publications: 0,
    updated_pre_prints: 0,
    skipped_pre_prints: 0,
    skipped_pre_prints_from_google_scholar: 0,
    updated_publications: 0,
    spreadsheet_id: spreadsheet.getId()
  };

  var sheet = spreadsheet.getSheetByName(constants.SHEET_NAME);

  // Query arXiv
  var arxivIdentifiers = getColumnData(sheet, constants.COLUMN_INDEX_ARXIV);
  var new_pre_print_data = [];

  try {
    queryArXiv(limit).forEach(preprint => {
      var index = 1 + (
        arxivIdentifiers
        .findIndex(row => (row == preprint.arxiv_identifier))
      );

      if (index === 0) {
        new_pre_print_data.push(publicationData(preprint));
        updated.new_pre_prints += 1;
      } else {
        updated.skipped_pre_prints += 1;
      }
    });
  } catch (error) {
    logger("Exception trying to query arXiv: " + error.message);
  }

  // Insert new pre-prints
  if (updated.new_pre_prints > 0) {
    insertPublicationRows(sheet, new_pre_print_data.length);
    (
      sheet
      .getRange(1 + constants.HEADER_ROWS, 1 + constants.LEFT_COLUMNS, new_pre_print_data.length, publicationData({}).length)
      .setValues(new_pre_print_data)
    );
  }

  // Google Scholar searches
  if (do_google_scholar) {
    var new_pre_print_data_from_google_scholar = [];
    var temp_arxiv = [];

    arxivIdentifiers.forEach(item => {
      if (item.length == 1) {
        temp_arxiv.push(item[0].split(":")[1]);
      }
    });

    logger("arxiv identifiers " + temp_arxiv);

    // General Google Scholar search
    try {
      const gsQuery = constants.GOOGLE_SCHOLAR_QUERY || ('"' + getConfig().get(CONFIG_KEYS.INSTITUTION_NAME) + '" + site:arxiv.org');
      queryGoogleScholar(encodeURIComponent(gsQuery), temp_arxiv).forEach(preprint => {
        var index = 1 + (
          arxivIdentifiers
          .findIndex(row => (row == preprint.arxiv_identifier))
        );

        if (index === 0) {
          new_pre_print_data_from_google_scholar.push(publicationData(preprint));
          temp_arxiv.push(preprint.arxiv_identifier);
          updated.new_pre_prints_from_google_scholar += 1;
        } else {
          updated.skipped_pre_prints_from_google_scholar += 1;
        }
      });
    } catch (error) {
      logger("Exception trying to search Google Scholar: " + error.message);
    }

    // Name-specific Google Scholar searches
    var search_author_names = (
      spreadsheet
      .getSheetByName("Authors")
      .getRange("A9:A1000")
      .getValues()
      .filter(String)
    );

    splitListIntoChunks(search_author_names, 20).forEach(chunk => {
      try {
        var q_gs = [];
        chunk.forEach(name => {
          q_gs.push('author:"' + name[0] + '"');
        });
        q_gs = q_gs.join(" OR ");
        q_gs = "+(" + q_gs + ") +site:arxiv.org";
        q_gs = encodeURIComponent(q_gs);

        logger(q_gs);

        queryGoogleScholar(q_gs, temp_arxiv).forEach(pp => {
          if (temp_arxiv.indexOf(pp.arxiv_identifier) === -1) {
            var index = 1 + (
              arxivIdentifiers
              .findIndex(row => (row == pp.arxiv_identifier))
            );

            if (index === 0) {
              new_pre_print_data_from_google_scholar.push(publicationData(pp));
              updated.new_pre_prints_from_google_scholar += 1;
              temp_arxiv.push(pp.arxiv_identifier);
            } else {
              updated.skipped_pre_prints_from_google_scholar += 1;
            }
          }
        });
      } catch (error) {
        logger("Exception trying to search Google Scholar: " + error.message);
      }
    });

    if (updated.new_pre_prints_from_google_scholar > 0) {
      insertPublicationRows(sheet, new_pre_print_data_from_google_scholar.length);
      (
        sheet
        .getRange(1 + constants.HEADER_ROWS, 1 + constants.LEFT_COLUMNS, new_pre_print_data_from_google_scholar.length, publicationData({}).length)
        .setValues(new_pre_print_data_from_google_scholar)
      );
    }
  }

  // Query NASA/ADS
  var nasaAdsIdentifiers = getColumnData(sheet, constants.COLUMN_INDEX_ADS);
  var arxivIdentifiers = getColumnData(sheet, constants.COLUMN_INDEX_ARXIV);
  var dois = getColumnData(sheet, constants.COLUMN_DOI);

  const publications = queryADS(limit);

  logger("Found " + publications.length + ' publications from ADS (limit=' + limit + ')');

  var metrics_data = [];
  var new_publication_data = [];

  var publication_data = (
    sheet
    .getRange(1 + constants.HEADER_ROWS, constants.LEFT_COLUMNS + constants.LEFT_DO_NOT_OVERWRITE, arxivIdentifiers.length, publicationData({}).length - constants.LEFT_DO_NOT_OVERWRITE)
    .getValues()
  );

  publications.forEach(publication => {
    var index = 1 + (
      nasaAdsIdentifiers
      .findIndex(row => (row == publication.id))
    );

    let row = publicationData(publication);

    var is_new = false;
    if (index === 0) {
      var doiIndex = 1 + (
        dois
        .findIndex(row => (row == publication.doi))
      );

      if (doiIndex == 0) {
        if (publication.arxiv_number === null) {
          is_new = true;
        } else {
          var arxivIndex = 1 + (
            arxivIdentifiers
            .findIndex(row => (row == publication.arxiv_identifier))
          );
          if (arxivIndex == 0) {
            is_new = true;
          } else {
            index = arxivIndex - constants.HEADER_ROWS - 1;
          }
        }
      } else {
        index = doiIndex - constants.HEADER_ROWS - 1;
      }
    } else {
      index = index - constants.HEADER_ROWS - 1;
    }

    if (is_new) {
      new_publication_data.push(row);
      updated.new_publications += 1;
    } else {
      publication_data[index] = row.slice(constants.LEFT_DO_NOT_OVERWRITE - 1, row.length - 1);
      updated.updated_publications += 1;
    }

    // Add to metrics
    metrics_data.push([
      (new Date()).toISOString(),
      publication.id,
      publication.citation_count,
      publication.read_count,
      publication.cite_read_boost,
      publication.classic_factor
    ]);
  });

  // Update existing (in batches of 100)
  logger("Updating existing ", updated.updated_publications);
  if (updated.updated_publications > 0) {
    logger("Truly updating.." + publication_data.length);
    const batchSize = 100;
    const chunks = splitListIntoChunks(publication_data, batchSize);

    chunks.forEach((chunk, chunkIndex) => {
      const startRow = 1 + constants.HEADER_ROWS + (chunkIndex * batchSize);
      const numCols = publicationData({}).length - constants.LEFT_DO_NOT_OVERWRITE;

      sheet
        .getRange(startRow, constants.LEFT_COLUMNS + constants.LEFT_DO_NOT_OVERWRITE, chunk.length, numCols)
        .setValues(chunk);
    });
  }

  // Insert new publications
  if (updated.new_publications > 0) {
    insertPublicationRows(sheet, updated.new_publications);
    (
      sheet
      .getRange(1 + constants.HEADER_ROWS, 1 + constants.LEFT_COLUMNS, updated.new_publications, publicationData({}).length)
      .setValues(new_publication_data)
    );
  }

  // Update metrics
  var metrics_sheet = spreadsheet.getSheetByName(constants.IMPACT_SHEET_NAME);
  metrics_sheet.insertRowsBefore(2, metrics_data.length);
  (
    metrics_sheet
    .getRange(2, 1, metrics_data.length, 6)
    .setValues(metrics_data)
  );

  return updated;
}

/**
 * Summarize most recent papers
 */
function summariseMostRecentPapers(limit=25, max_slides=25, days_recency=30) {
  const constants = getConstants();
  const sourcePresentation = SlidesApp.openById(constants.PRESENTATION_ID);
  const n_to_do = max_slides - (sourcePresentation.getSlides().length - 2);

  if (n_to_do < 0) {
    logger("Already have too many slides");
    return;
  } else {
    if (n_to_do < limit) {
      logger("Limiting from " + limit + " slides to " + n_to_do);
      limit = n_to_do;
    }
  }

  logger("We have " + n_to_do + " to do");

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(constants.SHEET_NAME);

  try {
    var arxiv_html_urls = getColumnData(sheet, constants.COLUMN_ARXIV_HTML_URL);
    var titles = getColumnData(sheet, constants.COLUMN_TITLE);
    var abstracts = getColumnData(sheet, constants.COLUMN_ABSTRACT);
    var tldr = getColumnData(sheet, constants.COLUMN_TLDR);
    var byline_citations = getColumnData(sheet, constants.COLUMN_BYLINE_CITATION);
    var image_urls = getColumnData(sheet, constants.COLUMN_FIGURE_URL);
    var date_added = getColumnData(sheet, constants.COLUMN_ADDED_STRING);

    var count = 0;
    var i = constants.HEADER_ROWS;
    const now = new Date();

    while (i < arxiv_html_urls.length) {
      logger("Check " + i + " and " + limit + " with " + tldr[i][0].length + " and " + arxiv_html_urls[i][0] + " added " + date_added[i]);

      var n_days_since = (now.getTime() - (new Date(date_added[i])).getTime())/(1000 * 60 * 60 * 24);

      if (n_days_since >= days_recency) {
        logger("n days since = " + n_days_since + " so breaking");
        break;
      }

      if (count >= limit) { break; }

      if ((tldr[i][0].length < 2) & (arxiv_html_urls[i][0].startsWith("http"))) {
        count += 1;
        try {
          logger("Summarising " + arxiv_html_urls[i][0] + " with " + titles[i][0] + " and " + abstracts[i][0]);
          var p = summarisePaper(arxiv_html_urls[i][0], titles[i][0], abstracts[i][0]);
          const row = [p.summary, p.figure_url];

          (
            sheet
            .getRange(1 + i, 1 + constants.LEFT_COLUMNS, 1, 2)
            .setValues([row])
          );

          logger("Creating slide");
          createSlide(titles[i][0], p.summary, byline_citations[i][0], p.figure_url);
          logger("Created slide");
        } catch (error) {
          logger("Exception trying to summarise " + arxiv_html_urls[i][0] + ": " + error.message);
          break;
        }
      }
      i += 1;
    }
  } catch (error) {
    logger("Caught: " + error.message);
  }
}
