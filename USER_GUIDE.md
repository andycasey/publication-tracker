# Publication Tracker - User Guide

## Getting Started (5 minutes!)

### Step 1: Make Your Copy

Click this link to create your own publication tracker:

**[Create Your Copy →](https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/copy)**

*(Replace SPREADSHEET_ID with your template's ID)*

This will:
- Create a personal copy of the tracker
- Give you full edit access
- Include all the necessary code

### Step 2: Open and Wait

1. **Open your copy** of the spreadsheet
2. **Wait 5-10 seconds** for the spreadsheet to load
3. You should see a **"Publications" menu** appear in the menu bar
   - If you don't see it, refresh the page

### Step 3: Run the Setup Wizard

1. Click: **Publications → ⚙️ Run Setup Wizard**

2. A setup window will open. Fill in:

   **Institution Information:**
   - Your institution name (e.g., "Columbia University")
   - Your department/center name (optional)

   **API Keys:**
   - You'll need 3 free API keys
   - Click "Need help getting API keys?" for instructions
   - Or see: [API Keys Guide](./API_KEYS_GUIDE.md)

   **Search Configuration:**
   - Click "Generate default queries" to auto-create search queries
   - Or customize them yourself

   **Email Settings:**
   - Enter who should receive email notifications
   - Separate multiple emails with commas

3. **Click "Test API Connections"** to verify your keys work

4. **Click "Complete Setup"**

That's it! Your tracker is ready! 🎉

## Getting Your API Keys

You need 3 free API keys. Don't worry - they're all free and take ~5 minutes each:

### 1. NASA ADS API Key (Free)

1. Go to: https://ui.adsabs.harvard.edu/
2. Register for an account
3. Go to: Settings → API Token
4. Click "Generate a new key"
5. Copy the key

### 2. Google Gemini API Key (Free)

1. Go to: https://aistudio.google.com/app/apikey
2. Log in with your Google account
3. Click "Create API Key"
4. Copy the key

### 3. SerpAPI API Key (Free - 100 searches/month)

1. Go to: https://serpapi.com/
2. Sign up for a free account
3. Copy the API key from your dashboard

For detailed instructions, see: [API Keys Guide](./API_KEYS_GUIDE.md)

## Using Your Tracker

### Search for Publications (Manual)

1. Click: **Publications → Search for new papers**
2. Wait a few minutes while it searches NASA ADS, arXiv, and Google Scholar
3. New publications will appear in the "Publications" sheet

### Create Slides (Manual)

1. Click: **Publications → Summarise and create slides for recent papers**
2. The system will:
   - Use AI to create plain-language summaries
   - Extract key figures from papers
   - Create presentation slides
3. Check the "staging slide deck" (link appears after first run)

### Send Email Updates

- **Publications → Send emails → Summarising new papers**
  - Sends a summary of newly found publications

- **Publications → Send emails → Create slide deck from staging**
  - Creates a final slide deck and emails it as PDF

### Automated Updates (Recommended!)

Set up the tracker to run automatically:

1. Click: **Extensions → Apps Script**
2. Click the clock icon ⏰ (Triggers)
3. Click **+ Add Trigger** (bottom right)

**For daily publication searches:**
- Function: `periodicSynchronizeSheet`
- Event source: Time-driven
- Type: Day timer
- Time: 9am to 10am
- Click Save

**For weekly slide decks:**
- Function: `periodicCreateNewSlideDeck`
- Event source: Time-driven
- Type: Week timer
- Day: Friday
- Time: 5pm to 6pm
- Click Save

Now the system runs automatically!

## Understanding the Spreadsheet

### Publications Sheet

This is the main sheet with all publications. Columns include:

- **Title, Authors, Abstract** - Basic publication info
- **TLDR** - AI-generated summary
- **Citation** - BibTeX citation
- **URLs** - Links to NASA ADS, arXiv, etc.
- **Metrics** - Citation counts, read counts

### Impact Sheet

Tracks publication metrics over time:
- Citation counts
- Read counts
- Impact factors

### Authors Sheet

Add researcher names here (one per row, starting at row 9) to track their publications even if they don't list your institution's affiliation.

**Example use cases:**
- Recent hires still publishing with former affiliation
- Collaborators at other institutions
- Alumni you want to track

## Tips and Tricks

### Tracking Specific Researchers

1. Go to the "Authors" sheet
2. Add names starting at row 9 (one name per row)
3. Format: "FirstName LastName" (e.g., "Jane Smith")
4. Next sync will include their papers

### Customizing Search Queries

1. Click: **Publications → ⚙️ Configuration**
2. Modify the search queries
3. Test and save

**NASA ADS examples:**
```
aff:("Columbia University") AND collection:astronomy
aff:("Your Institution") AND aff:("Department Name")
```

**arXiv examples:**
```
"Department of Astronomy"
"Center for Astrophysics"
```

### Checking What Went Wrong

If something doesn't work:

1. Click: **Extensions → Apps Script**
2. Click "Executions" (≡ icon on left)
3. Look for errors in red
4. Check the execution log for details

### Sharing with Colleagues

1. Click "Share" in the top right
2. Add people's email addresses
3. Give them "Edit" access
4. They can view and modify the tracker

**Note:** Each person/department should have their own copy. Don't share the same spreadsheet between different institutions.

## Common Questions

### How often should I run searches?

- **Daily** - For active departments with many publications
- **Weekly** - For smaller groups
- **Monthly** - For tracking purposes only

### What if I exceed API limits?

**NASA ADS:** 5,000/day - You'll never hit this

**Gemini:** 1,500/day - Reduce batch sizes if needed

**SerpAPI:** 100/month free - Either:
- Upgrade to paid ($50/month for 5,000)
- Disable Google Scholar searches
- Run searches less frequently

### Can I track publications from multiple departments?

Yes! Either:
1. Use broader search queries
2. Add all relevant authors to the Authors sheet
3. Create separate trackers for each department

### How do I backup my data?

The spreadsheet is automatically backed up by Google Drive, but you can also:

1. Download as Excel: **File → Download → Microsoft Excel**
2. Make periodic copies: **File → Make a copy**
3. Use Google Takeout for full backup

### Can I customize the slides?

Yes!

1. Open the staging presentation
2. Edit the first two slides (these are templates)
3. Future slides will use your customized templates

### What if I need help?

1. Check this guide
2. Review the [API Keys Guide](./API_KEYS_GUIDE.md)
3. Look at execution logs (Extensions → Apps Script → Executions)
4. Check the Apps Script code comments
5. Contact the template creator

## Advanced Features

### Manual Configuration

Instead of the wizard, you can manually configure:

1. **Extensions → Apps Script**
2. **Project Settings** (gear icon)
3. **Script Properties** section
4. Add/edit properties

### Exporting Publications

Export to BibTeX:
1. Copy the "Citation" column
2. Paste into a .bib file
3. Use with LaTeX, Overleaf, etc.

### Custom Metrics

The Impact sheet tracks metrics over time. You can:
- Create charts from this data
- Track citation growth
- Identify trending papers

### Bulk Operations

For large backlogs:
1. **Extensions → Apps Script**
2. **Open the editor**
3. Run functions with custom parameters:
   ```javascript
   synchronizeSheet(limit=100, do_google_scholar=true)
   ```

## Troubleshooting

### "Publications menu not appearing"

- Refresh the page
- Wait 10-20 seconds
- Check that you made a copy (not viewing the template)
- Try: Extensions → Apps Script to verify code exists

### "Setup wizard won't open"

- Disable popup blockers
- Try Chrome or Firefox
- Check: Extensions → Apps Script → Executions for errors

### "No publications found"

- Verify your search queries are correct
- Test API keys in the setup wizard
- Try a broader search (just institution name)
- Check execution logs for API errors

### "API key invalid"

- Regenerate the key from the API provider
- Copy the entire key (no extra spaces)
- Test in the setup wizard
- Check that the key is activated

### "Slide creation failing"

- Check that arXiv HTML URL exists for the paper
- Verify Gemini API key is valid
- Check Gemini API quota hasn't been exceeded
- Look at execution logs for specific errors

## Data Privacy

- All data stays in your Google account
- API keys are stored securely in Script Properties
- No data is sent to third parties except:
  - NASA ADS (for publication searches)
  - arXiv (for preprint data)
  - Google Scholar via SerpAPI (for searches)
  - Google Gemini (for summarization)

## Updates

This tracker is standalone - updates require manually copying new code or creating a new copy from an updated template.

For automatic updates, consider the GitHub deployment method (see README.md).

## Getting More Help

- **API Keys:** See [API_KEYS_GUIDE.md](./API_KEYS_GUIDE.md)
- **Technical Details:** See [README.md](./README.md)
- **Template Creation:** See [TEMPLATE_SETUP.md](./TEMPLATE_SETUP.md)

---

**Ready to get started?**

**[Create Your Copy →](https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/copy)**

Happy tracking! 📚✨
