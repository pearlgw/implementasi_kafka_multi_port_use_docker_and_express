const express = require('express');
const { Kafka } = require('kafkajs');

const app = express();

const kafka = new Kafka({
    clientId: 'email-service',
    brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'email-group' });

async function run() {
    await consumer.connect();
    console.log('====================================');
    console.log("Email Consumer Connected");
    console.log('====================================');

    await consumer.subscribe({ topic: 'order.created', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const order = JSON.parse(message.value.toString());
            console.log('====================================');
            console.log("Email Service");
            console.log("Data: ", order);
            console.log("Kirim email ke customer: ", order.customer);
            console.log('====================================');
        }
    });
}

run();

app.listen(9012, () => {
    console.log('====================================');
    console.log("Email service running on 9012");
    console.log('====================================');
})