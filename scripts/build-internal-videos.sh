#!/usr/bin/env bash
# Build internal showcase videos from Playwright recordings.
# Combines clips with text overlays into two MP4 files (pastor + follower).
set -euo pipefail

cd "$(dirname "$0")/.."
RESULTS="e2e/results"
TMP="/tmp/mtlbp-internal"
rm -rf "$TMP"
mkdir -p "$TMP"

# Font for text overlays (macOS)
FONT="/System/Library/Fonts/Supplemental/Arial Bold.ttf"
if [ ! -f "$FONT" ]; then
  FONT="/System/Library/Fonts/Helvetica.ttc"
fi

get_label() {
  case "$1" in
    P01) echo "Dashboard Overview" ;;
    P02) echo "Profile Management" ;;
    P03) echo "Services Catalog" ;;
    P04) echo "Availability Schedule" ;;
    P05) echo "Bookings Management" ;;
    P06) echo "Prayer Requests" ;;
    P07) echo "Giving Dashboard" ;;
    F01) echo "Browse Pastors" ;;
    F02) echo "Pastor Detail & Booking" ;;
    F03) echo "Community Prayer Wall" ;;
    F04) echo "My Bookings" ;;
    F05) echo "Give & Support" ;;
  esac
}

process_clip() {
  local input="$1"
  local label="$2"
  local output="$3"

  ffmpeg -y -i "$input" \
    -vf "drawtext=fontfile=${FONT}:text='${label}':fontsize=36:fontcolor=white:borderw=3:bordercolor=black@0.7:x=(w-text_w)/2:y=h-80,fps=30" \
    -c:v libx264 -preset fast -crf 23 -pix_fmt yuv420p \
    -an "$output" 2>/dev/null
  echo "  ✓ $label"
}

echo "=== Processing Pastor Portal clips ==="
PASTOR_CONCAT="$TMP/pastor-concat.txt"
> "$PASTOR_CONCAT"

for key in P01 P02 P03 P04 P05 P06 P07; do
  label=$(get_label "$key")
  dir=$(find "$RESULTS" -type d -name "*${key}*" | head -1)
  if [ -z "$dir" ]; then
    echo "  ✗ Skipping $key — no recording found"
    continue
  fi
  clip="$dir/video.webm"
  out="$TMP/pastor-${key}.mp4"
  process_clip "$clip" "$label" "$out"
  echo "file '$out'" >> "$PASTOR_CONCAT"
done

echo ""
echo "=== Processing Follower Portal clips ==="
FOLLOWER_CONCAT="$TMP/follower-concat.txt"
> "$FOLLOWER_CONCAT"

for key in F01 F02 F03 F04 F05; do
  label=$(get_label "$key")
  dir=$(find "$RESULTS" -type d -name "*${key}*" | head -1)
  if [ -z "$dir" ]; then
    echo "  ✗ Skipping $key — no recording found"
    continue
  fi
  clip="$dir/video.webm"
  out="$TMP/follower-${key}.mp4"
  process_clip "$clip" "$label" "$out"
  echo "file '$out'" >> "$FOLLOWER_CONCAT"
done

echo ""
echo "=== Combining Pastor Portal video ==="
PASTOR_OUT="frontend/apps/pastor-portal/public/videos/showcase.mp4"
mkdir -p "$(dirname "$PASTOR_OUT")"
ffmpeg -y -f concat -safe 0 -i "$PASTOR_CONCAT" \
  -c:v libx264 -preset fast -crf 22 -pix_fmt yuv420p \
  -movflags +faststart -an "$PASTOR_OUT" 2>/dev/null
echo "  ✓ $PASTOR_OUT ($(du -h "$PASTOR_OUT" | cut -f1))"

echo ""
echo "=== Combining Follower Portal video ==="
FOLLOWER_OUT="frontend/apps/follower-portal/public/videos/showcase.mp4"
mkdir -p "$(dirname "$FOLLOWER_OUT")"
ffmpeg -y -f concat -safe 0 -i "$FOLLOWER_CONCAT" \
  -c:v libx264 -preset fast -crf 22 -pix_fmt yuv420p \
  -movflags +faststart -an "$FOLLOWER_OUT" 2>/dev/null
echo "  ✓ $FOLLOWER_OUT ($(du -h "$FOLLOWER_OUT" | cut -f1))"

# Generate poster images (first frame)
echo ""
echo "=== Generating poster images ==="
ffmpeg -y -i "$PASTOR_OUT" -vframes 1 -q:v 2 \
  "frontend/apps/pastor-portal/public/videos/showcase-poster.jpg" 2>/dev/null
echo "  ✓ Pastor poster"
ffmpeg -y -i "$FOLLOWER_OUT" -vframes 1 -q:v 2 \
  "frontend/apps/follower-portal/public/videos/showcase-poster.jpg" 2>/dev/null
echo "  ✓ Follower poster"

echo ""
echo "=== Done! ==="
rm -rf "$TMP"
