#!/bin/bash
# Build two targeted showcase videos with text overlays
# Pastor video: scenes 1-5 (pastor portal only)
# Follower video: scenes 6-10, 11-12 (follower portal only)

set -e
cd "$(dirname "$0")/.."

RESULTS="e2e/results"
TMP="/tmp/showcase-build"
FONT="/System/Library/Fonts/Avenir Next.ttc"

rm -rf "$TMP"
mkdir -p "$TMP"

# ── Text overlay filter: bottom banner with semi-transparent bg ──
overlay() {
  local text="$1"
  echo "drawtext=fontfile='${FONT}':text='${text}':fontcolor=white:fontsize=32:x=(w-text_w)/2:y=h-80:box=1:boxcolor=black@0.55:boxborderw=16"
}

# ── Subtitle overlay: smaller text under main ──
subtitle() {
  local text="$1"
  echo "drawtext=fontfile='${FONT}':text='${text}':fontcolor=white@0.8:fontsize=20:x=(w-text_w)/2:y=h-40:box=1:boxcolor=black@0.4:boxborderw=10"
}

echo "=== Building individual scenes with text overlays ==="

# ── PASTOR SCENES ──
echo "  Pastor Scene 1: Hero"
ffmpeg -y -i "$RESULTS/showcase-🎬-Showcase-Video-28492--Pastor-Portal-Grand-Reveal-showcase/video.webm" \
  -vf "$(overlay 'Manage Your Ministry, Serve Your People'),$(subtitle 'Your all-in-one pastoral command center')" \
  -c:v libx264 -preset fast -crf 23 -pix_fmt yuv420p -an "$TMP/p1.mp4" 2>/dev/null

echo "  Pastor Scene 2: Features"
ffmpeg -y -i "$RESULTS/showcase-🎬-Showcase-Video-Scene-02-—-Features-That-Matter-showcase/video.webm" \
  -vf "$(overlay 'Powerful Tools for Ministry'),$(subtitle 'Bookings • Prayers • Giving • Profiles • Community')" \
  -c:v libx264 -preset fast -crf 23 -pix_fmt yuv420p -an "$TMP/p2.mp4" 2>/dev/null

echo "  Pastor Scene 3: Pricing"
ffmpeg -y -i "$RESULTS/showcase-🎬-Showcase-Video-Scene-03-—-Pricing-That-s-Fair-showcase/video.webm" \
  -vf "$(overlay 'Simple, Transparent Pricing'),$(subtitle 'Start free. Upgrade when you are ready.')" \
  -c:v libx264 -preset fast -crf 23 -pix_fmt yuv420p -an "$TMP/p3.mp4" 2>/dev/null

echo "  Pastor Scene 4: Testimonials"
ffmpeg -y -i "$RESULTS/showcase-🎬-Showcase-Video-Scene-04-—-Trusted-by-Pastors-showcase/video.webm" \
  -vf "$(overlay 'Trusted by Pastors Everywhere'),$(subtitle 'Hear from ministry leaders like you')" \
  -c:v libx264 -preset fast -crf 23 -pix_fmt yuv420p -an "$TMP/p4.mp4" 2>/dev/null

echo "  Pastor Scene 5: Full Sweep"
ffmpeg -y -i "$RESULTS/showcase-🎬-Showcase-Video-3037d--—-Full-Pastor-Portal-Sweep-showcase/video.webm" \
  -vf "$(overlay 'The Complete Pastor Experience')" \
  -c:v libx264 -preset fast -crf 23 -pix_fmt yuv420p -an "$TMP/p5.mp4" 2>/dev/null

# ── FOLLOWER SCENES ──
echo "  Follower Scene 1: Hero"
ffmpeg -y -i "$RESULTS/showcase-🎬-Showcase-Video-f2edb-ower-Portal-A-New-Beginning-showcase/video.webm" \
  -vf "$(overlay 'Connect with Your Pastor, Grow in Faith'),$(subtitle 'Your spiritual journey starts here')" \
  -c:v libx264 -preset fast -crf 23 -pix_fmt yuv420p -an "$TMP/f1.mp4" 2>/dev/null

echo "  Follower Scene 2: Discover Pastors"
ffmpeg -y -i "$RESULTS/showcase-🎬-Showcase-Video-Scene-07-—-Discover-Your-Pastor-showcase/video.webm" \
  -vf "$(overlay 'Find the Right Spiritual Guide'),$(subtitle 'Browse pastors by location, denomination, and specialty')" \
  -c:v libx264 -preset fast -crf 23 -pix_fmt yuv420p -an "$TMP/f2.mp4" 2>/dev/null

