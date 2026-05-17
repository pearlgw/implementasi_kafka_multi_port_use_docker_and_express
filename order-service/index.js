const express = require('express');
const { Kafka } = require('kafkajs');

const app = express();
app.use(express.json());

const kafka = new Kafka({
    clientId: 'order-service',
    brokers: ['localhost:9092']
});

const producer = kafka.producer();

async function connectProducer() {
    await producer.connect();
    console.log('====================================');
    console.log("Order Producer Connected");
    console.log('====================================');
}

connectProducer();

app.post('/order', async (req, res) => {
    const order = {
        id: Date.now(),
        customer: req.body.customer,
        total: req.body.total,
        createdAt: new Date()
    }

    await producer.send({
        topic: 'order.created',
        messages: [
            {
                value: JSON.stringify(order)
            }
        ]
    });

    console.log('====================================');
    console.log("Order Created: ", order);
    console.log('====================================');

    res.json({
        message: 'Order berhasil dibuat',
        data: order
    });
});

app.listen(9011, () => {
    console.log('====================================');
    console.log("Order service running on 9011");
    console.log('====================================');
});