/**
 * External APIs Module
 * Handles all interactions with external APIs (NASA ADS, arXiv, Google Scholar, Gemini)
 */

/**
 * Query NASA ADS for publications
 */
function queryADS(limit=null) {
  const constants = getConstants();

  var options = {
    "method": "GET",
    "headers": {
      "Authorization": "Bearer " + constants.NASA_ADS_API_KEY,
    }
  };

  var docs = [];
  var start = 0;
  const max_rows = 2000;
  const rows = limit === null ? max_rows : Math.min(limit, max_rows);

  while (true) {
    var url = (
      "https://api.adsabs.harvard.edu/v1/search/query?"
    + "q=" + constants.NASA_ADS_QUERY_STRING
    + "&start=" + start
    + "&rows=" + rows
    + "&sort=pubdate%20desc"
    + "&fl=aff,abstract,bibcode,bibstem,issue,journal,alternate_bibcode,cite_read_boost,classic_factor,doi,pub,pubdate,publisher,date,volume,year,title,author,id,arxiv,page,citation_count,read_count"
    );

    var r = UrlFetchApp.fetch(url, options);

    const d = (
      JSON
      .parse(r.getContentText())
      .response
      .docs
    );

    const num_rows = d.length;

    d.forEach(doc => {
      doc.arxiv_number = getArxivNumber(doc.alternate_bibcode);
      doc.arxiv_identifier = doc.arxiv_number === null ? null : "arXiv:" + doc.arxiv_number;
      doc.arxiv_url = doc.arxiv_number === null ? null : "https://arxiv.org/abs/" + doc.arxiv_number;
      doc.arxiv_html_url = doc.arxiv_number === null ? null : "https://arxiv.org/html/" + doc.arxiv_number + "v1";
      doc.ads_url = "http://ui.adsabs.harvard.edu/abs/" + doc.bibcode + "/abstract";
      doc.authors = doc.author.join("; ");
      doc.title = (doc.title === undefined ? "" : doc.title[0]);
      doc.issue = (doc.issue === undefined ? "" : doc.issue);
      doc.pub_month = constants.months[parseInt(doc.pubdate.split("-")[1]) - 1];
      doc.posted_year = (doc.arxiv_number === null ? "" : "20" + doc.arxiv_number.substring(0, 2));
      doc.pub_year = doc.pubdate.substring(0, 4);
      doc.bibstem = (doc.bibstem === undefined ? null : doc.bibstem[0]);
      doc.publisher = (doc.publisher === undefined ? doc.pub : doc.publisher);
      doc.doi = (doc.doi === undefined ? null : doc.doi[0]);

      // Create byline citation
      const firstAuthor = doc.author[0].split(",")[0];
      const authorCount = doc.author.length;
      const authorText = authorCount > 1 ? firstAuthor + " et al." : firstAuthor;
      doc.byline_citation = authorText + ", " + doc.pub + ", " + (doc.volume === undefined ? "accepted" : doc.volume) + (doc.issue === undefined ? "" : ", " + doc.issue) + " (" + doc.pub_year + ").";

      // Placeholder values for removed fields
      doc.tldr = null;
      doc.figure_url = null;
      doc.cite_read_boost = doc.cite_read_boost || null;
      doc.classic_factor = doc.classic_factor || null;
    });

    docs = [...docs, ...d];

    if ((num_rows == 0) | (num_rows < max_rows) | ((limit !== null) & (docs.length >= limit))) {
      break;
    } else {
      start += num_rows;
    }
  }

  return docs;
}

/**
 * Query arXiv for preprints
 */
function queryArXiv(limit=null) {
  const constants = getConstants();
  var all_manuscripts = [];
  var start = 0;
  const max_rows = 1000;
  const max_results = limit === null ? max_rows : Math.min(limit, max_rows);

  while (true) {
    var r = UrlFetchApp.fetch(
      "https://export.arxiv.org/api/query"
    + "?search_query=all:" + constants.ARXIV_QUERY_STRING
    + "&start=" + start
    + "&max_results=" + max_results
    + "&sortBy=submittedDate"
    + "&sortOrder=descending"
    );

    const ms = parseArXiv(r.getContentText());

    ms.forEach(m => {
      m.id = null;
      m.bibcode = null;
      m.arxiv_identifier = "arXiv:" + m.arxiv_number;
      m.doi = null;
      m.pub = null;
      m.volume = null;
      m.issue = null;
      m.page = null;
      m.ads_url = null;
      m.arxiv_url = "https://arxiv.org/abs/" + m.arxiv_number;
      m.arxiv_html_url = "https://arxiv.org/html/" + m.arxiv_number + "v1";
      m.citation_count = null;
      m.read_count = null;
      m.pubdate = m.published;
      m.abstract = m.summary;
      m.pub_year = "20" + m.arxiv_number.substring(0, 2);
      m.posted_year = m.pub_year;
      m.pub_month = constants.months[parseInt(m.arxiv_number.substring(2,4)) - 1];
      m.authors = m.author.join("; ");

      // Create byline citation
      const firstAuthor = m.author[0].split(" ").pop();
      const authorText = m.author.length > 1 ? firstAuthor + " et al." : firstAuthor;
      m.byline_citation = authorText + " (arXiv:" + m.arxiv_number + ").";

      // Placeholder values
      m.tldr = null;
      m.figure_url = null;
      m.cite_read_boost = null;
      m.classic_factor = null;
      m.bibstem = null;
      m.publisher = null;
      m.copyright = null;
    });

    all_manuscripts = [...all_manuscripts, ...ms];

    if ((ms.length == 0) | (ms.length < max_rows) | ((limit !== null) & (all_manuscripts.length >= limit))) {
      break;
    } else {
      start += ms.length;
    }
  }

  return all_manuscripts;
}

