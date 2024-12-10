const amqp = require('amqplib');
const nodemailer = require('nodemailer');

// Gmail credentials
const EMAIL_USER = 'rubanchakaravarthi60@gmail.com';
const EMAIL_PASS = 'ooxx ruzs behh bipq'; // Replace with correct App Password

// Function to send email
const sendEmail = async (data) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const subject = 'The Study Group Manager';
    const body =
      data.type.toLowerCase() === 'online'
        ? `Hi ${data.username},\n\nYou have joined in "${data.groupName}"\nZoom link: ${data.zoomLink}\nDate: ${data.date}\nTime: ${data.time}\n\n"Learn as if you were to live forever"\n\nThanks,\nStudious - Team`
        : `Hi ${data.username},\n\nYou have joined in "${data.groupName}"\nLocation: ${data.location}\nDate: ${data.date}\nTime: ${data.time}\n\n"Learn as if you were to live forever"\n\nThanks,\nStudious - Team`;

    console.log(`Sending email to: ${data.email}`);
    await transporter.sendMail({
      from: EMAIL_USER,
      to: data.email,
      subject,
      text: body,
    });
    console.log(`Email sent successfully to: ${data.email}`);
  } catch (err) {
    console.error(`Failed to send email to ${data.email}:`, err.message);
    throw err; // Propagate error for requeue or other handling
  }
};

// Function to consume messages from RabbitMQ
const consumeMessages = async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queue = 'group_emails';

  await channel.assertQueue(queue, { durable: true });

  channel.consume(
    queue,
    async (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());
        console.log('Message received:', data);

        try {
          // Attempt to send email
          await sendEmail(data);
          // Acknowledge message upon success
          channel.ack(msg);
        } catch (err) {
          console.error('Email processing failed:', err.message);
          // Requeue the message for retry
          channel.nack(msg, false, true);
        }
      }
    },
    { noAck: false } // Ensure acknowledgment is manual
  );

  console.log('Email consumer is running...');
};

consumeMessages().catch((err) => {
  console.error('Consumer initialization failed:', err.message);
});
