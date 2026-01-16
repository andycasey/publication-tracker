# Publication Tracker

**Automatically track and showcase publications from your institution**

Built for academic departments and research centers to:
- 📚 Discover publications from NASA ADS, arXiv, and Google Scholar
- 🤖 Generate AI summaries and presentation slides
- 📊 Track citation metrics over time
- 📧 Send automated email updates
- 🎨 Create beautiful slide decks for sharing

## Get Started in 5 Minutes

### Option 1: Use the Template (Easiest! No coding!)

1. **Click here to create your copy:**

   **[→ Create Your Publication Tracker](https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/copy)**

   *(Replace SPREADSHEET_ID with the actual template ID)*

2. **Open your copy and wait** for the "Publications" menu to appear (~10 seconds)

3. **Click:** Publications → ⚙️ Run Setup Wizard

4. **Fill in:**
   - Your institution name
   - Your API keys ([Get them here](./API_KEYS_GUIDE.md) - all free!)
   - Email addresses for notifications

5. **Done!** Start tracking publications

👉 **[Read the User Guide](./USER_GUIDE.md)** for detailed instructions

---

### Option 2: Deploy from GitHub (For developers)

If you want version control and automated deployments:

1. Clone this repository
2. Run `npm install && npm run setup`
3. Deploy with `npm run push`
4. Configure via the Setup Wizard

👉 **[Read the Technical README](./README.md)** for details

---

## What You'll Need

### Three Free API Keys

1. **NASA ADS** - For publication searches
   - Sign up: https://ui.adsabs.harvard.edu/
   - Free tier: 5,000 requests/day

2. **Google Gemini** - For AI summaries
   - Get key: https://aistudio.google.com/app/apikey
   - Free tier: 1,500 requests/day

3. **SerpAPI** - For Google Scholar
   - Sign up: https://serpapi.com/
   - Free tier: 100 searches/month

**[Detailed API Key Instructions →](./API_KEYS_GUIDE.md)**

---

## Features

### 🔍 Multi-Source Discovery

Automatically searches:
- **NASA ADS** - Peer-reviewed publications
- **arXiv** - Preprints
- **Google Scholar** - Papers that might be missed

### 🤖 AI-Powered Summaries

Uses Google Gemini to:
- Generate plain-language summaries
- Extract key figures from papers
- Create presentation-ready content

### 📊 Impact Tracking

Monitor over time:
- Citation counts
- Read counts
- Impact factors

### 🎨 Automated Slides

Generates Google Slides with:
- Paper titles and summaries
- Key figures
- Citations and links
- Customizable templates

### 📧 Email Notifications

Regular updates about:
- New publications discovered
- Weekly slide deck PDFs
- Customizable recipient lists

### ⚙️ Easy Configuration

- Web-based setup wizard
- No coding required
- Test API connections
- Auto-generated search queries

---

## Who Is This For?

✅ Department administrators
✅ Research center coordinators
✅ Faculty tracking group publications
✅ Communications teams showcasing research
✅ Grant writers documenting output

**No technical background required!**

---

## Quick Links

- **[User Guide](./USER_GUIDE.md)** - How to use your tracker
- **[API Keys Guide](./API_KEYS_GUIDE.md)** - How to get API keys
- **[Template Setup](./TEMPLATE_SETUP.md)** - How to create the template (for maintainers)
- **[Technical README](./README.md)** - For developers

---

## Example Workflow

1. **Daily (automated):**
   - Search for new publications
   - Send email summary to team

2. **Throughout the week:**
   - AI generates summaries and slides
   - Slides accumulate in "staging deck"

3. **Friday (automated):**
   - Create final slide deck
   - Email as PDF to stakeholders

4. **Ongoing:**
   - Track citation metrics
   - Monitor research impact

---

## Screenshots

*(Add screenshots here of:)*
- Setup Wizard
- Publications sheet with data
- Generated slides
- Impact metrics chart

---

## Support

### Common Questions

**Q: How much does this cost?**
A: Free! All API services have generous free tiers.

**Q: Do I need to know how to code?**
A: No! Use the template and Setup Wizard.

**Q: Can I customize the search queries?**
A: Yes, through the Setup Wizard or manually.

**Q: How often are publications updated?**
A: You control it - daily, weekly, or on-demand.

**Q: Can multiple people use the same tracker?**
A: Yes, share the spreadsheet with your team.

**Q: What if I need help?**
A: Check the User Guide or contact the maintainer.

### Need Help?

1. **[User Guide](./USER_GUIDE.md)** - Step-by-step instructions
2. **[API Keys Guide](./API_KEYS_GUIDE.md)** - API setup help
3. **Execution Logs** - Extensions → Apps Script → Executions
4. **Contact** - [Your contact info here]

---

## Privacy & Security

- ✅ All data stays in your Google account
- ✅ API keys stored securely in Script Properties
- ✅ No third-party data storage
- ✅ Code is open source and auditable

---

## Credits

Originally developed for the **Flatiron Institute's Center for Computational Astrophysics**

Refactored and generalized by **Andrew Casey**

Licensed under **MIT License**

---

## Ready to Get Started?

### **[→ Create Your Tracker Now](https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/copy)**

Questions? **[Read the User Guide](./USER_GUIDE.md)**

---

*Powered by NASA ADS, arXiv, Google Scholar, and Google Gemini*
