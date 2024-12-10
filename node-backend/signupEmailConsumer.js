const amqp = require('amqplib');
const nodemailer = require('nodemailer');

const EMAIL_USER = 'rubanchakaravarthi60@gmail.com';
const EMAIL_PASS = 'ooxx ruzs behh bipq'; // Replace with correct App Password

// Function to send email
const sendEmail = async (emailData) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    console.log(`Sending email to: ${emailData.email}`);
    await transporter.sendMail({
      from: EMAIL_USER,
      to: emailData.email,
      subject: emailData.subject,
      text: emailData.body,
    });
    console.log(`Email sent successfully to: ${emailData.email}`);
  } catch (err) {
    console.error(`Failed to send email to ${emailData.email}:`, err.message);
    throw err;
  }
};

// Function to consume messages from RabbitMQ
const consumeSignUpEmails = async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queue = 'signup_emails';

  await channel.assertQueue(queue, { durable: true });

  channel.consume(
    queue,
    async (msg) => {
      if (msg !== null) {
        const emailData = JSON.parse(msg.content.toString());
        console.log('Sign-up email message received:', emailData);

        try {
          await sendEmail(emailData);
          channel.ack(msg);
        } catch (err) {
          console.error('Email processing failed:', err.message);
          channel.nack(msg, false, true); // Requeue the message for retry
        }
      }
    },
    { noAck: false }
  );

  console.log('Sign-up email consumer is running...');
};

consumeSignUpEmails().catch((err) => {
  console.error('Sign-up email consumer initialization failed:', err.message);
});
