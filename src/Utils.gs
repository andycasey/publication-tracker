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
 * Insert publication rows
 */
function insertPublicationRows(sheet, rows=1) {
  const constants = getConstants();
  sheet.insertRowsBefore(constants.HEADER_ROWS + 1, rows);
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
 * Format shortened author list
 */
function shortenedAuthorList(authors, show_max_authors = 5) {
  if (authors.length > show_max_authors) {
    return authors[0] + " et al.";
  } else {
    return authors.join(", ");
  }
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

/**
 * Check if the current user is the owner of the spreadsheet
 */
function isCurrentUserOwner() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const owner = spreadsheet.getOwner();
    const currentUser = Session.getEffectiveUser();

    return owner.getEmail() === currentUser.getEmail();
  } catch (error) {
    logger("Error checking spreadsheet ownership: " + error.toString());
    // Default to false if we can't determine ownership
    return false;
  }
}
