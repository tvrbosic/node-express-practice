const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.APP_EMAIL_HOST,
    port: process.env.APP_EMAIL_PORT,
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_EMAIL_PASSWORD,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Tomislav Vrbošić <tomislav.vrbosic@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: TODO
  };

  // 3) Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;