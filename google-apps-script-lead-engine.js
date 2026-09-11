/**
 * =========================================================================
 * ORBIZ.ONE LEAD ENGINE - GOOGLE APPS SCRIPT WEBHOOK
 * =========================================================================
 * Purpose:
 * 1. Captures contact form submissions from https://orbiz.one/contact.html
 * 2. Appends a new timestamped lead row into the active Google Sheet.
 * 3. Sends an instant HTML email alert to contact@orbiz.one & orbizweb@gmail.com.
 *
 * Setup:
 * 1. Open your Google Sheet (e.g. "Orbiz.one Website Leads")
 * 2. Click: Extensions > Apps Script
 * 3. Replace all code with this file's contents
 * 4. Click: Deploy > New deployment > Web app
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (allows website visitors to submit without Google login)
 * 5. Click "Deploy", authorize permissions, and copy the Web App URL!
 * =========================================================================
 */

function doPost(e) {
  // Prevent concurrent write collisions
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Auto-create column headers if sheet is newly created
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Full Name",
        "Work Email",
        "Company / Organization",
        "Phone / WhatsApp",
        "Areas of Interest",
        "Project Scope & Objectives"
      ]);
      // Style headers: Bold with Orbiz Brand Accent
      var headerRange = sheet.getRange(1, 1, 1, 7);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#c50d12");
      headerRange.setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }

    // Extract parameters from form submission (supports FormData and JSON)
    var data = {};
    if (e && e.parameter && e.parameter.name) {
      data = e.parameter;
    } else if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        data = e.parameter || {};
      }
    }

    var timestamp = new Date();
    var name = (data.name || "").trim();
    var email = (data.email || "").trim();
    var company = (data.company || "").trim();
    var phone = (data.phone || "").trim();
    var interests = (data.interests || "").trim();
    var message = (data.message || "").trim();

    // 1. Log Lead Row in Google Sheet
    sheet.appendRow([
      timestamp,
      name,
      email,
      company,
      phone,
      interests,
      message
    ]);

    // 2. Instant Email Notification to Orbiz Leadership
    var recipients = "contact@orbiz.one, orbizweb@gmail.com";
    var subject = "New Executive Briefing Request: " + name + (company ? " (" + company + ")" : "");

    var plainBody = 
      "You have received a new consultation request from the Orbiz.one Contact Page:\n\n" +
      "Full Name: " + name + "\n" +
      "Work Email: " + email + "\n" +
      "Company: " + (company || "Not specified") + "\n" +
      "Phone / WhatsApp: " + (phone || "Not specified") + "\n" +
      "Areas of Interest: " + (interests || "General Inquiry") + "\n" +
      "Project Scope: " + (message || "None provided") + "\n\n" +
      "Timestamp: " + timestamp.toString();

    var htmlBody = 
      '<div style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; line-height: 1.6; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">' +
        '<div style="background: #c50d12; padding: 20px 24px; color: #ffffff;">' +
          '<h2 style="margin: 0; font-size: 20px; font-weight: 700;">New Executive Briefing Request</h2>' +
          '<p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">Orbiz.one Website Lead Capture</p>' +
        '</div>' +
        '<div style="padding: 24px;">' +
          '<p style="font-size: 15px; margin-top: 0;">A prospect has requested an executive consultation:</p>' +
          '<table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">' +
            '<tr style="background: #f8fafc;">' +
              '<td style="padding: 10px 12px; font-weight: 600; width: 32%; border-bottom: 1px solid #e2e8f0; color: #475569;">Full Name</td>' +
              '<td style="padding: 10px 12px; font-weight: 700; border-bottom: 1px solid #e2e8f0; color: #0f172a;">' + name + '</td>' +
            '</tr>' +
            '<tr>' +
              '<td style="padding: 10px 12px; font-weight: 600; border-bottom: 1px solid #e2e8f0; color: #475569;">Work Email</td>' +
              '<td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0;"><a href="mailto:' + email + '" style="color: #c50d12; font-weight: 600; text-decoration: none;">' + email + '</a></td>' +
            '</tr>' +
            '<tr style="background: #f8fafc;">' +
              '<td style="padding: 10px 12px; font-weight: 600; border-bottom: 1px solid #e2e8f0; color: #475569;">Company</td>' +
              '<td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">' + (company || '<em>Not specified</em>') + '</td>' +
            '</tr>' +
            '<tr>' +
              '<td style="padding: 10px 12px; font-weight: 600; border-bottom: 1px solid #e2e8f0; color: #475569;">Phone / WhatsApp</td>' +
              '<td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">' + (phone ? '<a href="tel:' + phone + '" style="color: #0f172a; text-decoration: none;">' + phone + '</a>' : '<em>Not specified</em>') + '</td>' +
            '</tr>' +
            '<tr style="background: #f8fafc;">' +
              '<td style="padding: 10px 12px; font-weight: 600; border-bottom: 1px solid #e2e8f0; color: #475569;">Areas of Interest</td>' +
              '<td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; color: #c50d12; font-weight: 600;">' + (interests || 'General Consultation') + '</td>' +
            '</tr>' +
            '<tr>' +
              '<td style="padding: 10px 12px; font-weight: 600; border-bottom: 1px solid #e2e8f0; color: #475569; vertical-align: top;">Project Scope</td>' +
              '<td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a; white-space: pre-wrap;">' + (message || '<em>None specified</em>') + '</td>' +
            '</tr>' +
          '</table>' +
          '<div style="text-align: center; margin-top: 24px;">' +
            '<a href="mailto:' + email + '?subject=Re:%20Orbiz%20Executive%20Briefing%20-%20' + encodeURIComponent(name) + '" style="background: #c50d12; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-block;">Reply Directly to ' + name + ' &rarr;</a>' +
          '</div>' +
        '</div>' +
        '<div style="background: #f1f5f9; padding: 12px 24px; font-size: 12px; color: #64748b; text-align: center;">' +
          'Logged into Google Sheets automatically &bull; Response SLA: &lt; 4 Business Hours' +
        '</div>' +
      '</div>';

    MailApp.sendEmail({
      to: recipients,
      subject: subject,
      body: plainBody,
      htmlBody: htmlBody
    });

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput("Orbiz.one Lead Engine Webhook is Active and Ready.")
    .setMimeType(ContentService.MimeType.TEXT);
}
