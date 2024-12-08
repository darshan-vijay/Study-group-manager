const amqp = require("amqplib");
const { Storage } = require("@google-cloud/storage");
const clientModel = require("../models/clientModel");
const crypto = require("crypto");

// Initialize Google Cloud Storage
const storage = new Storage({
  keyFilename: "./config/firebase-service-account.json",
});
const bucketName = "study-group-manager";
const bucket = storage.bucket(bucketName);

const queueName = "profilePictureQueue";

// Function to Upload to Cloud Storage
const uploadToCloudStorage = async (profilePicture) => {
  const fileBuffer = Buffer.from(profilePicture.buffer, "base64");
  const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");
  const fileName = `${hash}_${profilePicture.originalname}`;
  const cloudFile = bucket.file(fileName);

  await cloudFile.save(fileBuffer, {
    metadata: { contentType: profilePicture.mimetype },
    resumable: false,
  });

  await cloudFile.makePublic();
  return `https://storage.googleapis.com/${bucketName}/${fileName}`;
};

// Start RabbitMQ Consumer
const startConsumer = async () => {
  const connection = await amqp.connect("amqp://localhost:5672"); // Replace with your RabbitMQ URL
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName);

  console.log("Waiting for messages in queue:", queueName);
  channel.consume(queueName, async (msg) => {
    if (msg) {
      const { clientId, profilePicture, userData } = JSON.parse(msg.content.toString());
      try {
        console.log("Processing message:", clientId);

        // Upload profile picture to GCP
        const profilePictureUrl = await uploadToCloudStorage(profilePicture);

        // Save user data to the database
        await clientModel.addClient({ ...userData, id: clientId, profilePictureUrl });

        console.log(`User ${clientId} processed successfully.`);
        channel.ack(msg);
      } catch (error) {
        console.error("Error processing message:", error.message);
        channel.nack(msg); // Requeue the message for later processing
      }
    }
  });
};

startConsumer().catch((err) => console.error("Consumer error:", err.message));
