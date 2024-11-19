import express from "express";
import bodyParser from 'body-parser';
import amqplib from 'amqplib';

const app = express();
app.use(bodyParser.json());

const port = 3001;

// RabbitMQ connection settings
const RABBITMQ_URL = 'amqp://localhost'; // Replace with your RabbitMQ URL
const QUEUE_NAME = 'jsonMessages';

async function sendToQueue(message) {
  const connection = await amqplib.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertQueue(QUEUE_NAME, { durable: true });

  channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), {
      persistent: true,
  });

  console.log('Message sent:', message);
  await channel.close();
  await connection.close();
}

app.post('/produce', async (req, res) => {
  const message = req.body;

  try {
      await sendToQueue(message);
      res.status(200).json({ success: true, message: 'Message sent to the queue.' });
  } catch (error) {
      console.error('Error sending message to queue:', error);
      res.status(500).json({ error: 'Failed to send message to the queue.' });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to my server!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});