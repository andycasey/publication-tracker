# Publication Tracker

An automated system for tracking academic publications from your institution using NASA ADS, arXiv, and Google Scholar. Originally developed for the Flatiron Institute's Center for Computational Astrophysics, now refactored to be easily deployable for any institution.

## Features

- 🔍 **Automated Publication Discovery**: Searches NASA ADS, arXiv, and Google Scholar
- 📊 **Google Sheets Integration**: Organizes publications in a structured spreadsheet
- 🎨 **Slide Generation**: Automatically creates presentation slides with AI-generated summaries
- 📧 **Email Notifications**: Regular updates about new publications
- 📈 **Impact Tracking**: Monitors citation counts and read counts over time
- ⚙️ **Easy Configuration**: Web-based setup wizard (no coding required!)

## Two Deployment Options

### ⭐ Option 1: Template Spreadsheet (Recommended for Most Users)

**Best for:** Non-technical users, quick setup, individual departments

**Pros:**
- ✅ No coding or command line
- ✅ Setup in 5 minutes
- ✅ Just copy a spreadsheet
- ✅ Perfect for non-technical users

**Get started:** See **[FOR_END_USERS.md](./FOR_END_USERS.md)**

---

### 🔧 Option 2: GitHub Deployment (For Developers)

**Best for:** Developers, version control, automated deployments, maintaining code

**Pros:**
- ✅ Full version control
- ✅ Automated deployments via GitHub Actions
- ✅ Easy to update and maintain
- ✅ Good for managing multiple instances

**Get started:** Continue reading this README

---

## Quick Start (GitHub Deployment)

### Prerequisites

- A Google account
- Node.js (v14 or higher)
- Git

### Installation

1. **Clone this repository**
   ```bash
   git clone https://github.com/yourusername/publication-tracker.git
   cd publication-tracker
   ```

2. **Run the setup script**
   ```bash
   npm install
   npm run setup
   ```

   The setup script will:
   - Install dependencies
   - Log you in to Google Apps Script (via `clasp`)
   - Help you create or connect to a Google Spreadsheet
   - Generate necessary configuration files

3. **Push code to Google Apps Script**
   ```bash
   npm run push
   ```

4. **Open your spreadsheet and run the setup wizard**
   - Open the Google Spreadsheet you created/connected
   - A "Publications" menu will appear
   - Click "Publications" > "⚙️ Run Setup Wizard"
   - Fill in your institution details and API keys (see [API Keys Guide](./API_KEYS_GUIDE.md))

## Configuration

### Required API Keys

You'll need three API keys:

1. **NASA ADS API Key** - For searching astronomical publications
   - Get it at: https://ui.adsabs.harvard.edu/user/settings/token

2. **Google Gemini API Key** - For AI-powered paper summaries
   - Get it at: https://aistudio.google.com/app/apikey

3. **SerpAPI API Key** - For Google Scholar searches
   - Get it at: https://serpapi.com/manage-api-key

For detailed instructions, see [API_KEYS_GUIDE.md](./API_KEYS_GUIDE.md)

### Setup Wizard

The setup wizard will ask you for:

- **Institution name** (e.g., "Columbia University")
- **Department/Center name** (optional, e.g., "Department of Astronomy")
- **API keys** (see above)
- **Search queries** (can be auto-generated from your institution name)
- **Email recipients** for notifications

## Usage

Once configured, you can use the system through the "Publications" menu in your spreadsheet:

### Manual Operations

- **Search for new papers** - Manually trigger a search for new publications
- **Summarise and create slides** - Generate AI summaries and slides for recent papers

### Automated Operations

Set up time-based triggers for automated operation:

1. Open your spreadsheet
2. Go to Extensions > Apps Script
3. Click "Triggers" (clock icon)
4. Add triggers for:
   - `periodicSynchronizeSheet` - Daily/weekly search for new publications
   - `periodicCreateNewSlideDeck` - Weekly slide deck creation

### Email Notifications

- **Summarising new papers** - Send email with summary of newly found publications
- **Create slide deck from staging** - Create a new slide deck and email it as PDF

## GitHub Actions Deployment

To set up automatic deployment when you push changes to GitHub:

1. **Run `clasp login` locally** and complete authentication

2. **Get your clasp credentials**
   ```bash
   cat ~/.clasprc.json
   ```

3. **Get your project configuration**
   ```bash
   cat .clasp.json
   ```

