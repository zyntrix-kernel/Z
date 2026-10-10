#!/usr/bin/env python3
"""Generate a royalty-free, synthesised ambient score for the Zyntrix trailer."""
import math
import os
import struct
import wave

SAMPLE_RATE = 22050
DURATION = 45
NOTES = [
    (110.00, 164.81, 220.00, 261.63),
    (87.31, 130.81, 174.61, 220.00),
    (130.81, 196.00, 261.63, 329.63),
    (98.00, 146.83, 196.00, 246.94),
]

def main():
    os.makedirs("out", exist_ok=True)
    pcm = bytearray()
    count = SAMPLE_RATE * DURATION
    for i in range(count):
        t = i / SAMPLE_RATE
        chord = NOTES[int(t // 5) % len(NOTES)]
        fade = min(1.0, t / 1.6, max(0.0, (DURATION - t) / 2.8))
        breathe = 0.72 + 0.28 * math.sin(2 * math.pi * 0.075 * t)
        pad = sum(math.sin(2 * math.pi * n * t + 0.14 * math.sin(2 * math.pi * 0.12 * t)) for n in chord) / 4
        bass = math.sin(2 * math.pi * 55 * t) * (0.55 + 0.45 * math.sin(2 * math.pi * 0.42 * t))
        beat = (t * 1.6) % 1.0
        kick = math.sin(2 * math.pi * (52 + 18 * math.exp(-beat * 24)) * t) * math.exp(-beat * 10) if beat < 0.22 else 0.0
        hit = t % 5.0
        impact = math.sin(2 * math.pi * (90 + 120 * math.exp(-hit * 5)) * t) * math.exp(-hit * 5) if hit < 0.6 else 0.0
        shimmer = math.sin(2 * math.pi * (660 + 40 * math.sin(t * 0.3)) * t) * 0.025 * (0.5 + 0.5 * math.sin(t * 1.1))
        value = max(-0.88, min(0.88, (0.20 * pad + 0.13 * bass + 0.095 * kick + 0.07 * impact + shimmer) * fade * breathe))
        sample = int(value * 32767)
        pcm.extend(struct.pack("<hh", sample, sample))
    with wave.open("out/score.wav", "wb") as output:
        output.setnchannels(2)
        output.setsampwidth(2)
        output.setframerate(SAMPLE_RATE)
        output.writeframes(pcm)

if __name__ == "__main__":
    main()
