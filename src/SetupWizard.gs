/**
 * Setup Wizard Module
 * Provides a web interface for initial configuration
 */

/**
 * Show the setup wizard
 */
function showSetupWizard() {
  const html = HtmlService.createHtmlOutputFromFile('SetupWizard_template')
    .setWidth(800)
    .setHeight(600)
    .setTitle('Publication Tracker Setup');

  SpreadsheetApp.getUi().showModalDialog(html, 'Setup Wizard');
}

/**
 * Get current configuration for the setup wizard
 */
function getSetupConfiguration() {
  const config = getConfig();
  const all = config.getAll();

  // Don't send full API keys to the client
  const safeConfig = {};
  for (const [key, value] of Object.entries(all)) {
    safeConfig[key] = value;
  }

  return safeConfig;
}

/**
 * Save configuration from setup wizard
 */
function saveSetupConfiguration(configData) {
  try {
    const config = getConfig();

    // Validate required fields
    const required = ['INSTITUTION_NAME', 'NASA_ADS_API_KEY', 'GEMINI_API_KEY', 'SERPAPI_API_KEY', 'EMAIL_RECIPIENTS'];
    const missing = [];

    for (const field of required) {
      if (!configData[field] || configData[field].trim() === '') {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      return {
        success: false,
        error: 'Missing required fields: ' + missing.join(', ')
      };
    }

    // Save configuration
    config.setMultiple(configData);

    return {
      success: true,
      message: 'Configuration saved successfully!'
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Initialize spreadsheet structure
 */
function initializeSpreadsheet() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const config = getConfig();
    const sheetName = config.get(CONFIG_KEYS.SHEET_NAME) || 'Publications';
    const impactSheetName = config.get(CONFIG_KEYS.IMPACT_SHEET_NAME) || 'Impact';

    // Create Publications sheet if it doesn't exist
    let pubSheet = spreadsheet.getSheetByName(sheetName);
    if (!pubSheet) {
      pubSheet = spreadsheet.insertSheet(sheetName);

      // Set up headers
      const headers = [
        ['', '', 'TL; DR', 'Figure URL', 'Byline Citation', 'NASA/ADS ID', 'Bibliographic Code', 'arXiv Identifier', 'Digital Object Identifier', 'Title', 'Authors', 'Journal', 'Bibstem', 'Publisher', 'Copyright', 'Abstract', 'Volume', 'Issue', 'Page', 'Posted Year', 'Published Year', 'Published Month', 'NASA/ADS', 'arXiv', 'arXiv HTML', 'Citation count', 'Read count (90 d)', 'Cite Read Boost', 'Classic Factor', 'Publication date', 'Last updated', 'Added to database']
      ];

      pubSheet.getRange(1, 1, 1, headers[0].length).setValues(headers);
      pubSheet.getRange(1, 1, 1, headers[0].length).setFontWeight('bold');
      pubSheet.setFrozenRows(2);
      pubSheet.setFrozenColumns(2);
    }

    // Create Impact sheet if it doesn't exist
    let impactSheet = spreadsheet.getSheetByName(impactSheetName);
    if (!impactSheet) {
      impactSheet = spreadsheet.insertSheet(impactSheetName);

      // Set up headers
      const headers = [
        ['Timestamp', 'ID', 'Citations', 'Reads', 'Cite/Read Boost', 'Classic Factor']
      ];

      impactSheet.getRange(1, 1, 1, headers[0].length).setValues(headers);
      impactSheet.getRange(1, 1, 1, headers[0].length).setFontWeight('bold');
      impactSheet.setFrozenRows(1);
    }

    // Create Authors sheet if it doesn't exist
    let authorsSheet = spreadsheet.getSheetByName('Authors');
    if (!authorsSheet) {
      authorsSheet = spreadsheet.insertSheet('Authors');

      const headers = [
        ['Instructions:', '', ''],
        ['Add author names (one per row) below to track their publications even when they don\'t list institutional affiliation.', '', ''],
        ['This is useful for:', '', ''],
        ['- Recent hires who may still publish with their previous affiliation', '', ''],
        ['- Authors who sometimes omit institutional affiliation', '', ''],
        ['- Tracking specific researchers of interest', '', ''],
        ['', '', ''],
        ['Author Name', '', '']
      ];

      authorsSheet.getRange(1, 1, headers.length, 1).setValues(headers);
      authorsSheet.getRange(8, 1).setFontWeight('bold');
    }

    return {
      success: true,
      message: 'Spreadsheet initialized successfully!'
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Create template presentation
 */
function createTemplatePresentation() {
  try {
    const config = getConfig();
    const institutionName = config.get(CONFIG_KEYS.INSTITUTION_NAME) || 'Institution';

    // Create a new presentation
    const presentation = SlidesApp.create(institutionName + ' Publications - Staging');
    const presentationId = presentation.getId();

    // Get slides
    const slides = presentation.getSlides();

    // Clear default slide
    if (slides.length > 0) {
      slides[0].remove();
    }

    // Create first template slide
    const templateSlide1 = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    templateSlide1.setSkipped(true);

    // Add title (large text)
    const titleShape1 = templateSlide1.insertTextBox('{{Title}}', 25, 25, 670, 80);
    titleShape1.getText().getTextStyle()
      .setBold(true)
      .setFontSize(24);

    // Add summary (smaller text)
    const summaryShape1 = templateSlide1.insertTextBox('{{Summary}}', 25, 120, 670, 180);
    summaryShape1.getText().getTextStyle()
      .setFontSize(14);

    // Add citation (smaller text)
    const citationShape1 = templateSlide1.insertTextBox('{{Citation}}', 25, 315, 670, 50);
    citationShape1.getText().getTextStyle()
      .setFontSize(12)
      .setItalic(true);

    // Create second template slide (identical to first)
    const templateSlide2 = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    templateSlide2.setSkipped(true);

    // Add title (large text)
    const titleShape2 = templateSlide2.insertTextBox('{{Title}}', 25, 25, 670, 80);
    titleShape2.getText().getTextStyle()
      .setBold(true)
      .setFontSize(24);

    // Add summary (smaller text)
    const summaryShape2 = templateSlide2.insertTextBox('{{Summary}}', 25, 120, 670, 180);
    summaryShape2.getText().getTextStyle()
      .setFontSize(14);

    // Add citation (smaller text)
    const citationShape2 = templateSlide2.insertTextBox('{{Citation}}', 25, 315, 670, 50);
    citationShape2.getText().getTextStyle()
      .setFontSize(12)
      .setItalic(true);

    // Save presentation ID to config
    config.set(CONFIG_KEYS.PRESENTATION_ID, presentationId);

    return {
      success: true,
      message: 'Template presentation created successfully!',
      presentationId: presentationId,
      url: 'https://docs.google.com/presentation/d/' + presentationId
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Complete the setup process
 */
function completeSetup(configData) {
  try {
    // Save configuration
    const saveResult = saveSetupConfiguration(configData);
    if (!saveResult.success) {
      return saveResult;
    }

    // Initialize spreadsheet
    const spreadsheetResult = initializeSpreadsheet();
    if (!spreadsheetResult.success) {
      return spreadsheetResult;
    }

    // Create template presentation if not exists
    const config = getConfig();
    let presentationId = config.get(CONFIG_KEYS.PRESENTATION_ID);

    if (!presentationId || presentationId.trim() === '') {
      const presentationResult = createTemplatePresentation();
      if (!presentationResult.success) {
        return presentationResult;
      }
      presentationId = presentationResult.presentationId;
    }

    // Validate configuration
    const validation = config.validate();
    if (!validation.valid) {
      return {
        success: false,
        error: 'Configuration incomplete: ' + validation.missing.join(', ')
      };
    }

    // Update cell A1 with link to staging deck
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = config.get(CONFIG_KEYS.SHEET_NAME) || 'Publications';
    const pubSheet = spreadsheet.getSheetByName(sheetName);
    const institutionName = config.get(CONFIG_KEYS.INSTITUTION_NAME) || 'Institution';

    if (pubSheet) {
      const stagingDeckUrl = 'https://docs.google.com/presentation/d/' + presentationId;
      pubSheet.getRange('A1').setFormula('=HYPERLINK("' + stagingDeckUrl + '", "→ Staging Deck")');
    }

    // Create triggers
    createAutomationTriggers();

    // Mark setup as complete
    config.markSetupComplete();

    // Delete the Instructions sheet if it exists
    try {
      const instructionsSheet = spreadsheet.getSheetByName('Instructions');
      if (instructionsSheet) {
        spreadsheet.deleteSheet(instructionsSheet);
      }
    } catch (error) {
      logger('Could not delete Instructions sheet: ' + error.toString());
    }

    // Run initial synchronization for 100 papers)
    synchronizeSheet(limit=100, false);

    return {
      success: true,
      message: 'Setup completed successfully! Initial synchronization is complete.',
      presentationId: presentationId
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Test API connections
 * @param {string} nasaAdsApiKey - NASA ADS API key to test
 * @param {string} geminiApiKey - Gemini API key to test
 * @param {string} serpapiApiKey - SerpAPI API key to test
 * @param {string} geminiModel - Gemini model name (optional, defaults to config value)
 */
function testApiConnections(nasaAdsApiKey, geminiApiKey, serpapiApiKey, geminiModel) {
  const config = getConfig();
  const results = {
    nasa_ads: false,
    gemini: false,
    serpapi: false
  };

  // Test NASA ADS
  try {
    const apiKey = nasaAdsApiKey || config.get(CONFIG_KEYS.NASA_ADS_API_KEY);
    if (!apiKey || apiKey.trim() === '') {
      results.nasa_ads = false;
    } else {
      const options = {
        "method": "GET",
        "headers": {
          "Authorization": "Bearer " + apiKey,
        },
        "muteHttpExceptions": true
      };

      const url = "https://api.adsabs.harvard.edu/v1/search/query?q=star&rows=1";
      const response = UrlFetchApp.fetch(url, options);
      results.nasa_ads = response.getResponseCode() === 200;
    }
  } catch (error) {
    results.nasa_ads = false;
  }

  // Test Gemini
  try {
    const apiKey = geminiApiKey || config.get(CONFIG_KEYS.GEMINI_API_KEY);
    const modelName = geminiModel || config.get(CONFIG_KEYS.GEMINI_MODEL_NAME);

    if (!apiKey || apiKey.trim() === '') {
      results.gemini = false;
    } else {
      const payload = {
        contents: [{
          parts: [{ text: "Hello" }],
        }],
      };

      const options = {
        "method": "post",
        "headers": {
          "Content-Type": "application/json",
        },
        "payload": JSON.stringify(payload),
        "muteHttpExceptions": true
      };

      const url = "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent?key=" + apiKey;
      const response = UrlFetchApp.fetch(url, options);
      results.gemini = response.getResponseCode() === 200;
    }
  } catch (error) {
    results.gemini = false;
  }

  // Test SerpAPI
  try {
    const apiKey = serpapiApiKey || config.get(CONFIG_KEYS.SERPAPI_API_KEY);
    if (!apiKey || apiKey.trim() === '') {
      results.serpapi = false;
    } else {
      const url = "https://serpapi.com/search.json?engine=google_scholar&q=test&api_key=" + apiKey;

      const options = {
        "method": "GET",
        "muteHttpExceptions": true
      };

      const response = UrlFetchApp.fetch(url, options);
      results.serpapi = response.getResponseCode() === 200;
    }
  } catch (error) {
    results.serpapi = false;
  }

  return results;
}

/**
 * Generate default queries based on institution name
 */
function generateDefaultQueries(institutionName, departmentName) {
  const dept = departmentName || '';

  const nasaQuery = dept
    ? `(aff:("${institutionName}") AND aff:("${dept}")) AND collection:astronomy AND property:refereed AND -(title:"^Erratum:")`
    : `aff:("${institutionName}") AND collection:astronomy AND property:refereed AND -(title:"^Erratum:")`;

  const arxivQuery = dept ? `"${dept}"` : `"${institutionName}"`;

  const googleScholarQuery = dept
    ? `"${institutionName}" + "${dept}" + site:arxiv.org`
    : `"${institutionName}" + site:arxiv.org`;

  return {
    nasaQuery: nasaQuery,
    arxivQuery: arxivQuery,
    googleScholarQuery: googleScholarQuery
  };
}

/**
 * Create automation triggers for the publication tracker
 */
function createAutomationTriggers() {
  // Delete all existing triggers to avoid duplicates
  const existingTriggers = ScriptApp.getProjectTriggers();
  existingTriggers.forEach(trigger => {
    ScriptApp.deleteTrigger(trigger);
  });

  // synchronizeSheet on Tuesday, Wednesday, Thursday at 5-6am
  ScriptApp.newTrigger('synchronizeSheet')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.TUESDAY)
    .atHour(5)
    .create();

  ScriptApp.newTrigger('synchronizeSheet')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.WEDNESDAY)
    .atHour(5)
    .create();

  ScriptApp.newTrigger('synchronizeSheet')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.THURSDAY)
    .atHour(5)
    .create();

  // periodicSynchronizeSheet on Monday at 5-6am
  ScriptApp.newTrigger('periodicSynchronizeSheet')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(5)
    .create();

  // periodicCreateNewSlideDeck on Friday at 5-6am
  ScriptApp.newTrigger('periodicCreateNewSlideDeck')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.FRIDAY)
    .atHour(5)
    .create();

  // summariseMostRecentPapers every hour
  ScriptApp.newTrigger('summariseMostRecentPapers')
    .timeBased()
    .everyHours(1)
    .create();
}