/**
 * Query arXiv for a specific preprint
 */
function queryArXivPrePrint(arxiv_identifier) {
  const constants = getConstants();

  var r = UrlFetchApp.fetch(
    "https://export.arxiv.org/api/query"
  + "?id_list=" + arxiv_identifier
  );

  logger("Querying " + arxiv_identifier);
  var ms = parseArXiv(r.getContentText());
  m = ms[0];
  m.id = null;
  m.bibcode = null;
  m.arxiv_identifier = "arXiv:" + m.arxiv_number;
  m.doi = null;
  m.pub = null;
  m.volume = null;
  m.issue = null;
  m.page = null;
  m.ads_url = null;
  m.arxiv_url = "https://arxiv.org/abs/" + m.arxiv_number;
  m.arxiv_html_url = "https://arxiv.org/html/" + m.arxiv_number + "v1";
  m.citation_count = null;
  m.read_count = null;
  m.pubdate = m.published;
  m.abstract = m.summary;
  m.pub_year = "20" + m.arxiv_number.substring(0, 2);
  m.posted_year = m.pub_year;
  m.pub_month = constants.months[parseInt(m.arxiv_number.substring(2,4)) - 1];
  m.authors = m.author.join("; ");

  // Create byline citation
  const firstAuthor = m.author[0].split(" ").pop();
  const authorText = m.author.length > 1 ? firstAuthor + " et al." : firstAuthor;
  m.byline_citation = authorText + " (arXiv:" + m.arxiv_number + ").";

  // Placeholder values
  m.tldr = null;
  m.figure_url = null;
  m.cite_read_boost = null;
  m.classic_factor = null;
  m.bibstem = null;
  m.publisher = null;
  m.copyright = null;

  return m;
}

/**
 * Parse arXiv XML feed
 */
function parseArXiv(feed, since = null) {
  var document = XmlService.parse(feed.replace("\n", " \n"));
  keys_simple_parse = ["id", "title", "published", "updated", "summary"];
  var entries = [];

  const authorNames = getSearchAuthorNames();

  document.getRootElement().getChildren().forEach(item => {
    if (item.getName() == "entry") {
      var parsed_entry = {author: [], aff: []};

      item.getChildren().forEach(sub_item => {
        name = sub_item.getName();

        if (keys_simple_parse.indexOf(name) !== -1) {
          parsed_entry[name] = (
            sub_item
            .getText()
            .replace(/\n/g, ' ')
            .replace(/\r/g,  ' ')
            .replace(/^\s+/, "")
          );
        }

        if (name == "author") {
          var parsed = {
            name: null,
            aff: []
          };

          sub_item.getChildren().forEach(author_attr => {
            if (author_attr.getName() == "name") {
              parsed.name = author_attr.getText().replace(/^\s+/, "");
            } else {
              affiliation_text = author_attr.getText();
              parsed.aff.push(affiliation_text);
            }
          });

          parsed_entry["author"].push(parsed["name"]);
          parsed_entry["aff"].push(parsed["aff"]);
        }
      });

      parsed_entry["arxiv_number"] = parsed_entry["id"].split("/").pop().split("v")[0];
      parsed_entry["title"] = (
        parsed_entry["title"]
        .replace(/\n/g, ' ')
        .replace(/\s/g, ' ')
        .replace(/\s+/g, ' ')
      );

      parsed_entry["short_author_list"] = (
        shortenedAuthorList(parsed_entry["author"])
        .replace(/\n/g, ' ')
        .replace(/\s/g, ' ')
        .replace(/\s+/g, ' ')
      );

      if (since !== null) {
        published = parseDate(parsed_entry["published"]);
        if (published >= since) {
          entries.push(parsed_entry);
        }
      } else {
        entries.push(parsed_entry);
      }
    }
  });

  return entries;
}

/**
 * Query Google Scholar via SerpAPI
 */
