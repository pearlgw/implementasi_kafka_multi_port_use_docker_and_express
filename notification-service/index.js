const express = require('express');
const { Kafka } = require('kafkajs');

const app = express();

const kafka = new Kafka({
    clientId: 'notification-service',
    brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'notification-group' });

async function run() {
    await consumer.connect();
    console.log('====================================');
    console.log("Notification Consumer Connected");
    console.log('====================================');

    await consumer.subscribe({ topic: 'order.created', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const order = JSON.parse(message.value.toString());
            console.log('====================================');
            console.log("Notification Service");
            console.log("Data: ", order);
            console.log("Kirim notifikasi ke customer: ", order.customer);
            console.log('====================================');
        }
    });
}

run();

app.listen(9013, () => {
    console.log('====================================');
    console.log("Notification service running on 9013");
    console.log('====================================');
})