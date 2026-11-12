#!/usr/bin/env bash
# Generates realistic-looking demo video assets (covers, thumbnails,
# watermarked previews, and "original" masters) using ffmpeg's built-in
# synthetic sources, so the storefront has real playable video files to
# exercise the hover-preview / gallery / download flows without needing
# any external video licensing or network access.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STORAGE="$ROOT/.storage"
mkdir -p "$STORAGE/covers" "$STORAGE/thumbnails" "$STORAGE/previews" "$STORAGE/originals"

# id|lavfi_source|duration|label
clips=(
  "neon-pulse|haldclutsrc,hue=H=2*PI*t:s=1|6|Neon Pulse"
  "cyber-grid|mandelbrot=size=640x360:rate=24|6|Cyber Grid"
  "liquid-chrome|gradients=size=640x360:rate=24:n=6:speed=0.05:seed=42|6|Liquid Chrome"
  "particle-flux|life=size=640x360:rate=24:mold=4:life_color=8B5CF6:death_color=00E5FF|6|Particle Flux"
  "glitch-matrix|cellauto=size=640x360:rate=24:rule=22|6|Glitch Matrix"
  "aurora-drift|gradients=size=640x360:rate=24:n=3:speed=0.02|6|Aurora Drift"
  "pulse-wave|rgbtestsrc=size=640x360:rate=24,hue=H=2*PI*t:s=1.4|6|Pulse Wave"
  "deep-field|allrgb=rate=24,scale=640x360,hue=H=PI*t|5|Deep Field"
)

gen_one() {
  local id="$1" src="$2" dur="$3" label="$4"

  # Original master (slightly higher bitrate, no watermark)
  ffmpeg -y -f lavfi -i "${src}" -t "${dur}" \
    -vf "format=yuv420p" -c:v libx264 -preset veryfast -crf 20 -an \
    "$STORAGE/originals/${id}.mp4" -loglevel error

  # Watermarked preview (smaller, with a visible PREVIEW stamp + pack label)
  ffmpeg -y -i "$STORAGE/originals/${id}.mp4" \
    -vf "drawtext=text='PREVIEW':fontcolor=white@0.55:fontsize=22:x=20:y=20:box=1:boxcolor=black@0.35:boxborderw=8,drawtext=text='${label}':fontcolor=white@0.85:fontsize=16:x=20:y=h-40:box=1:boxcolor=black@0.35:boxborderw=6" \
    -c:v libx264 -preset veryfast -crf 26 -an \
    "$STORAGE/previews/${id}.mp4" -loglevel error

  # Thumbnail (frame at 1s)
  ffmpeg -y -ss 1 -i "$STORAGE/originals/${id}.mp4" -frames:v 1 \
    "$STORAGE/thumbnails/${id}.jpg" -loglevel error

  echo "generated: $id"
}

for entry in "${clips[@]}"; do
  IFS='|' read -r id src dur label <<< "$entry"
  gen_one "$id" "$src" "$dur" "$label"
done

# Cover images: reuse thumbnail but add a title card look via drawtext
cover_titles=(
  "neon-pulse|NEON PULSE WAVES"
  "cyber-grid|CYBER GRID FLOW"
  "liquid-chrome|LIQUID CHROME"
  "particle-flux|PARTICLE NEBULA"
  "glitch-matrix|GLITCH MATRIX"
  "aurora-drift|AURORA DRIFT"
  "pulse-wave|PULSE WAVE PACK"
  "deep-field|DEEP FIELD LOOP"
)
for entry in "${cover_titles[@]}"; do
  IFS='|' read -r id title <<< "$entry"
  ffmpeg -y -i "$STORAGE/thumbnails/${id}.jpg" \
    -vf "scale=800:450,drawtext=text='${title}':fontcolor=white:fontsize=34:x=(w-text_w)/2:y=(h-text_h)/2:box=1:boxcolor=black@0.4:boxborderw=14" \
    "$STORAGE/covers/${id}.jpg" -loglevel error
  echo "cover: $id"
done

echo "Done. Assets in $STORAGE"
