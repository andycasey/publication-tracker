/**
 * Slides Module
 * Handles slide creation and presentation management
 */

/**
 * Create a slide in the staging presentation
 */
function createSlide(title, tldr, byline_citation, image_url=null) {
  logger(title);
  logger(tldr);
  logger(byline_citation);
  logger(image_url);

  const constants = getConstants();
  const sourcePresentation = SlidesApp.openById(constants.PRESENTATION_ID);
  const index = (((image_url !== null) & (image_url != "")) ? constants.SLIDE_TEMPLATE_IMAGE_INDEX : constants.SLIDE_TEMPLATE_NO_IMAGE_INDEX);
  const sourceSlide = sourcePresentation.getSlides()[index];

  const newSlide = sourceSlide.duplicate();
  newSlide.move(3);
  newSlide.setSkipped(false);

  // Replace text
  newSlide.getShapes().forEach(element => {
    if (element.getText().asString().includes("{{")) {
      const replaceTextMap = {
        "{{Title}}": title,
        "{{Summary}}": tldr,
        "{{Citation}}": byline_citation,
      };

      for (const [oldText, newText] of Object.entries(replaceTextMap)) {
        element.getText().replaceAllText(oldText, newText);
      }
    }
  });

  // Insert image if provided
  if (image_url !== null) {
    try {
      newSlide.insertImage(image_url, 450, 25, 300, 300);
    } catch (error) {
      logger(error);
    }
  }

  sourcePresentation.saveAndClose();
  return;
}

/**
 * Create slides for publications that don't have them yet
 */
function createSlides(limit=10) {
  const constants = getConstants();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(constants.SHEET_NAME);

  var titles = getColumnData(sheet, constants.COLUMN_TITLE);
  var tldrs = getColumnData(sheet, constants.COLUMN_TLDR);
  var byline_citations = getColumnData(sheet, constants.COLUMN_BYLINE_CITATION);
  var image_urls = getColumnData(sheet, constants.COLUMN_FIGURE_URL);
  var slide_made = getColumnData(sheet, 1);

  var count = 0;
  for (var i = 0; i < slide_made.length; i++) {
    if ((i < constants.HEADER_ROWS) | (slide_made[i][0]) | (tldrs[i][0].length < 2)) { continue; }
    if (count >= limit) { break; }

    createSlide(titles[i][0], tldrs[i][0], byline_citations[i][0], image_urls[i][0]);
    count += 1;
  }
}

/**
 * Create a new slide deck from the staging presentation
 */
function createNewSlideDeckFromStaging(name) {
  const constants = getConstants();
  const sourcePresentation = SlidesApp.openById(constants.PRESENTATION_ID);
  const newFile = DriveApp.getFileById(constants.PRESENTATION_ID).makeCopy();
  const newPresentation = SlidesApp.openById(newFile.getId());

  newPresentation.setName(name);

  // Delete first two template slides
  var new_slides = newPresentation.getSlides();
  new_slides[0].remove();
  new_slides[1].remove();

  // Remove slides from source (keep templates only)
  var slides = sourcePresentation.getSlides();
  for (var i=2; i < slides.length; i++) {
    slides[i].remove();
  }

  // Add editors
  const recipients = constants.PERIODIC_EMAIL_RECIPIENTS.split(",");
  const ccList = constants.PERIODIC_EMAIL_CC_LIST ? constants.PERIODIC_EMAIL_CC_LIST.split(",") : [];

  newPresentation.addEditors(recipients);
  if (ccList.length > 0) {
    newPresentation.addEditors(ccList);
  }

  newPresentation.saveAndClose();
  sourcePresentation.saveAndClose();

  return newPresentation.getId();
}
