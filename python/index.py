#!/usr/bin/env python
import sys
import time
import json

from qhue import Bridge
from rgbxy import Converter
from rgbxy import GamutC
from chirpsdk import ChirpConnect, CallbackSet


class Callbacks(CallbackSet):
    def on_received(self, payload, channel):
        if payload is not None:
            hex = json.loads(payload.decode('utf-8'))
            print('Received: ' + hex['c'])
            hueUtil = HueUtil()
            hueUtil.hex(hex['c'])
        else:
            print('Decode failed')


class HueUtil:
    ipAddress = "d780c907.ngrok.io"
    userId = "IbUDZzSJqJwaMEuH3hQzXoZKPzqsy3Qvus2Io8Vr"
    lightId = 2
    b = Bridge(ipAddress, userId)

    def hex(self, hexStr):
        red = int(hexStr[1:3], 16)
        green = int(hexStr[3:5], 16)
        blue = int(hexStr[5:], 16)

        converter = Converter(GamutC)
        xy = converter.rgb_to_xy(red, green, blue)
        print(xy)
        self.b.lights(self.lightId, 'state', xy=xy)


chirp = ChirpConnect()
chirp.start(send=True, receive=True)
chirp.set_callbacks(Callbacks())


try:
    # Process audio streams
    while True:
        time.sleep(0.1)
        sys.stdout.write('.')
        sys.stdout.flush()
except KeyboardInterrupt:
    print('Exiting')