4. **Add secrets to your GitHub repository**
   - Go to your repository settings > Secrets and variables > Actions
   - Add two secrets:
     - `CLASPRC_JSON`: Contents of `~/.clasprc.json`
     - `CLASP_JSON`: Contents of `.clasp.json`

5. **Push to main branch** - The workflow will automatically deploy your code

## Project Structure

```
publication-tracker/
├── src/
│   ├── Config.gs           # Configuration management
│   ├── SetupWizard.gs      # Setup wizard server-side code
│   ├── SetupWizard.html    # Setup wizard UI
│   ├── Utils.gs            # Utility functions
│   ├── APIs.gs             # External API integrations
│   ├── Publications.gs     # Publication data management
│   ├── Slides.gs           # Slide creation
│   └── Main.gs             # Menu and entry points
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions workflow
├── setup.js                # Local setup script
├── package.json
├── appsscript.json         # Apps Script manifest
├── .claspignore
├── README.md
└── API_KEYS_GUIDE.md
```

## Customization

### Modifying Search Queries

The default queries search for publications with your institution's affiliation. You can customize them in the setup wizard or directly in the configuration.

**NASA ADS Query Examples:**
```
aff:("Columbia University") AND collection:astronomy AND property:refereed
aff:("Your Institution") AND aff:("Your Department") AND property:refereed
```

**arXiv Query Examples:**
```
"Department of Astronomy"
"Center for Computational Astrophysics"
```

### Tracking Specific Authors

To track publications from specific researchers (even when they don't list your institution):

1. Open the "Authors" sheet in your spreadsheet
2. Add author names (one per row) starting at row 9
3. The system will search for papers by these authors

### Customizing Affiliations

The `parseFlatironAffiliation()` function in `Utils.gs` can be modified to recognize your institution's department/center structure.

## Troubleshooting

### "Setup not complete" error

Run the setup wizard: Publications > ⚙️ Run Setup Wizard

### API connection failures

1. Check your API keys in the setup wizard
2. Use "Test API Connections" button to verify
3. Ensure you haven't exceeded API rate limits

### Code not updating after push

1. Check `.claspignore` to ensure files aren't excluded
2. Verify your `.clasp.json` has the correct Script ID
3. Try `clasp pull` to see if there are conflicts

### Email notifications not working

1. Check email addresses in configuration
2. Ensure the script has permission to send emails
3. Check Apps Script execution logs for errors

## Advanced Usage

### Scheduling

Set up time-based triggers in Apps Script:

- **Daily sync**: `periodicSynchronizeSheet()` at 9:00 AM
- **Weekly slides**: `periodicCreateNewSlideDeck()` on Fridays at 5:00 PM

### Batch Processing

For large backlogs, use the limit parameter:

```javascript
synchronizeSheet(limit=100, do_google_scholar=true)
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Credits

Originally developed for the Flatiron Institute's Center for Computational Astrophysics.
Refactored and generalized by Andrew Casey.

## Support

For issues and questions:
- Open an issue on GitHub
- Check the [API Keys Guide](./API_KEYS_GUIDE.md) for API-related problems
- Review Apps Script execution logs for errors

## Creating a Template Spreadsheet

If you want to deploy this as a **copy-able template** instead of using GitHub/clasp:

1. **Follow the instructions in:** [TEMPLATE_SETUP.md](./TEMPLATE_SETUP.md)
2. **Share the template** using the special `/copy` URL format
3. **Users just copy the spreadsheet** - no command line needed!

This is the **easiest approach for end users** and recommended for most institutions.

---

## Comparison of Deployment Methods

| Feature | Template Spreadsheet | GitHub Deployment |
|---------|---------------------|-------------------|
| **Setup Complexity** | ⭐ Very Easy | 🔧 Moderate |
| **Time to Deploy** | 5 minutes | 15-30 minutes |
| **Technical Skills** | None required | Command line, Git |
| **Version Control** | Manual | Automatic (Git) |
| **Updates** | Manual code copy | Git pull/push |
| **Auto-deployment** | No | Yes (GitHub Actions) |
| **Best For** | Individual users | Developers, maintainers |

**Recommendation:**
- **End users:** Use the template spreadsheet ([FOR_END_USERS.md](./FOR_END_USERS.md))
- **Developers/maintainers:** Use GitHub deployment (this README)
- **Create once, share many:** Create a template, share with your institution

---

## Changelog

### v1.0.0 (2024)
- Initial release
- Modular architecture
- Web-based setup wizard
- GitHub Actions integration
- Template spreadsheet option
- Automated slide generation
- Multi-source publication discovery
