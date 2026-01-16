/**
 * Utility Functions Module
 * Common helper functions used throughout the application
 */

/**
 * Logger function that respects VERBOSE setting
 */
function logger(m) {
  const constants = getConstants();
  if (constants.VERBOSE) {
    Logger.log(m);
  }
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date) {
  var year = date.getFullYear();
  var month = (date.getMonth() + 1).toString().padStart(2, '0');
  var day = date.getDate().toString().padStart(2, '0');
  return year + "-" + month + "-" + day;
}

/**
 * Parse date from string
 */
function parseDate(string) {
  return Utilities.parseDate(string.split("T")[0], "GMT", "yyyy-MM-dd");
}

/**
 * Check if today is a weekend
 */
function isWeekend() {
  const today = Utilities.formatDate(new Date(), "-4", "EEEE");
  const weekend = ["Saturday", "Sunday"];
  return weekend.includes(today);
}

/**
 * Split list into chunks of specified size
 */
function splitListIntoChunks(list, chunkSize) {
  const result = [];
  for (let i = 0; i < list.length; i += chunkSize) {
    result.push(list.slice(i, i + chunkSize));
  }
  return result;
}

/**
 * Get column data from sheet
 */
function getColumnData(sheet, column) {
  var lastRow = sheet.getLastRow();
  var range = sheet.getRange(1, column, lastRow, 1);
  var values = range.getValues();
  return values;
}

/**
 * Insert publication rows with checkboxes
 */
function insertPublicationRows(sheet, rows=1) {
  const constants = getConstants();

  sheet.insertRowsBefore(constants.HEADER_ROWS + 1, rows);

  sheet
    .getRange(1 + constants.HEADER_ROWS, 1, rows, constants.LEFT_COLUMNS)
    .insertCheckboxes();

  sheet
    .getRange(1 + constants.HEADER_ROWS, constants.COLUMN_CROSS_CENTER, rows, 1)
    .insertCheckboxes();
}

/**
 * Get arXiv number from alternate bibcode
 */
function getArxivNumber(alternate_bibcode) {
  if (typeof alternate_bibcode === 'undefined') {
    return null;
  }

  var arXivNumber = null;
  for (const bibcode of alternate_bibcode) {
    if (bibcode.includes("arXiv")) {
      var s = (
        bibcode
        .split("arXiv")[1]
        .replace(/^\./, '')
        .replace(/[A-Z]+$/, '')
      );
      arXivNumber = (s.substring(0, 4) + "." + s.substring(4)).replace('..', '.');
    }
  }
  return arXivNumber;
}

/**
 * Parse Flatiron affiliation to determine center
 * This can be customized for other institutions
 */
function parseFlatironAffiliation(aff) {
  const is_fi = (aff.match(/Flatiron Institute/) !== null);
  const is_scc = (aff.match(/Scientific Computing Core/) !== null);

  const ccx = {
    "Astrophysics": "CCA",
    "Quantum Mechanics": "CCQ",
    "Mathematics": "CCM",
    "Biology": "CCB",
    "Neuroscience": "CCN",
  };

  const name = aff.match(/Cent[er]{2} for Computational (\w+\s?\w+|\w+), Flatiron Institute/);

  return {
    is_fi: is_fi,
    is_scc: is_scc,
    ccx: name === null ? null : ccx[name[1]],
  };
}

/**
 * Format author list for citation (first last, (...) and others)
 */
function citationAuthorList(doc, showFirst=3, ellipsis="{...}") {
  var author_names = [];

  for (let a=0; a < doc.author.length; a++) {
    if ((a < showFirst) | (doc.cca_author.includes(doc.author[a]))) {
      if (doc.author[a].indexOf(",") <= 0) {
        author_names.push(doc.author[a]);
      } else {
        const last = doc.author[a].split(",")[0];
        const given = doc.author[a].split(", ")[1];
        author_names.push(given + " " + last);
      }
    } else {
      author_names.push("{...}");
    }
  }

  var v = (
    author_names
    .join(" and ")
    .replace(/( and \{\.\.\.\})+/g, ' and {...}')
    .replace(/ and \{\.\.\.\}$/, " and others")
    .replace('{...}', ellipsis)
  );

  return v;
}

/**
 * Format author list for slides
 */
function slideCitationAuthorList(doc, showFirst=1) {
  var author_names = [];

  for (let a=0; a < doc.author.length; a++) {
    if ((a < showFirst) | (doc.cca_author.includes(doc.author[a]))) {
      if (doc.author[a].indexOf(",") <= 0) {
        author_names.push(doc.author[a]);
      } else {
        const last = doc.author[a].split(",")[0];
        const given = doc.author[a].split(", ")[1];
        author_names.push(given + " " + last);
      }
    } else {
      author_names.push("...");
    }
  }

  var s = (
    author_names
    .join(", ")
    .replace(/(\.\.\.,\s)+/g, '..., ')
    .replace(/\.\.\.$/, " and others")
  );

  var s = s.replace(", ...,  and others", ", and others");
  return s;
}

/**
 * Format shortened author list
 */
function shortenedAuthorList(authors, show_max_authors = 5) {
  if (authors.length > show_max_authors) {
    var author_names = authors[0]["name"];
    var cca_author_names = [];

    authors.forEach(author => {
      if (author["has_cca_affiliation"]) {
        cca_author_names.push(author["name"]);
      }
    });

    if ((cca_author_names.length > 0) & (cca_author_names[0] != authors[0]["name"])) {
      author_names = author_names + " et al., including " + cca_author_names.join(", ");
    } else {
      author_names += " et al.";
    }
  } else {
    var author_names = [];
    authors.forEach(author => {
      author_names.push(author["name"]);
    });
    author_names = author_names.join(", ");
  }

  return author_names;
}

/**
 * Find nth occurrence of a figure tag in HTML string
 */
function findFigureNumber(htmlString, n, figureTag) {
  let count = 0;
  let index = 0;

  while (count < n && index < htmlString.length) {
    index = htmlString.indexOf(figureTag, index);
    if (index !== -1) {
      count++;
      if (count === n) {
        return index;
      }
      index += figureTag.length;
    } else {
      break;
    }
  }

  return -1;
}

/**
 * Get search author names from Authors sheet
 */
function getSearchAuthorNames() {
  var SEARCH_AUTHOR_LAST_NAMES = [];
  var SEARCH_AUTHOR_NAMES = [];

  try {
    SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName("Authors")
      .getRange("A9:A1000")
      .getValues()
      .filter(String)
      .forEach(m => {
        SEARCH_AUTHOR_LAST_NAMES.push(m[0].split(" ").at(-1));
        SEARCH_AUTHOR_NAMES.push(m[0]);
      });
  } catch (error) {
    logger("Error loading author names: " + error.toString());
  }

  return {
    lastNames: SEARCH_AUTHOR_LAST_NAMES,
    fullNames: SEARCH_AUTHOR_NAMES
  };
}
