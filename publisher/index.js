const express = require("express")

const app = express()
const PORT = process.env.PORT || 4000;

app.use(express.json())

const amqp = require("amqplib");
var channel, connection;

const exchange_name = 'test-exchange';
const exchange_type = 'fanout';

connectQueue() 
async function connectQueue() {
    try {

        connection = await amqp.connect("amqp://localhost:5672");
        channel = await connection.createChannel()

    
        await channel.assertExchange(exchange_name, exchange_type, {
            durable: false
        })

    } catch (error) {
        console.log(error)
    }
}

const sendMessageToQueue = async (message) => {
    const queue_name = '';
    await channel.publish(
        exchange_name,
        queue_name, 
        Buffer.from(message)
    );
}

app.get("/send-msg", (req, res) => {
    const message = "Hello World!";

    sendMessageToQueue(message)

    console.log("Message sent to the exchange");

 ;

    res.send("Message Sent");
    
})

app.listen(PORT, () => console.log("Server listening at port " + PORT))