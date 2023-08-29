const express = require("express");
const app = express();
const PORT = process.env.PORT || 5002;

app.use(express.json());

const amqp = require("amqplib");
var channel, connection;

const exchange_name = "test-exchange";
const exchange_type = "fanout";
const queue_name = "test-queue2";

connectToRabbitMQ();
async function connectToRabbitMQ() {
  try {
    connection = await amqp.connect("amqp://localhost:5672");
    channel = await connection.createChannel();

    connectToQueue();
  } catch (error) {
    console.log(error);
  }
}

async function connectToQueue() {

  await channel.assertExchange(exchange_name, exchange_type, {
    durable: false,
  });

  const q = await channel.assertQueue(queue_name, { exclusive: true });

  // binding the queue
  const binding_key = "";
  channel.bindQueue(q.queue, exchange_name, binding_key);

  console.log("Consuming messages from queue: ", q.queue);
  channel.consume(
    q.queue,
    (msg) => {
      if (msg.content)
        console.log("\nReceived message: ", msg.content.toString());
    },
    { noAck: true }
  );
}

app.listen(PORT, () => console.log("Server running at port " + PORT));



