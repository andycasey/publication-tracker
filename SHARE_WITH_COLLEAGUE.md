# How to Set This Up for Your Colleague

Your colleague at Columbia University wants to use this publication tracker. Here's the **absolute easiest way** to set it up for them:

## The Template Spreadsheet Approach (Recommended!)

Instead of asking them to use GitHub/command line, you'll create a **master template spreadsheet** that they can simply copy.

### Step 1: Create the Template (You do this once)

1. **Create a new Google Spreadsheet**
   - Go to https://sheets.google.com
   - Create a new blank spreadsheet
   - Name it: "Publication Tracker [TEMPLATE - DO NOT EDIT]"

2. **Add the code to it**
   - In the spreadsheet: **Extensions → Apps Script**
   - For each file in the `src/` folder, create it in Apps Script:
     - Copy `src/Config.gs` → Create "Config" script
     - Copy `src/Utils.gs` → Create "Utils" script
     - Copy `src/APIs.gs` → Create "APIs" script
     - Copy `src/Publications.gs` → Create "Publications" script
     - Copy `src/Slides.gs` → Create "Slides" script
     - Copy `src/SetupWizard.gs` → Create "SetupWizard" script
     - Copy `src/SetupWizard.html` → Create "SetupWizard" HTML file
     - Copy `src/Main.gs` → Create "Main" script
   - Update the `appsscript.json` manifest (see TEMPLATE_SETUP.md)

3. **Test it**
   - Refresh the spreadsheet
   - You should see a "Publications" menu
   - Try running the Setup Wizard

4. **Clean it up**
   - Clear any test data
   - In Apps Script: Project Settings → Delete all Script Properties
   - Add a note in cell A1: "To use this tracker, make a copy: File → Make a copy"

5. **Set sharing**
   - Click "Share" button
   - Set to: "Anyone with the link"
   - Permission: "Viewer" (important!)

6. **Get the sharing link**
   - Your spreadsheet URL looks like:
     ```
     https://docs.google.com/spreadsheets/d/1ABC123xyz/edit
     ```
   - Change it to the special "copy" format:
     ```
     https://docs.google.com/spreadsheets/d/1ABC123xyz/copy
     ```

### Step 2: Send to Your Colleague

Send them this simple message:

---

**Subject: Your Publication Tracker is Ready!**

Hi [Colleague],

I've set up the publication tracking system for you. Here's how to get started:

**1. Click this link to create your copy:**

[Create My Publication Tracker](https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/copy)

**2. After the copy is created:**
   - Open your new spreadsheet
   - Wait 10 seconds for the "Publications" menu to appear
   - Click: Publications → ⚙️ Run Setup Wizard

**3. In the Setup Wizard, you'll need:**
   - Columbia University (or your department) name
   - 3 free API keys - [get them here](https://docs.google.com/document/d/YOUR_API_GUIDE_LINK)
   - Your email for notifications

**4. That's it!**

The system will then automatically:
- Search NASA ADS, arXiv, and Google Scholar for Columbia publications
- Create AI-generated summaries
- Generate presentation slides
- Send you email updates

**Need help?** See the [User Guide](https://docs.google.com/document/d/YOUR_USER_GUIDE_LINK)

Best,
[Your name]

---

### Step 3: Share the Documentation

Host these files somewhere accessible (Google Docs, GitHub, your website):

- **API_KEYS_GUIDE.md** - Step-by-step API key instructions
- **USER_GUIDE.md** - How to use the tracker
- **FOR_END_USERS.md** - Complete getting started guide

**Or** convert them to Google Docs:
1. Create new Google Docs
2. Copy the markdown content
3. Share the Google Docs publicly
4. Send those links in your email

---

## Why This Approach?

✅ **Zero technical knowledge required**
- No command line
- No Git
- No Node.js
- Just copy a spreadsheet!

✅ **5-minute setup**
- Click a link
- Run the wizard
- Done!

✅ **Self-contained**
- Everything in one spreadsheet
- Code comes with the copy
- No external dependencies

✅ **Easy to support**
- If something breaks, you can fix the template
- Send them a new copy link
- Or walk them through the issue

---

## Alternative: GitHub Approach (Not Recommended for Non-Technical Users)

If your colleague is comfortable with:
- Command line
- Git
- Node.js

Then they could use the GitHub deployment approach. But honestly, the template is SO much easier for non-technical users.

---

## Troubleshooting the Template

### Problem: Menu doesn't appear

**Solution:**
- Refresh the page
- Wait 15-20 seconds
- Check they made a copy (not viewing the template)

### Problem: Setup wizard won't open

**Solution:**
- Check popup blockers
- Try different browser (Chrome works best)
- Check Apps Script execution log for errors

### Problem: They want to update the code later

**Solution:**
- You can update the template
- They make a fresh copy
- Export their data from old copy
- Import into new copy

Or teach them to update code in: Extensions → Apps Script

---

## Quick Start Checklist

- [ ] Create Google Spreadsheet
- [ ] Add all code files from `src/` folder
- [ ] Update appsscript.json manifest
- [ ] Test the menu and Setup Wizard
- [ ] Clear test data and script properties
- [ ] Set sharing to "Anyone with link, Viewer"
- [ ] Get the `/copy` URL format
- [ ] Create/share the API Keys Guide
- [ ] Create/share the User Guide
- [ ] Send email to colleague with `/copy` link
- [ ] Be available for questions!

---

## Sample Email Template

```
Subject: Columbia Publication Tracker - Ready to Use!

Hi [Name],

Your publication tracking system is ready! This will automatically find and track publications from Columbia University.

🚀 GET STARTED (5 minutes):

1. Click here: [Create Your Tracker](SPREADSHEET_COPY_LINK)

2. Open your new spreadsheet and click: Publications → ⚙️ Run Setup Wizard

3. You'll need 3 free API keys:
   - NASA ADS: [Get Here](API_GUIDE_LINK)
   - Google Gemini: [Get Here](API_GUIDE_LINK)
   - SerpAPI: [Get Here](API_GUIDE_LINK)

4. Fill in Columbia University info and your email

5. Done! 🎉

📖 DOCUMENTATION:
- [User Guide](USER_GUIDE_LINK) - How to use it
- [API Keys Guide](API_KEYS_GUIDE_LINK) - How to get API keys
- [Help](YOUR_CONTACT) - Contact me if you need help

The system will:
✓ Search for publications daily (you can adjust)
✓ Create AI summaries and slides
✓ Email you updates
✓ Track citations over time

Questions? Just reply to this email!

Best,
[Your Name]
```

---

## Done!

Your colleague can now set up their publication tracker in **5 minutes** without touching any code! 🎉

For detailed template creation instructions, see: [TEMPLATE_SETUP.md](./TEMPLATE_SETUP.md)
