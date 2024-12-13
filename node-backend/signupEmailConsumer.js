const amqp = require("amqplib");
const nodemailer = require("nodemailer");

const RABBITMQ_URL = process.env.RABBIT_MQ || "amqp://localhost:5679";

const EMAIL_USER = "rubanchakaravarthi60@gmail.com";
const EMAIL_PASS = "ooxx ruzs behh bipq"; // Replace with correct App Password

// Function to send email
const sendEmail = async (emailData) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
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

// Function to process messages from a specific queue
const processMessage = async (queue, msg, channel) => {
  const data = JSON.parse(msg.content.toString());
  console.log(`${queue} message received:`, data);

  try {
    let emailData;

    if (queue === "group_emails") {
      emailData = {
        email: data.email,
        subject: "The Study Group Manager",
        body:
          data.type.toLowerCase() === "online"
            ? `Hi ${data.username},\n\nYou have joined in \"${data.groupName}\"\nZoom link: ${data.zoomLink}\nDate: ${data.date}\nTime: ${data.time}\n\n\"Learn as if you were to live forever\"\n\nThanks,\nStudious - Team`
            : `Hi ${data.username},\n\nYou have joined in \"${data.groupName}\"\nLocation: ${data.location}\nDate: ${data.date}\nTime: ${data.time}\n\n\"Learn as if you were to live forever\"\n\nThanks,\nStudious - Team`,
      };
    } else if (queue === "signup_emails") {
      emailData = {
        email: data.email,
        subject: data.subject,
        body: data.body,
      };
    } else {
      console.warn(`Unknown queue: ${queue}`);
      channel.nack(msg, false, false); // Reject message without requeuing
      return;
    }

    await sendEmail(emailData);
    channel.ack(msg); // Acknowledge message upon success
  } catch (err) {
    console.error(`${queue} email processing failed:`, err.message);
    channel.nack(msg, false, true); // Requeue the message for retry
  }
};

// Main function to consume messages from multiple queues
const consumeMessages = async () => {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  const queues = ["group_emails", "signup_emails"];

  for (const queue of queues) {
    await channel.assertQueue(queue, { durable: true });

    channel.consume(
      queue,
      async (msg) => {
        if (msg !== null) {
          await processMessage(queue, msg, channel);
        }
      },
      { noAck: false } // Ensure acknowledgment is manual
    );

    console.log(`${queue} consumer is running...`);
  }
};

consumeMessages().catch((err) => {
  console.error("Consumer initialization failed:", err.message);
});
