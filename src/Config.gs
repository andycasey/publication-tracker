/**
 * Configuration Management Module
 * Handles all configuration storage and retrieval using Script Properties
 */

const CONFIG_KEYS = {
  // API Keys
  NASA_ADS_API_KEY: 'NASA_ADS_API_KEY',
  GEMINI_API_KEY: 'GEMINI_API_KEY',
  SERPAPI_API_KEY: 'SERPAPI_API_KEY',

  // Institution Settings
  INSTITUTION_NAME: 'INSTITUTION_NAME',
  DEPARTMENT_NAME: 'DEPARTMENT_NAME',

  // Query Settings
  NASA_ADS_QUERY: 'NASA_ADS_QUERY',
  ARXIV_QUERY: 'ARXIV_QUERY',
  GOOGLE_SCHOLAR_QUERY: 'GOOGLE_SCHOLAR_QUERY',

  // Email Settings
  EMAIL_RECIPIENTS: 'EMAIL_RECIPIENTS',
  EMAIL_CC_LIST: 'EMAIL_CC_LIST',

  // Sheet Settings
  SHEET_NAME: 'SHEET_NAME',
  IMPACT_SHEET_NAME: 'IMPACT_SHEET_NAME',

  // Presentation Settings
  PRESENTATION_ID: 'PRESENTATION_ID',

  // Other Settings
  GEMINI_MODEL_NAME: 'GEMINI_MODEL_NAME',
  VERBOSE: 'VERBOSE',
  SETUP_COMPLETE: 'SETUP_COMPLETE'
};

/**
 * Configuration class for managing settings
 */
class Config {

  constructor() {
    this.properties = PropertiesService.getScriptProperties();
  }

  /**
   * Get a configuration value
   */
  get(key) {
    const value = this.properties.getProperty(key);

    // Handle boolean values
    if (value === 'true') return true;
    if (value === 'false') return false;

    // Handle null/undefined
    if (value === null || value === undefined) {
      return this.getDefaultValue(key);
    }

    return value;
  }

  /**
   * Set a configuration value
   */
  set(key, value) {
    if (value === null || value === undefined) {
      this.properties.deleteProperty(key);
    } else {
      this.properties.setProperty(key, String(value));
    }
  }

  /**
   * Set multiple configuration values at once
   */
  setMultiple(configObject) {
    const properties = {};
    for (const [key, value] of Object.entries(configObject)) {
      if (value !== null && value !== undefined) {
        properties[key] = String(value);
      }
    }
    this.properties.setProperties(properties);
  }

  /**
   * Get all configuration values
   */
  getAll() {
    return this.properties.getProperties();
  }

  /**
   * Check if setup is complete
   */
  isSetupComplete() {
    return this.get(CONFIG_KEYS.SETUP_COMPLETE) === true;
  }

  /**
   * Mark setup as complete
   */
  markSetupComplete() {
    this.set(CONFIG_KEYS.SETUP_COMPLETE, true);
  }

  /**
   * Reset all configuration
   */
  reset() {
    this.properties.deleteAllProperties();
  }

  /**
   * Get default value for a configuration key
   */
  getDefaultValue(key) {
    const defaults = {
      [CONFIG_KEYS.VERBOSE]: true,
      [CONFIG_KEYS.GEMINI_MODEL_NAME]: 'gemini-2.5-flash-lite',
      [CONFIG_KEYS.SHEET_NAME]: 'Publications',
      [CONFIG_KEYS.IMPACT_SHEET_NAME]: 'Impact',
      [CONFIG_KEYS.SETUP_COMPLETE]: false,
    };
    return defaults[key] || null;
  }

  /**
   * Validate that all required configuration is present
   */
  validate() {
    const required = [
      CONFIG_KEYS.NASA_ADS_API_KEY,
      CONFIG_KEYS.GEMINI_API_KEY,
      CONFIG_KEYS.SERPAPI_API_KEY,
      CONFIG_KEYS.INSTITUTION_NAME,
      CONFIG_KEYS.NASA_ADS_QUERY,
      CONFIG_KEYS.EMAIL_RECIPIENTS,
      CONFIG_KEYS.PRESENTATION_ID
    ];

    const missing = [];
    for (const key of required) {
      if (!this.get(key)) {
        missing.push(key);
      }
    }

    return {
      valid: missing.length === 0,
      missing: missing
    };
  }