echo "  Follower Scene 3: Prayer Wall"
ffmpeg -y -i "$RESULTS/showcase-🎬-Showcase-Video-Scene-08-—-The-Prayer-Wall-showcase/video.webm" \
  -vf "$(overlay 'The Prayer Wall — You Are Not Alone'),$(subtitle 'Share requests • Receive responses • Pray together')" \
  -c:v libx264 -preset fast -crf 23 -pix_fmt yuv420p -an "$TMP/f3.mp4" 2>/dev/null

echo "  Follower Scene 4: Giving"
ffmpeg -y -i "$RESULTS/showcase-🎬-Showcase-Video-Scene-09-—-Generous-Giving-showcase/video.webm" \
  -vf "$(overlay 'Support Your Ministry'),$(subtitle 'Tithes • Offerings • Missions — secure and simple')" \
  -c:v libx264 -preset fast -crf 23 -pix_fmt yuv420p -an "$TMP/f4.mp4" 2>/dev/null

echo "  Follower Scene 5: Live Pastors"
ffmpeg -y -i "$RESULTS/showcase-🎬-Showcase-Video-a2483-e-Real-Pastors-API-Powered--showcase/video.webm" \
  -vf "$(overlay 'Real Pastors, Real Connections')" \
  -c:v libx264 -preset fast -crf 23 -pix_fmt yuv420p -an "$TMP/f5.mp4" 2>/dev/null

echo "  Follower Scene 6: Full Sweep"
ffmpeg -y -i "$RESULTS/showcase-🎬-Showcase-Video-fb9a7--Full-Follower-Portal-Sweep-showcase/video.webm" \
  -vf "$(overlay 'The Complete Follower Experience')" \
  -c:v libx264 -preset fast -crf 23 -pix_fmt yuv420p -an "$TMP/f6.mp4" 2>/dev/null

# ── CONCATENATE ──
echo ""
echo "=== Concatenating pastor video ==="
cat > "$TMP/pastor-list.txt" << 'EOF'
file 'p1.mp4'
file 'p2.mp4'
file 'p3.mp4'
file 'p4.mp4'
file 'p5.mp4'
EOF
ffmpeg -y -f concat -safe 0 -i "$TMP/pastor-list.txt" \
  -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p -movflags +faststart -an \
  frontend/apps/pastor-portal/public/videos/showcase.mp4 2>/dev/null

echo "=== Concatenating follower video ==="
cat > "$TMP/follower-list.txt" << 'EOF'
file 'f1.mp4'
file 'f2.mp4'
file 'f3.mp4'
file 'f4.mp4'
file 'f5.mp4'
file 'f6.mp4'
EOF
ffmpeg -y -f concat -safe 0 -i "$TMP/follower-list.txt" \
  -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p -movflags +faststart -an \
  frontend/apps/follower-portal/public/videos/showcase.mp4 2>/dev/null

# ── Poster frames ──
echo "=== Generating poster frames ==="
ffmpeg -y -i frontend/apps/pastor-portal/public/videos/showcase.mp4 -ss 2 -vframes 1 -update 1 -q:v 2 \
  frontend/apps/pastor-portal/public/videos/showcase-poster.jpg 2>/dev/null
ffmpeg -y -i frontend/apps/follower-portal/public/videos/showcase.mp4 -ss 2 -vframes 1 -update 1 -q:v 2 \
  frontend/apps/follower-portal/public/videos/showcase-poster.jpg 2>/dev/null

# ── Summary ──
echo ""
echo "=== Done ==="
PSIZE=$(du -h frontend/apps/pastor-portal/public/videos/showcase.mp4 | cut -f1)
PDUR=$(ffprobe -v quiet -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 frontend/apps/pastor-portal/public/videos/showcase.mp4)
FSIZE=$(du -h frontend/apps/follower-portal/public/videos/showcase.mp4 | cut -f1)
FDUR=$(ffprobe -v quiet -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 frontend/apps/follower-portal/public/videos/showcase.mp4)
echo "  Pastor video:   $PSIZE  (${PDUR}s)"
echo "  Follower video: $FSIZE  (${FDUR}s)"

rm -rf "$TMP"
