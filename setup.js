#!/usr/bin/env node

/**
 * Setup Script for Publication Tracker
 * Helps users initialize their local environment and deploy to Google Apps Script
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

console.log('='.repeat(60));
console.log('Publication Tracker - Setup Script');
console.log('='.repeat(60));
console.log('');

// Check if node_modules exists
if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('');
}

async function main() {
  console.log('This script will help you set up the Publication Tracker.');
  console.log('');

  // Check if clasp is installed globally
  try {
    execSync('clasp --version', { stdio: 'ignore' });
  } catch (error) {
    console.log('⚠️  clasp is not installed globally.');
    console.log('Installing @google/clasp globally...');
    execSync('npm install -g @google/clasp', { stdio: 'inherit' });
    console.log('');
  }

  // Check if .clasp.json exists
  const claspJsonPath = path.join(__dirname, '.clasp.json');
  const hasClaspJson = fs.existsSync(claspJsonPath);

  if (hasClaspJson) {
    const { continueSetup } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continueSetup',
        message: '.clasp.json already exists. Do you want to reconfigure?',
        default: false
      }
    ]);

    if (!continueSetup) {
      console.log('Setup cancelled.');
      process.exit(0);
    }
  }

  // Check if user is logged in to clasp
  let isLoggedIn = false;
  try {
    execSync('clasp login --status', { stdio: 'ignore' });
    isLoggedIn = true;
    console.log('✓ You are already logged in to Google Apps Script');
  } catch (error) {
    console.log('You need to log in to Google Apps Script.');
  }

  if (!isLoggedIn) {
    const { shouldLogin } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'shouldLogin',
        message: 'Do you want to log in now?',
        default: true
      }
    ]);

    if (shouldLogin) {
      console.log('Opening browser for authentication...');
      execSync('clasp login', { stdio: 'inherit' });
      console.log('');
    } else {
      console.log('You can log in later using: npm run login');
      process.exit(0);
    }
  }

  console.log('');

  // Ask user about project setup
  const { setupType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'setupType',
      message: 'How would you like to set up your project?',
      choices: [
        {
          name: 'Create a new Google Spreadsheet with Apps Script',
          value: 'new'
        },
        {
          name: 'Use an existing Google Spreadsheet',
          value: 'existing'
        }
      ]
    }
  ]);

  let scriptId;

  if (setupType === 'new') {
    const { spreadsheetName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'spreadsheetName',
        message: 'Enter a name for your spreadsheet:',
        default: 'Publications Tracker'
      }
    ]);

    console.log('');
    console.log('Creating new spreadsheet and Apps Script project...');

    // Create a new standalone script
    try {
      const output = execSync('clasp create --type standalone --title "' + spreadsheetName + ' - Script"', { encoding: 'utf8' });
      console.log(output);

      // Extract script ID from output
      const match = output.match(/https:\/\/script\.google\.com\/d\/([^\/]+)\//);
      if (match) {
        scriptId = match[1];
      }

      // Read the generated .clasp.json
      if (fs.existsSync(claspJsonPath)) {
        const claspConfig = JSON.parse(fs.readFileSync(claspJsonPath, 'utf8'));
        scriptId = claspConfig.scriptId;
      }

      console.log('');
      console.log('✓ Project created successfully!');
      console.log('');
      console.log('IMPORTANT NEXT STEPS:');
      console.log('1. Open your Apps Script project: npm run open');
      console.log('2. Manually create a new Google Spreadsheet');
      console.log('3. In the spreadsheet, go to Extensions > Apps Script');
      console.log('4. Copy the Script ID from the URL');
      console.log('5. Update .clasp.json with that Script ID');
      console.log('6. Run: npm run push');
      console.log('');

    } catch (error) {
      console.error('Error creating project:', error.message);
      process.exit(1);
    }

  } else {
    console.log('');
    console.log('To use an existing spreadsheet:');
    console.log('1. Open your Google Spreadsheet');
    console.log('2. Go to Extensions > Apps Script');
    console.log('3. Copy the Script ID from the URL (between /d/ and /edit)');
    console.log('');

    const { existingScriptId } = await inquirer.prompt([
      {
        type: 'input',
        name: 'existingScriptId',
        message: 'Enter the Script ID:',
        validate: (input) => {
          if (input && input.length > 0) {
            return true;
          }
          return 'Please enter a valid Script ID';
        }
      }
    ]);

    scriptId = existingScriptId;

    // Create .clasp.json
    const claspConfig = {
      scriptId: scriptId,
      rootDir: "./src"
    };

    fs.writeFileSync(claspJsonPath, JSON.stringify(claspConfig, null, 2));
    console.log('✓ Created .clasp.json');
  }

  // Create .claspignore if it doesn't exist
  const claspIgnorePath = path.join(__dirname, '.claspignore');
  if (!fs.existsSync(claspIgnorePath)) {
    const claspIgnoreContent = `**/**
!src/**/*.gs
!src/**/*.html
!appsscript.json
`;
    fs.writeFileSync(claspIgnorePath, claspIgnoreContent);
    console.log('✓ Created .claspignore');
  }

  // Create appsscript.json if it doesn't exist
  const appsscriptJsonPath = path.join(__dirname, 'appsscript.json');
  if (!fs.existsSync(appsscriptJsonPath)) {
    const appsscriptConfig = {
      "timeZone": "America/New_York",
      "dependencies": {},
      "exceptionLogging": "STACKDRIVER",
      "runtimeVersion": "V8"
    };
    fs.writeFileSync(appsscriptJsonPath, JSON.stringify(appsscriptConfig, null, 2));
    console.log('✓ Created appsscript.json');
  }

  console.log('');
  console.log('Setup complete!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Push your code to Google Apps Script: npm run push');
  console.log('2. Open your spreadsheet and run the setup wizard from the Publications menu');
  console.log('3. Configure your API keys and institution settings');
  console.log('');
  console.log('For more information, see the README.md file.');
  console.log('');
}

main().catch(error => {
  console.error('Setup failed:', error);
  process.exit(1);
});
