#!/usr/bin/env python
import sys
import time
import json

from chirpsdk import ChirpConnect, CallbackSet


class Callbacks(CallbackSet):
    def on_received(self, payload, channel):
        if payload is not None:
            hex = payload.decode('utf-8')
            print(json.dumps({"data": hex, "type": "hex"}))
        else:
            print(json.dumps({"data": "Decode Failed", "type": "error"}))

    def on_receiving(self, channel):
        print(json.dumps({"data": "Listening...", "type": "listening"}))
        return super().on_receiving(channel)


chirp = ChirpConnect()
chirp.start(receive=True)
chirp.set_callbacks(Callbacks())

try:
    while True:
        time.sleep(0.1)
        sys.stdout.flush()
except KeyboardInterrupt:
    print('Exiting')
