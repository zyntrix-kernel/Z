#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p out
REFERENCE_VIDEO_URL="${REFERENCE_VIDEO_URL:-https://d2ol7oe51mr4n9.cloudfront.net/user_3K32CiOAcurw0eVrpkaRJB6SxXB/09c16e4d-178d-4c9d-a5dd-bc9f387f7be7.mp4}"
REFERENCE_AUDIO="/tmp/zettings-reference-audio.mp4"
curl -fsSL "$REFERENCE_VIDEO_URL" -o "$REFERENCE_AUDIO"
npx remotion render src/index.ts Trailer out/zettings-film-v9-silent.mp4 --codec h264 --crf 17 --concurrency "${REMOTION_CONCURRENCY:-4}"
ffmpeg -y -hide_banner -loglevel error \
  -i out/zettings-film-v9-silent.mp4 \
  -i "$REFERENCE_AUDIO" \
  -filter_complex '[1:a]atempo=0.97777778,afade=t=in:st=0:d=1.0,afade=t=out:st=42:d=3.0[a]' \
  -map 0:v:0 -map '[a]' -c:v copy -c:a aac -b:a 192k -t 45 \
  -movflags +faststart out/zettings-film-v9-peak.mp4
ffprobe -v error -show_entries format=duration,size -show_entries stream=codec_name,width,height,r_frame_rate -of json out/zettings-film-v9-peak.mp4