function queryGoogleScholar(q, ignore_arxiv_identifiers) {
  const constants = getConstants();
  var start = 0;
  var docs = [];
  var arxiv_identifiers = [];

  while (true) {
    var url = (
      "https://serpapi.com/search.json?"
    + "engine=google_scholar"
    + '&q=' + q
    + "&as_ylo=2024"
    + "&hl=en&api_key=" + constants.SERPAPI_API_KEY
    + "&start=" + start
    + "&num=20"
    );

    var r = UrlFetchApp.fetch(url);
    logger(url);

    var d = (
      JSON
      .parse(r.getContentText())
    );

    var total = d.search_information.total_results;

    if (d.organic_results === undefined) {
      break;
    }

    d.organic_results.forEach(result => {
      var arxiv_identifier = result.link.split("/")[4];

      if ((arxiv_identifiers.indexOf(arxiv_identifier) == -1) & (ignore_arxiv_identifiers.indexOf(arxiv_identifier) == -1)) {
        doc = queryArXivPrePrint(arxiv_identifier);
        docs.push(doc);
        arxiv_identifiers.push(arxiv_identifier);
      }
      start += 1;
    });

    if (start >= total) {
      break;
    }
  }

  return docs;
}

/**
 * Call Gemini API with a prompt
 */
function gemini(q) {
  const constants = getConstants();

  const payload = {
    contents: [{
      parts: [{ text: q }],
    }],
  };

  const options = {
    "method": "post",
    "headers": {
      "Content-Type": "application/json",
    },
    "payload": JSON.stringify(payload),
  };

  const response = UrlFetchApp.fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/" + constants.GEMINI_MODEL_NAME + ":generateContent?key=" + constants.GEMINI_API_KEY,
    options
  );

  const content = response.getContentText();
  return JSON.parse(content);
}

/**
 * Summarize paper using Gemini
 */
function summarisePaper(arxiv_html_url, title, abstract) {
  try {
    var r = UrlFetchApp.fetch(arxiv_html_url);
  } catch (error) {
    // Can't access HTML, use abstract only
    var r = gemini("I am going to give you the title and abstract of a scientific paper. I want you to tell me the key highlight of the paper in one sentence. The sentence should be written in a matter-of-fact, and be short enough to be a by-line in a newspaper. Be concise with your sentence. In your response, do not include any other context, reasoning, or explanation. Only provide the key highlight.\n\nTitle: " + title + "\n\nAbstract: " + abstract);
    return {
      figure_url: null,
      summary: r.candidates[0].content.parts[0].text
    };
  }

  const content = r.getContentText();

  const gemini_prefix = "I am going to give you HTML of a page that describes a scientific paper. I want you to tell me the key highlight of the paper in one sentence. The sentence must be short and in language that is as plain as possible, and should not use any acronymns. The sentence must not start with the phrase 'This paper ...', or any phrase like that! The sentence should be written with impact as if it will be read out on the news as a matter of fact. Be concise with your sentence. I also want you decide what you think is the single most relevant figure in the paper, and provide me with the URL to that figure. It must be a figure (e.g., png, jpeg), and it CANNOT have a video extension (e.g., mp4). The figure URL must exactly match the `src` attribute of the images in the HTML code: do not change the path of the figure in any way. Your response should be in JSON format like this:\n\n{ \"summary\": $PAPER_SUMMARY, \"figure_url\": $FIGURE_URL }\n\nIn your response, do not include any other context, reasoning, or any tick marks like ```json ```: only provide the summary and figure URL in the exact format requested. Make sure you provide valid JSON that can be parsed by Google Apps Script. If there are no figures in the paper, you can set $FIGURE_URL to null. The HTML is: \n\n";

  try {
    var r = gemini(gemini_prefix + content);
  } catch (error) {
    var r = gemini(gemini_prefix + content.substring(0, 100000));
  }

  var s = r.candidates[0].content.parts[0].text;
  var s = s.replace("```json", "").replace("```", "");
  logger("Response s: " + s);
  var p = JSON.parse(s);

  if ((p.figure_url === null) | (p.figure_url === "null")) {
    p.figure_url = "";
  } else {
    if (p.figure_url.startsWith("/html")) {
      p.figure_url = "https://arxiv.org" + p.figure_url;
    } else {
      p.figure_url = arxiv_html_url + "/" + p.figure_url;
    }
  }

  try {
    UrlFetchApp.fetch(p.figure_url);
  } catch (error) {
    logger("Exception trying to access " + p.figure_url + ": " + error);
    var start_index = findFigureNumber(content, 3, '<figure class="ltx_figure"');
    start_index += content.substring(start_index).indexOf('src="') + 5;
    var end_index = content.substring(start_index).search('"');
    p.figure_url = arxiv_html_url + "/" + content.substring(start_index, start_index + end_index);

    try {
      UrlFetchApp.fetch(p.figure_url);
    } catch (error) {
      logger("Exception trying to access " + p.figure_url + ": " + error);
      var start_index = findFigureNumber(content, 1, '<figure class="ltx_figure"');
      start_index += content.substring(start_index).indexOf('src="') + 5;
      var end_index = content.substring(start_index).search('"');
      p.figure_url = arxiv_html_url + "/" + content.substring(start_index, start_index + end_index);

      try {
        UrlFetchApp.fetch(p.figure_url);
      } catch (error) {
        logger("Exception trying to access " + p.figure_url + ": " + error);
        p.figure_url = null;
      }
    }
  }

  return p;
}
