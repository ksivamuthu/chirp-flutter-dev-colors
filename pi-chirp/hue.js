const huejay = require('huejay');
const Color = require('color');

let _client = new huejay.Client({
    host: '192.168.1.233',
    port: 80,               // Optional
    username: 'IbUDZzSJqJwaMEuH3hQzXoZKPzqsy3Qvus2Io8Vr', // Optional
    timeout: 15000,            // Optional, timeout in milliseconds (15000 is the default)
});

function pingBridge() {
    _client.bridge.ping()
        .then(() => { console.log('Ping successful') })
        .catch(handleError);
}

async function setlightAttrs(lightId, attrs) {
    try {
        const light = await _client.lights.getById(lightId);
        light.on = true;
        light.brightness = attrs.brightness;
        light.hue = attrs.hue;
        light.saturation = attrs.saturation;
        await _client.lights.save(light);
    } catch (err) {
        handleError(err);
    }
}

async function lightOff(lightId) {
    try {
        const light = await _client.lights.getById(lightId);
        light.off = true;
        await _client.lights.save(light);
    } catch (err) {
        handleError(err);
    }
}

function convertHexToHsv(hex) {
    let hsl = Color(hex).hsl();
    console.log(hsl.toString());
    const hue = Math.min(Math.round(hsl.hue() * 65535 / 360));
    const saturation = Math.min(Math.round(hsl.saturationl() * 255 / 100));
    // const brightness = Math.min(Math.round(100 * 255 / 100));
    const brightness = 254;
    return { hue, saturation, brightness };
}

function handleError(err) {
    console.error(`An error occurred: ${err.message}`);
}

function setLED(hex) {
    setlightAttrs(2, convertHexToHsv(hex));
}

async function setCopMode() {
    for (var i = 0; i <= 20; i++) {
        await sleep(300);
        setlightAttrs(2, convertHexToHsv("#ff0000"));
        await sleep(300);
        setlightAttrs(2, convertHexToHsv("#0000ff"));
        await sleep(300);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


module.exports = {
    setLED: setLED,
    setCopMode: setCopMode
};