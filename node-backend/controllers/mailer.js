const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Replace with your email provider
  auth: {
    user: 'lindankutty@gmail.com', // Your email
    pass: 'rubanlin', // Your email password
  },
});

exports.sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: '"Studious - Team" lindankutty@gmail.com',
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error.message);
  }
};
