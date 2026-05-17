const express = require('express');
const { Kafka } = require('kafkajs');

const app = express();

const kafka = new Kafka({
    clientId: 'dashboard-service',
    brokers: ['localhost:9092']
});

const consumer = kafka.consumer({
    groupId: 'dashboard-group'
});

async function run() {
    await consumer.connect();
    console.log('====================================');
    console.log("Dashboard Consumer Connected");
    console.log('====================================');

    await consumer.subscribe({ topic: 'order.created', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const order = JSON.parse(message.value.toString());
            console.log('====================================');
            console.log("Dashboard Service");
            console.log("Data: ", order);
            console.log("Kirim notifikasi ke customer: ", order.customer);
            console.log('====================================');
        }
    });
}

run();

app.listen(9014, () => {
    console.log('====================================');
    console.log("Dashboard service running on 9014");
    console.log('====================================');
})