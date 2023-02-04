const path = require("path");
const ejs = require("ejs");
const SGmail = require("@sendgrid/mail");

class Email {
  from;
  recipients;
  subject;
  constructor(recipients, subject) {
    SGmail.setApiKey(process.env.SEND_GRID_API_KEY);

    this.from = "abacusug.com@gmail.com";
    this.recipients = recipients;
    this.subject = subject;
  }

  async sendHtml(html, subject) {
    const mailOptions = {
      to: this.recipients,
      from: { email: this.from, name: "AbacusUganda" },
      subject: subject,
      html: html,
    };
    try {
      await SGmail.send(mailOptions);
    } catch (error) {
      console.log("error sending email", error);
    }
  }

  async sendWelcome(userName) {
    const html = await ejs.renderFile(
      path.join(__dirname, "../views/email/email-welcome.ejs"),
      {
        subject: this.subject,
        userName: userName,
      }
    );
    await this.sendHtml(html, "Welcome to Abacusuganda ");
  }

  async sendPasswordReset(url, userName) {
    console.log("Password reset url: ", url);

    const html = await ejs.renderFile(
      path.join(__dirname, "../views/email/email-reset-password.ejs"),
      {
        subject: "Password Reset",
        userName: userName,
        resetURL: url,
      }
    );
    await this.sendHtml(html, "Reset Password");
  }

  async sendContactUs(name, message, email, subject) {
    const html = await ejs.renderFile(
      path.join(__dirname, "../views/email/email-contact.ejs"),
      {
        subject: "Contact Us Message",
        name: name,
        message: message,
        email: email,
        contactSubject: subject,
      }
    );
    await this.sendHtml(html, "Contact Us Message");
  }

  async sendDevsBug(error, userName) {
    console.log("Catch error :", error);

    const html = await ejs.renderFile(
      path.join(__dirname, "../views/email/email-bug.ejs"),
      {
        subject: "A Bug In Production",
        userName: userName,
        error: error,
      }
    );
    await this.sendHtml(html, "A Bug In Production");
  }
}

module.exports = Email;
