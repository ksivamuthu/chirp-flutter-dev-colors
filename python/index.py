#!/usr/bin/env python
import sys
import time

from qhue import Bridge
from rgbxy import Converter
from rgbxy import GamutC
from chirpsdk import ChirpConnect, CallbackSet


class Callbacks(CallbackSet):
    def on_received(self, payload, channel):
        if payload is not None:
            hex = payload.decode('utf-8')
            print('Received: ' + hex)
            hueUtil = HueUtil()
            hueUtil.hex(hex)
        else:
            print('Decode failed')


class HueUtil:
    ipAddress = "<IP_ADDRESS>"
    userId = "<HUE_USERID>"
    lightId = 2
    b = Bridge(ipAddress, userId)

    def hex(self, hexStr):
        red = int(hexStr[3:5], 16)
        green = int(hexStr[5:7], 16)
        blue = int(hexStr[7:], 16)

        converter = Converter(GamutC)
        xy = converter.rgb_to_xy(red, green, blue)
        print(xy)
        self.b.lights(lightId, 'state', xy=xy)


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
