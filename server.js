const express = require("express");
const app = express();
const cors = require("cors");
const expressWs = require('express-ws')(app);

const port = 3333;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

const activeConnections = [];
const CirclePosition = [];

    app.ws('/chat', function (ws) {
        console.log('client connected');
        activeConnections.push(ws);
        const activeConnectionIndex = activeConnections.length - 1;

        CirclePosition.forEach(position => {
            ws.send(JSON.stringify(position));
        });

        ws.on('close', () => {
            console.log('client disconnected' + " " + activeConnectionIndex);
            activeConnections.splice(activeConnectionIndex, 1);
        });

        ws.on('message', (msg) => {
            const decodedMessage = JSON.parse(msg);
            const message = JSON.stringify({
                x: decodedMessage.x,
                y: decodedMessage.y,
                colour: decodedMessage.colour
            });
            CirclePosition.push(decodedMessage);
            activeConnections.forEach(connection => {
                connection.send(message);
            });
        });
    });
    app.listen(port, () => console.log(`Server started on ${port}`));
