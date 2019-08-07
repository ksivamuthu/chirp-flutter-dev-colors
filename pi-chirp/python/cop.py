#!/usr/bin/env python
import os
from playsound import playsound


from chirpsdk import ChirpConnect, CallbackSet

chirp = ChirpConnect()
chirp.start(send=True)
identifier = 'cop'
payload = bytearray([ord(ch) for ch in identifier])
chirp.send(payload, blocking=True)

playsound('beedoo.mp3')
playsound('beedoo.mp3')
