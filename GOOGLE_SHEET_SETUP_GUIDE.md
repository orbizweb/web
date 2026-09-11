# Google Sheet & Automated Email Setup Guide for Orbiz.one

This 60-second setup connects the [Orbiz.one Contact Page](https://orbiz.one/contact.html) directly to your **Google Sheet** and sends an instant email notification to both **`contact@orbiz.one`** and **`orbizweb@gmail.com`** whenever a prospect submits their details.

---

### Step 1: Create a Google Sheet
1. Open Google Sheets ([sheets.new](https://sheets.new)) while signed into your Google account.
2. Name the sheet: **`Orbiz.one Website Leads`**.
3. *(Optional)* Leave the sheet blank—the script will automatically create professional red-and-white branded headers on the first submission!

---

### Step 2: Paste the Script
1. In the top menu of your Google Sheet, click:  
   **`Extensions` &rarr; `Apps Script`**
2. In the script editor that opens, delete any code inside the editor (`myFunction() { ... }`).
3. Copy the entire contents of [`google-apps-script-lead-engine.js`](google-apps-script-lead-engine.js) and paste it into the editor.
4. Click the **💾 Save** icon (or press `Cmd + S`).

---

### Step 3: Deploy as a Web App (One-Time)
1. Click the blue **Deploy** button (top right) &rarr; Select **`New deployment`**.
2. Beside "Select type", click the **⚙️ Gear icon** &rarr; Select **`Web app`**.
3. Fill in these 3 fields:
   * **Description**: `Orbiz Lead Engine Webhook`
   * **Execute as**: `Me (your email)`
   * **Who has access**: **`Anyone`** *(Essential: allows website visitors to submit without logging into Google)*
4. Click **Deploy**.
5. Google will ask you to **Authorize access**:
   * Click **Authorize access** &rarr; Select your Google account.
   * Click **Advanced** &rarr; Click **"Go to Untitled project (unsafe)"** *(standard Google warning for your own custom scripts)* &rarr; Click **Allow**.
6. Copy the **Web App URL** provided (it looks like `https://script.google.com/macros/s/AKfycbx.../exec`).

---

### Step 4: Add Your Web App URL to the Website
Paste your Web App URL into [`assets/script.js`](assets/script.js) on line 155:
```javascript
const GOOGLE_SCRIPT_WEBHOOK_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
```
That's it! 

---

### What Happens Automatically:
1. **Visitor Experience**:
   * The visitor clicks *"Request Strategic Briefing →"*.
   * The button displays *"Scheduling Briefing..."* with a spinner.
   * Within 1 second, an on-screen confirmation card appears:
     > **✓ Briefing Request Received!**  
     > *Thank you, [Name]! Your consultation request has been submitted directly to Orbiz leadership. We will review your requirements and reach out to [Email] within 4 business hours.*
   * The visitor never leaves your site.

2. **Google Sheet**:
   * A new row is immediately appended with:
     `Timestamp | Full Name | Work Email | Company | Phone | Areas of Interest | Project Scope`

3. **Instant Email Delivery**:
   * A beautifully styled HTML email with full prospect details and a 1-click **"Reply Directly to [Name]"** button is dispatched immediately to:
     * `contact@orbiz.one`
     * `orbizweb@gmail.com`
