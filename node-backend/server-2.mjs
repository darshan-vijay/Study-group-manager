import amqplib from "amqplib";

const RABBITMQ_URL = 'amqp://admin:password@localhost:30072'; // Replace with your RabbitMQ URL
const QUEUE_NAME = 'jsonMessages';

async function consumeMessages() {
    const connection = await amqplib.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log('Waiting for messages...');

    channel.consume(
        QUEUE_NAME,
        (message) => {
            if (message) {
                const parsedMessage = JSON.parse(message.content.toString());
                console.log('Received message:', parsedMessage);

                // Acknowledge the message
                channel.ack(message);
            }
        },
        { noAck: false }
    );
}

    consumeMessages().catch((error) => {
      console.error('Error in consumer:', error);
    });

