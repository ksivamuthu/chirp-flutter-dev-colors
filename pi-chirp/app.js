const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const chirpBridge = require('./chirpbridge');
const hue = require('./hue');

app.use(express.static('client/build'));

app.get('/healthcheck', (req, res, next) => {
  res.status(200).send({ 'status': 'healthy' });
});

server.listen(process.env.PORT || 3001, () => console.log('Server is running...'));

io.on('connection', (socket) => {
  console.log('Client connected');
});

chirpBridge.on('DataReceived', (data) => {
  const json = JSON.parse(data);
  console.log(json);
  if (json.type === 'hex' && json.data) {
    if (json.data === 'cop') {
      hue.setCopMode();
    } else {
      hue.setLED(json.data);
      io.emit('ChirpDataReceived', data);
    }
  } else if (json.type === 'listening') {
    io.emit('ChirpListening', json.data);
  } else if (json.type === 'error') {
    io.emit('ChirpError', json.data);
  }
});