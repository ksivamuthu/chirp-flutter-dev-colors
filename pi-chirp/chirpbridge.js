
const EventEmitter = require('events');
const emitter = new EventEmitter();

const spawn = require('child_process').spawn;
const py = spawn('python3', ['python/chirp.py']);
py.stdout.on('data', (data) => {
    emitter.emit('DataReceived', data);
});

const pyUltraSonic = spawn('python3', ['python/chirpultrasonic.py']);
pyUltraSonic.stdout.on('data', (data) => {
    emitter.emit('DataReceived', data);
});

module.exports = emitter;