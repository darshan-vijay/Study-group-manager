const sharp = require("sharp");
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const admin = require("firebase-admin");
const amqp = require("amqplib");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(
    require(path.join(__dirname, "../config/firebase-service-account.json"))
  ),
});
const firestore = admin.firestore();

// Initialize Google Cloud Storage
const storage = new Storage({
  keyFilename: path.join(__dirname, "../config/firebase-service-account.json"), // Adjust the relative path
});
const bucketName = "study-group-manager"; // Your bucket name
const bucket = storage.bucket(bucketName);

// Function to handle file upload with compression
const processFileUpload = async (message) => {
    try {
      const { clientId, profilePicture, userData } = message;
  
      console.log("Compressing image...");
      const compressedBuffer = await sharp(Buffer.from(profilePicture.buffer, "base64"))
        .resize(800, 800, { fit: "inside" }) // Resize to max dimensions (800x800)
        .jpeg({ quality: 70 }) // Convert to JPEG with 50% quality
        .toBuffer();
  
      console.log("Uploading compressed image...");
      const fileName = `${clientId}_${profilePicture.originalname}`;
      const cloudFile = bucket.file(fileName);
  
      await cloudFile.save(compressedBuffer, {
        metadata: { contentType: "image/jpeg" },
        resumable: false,
      });
  
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
      console.log("File uploaded successfully:", publicUrl);
  
      // Add the image URL to user data
      userData.profilePictureUrl = publicUrl;
  
      console.log("Updating user data in Firestore...");
      // Save user data to Firestore under `clients` collection
      await firestore.collection("clients").doc(clientId).set(userData);
  
      console.log("User data updated successfully in Firestore under `clients` collection.");
    } catch (error) {
      console.error("Error processing file upload:", error.message);
    }
  };
  
// RabbitMQ Worker
(async () => {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    await channel.assertQueue("profilePictureQueue");

    console.log("Worker is listening for messages...");

    channel.consume("profilePictureQueue", async (msg) => {
      const message = JSON.parse(msg.content.toString());
      console.log("Message received from RabbitMQ:", message);

      await processFileUpload(message);

      channel.ack(msg); // Acknowledge message after processing
    });
  } catch (error) {
    console.error("RabbitMQ worker error:", error.message);
  }
})();
