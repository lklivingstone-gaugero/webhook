const express= require("express")

const KafkaClient= require("kafka-node").KafkaClient
const Producer= require("kafka-node").Producer
const router = express();
// import { KafkaClient, Producer } from "kafka-node";

router.post("/", async (req, res) => {
    try {
        const kafkaBroker = '65.2.142.243:29093';

        // Create a Kafka client
        const client = new KafkaClient({ kafkaHost: kafkaBroker });

        // Create a Producer instance
        const producer = new Producer(client);

        // Topic to publish messages to
        const topic = 'timeseriestopic4';

        // Sample message data
        const reqBody = req.body["data"]

        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');

        const currentDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        // console.log(currentDateTime);

        const message = {
            "schema": {
                "type": "struct",
                "fields": [
                    {"field": "id", "type": "int32"},
                    {"field": "device_id", "type": "string"},
                    {"field": "temperature", "type": "float"},
                    {"field": "pressure", "type": "float"},
                    {"field": "humidity", "type": "float"},
                    {"field": "location", "type": "string"},
                    {"field": "timestamp", "type": "string"}
                ]
            },
            "payload": {
                "id": 100,
                "device_id": reqBody["device_id"],
                "temperature": reqBody["temperature"],
                "pressure": reqBody["pressure"],
                "humidity": reqBody["humidity"],
                "location": reqBody["location"],
                "timestamp": currentDateTime
            }
        }
    

        // Connect to the Kafka broker
        producer.on('ready', () => {
            console.log('Producer is ready');

            // Create a new payload
            const payload = [
                {
                topic: topic,
                messages: JSON.stringify(message)
                }
            ];

            // Send the payload to the Kafka broker
            producer.send(payload, (error, result) => {
                if (error) {
                    console.error('Error publishing message:', error);
                } else {
                    console.log('Message published successfully:', result);
                }
                
                // Close the Kafka client connection after publishing
                client.close();
            });
        });

        // Handle producer errors
        producer.on('error', (error) => {
            console.error('Producer error:', error);
        });

        res.status(200).json("Success!");
    }
    catch(err) {
        res.status(500).json(err)
    }
});

module.exports= router
// export default router;