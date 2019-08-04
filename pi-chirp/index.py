#!/usr/bin/env python
import sys
import time

from chirpsdk import ChirpConnect, CallbackSet


class Callbacks(CallbackSet):
    def on_received(self, payload, channel):
        if payload is not None:
            hex = payload.decode('utf-8')
            print('Received: ' + hex)
        else:
            print('Decode failed')


chirp = ChirpConnect()
chirp.start(send=True, receive=True)
chirp.set_callbacks(Callbacks())

try:
    # Process audio streams
    while True:
        time.sleep(0.1)
        # sys.stdout.write('.')
        sys.stdout.flush()
except KeyboardInterrupt:
    print('Exiting')
