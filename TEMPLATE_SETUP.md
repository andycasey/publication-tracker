# Creating the Template Spreadsheet

This guide explains how to create the master template spreadsheet that others can copy.

## Overview

Instead of deploying code via clasp/GitHub, we create a single **master template spreadsheet** with the Apps Script already attached. Users simply make a copy of this spreadsheet and run the Setup Wizard.

## Step 1: Create the Master Spreadsheet

1. **Create a new Google Spreadsheet**
   - Go to https://sheets.google.com
   - Click "Blank" to create a new spreadsheet
   - Name it: "Publication Tracker [TEMPLATE]"

2. **Open the Apps Script editor**
   - In your spreadsheet, click: **Extensions → Apps Script**
   - This creates a "container-bound" script attached to the spreadsheet

3. **Delete the default Code.gs file**
   - In the Apps Script editor, delete the default `function myFunction() {}` code

## Step 2: Add the Code Files

For each `.gs` file in the `src/` directory, create it in Apps Script:

1. **Click the "+" next to "Files"** in the left sidebar
2. **Select "Script"** for .gs files or **"HTML"** for .html files
3. **Name the file** (e.g., "Config", "SetupWizard", etc.)
4. **Copy and paste** the contents from the corresponding file in `src/`

### Files to create (in this order):

1. **Config** (Script)
   - Copy contents from `src/Config.gs`

2. **Utils** (Script)
   - Copy contents from `src/Utils.gs`

3. **APIs** (Script)
   - Copy contents from `src/APIs.gs`

4. **Publications** (Script)
   - Copy contents from `src/Publications.gs`

5. **Slides** (Script)
   - Copy contents from `src/Slides.gs`

6. **SetupWizard** (Script)
   - Copy contents from `src/SetupWizard.gs`

7. **SetupWizard** (HTML)
   - Click "+" → "HTML"
   - Name it exactly "SetupWizard" (same as the .gs file)
   - Copy contents from `src/SetupWizard.html`

8. **Main** (Script)
   - Copy contents from `src/Main.gs`

### Update the manifest

1. Click the gear icon ⚙️ (Project Settings) on the left
2. Check "Show 'appsscript.json' manifest file"
3. Go back to Editor
4. Click on `appsscript.json`
5. Replace contents with:

```json
{
  "timeZone": "America/New_York",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/presentations",
    "https://www.googleapis.com/auth/script.external_request",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/script.send_mail",
    "https://www.googleapis.com/auth/userinfo.email"
  ]
}
```

## Step 3: Create the Template Sheets

The Setup Wizard will create these automatically, but for a cleaner template:

### Publications Sheet

1. Rename "Sheet1" to "Publications"
2. Add headers in row 1 (or let the wizard do it)

### Impact Sheet

1. Create a new sheet named "Impact"
2. Add headers in row 1 (or let the wizard do it)

### Authors Sheet

1. Create a new sheet named "Authors"
2. Add instructions (or let the wizard do it)

## Step 4: Save and Test

1. **Save the script**: Click the disk icon or Ctrl+S (Cmd+S on Mac)

2. **Refresh the spreadsheet**: Go back to your spreadsheet tab and refresh

3. **Test the menu**: After a few seconds, you should see "Publications" in the menu bar

4. **Run the Setup Wizard**: Publications → ⚙️ Run Setup Wizard

5. **Test the setup**: Fill in dummy data and verify it works

## Step 5: Prepare for Sharing

### Clean up the template:

1. **Clear any test data** from all sheets

2. **Reset the configuration**:
   - In Apps Script editor, go to **Project Settings** (gear icon)
   - Scroll down to "Script Properties"
   - Delete all properties (if any exist)

3. **Remove any test presentations** you created

4. **Add instructions to the spreadsheet**:
   - In cell A1 of the Publications sheet, add a note:
     ```
     Welcome! To set up your publication tracker:
     1. Make a copy of this spreadsheet (File → Make a copy)
     2. Open your copy
     3. Click Publications → ⚙️ Run Setup Wizard
     4. Follow the instructions

     For help, see: [link to documentation]
     ```

### Set sharing permissions:

1. **Click "Share"** in the top right of the spreadsheet

2. **Change to "Anyone with the link"**

3. **Set to "Viewer"** (not Editor)
   - This ensures people must make a copy, they can't edit the template

4. **Copy the sharing link**

## Step 6: Create Distribution Link

Google Sheets has a special URL format that prompts users to make a copy:

Take your spreadsheet URL:
```
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
```

Change it to:
```
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/copy
```

This special `/copy` URL will:
- Automatically prompt users to make a copy
- Give them their own copy with the script attached
- Not require any permissions to the original

## Step 7: Document and Share

Create a simple webpage or README that says:

---

# Publication Tracker - Get Started

Click this link to create your own publication tracker:

**[Create Your Copy →](https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/copy)**

After making your copy:
1. Open the spreadsheet
2. Wait a few seconds for the "Publications" menu to appear
3. Click **Publications → ⚙️ Run Setup Wizard**
4. Follow the setup instructions

Need help getting API keys? See the [API Keys Guide](link-to-guide)

---

## Troubleshooting the Template

### "Publications menu not appearing"

- Refresh the spreadsheet
- Check that all script files are present in Extensions → Apps Script
- Look for errors in the Apps Script execution log

### "Setup Wizard won't open"

- Check browser popup blockers
- Try a different browser
- Check the Apps Script execution log for errors

### "Script not copied when spreadsheet is copied"

- Make sure the script is "container-bound" (created via Extensions → Apps Script in the spreadsheet)
- Verify the spreadsheet isn't using a standalone script

### "Users can edit the template"

- Make sure sharing is set to "Viewer" not "Editor"
- Use the `/copy` URL format

## Maintenance and Updates

When you need to update the code:

1. **Edit the master template**:
   - Update the code in the master spreadsheet's Apps Script

2. **Test the changes**:
   - Make a copy and test thoroughly

3. **Notify users**:
   - Users with existing copies won't get updates automatically
   - They need to either:
     - Copy the updated template and migrate their data
     - Manually update their script code
     - Use the GitHub approach for automatic updates (advanced users)

## Alternative: Library Approach (Advanced)

For more sophisticated versioning, you could:

1. Create the core code as a **Google Apps Script Library**
2. The template just calls library functions
3. Users get updates when you publish new library versions

This is more complex but allows centralized updates. See Google's documentation on Apps Script Libraries for details.

## Best Practices

1. **Version the template**: Add a version number in cell A1
2. **Change log**: Keep a sheet documenting changes
3. **Test before sharing**: Always make a fresh copy and test the full workflow
4. **Backup**: Keep a copy of the template in a safe folder
5. **Documentation**: Keep API_KEYS_GUIDE.md and other docs publicly accessible

## Summary

The template spreadsheet approach is **by far the easiest** for non-technical users:

✅ No command line
✅ No Git/GitHub
✅ No Node.js
✅ No clasp
✅ Just copy a spreadsheet

This is the recommended approach for most users!
