import nodemailer from "nodemailer";

export interface EnquiryData {
  id?: string;
  name: string;
  email: string;
  interestedIn?: string | null;
  projectGoals?: string | null;
  budget?: string | null;
  createdAt?: Date | string;
}

/**
 * Creates and returns a Nodemailer transporter configured via environment variables.
 * Returns null if required SMTP credentials are missing.
 */
function getSmtpTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  const port = Number(process.env.SMTP_PORT || 465);
  const secure =
    process.env.SMTP_SECURE !== undefined
      ? process.env.SMTP_SECURE === "true"
      : port === 465 || port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Sends an SMTP email notification when a new enquiry is received.
 */
export async function sendEnquiryNotificationEmail(enquiry: EnquiryData) {
  try {
    const transporter = getSmtpTransporter();

    if (!transporter) {
      console.warn(
        "[SMTP Mailer] SMTP credentials (SMTP_HOST, SMTP_USER, SMTP_PASS) are not configured. Email notification skipped.",
      );
      return { success: false, reason: "SMTP not configured" };
    }

    const recipient = process.env.CONTACT_EMAIL || "info@sevenstarsatmb.co.uk";

    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;
    const fromName = process.env.SMTP_FROM_NAME || "Gastro Pub";
    const sender = process.env.SMTP_FROM || `"${fromName}" <${fromEmail}>`;

    const subject = `New Enquiry: ${enquiry.interestedIn || "General Enquiry"} from ${enquiry.name}`;
    const dateFormatted = enquiry.createdAt
      ? new Date(enquiry.createdAt).toLocaleString("en-GB", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : new Date().toLocaleString("en-GB", {
          dateStyle: "medium",
          timeStyle: "short",
        });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; color: #333; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); }
            .header { background: #0B0F29; color: #ffffff; padding: 24px; text-align: center; }
            .header h1 { margin: 0; font-size: 22px; font-weight: 700; color: #D4AF37; letter-spacing: 0.5px; }
            .header p { margin: 6px 0 0 0; font-size: 13px; color: #a0aec0; }
            .body-content { padding: 30px; }
            .info-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            .info-table td { padding: 12px 8px; border-bottom: 1px solid #edf2f7; vertical-align: top; }
            .info-table td.label { font-weight: 600; color: #4a5568; width: 130px; }
            .info-table td.value { color: #1a202c; }
            .message-box { background: #f8fafc; border-left: 4px solid #D4AF37; padding: 15px; margin-top: 15px; border-radius: 4px; white-space: pre-wrap; color: #2d3748; line-height: 1.6; }
            .footer { background: #edf2f7; padding: 16px; text-align: center; font-size: 12px; color: #718096; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Gastro Pub</h1>
              <p>New Form Submission Received</p>
            </div>
            <div class="body-content">
              <table class="info-table">
                <tr>
                  <td class="label">Name:</td>
                  <td class="value"><strong>${enquiry.name}</strong></td>
                </tr>
                <tr>
                  <td class="label">Email:</td>
                  <td class="value"><a href="mailto:${enquiry.email}" style="color: #3182ce; text-decoration: none;">${enquiry.email}</a></td>
                </tr>
                <tr>
                  <td class="label">Interested In:</td>
                  <td class="value">${enquiry.interestedIn || "General Enquiry"}</td>
                </tr>
                ${
                  enquiry.budget
                    ? `<tr><td class="label">Budget:</td><td class="value">${enquiry.budget}</td></tr>`
                    : ""
                }
                <tr>
                  <td class="label">Date & Time:</td>
                  <td class="value">${dateFormatted}</td>
                </tr>
              </table>

              <div style="margin-top: 20px;">
                <div style="font-weight: 600; color: #4a5568; margin-bottom: 6px;">Message / Details:</div>
                <div class="message-box">${enquiry.projectGoals || "No message provided."}</div>
              </div>
            </div>
            <div class="footer">
              This email was automatically sent from your website enquiry system via SMTP.
            </div>
          </div>
        </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: sender,
      to: recipient,
      replyTo: enquiry.email,
      subject: subject,
      html: htmlContent,
    });

    console.log(
      "[SMTP Mailer] Email sent successfully. MessageID:",
      info.messageId,
    );
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("[SMTP Mailer Error]:", error);
    return { success: false, error: error.message || "Failed to send email" };
  }
}
