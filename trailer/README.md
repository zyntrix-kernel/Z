# Zettings Film v9, Remotion source

A 45-second, 1920×1080, 30 fps motion-graphics product film inspired by `ZETTINGS_FILM_v6_FINAL.mp4`.

## What this cut is built around

- Near-black frame, fine chapter marker (`01 / 06`), condensed headline typography and restrained per-feature color.
- Feature beats: Wi-Fi, paired-device battery, Do Not Disturb, quick settings, ten categories, instant search, brightness, Light/Dark/OLED, accent colors and Night Light.
- A dedicated **BUTTERY SMOOTH · SPRING PHYSICS** hero shot with animated toggle and slider.
- A drawn-on, filled-gradient Z mark with moving color points, converging rays, then **ZETTINGS / FEEL EVERY SETTING.**
- The supplied reference film's soundtrack, retimed gently to the 45-second export.

## Render

Requires Node.js, FFmpeg and a network connection to fetch the reference audio track.

```bash
npm install
npm run render
```

The finished MP4 is written to `out/zettings-film-v9-peak.mp4`.

## GitHub Actions

The **Render Zyntrix trailer** workflow renders the same composition and uploads the finished MP4 as the `zettings-film-v9-peak` artifact.
