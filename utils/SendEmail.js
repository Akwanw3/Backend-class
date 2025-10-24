const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_SERVER,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const message = {
    from: `Test <developer@appname.io>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
    text: options.body,
  };

  const info = await transporter.sendMail(message);

  console.log("Message sent: %s", info.messageId);
};


module.exports = sendEmail;