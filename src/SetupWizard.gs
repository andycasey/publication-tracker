/**
 * Setup Wizard Module
 * Provides a web interface for initial configuration
 */

/**
 * Show the setup wizard
 */
function showSetupWizard() {
  const html = HtmlService.createHtmlOutputFromFile('SetupWizard')
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
    if (key.includes('API_KEY') && value) {
      safeConfig[key] = value.substring(0, 8) + '...(configured)';
      safeConfig[key + '_IS_SET'] = true;
    } else {
      safeConfig[key] = value;
    }
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

    // Validate
    const validation = config.validate();
    if (!validation.valid) {
      return {
        success: false,
        error: 'Configuration incomplete: ' + validation.missing.join(', ')
      };
    }

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
        ['', '', 'TLDR', 'Figure URL', 'Citation (Byline)', 'Cross-Center', 'Authors (Institutional)', 'Authors (Cross-Center)', 'Citation (BibTeX)', 'ID (NASA/ADS)', 'Bibcode', 'arXiv ID', 'DOI', 'Title', 'Authors', 'Publication', 'Bibstem', 'Publisher', 'Copyright', 'Abstract', 'Volume', 'Issue', 'Page', 'Posted Year', 'Pub Year', 'Pub Month', 'URL (NASA/ADS)', 'URL (arXiv)', 'URL (arXiv HTML)', 'Citations', 'Reads', 'Cite/Read Boost', 'Classic Factor', 'Pub Date', 'Updated', 'Added']
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

    // Create template slide without image
    const templateSlideNoImage = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    templateSlideNoImage.setSkipped(true);

    // Add title
    const titleShape = templateSlideNoImage.insertTextBox('{{Title}}', 25, 25, 700, 60);
    titleShape.getText().getTextStyle()
      .setBold(true)
      .setFontSize(20);

    // Add summary
    const summaryShape = templateSlideNoImage.insertTextBox('{{Summary}}', 25, 100, 700, 200);
    summaryShape.getText().getTextStyle()
      .setFontSize(14);

    // Add citation
    const citationShape = templateSlideNoImage.insertTextBox('{{Citation}}', 25, 320, 700, 40);
    citationShape.getText().getTextStyle()
      .setFontSize(10)
      .setItalic(true);

    // Create template slide with image
    const templateSlideWithImage = templateSlideNoImage.duplicate();
    // The image will be inserted programmatically at position 450, 25, 300x300

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

    // Mark setup as complete
    config.markSetupComplete();

    return {
      success: true,
      message: 'Setup completed successfully!',
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
 */
function testApiConnections() {
  const config = getConfig();
  const results = {
    nasa_ads: false,
    gemini: false,
    serpapi: false
  };

  // Test NASA ADS
  try {
    const apiKey = config.get(CONFIG_KEYS.NASA_ADS_API_KEY);
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
  } catch (error) {
    results.nasa_ads = false;
  }

  // Test Gemini
  try {
    const apiKey = config.get(CONFIG_KEYS.GEMINI_API_KEY);
    const modelName = config.get(CONFIG_KEYS.GEMINI_MODEL_NAME);

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
  } catch (error) {
    results.gemini = false;
  }

  // Test SerpAPI
  try {
    const apiKey = config.get(CONFIG_KEYS.SERPAPI_API_KEY);
    const url = "https://serpapi.com/search.json?engine=google_scholar&q=test&api_key=" + apiKey;

    const options = {
      "method": "GET",
      "muteHttpExceptions": true
    };

    const response = UrlFetchApp.fetch(url, options);
    results.serpapi = response.getResponseCode() === 200;
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
