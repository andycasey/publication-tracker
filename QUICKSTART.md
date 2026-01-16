# Quick Start Guide for Non-Technical Users

This guide will help you set up the Publication Tracker for your institution. Don't worry if you're not familiar with programming - just follow these steps!

## What You'll Need

1. A Google account
2. About 30 minutes of time
3. Three free API keys (we'll help you get these)

## Step 1: Install Required Software

### Install Node.js

1. Go to https://nodejs.org/
2. Download the "LTS" version (the one recommended for most users)
3. Run the installer and follow the prompts
4. Accept all default settings

### Install Git

1. Go to https://git-scm.com/downloads
2. Download Git for your operating system
3. Run the installer
4. Accept all default settings

### Verify Installation

Open Terminal (Mac) or Command Prompt (Windows) and type:

```bash
node --version
git --version
```

You should see version numbers. If you do, you're ready to proceed!

## Step 2: Get the Code

1. Open Terminal (Mac) or Command Prompt (Windows)

2. Navigate to where you want to store the code (e.g., your Documents folder):
   ```bash
   cd Documents
   ```

3. Download the code:
   ```bash
   git clone https://github.com/yourusername/publication-tracker.git
   cd publication-tracker
   ```

## Step 3: Run the Setup

In your terminal, type:

```bash
npm install
npm run setup
```

The setup wizard will:
1. Install necessary tools
2. Ask you to log in to Google (a browser window will open)
3. Ask if you want to create a new spreadsheet or use an existing one
4. Create configuration files

**Choose "Create a new Google Spreadsheet"** if this is your first time.

## Step 4: Deploy the Code

After setup completes, deploy the code to Google:

```bash
npm run push
```

You should see a success message!

## Step 5: Get Your API Keys

You need three free API keys. Follow the [API Keys Guide](./API_KEYS_GUIDE.md) to get them:

1. **NASA ADS** - Get it here: https://ui.adsabs.harvard.edu/user/settings/token
   - Create account → Settings → API Token → Generate

2. **Google Gemini** - Get it here: https://aistudio.google.com/app/apikey
   - Click "Create API Key" → Copy the key

3. **SerpAPI** - Get it here: https://serpapi.com/manage-api-key
   - Sign up → Copy the key from dashboard

Keep these keys in a safe place (like a password manager).

## Step 6: Configure Your Tracker

1. Open your Google Spreadsheet
   - It should have been created during setup
   - Or open an existing one if you connected to one

2. Look for the "Publications" menu at the top
   - If you don't see it, refresh the page

3. Click: **Publications → ⚙️ Run Setup Wizard**

4. Fill in the form:

   **Institution Information:**
   - Institution Name: e.g., "Columbia University"
   - Department Name: e.g., "Department of Astronomy" (optional)

   **API Keys:**
   - Paste the three keys you got in Step 5
   - Click "Test API Connections" to make sure they work

   **Search Configuration:**
   - Click "Generate default queries from institution name"
   - This will create search queries for you
   - You can customize them later if needed

   **Email Notifications:**
   - Enter email addresses for people who should receive updates
   - Separate multiple emails with commas

5. Click **"Complete Setup"**

You're done! 🎉

## Step 7: Test It Out

### Search for Publications

1. In your spreadsheet, click: **Publications → Search for new papers**
2. Wait a few minutes while it searches
3. You should see publications appear in the spreadsheet!

### Create Slides

1. Click: **Publications → Summarise and create slides for recent papers**
2. This will use AI to create summaries and presentation slides
3. Check the staging slide deck (link is in the spreadsheet)

## Setting Up Automated Updates

To run searches automatically every day:

1. In your spreadsheet, click: **Extensions → Apps Script**
2. Click the clock icon (⏰ Triggers) on the left
3. Click **+ Add Trigger** (bottom right)
4. Set up:
   - Function: `periodicSynchronizeSheet`
   - Event source: Time-driven
   - Type: Day timer
   - Time: 9am to 10am (or whatever you prefer)
5. Click **Save**

Repeat for weekly slide decks:
- Function: `periodicCreateNewSlideDeck`
- Type: Week timer
- Day: Friday
- Time: 5pm to 6pm

## GitHub Setup (Optional but Recommended)

This lets you automatically deploy code changes from GitHub.

### Create a GitHub Repository

1. Go to https://github.com and sign in (create account if needed)
2. Click the "+" in top right → "New repository"
3. Name it "publication-tracker"
4. Keep it Private
5. Click "Create repository"

### Connect Your Code to GitHub

In your terminal (in the publication-tracker folder):

```bash
git remote add origin https://github.com/YOUR_USERNAME/publication-tracker.git
git branch -M main
git add .
git commit -m "Initial commit"
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### Set Up Automatic Deployment

1. In your terminal, type:
   ```bash
   cat ~/.clasprc.json
   ```
   Copy the entire output

2. In another terminal window, type:
   ```bash
   cat .clasp.json
   ```
   Copy this output too

3. Go to your GitHub repository online
4. Click "Settings" → "Secrets and variables" → "Actions"
5. Click "New repository secret"
6. Create two secrets:
   - Name: `CLASPRC_JSON`, Value: (paste the first output)
   - Name: `CLASP_JSON`, Value: (paste the second output)

Now, whenever you push changes to GitHub, they'll automatically deploy to Google Apps Script!

## Troubleshooting

### "Setup not complete" error
- Run the setup wizard again: Publications → ⚙️ Configuration

### No publications appearing
- Check your search queries in the setup wizard
- Make sure your institution name is spelled correctly
- Try a broader search

### API errors
- Test your API keys in the setup wizard
- Make sure you haven't exceeded free tier limits
- Try regenerating the keys

### Code not updating
- Make sure you ran `npm run push`
- Check that .clasp.json has the correct Script ID
- Try running `npm run open` to see the Apps Script project

## Getting Help

1. Check the [README.md](./README.md) for detailed information
2. Review the [API Keys Guide](./API_KEYS_GUIDE.md) for API issues
3. Look at the Apps Script execution logs:
   - Extensions → Apps Script
   - Click "Executions" (≡ icon on left)
4. Open an issue on GitHub

## Next Steps

Once everything is working:

1. **Add authors to track**
   - Open the "Authors" sheet
   - Add names of researchers to track (one per row)
   - Even if they don't list your institution

2. **Customize search queries**
   - Fine-tune in the setup wizard
   - See the README for examples

3. **Set up automated emails**
   - Configure in the Publications menu
   - Choose who receives notifications

4. **Share with colleagues**
   - Share the spreadsheet with view/edit access
   - They can see publications and slides

Congratulations! You now have an automated publication tracking system! 🎓
