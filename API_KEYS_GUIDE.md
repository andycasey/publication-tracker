# API Keys Guide

This guide provides step-by-step instructions for obtaining the API keys required for the Publication Tracker.

## Overview

The Publication Tracker requires three API keys:

1. **NASA ADS API Key** - For searching astronomical publications
2. **Google Gemini API Key** - For AI-powered paper summaries
3. **SerpAPI API Key** - For Google Scholar searches

All three services offer free tiers that are sufficient for most use cases.

---

## 1. NASA ADS API Key

NASA's Astrophysics Data System (ADS) provides access to millions of astronomical and physics publications.

### Step-by-Step Instructions

1. **Create an ADS account** (if you don't have one)
   - Go to: https://ui.adsabs.harvard.edu/
   - Click "Login/Register" in the top right
   - Choose "Register" and fill in your details
   - Verify your email address

2. **Generate an API key**
   - Log in to ADS
   - Go to: https://ui.adsabs.harvard.edu/user/settings/token
   - Or navigate: Click your name (top right) → Settings → API Token
   - Click "Generate a new key"
   - Copy the key (it looks like: `AbCdEfGhIjKlMnOpQrStUvWxYz1234567890abcd`)

3. **Save your key**
   - Store it securely
   - You'll need to paste this into the setup wizard

### Free Tier Limits

- **5,000 requests per day**
- **5 requests per second**

This is more than enough for typical academic department usage.

### Troubleshooting

- **Key not working**: Make sure you copied the entire key without extra spaces
- **Rate limit errors**: You may be making too many requests. The script includes delays to prevent this.

---

## 2. Google Gemini API Key

Google Gemini is used to generate plain-language summaries of papers and extract relevant figures.

### Step-by-Step Instructions

1. **Go to Google AI Studio**
   - Visit: https://aistudio.google.com/app/apikey
   - You'll need to be logged in to your Google account

2. **Create an API key**
   - Click "Create API Key"
   - You can create a new project or use an existing one
   - Click "Create API key in new project" (recommended for first-time setup)
   - Copy the API key (it looks like: `AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567`)

3. **Save your key**
   - Store it securely
   - Keep the Google AI Studio page bookmarked for future reference

### Free Tier Limits

Gemini offers generous free tier limits:

- **Free tier**: 15 requests per minute (RPM)
- **1,500 requests per day** for Gemini 1.5 Flash
- **50 requests per day** for Gemini 1.5 Pro

The Publication Tracker uses Gemini Flash Lite by default, which is optimized for speed and cost.

### Model Options

You can change the model in the Advanced Settings of the setup wizard:

- `gemini-2.5-flash-lite` (default) - Fastest, cheapest
- `gemini-1.5-flash` - Good balance
- `gemini-1.5-pro` - Highest quality

### Troubleshooting

- **"API key not valid"**: Check that you copied the entire key
- **Rate limit errors**: You're processing too many papers at once. Reduce the batch size.
- **"Model not found"**: Make sure you're using a valid model name
- **Billing errors**: The free tier should be sufficient. If you need more, you can enable billing in Google Cloud Console.

---

## 3. SerpAPI API Key

SerpAPI provides access to Google Scholar search results, which helps find papers that might not be in NASA ADS or arXiv.

### Step-by-Step Instructions

1. **Create a SerpAPI account**
   - Go to: https://serpapi.com/
   - Click "Sign Up" or "Register"
   - You can sign up with:
     - Email and password
     - Google account
     - GitHub account

2. **Get your API key**
   - After signing up, you'll be redirected to the dashboard
   - Your API key is displayed prominently
   - Or go to: https://serpapi.com/manage-api-key
   - Copy the key (it looks like: `1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`)

3. **Save your key**
   - Store it securely
   - You can regenerate it if needed from the dashboard

### Free Tier Limits

- **100 searches per month** (free plan)
- **5 requests per second**

For departments with high publication rates, you may need to:
- Upgrade to a paid plan ($50/month for 5,000 searches)
- Or reduce the frequency of Google Scholar searches in your setup

### Troubleshooting

- **"Credit limit reached"**: You've used your 100 free searches for the month
  - Option 1: Disable Google Scholar searches until next month
  - Option 2: Upgrade to a paid plan
  - Option 3: Use a different SerpAPI account
- **"Invalid API key"**: Check that you copied the entire key
- **No results**: Google Scholar searches are supplementary. NASA ADS is the primary source.

---

## API Key Security

### Best Practices

1. **Never commit API keys to Git**
   - The setup wizard stores them securely in Google Apps Script properties
   - They are never stored in code files

2. **Don't share API keys**
   - Each person should get their own keys
   - If someone leaves your team, regenerate the keys

3. **Monitor usage**
   - Check your API dashboards periodically
   - Set up alerts for unusual activity

4. **Rotate keys periodically**
   - Consider changing keys every 6-12 months
   - Update them in the setup wizard

### How Keys Are Stored

The Publication Tracker stores API keys using Google Apps Script's `PropertiesService`, which:
- Encrypts data at rest
- Is only accessible by the script
- Is not visible in the code

---

## Cost Considerations

### Typical Monthly Usage (for a 50-person department)

**NASA ADS**: Free
- ~200 searches per month
- Well within free tier

**Google Gemini**: Free
- ~100 summaries per month
- Well within free tier

**SerpAPI**: $0-50/month
- Free tier (100 searches) may be sufficient
- Paid tier ($50) recommended for active departments

### Reducing Costs

1. **Disable Google Scholar searches**
   - NASA ADS is usually sufficient for astrophysics
   - Set `do_google_scholar=false` in periodic syncs

2. **Reduce sync frequency**
   - Weekly instead of daily
   - Only sync during academic year

3. **Limit batch sizes**
   - Process fewer papers at a time
   - Use the `limit` parameter

---

## Alternatives

### If you can't get a specific API key:

**NASA ADS**: No good alternative for astrophysics publications. This is required.

**Google Gemini**: You could:
- Manually write summaries
- Use OpenAI API (requires code changes)
- Skip automated summaries

**SerpAPI**: You could:
- Disable Google Scholar integration
- Use only NASA ADS and arXiv (usually sufficient)
- Implement direct Google Scholar scraping (may violate ToS)

---

## Testing Your Keys

After entering your keys in the setup wizard:

1. Click the **"Test API Connections"** button
2. Wait for the results (may take 10-15 seconds)
3. Check that all three show ✓ Connected

If any fail:
- Double-check you copied the entire key
- Verify the key is active in the respective dashboard
- Check for any account restrictions

---

## Support

### NASA ADS
- Documentation: https://ui.adsabs.harvard.edu/help/
- Support: adshelp@cfa.harvard.edu

### Google Gemini
- Documentation: https://ai.google.dev/docs
- Support: https://support.google.com/googleai

### SerpAPI
- Documentation: https://serpapi.com/docs
- Support: https://serpapi.com/support
- Live chat available on website

---

## Updating Keys

If you need to change any API key later:

1. Open your spreadsheet
2. Go to: Publications > ⚙️ Configuration
3. Update the relevant key(s)
4. Click "Test API Connections" to verify
5. Save

The new keys will be used immediately for all future operations.