  /**
   * Get configuration as an object (for display purposes)
   */
  toObject() {
    const config = {};
    for (const key of Object.values(CONFIG_KEYS)) {
      const value = this.get(key);

      // Mask sensitive keys
      if (key.includes('API_KEY') && value) {
        config[key] = value.substring(0, 8) + '...';
      } else {
        config[key] = value;
      }
    }
    return config;
  }
}

/**
 * Global configuration instance
 */
function getConfig() {
  return new Config();
}

/**
 * Constants that depend on configuration
 */
function getConstants() {
  const config = getConfig();

  return {
    VERBOSE: config.get(CONFIG_KEYS.VERBOSE),
    NASA_ADS_API_KEY: config.get(CONFIG_KEYS.NASA_ADS_API_KEY),
    GEMINI_API_KEY: config.get(CONFIG_KEYS.GEMINI_API_KEY),
    SERPAPI_API_KEY: config.get(CONFIG_KEYS.SERPAPI_API_KEY),
    GEMINI_MODEL_NAME: config.get(CONFIG_KEYS.GEMINI_MODEL_NAME),
    PERIODIC_EMAIL_RECIPIENTS: config.get(CONFIG_KEYS.EMAIL_RECIPIENTS),
    PERIODIC_EMAIL_CC_LIST: config.get(CONFIG_KEYS.EMAIL_CC_LIST),
    NASA_ADS_QUERY_STRING: escape(config.get(CONFIG_KEYS.NASA_ADS_QUERY)),
    ARXIV_QUERY_STRING: escape(config.get(CONFIG_KEYS.ARXIV_QUERY)),
    IMPACT_SHEET_NAME: config.get(CONFIG_KEYS.IMPACT_SHEET_NAME),
    SHEET_NAME: config.get(CONFIG_KEYS.SHEET_NAME),
    PRESENTATION_ID: config.get(CONFIG_KEYS.PRESENTATION_ID),

    // Fixed constants
    HEADER_ROWS: 2,
    LEFT_COLUMNS: 0,
    COLUMN_TLDR: 1,
    COLUMN_FIGURE_URL: 2,
    COLUMN_BYLINE_CITATION: 3,
    COLUMN_INDEX_ADS: 4,
    COLUMN_INDEX_ARXIV: 6,
    COLUMN_DOI: 7,
    COLUMN_TITLE: 8,
    COLUMN_ABSTRACT: 14,
    COLUMN_ARXIV_HTML_URL: 23,
    COLUMN_ADDED_STRING: 30,
    LEFT_DO_NOT_OVERWRITE: 5,

    SLIDE_TEMPLATE_NO_IMAGE_INDEX: 0,
    SLIDE_TEMPLATE_IMAGE_INDEX: 1,

    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  };
}

/**
 * Generate HTML for helpful links
 */
function getHelpfulLinksHtml() {
  const config = getConfig();
  const institutionName = config.get(CONFIG_KEYS.INSTITUTION_NAME) || 'Institution';
  const presentationId = config.get(CONFIG_KEYS.PRESENTATION_ID);

  return (
    "<p>Some helpful links:"
  + "<ul>"
  + "<li>The <a href=\"https://docs.google.com/spreadsheets/d/" + SpreadsheetApp.getActiveSpreadsheet().getId() + "\">" + institutionName + " Publications</a> spreadsheet</li>"
  + (presentationId ? "<li>The <a href=\"https://docs.google.com/presentation/d/" + presentationId + "\">staging slide deck</a></li>" : "")
  + "<li>The <a href=\"https://script.google.com/home\">Google Apps Script</a> dashboard</li>"
  + "</ul></p>"
  );
}
