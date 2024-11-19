import express from "express";
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const port = 3004;
//connect to redis


app.post('/produce', async (req, res) => {
  const message = req.body;

  try {
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