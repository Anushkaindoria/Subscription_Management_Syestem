import nodemailer from "nodemailer";

// Mailpit (localhost:1025) pe bhejta hai. Na mile to console mein print (demo ke liye).
export async function sendMail(to: string, subject: string, text: string): Promise<void> {
  try {
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "localhost",
      port: Number(process.env.SMTP_PORT || 1025),
      secure: false,
      connectionTimeout: 2000,
      greetingTimeout: 2000,
    });
    await transport.sendMail({
      from: process.env.MAIL_FROM || "Brightloop Software <no-reply@brightloop.local>",
      to,
      subject,
      text,
    });
  } catch {
    console.log("[MAIL fallback - SMTP nahi mila]\nTo: " + to + "\nSubject: " + subject + "\n" + text);
  }
}
