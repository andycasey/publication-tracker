/**
 * Main Module
 * Entry points, menu functions, and periodic tasks
 */

/**
 * Called when spreadsheet is opened
 */
function onOpen() {
  const config = getConfig();
  const isOwner = isCurrentUserOwner();

  // Check if setup is complete
  if (!config.isSetupComplete()) {
    // Only show setup wizard to the owner
    if (isOwner) {
      SpreadsheetApp.getUi()
        .createMenu('Publications')
        .addItem('⚙️ Run Setup Wizard', 'showSetupWizard')
        .addToUi();
    }
    return;
  }

  // Regular menu
  const menu = SpreadsheetApp.getUi()
    .createMenu('Publications')
    .addItem('Search for new papers', 'synchronizeSheet')
    .addItem('Summarise and create slides for recent papers', 'summariseMostRecentPapers')
    .addSeparator()
    .addSubMenu(
      SpreadsheetApp.getUi()
        .createMenu('Send emails..')
        .addItem('Summarising new papers', 'periodicSynchronizeSheet')
        .addItem('Create slide deck from staging', 'periodicCreateNewSlideDeck')
        .addItem('Test slide deck creation', 'testCreateNewSlideDeck'),
    );

  // Only add Configuration option for the owner
  if (isOwner) {
    menu.addSeparator()
        .addItem('⚙️ Configuration', 'showSetupWizard');
  }

  menu.addToUi();
}

/**
 * Periodic task: Synchronize sheet and send email
 */
function periodicSynchronizeSheet() {
  const config = getConfig();

  if (!config.isSetupComplete()) {
    throw new Error("Setup not complete. Please run the setup wizard first.");
  }

  const constants = getConstants();
  const start = (new Date());
  const updated = synchronizeSheet(limit=null, do_google_scholar=true);
  const completed = (((new Date()).getTime() - start.getTime()) / 1000);

  const institutionName = config.get(CONFIG_KEYS.INSTITUTION_NAME) || 'Institution';

  MailApp.sendEmail({
    to: constants.PERIODIC_EMAIL_RECIPIENTS,
    cc: constants.PERIODIC_EMAIL_CC_LIST || '',
    subject: institutionName + " Publications",
    htmlBody: ("<html><body>"
    + "<p>Dear colleague,</p>"
    + "<p>The <a href=\"https://docs.google.com/spreadsheets/d/" + updated.spreadsheet_id + "\">" + institutionName + " Publications spreadsheet</a> has been updated. Here is a summary of the changes:</p>"
    + "<p><b>" + (config.get(CONFIG_KEYS.DEPARTMENT_NAME) || institutionName) + "</b></p>"
    + "<ul>"
    + "<li>New from NASA/ADS: " + updated.new_publications + "</li>"
    + "<li>Updated from NASA/ADS: " + updated.updated_publications + "</li>"
    + "<li>New from arXiv: " + updated.new_pre_prints + "</li>"
    + "<li>Skipped from arXiv: " + updated.skipped_pre_prints + "</li>"
    + "<li>New from arXiv (via Google Scholar): " + updated.new_pre_prints_from_google_scholar + "</li>"
    + "<li>Skipped from arXiv (via Google Scholar): " + updated.skipped_pre_prints_from_google_scholar + "</li>"
    + "</ul>"
    + "<p>Synchronization completed in " + Utilities.formatString("%1.0f", completed) + " seconds.</p>"
    + "<p>The <a href=\"https://docs.google.com/presentation/d/" + constants.PRESENTATION_ID + "\">" + institutionName + " Publications Staging</a> slide deck will be updated throughout the week, and a new slide deck will be emailed on Friday.</p>"
    + getHelpfulLinksHtml()
    + "<p>Best wishes,<br> 🤖</p>"
    )
  });
}

/**
 * Periodic task: Create new slide deck and send email
 */
function periodicCreateNewSlideDeck() {
  const config = getConfig();

  if (!config.isSetupComplete()) {
    throw new Error("Setup not complete. Please run the setup wizard first.");
  }

  const constants = getConstants();
  const institutionName = config.get(CONFIG_KEYS.INSTITUTION_NAME) || 'Institution';
  const today = formatDate(new Date());
  const newSlideId = createNewSlideDeckFromStaging(institutionName + " Publications " + today);
  var blob = DriveApp.getFileById(newSlideId).getBlob();

  MailApp.sendEmail({
    to: constants.PERIODIC_EMAIL_RECIPIENTS,
    cc: constants.PERIODIC_EMAIL_CC_LIST || '',
    subject: institutionName + " Publications",
    htmlBody: ("<html><body>"
    + "<p>Dear colleague,</p>"
    + "<p>A <a href=\"https://docs.google.com/presentation/d/" + newSlideId + "\">new slide deck</a> has been created from the <a href=\"https://docs.google.com/presentation/d/" + constants.PRESENTATION_ID + "\">" + institutionName + " Publications staging deck</a>.</p>"
    + "<p>A PDF copy of the new slide deck is attached with this email, but you can edit the Google Slide deck if you need to make changes.</p>"
    + getHelpfulLinksHtml()
    + "<p>Best wishes,<br> 🤖</p>"
    + "</body></html>"
    ),
    attachments: [blob],
  });
}

/**
 * Test function: Create new slide deck
 */
function testCreateNewSlideDeck() {
  const config = getConfig();

  if (!config.isSetupComplete()) {
    throw new Error("Setup not complete. Please run the setup wizard first.");
  }

  const constants = getConstants();
  const institutionName = config.get(CONFIG_KEYS.INSTITUTION_NAME) || 'Institution';
  const today = formatDate(new Date());
  const name = institutionName + " Publications " + today;

  const newFile = DriveApp.getFileById(constants.PRESENTATION_ID).makeCopy();
  const newSlideId = newFile.getId();
  const newPresentation = SlidesApp.openById(newSlideId);

  newPresentation.setName(name);

  // Delete first two template slides
  var new_slides = newPresentation.getSlides();
  new_slides[0].remove();
  new_slides[1].remove();

  const recipients = constants.PERIODIC_EMAIL_RECIPIENTS.split(",");
  const ccList = constants.PERIODIC_EMAIL_CC_LIST ? constants.PERIODIC_EMAIL_CC_LIST.split(",") : [];

  newPresentation.addEditors(recipients);
  if (ccList.length > 0) {
    newPresentation.addEditors(ccList);
  }

  newPresentation.saveAndClose();
  var blob = DriveApp.getFileById(newPresentation.getId()).getBlob();

  // Get current user email for testing
  const currentUser = Session.getActiveUser().getEmail();

  MailApp.sendEmail({
    to: currentUser,
    subject: institutionName + " Publications [test]",
    htmlBody: ("<html><body>"
    + "<p>Dear colleague,</p>"
    + "<p>A <a href=\"https://docs.google.com/presentation/d/" + newSlideId + "\">new slide deck</a> has been created from the <a href=\"https://docs.google.com/presentation/d/" + constants.PRESENTATION_ID + "\">" + institutionName + " Publications staging deck</a>.</p>"
    + "<p>A PDF copy of the new slide deck is attached with this email, but you can edit the Google Slide deck if you need to make changes.</p>"
    + getHelpfulLinksHtml()
    + "<p>Best wishes,<br> 🤖</p>"
    + "</body></html>"
    ),
    attachments: [blob],
  });
}
