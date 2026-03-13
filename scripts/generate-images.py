"""
Generate 8 key images for MayTheLordBePraised using OpenRouter + Gemini Flash Image.
Run: OPENROUTER_API_KEY=sk-or-... python3 scripts/generate-images.py
"""
import os
import sys
import json
import base64
import time
import requests

API_KEY = os.environ.get("OPENROUTER_API_KEY")
if not API_KEY:
    print("ERROR: Set OPENROUTER_API_KEY environment variable")
    sys.exit(1)

MODEL = "google/gemini-2.5-flash-image"
OUTPUT_DIR = "frontend/assets/images"

STYLE = (
    "Warm, editorial photography. Color palette: cream (#fdf8f0), warm browns (#3d2518), "
    "golden earth (#d4a574), sand (#f5ead6). Soft natural lighting, shallow depth of field. "
    "No text, no UI overlays, no watermarks. Photorealistic, warm and inviting — like a premium church magazine."
)

IMAGES = [
    {
        "name": "hero-pastor",
        "prompt": (
            "A warm cinematic photograph of a pastor in their mid-40s sitting at a modern desk "
            "in a sunlit church office. Looking at a laptop with a calm confident smile. Warm morning "
            "light streams through a tall window. Bookshelves with books in soft background. "
            "Bible and coffee cup on desk. Earth tones and cream colors. Peaceful productivity. "
            "16:9 aspect ratio."
        ),
    },
    {
        "name": "hero-follower",
        "prompt": (
            "An overhead aerial photograph of a diverse group of people sitting in a circle in a warm "
            "sunlit church community room, holding hands in prayer. Wooden floor, natural light from "
            "tall windows. Earth-toned clothing. Warm golden hour lighting. Slightly desaturated with "
            "warm cream and brown color grading. No faces clearly visible, focus on hands and circle. "
            "16:9 aspect ratio."
        ),
    },
    {
        "name": "prayer-hands",
        "prompt": (
            "Close-up photograph of weathered hands clasped together in prayer over an open Bible. "
            "Warm candlelight illumination with a soft golden glow. Shallow depth of field. "
            "Intimate, sacred, deeply comforting mood. Brown and earth color palette. 4:3 aspect ratio."
        ),
    },
    {
        "name": "counseling-session",
        "prompt": (
            "A warm photograph of a pastor meeting with a young couple in a cozy counseling room. "
            "Sitting in comfortable chairs. Soft natural lighting through sheer curtains. "
            "Earth-toned decor with a plant, wooden furniture, cream walls. Trust and guidance mood. "
            "No faces directly toward camera. 4:3 aspect ratio."
        ),
    },
    {
        "name": "community-group",
        "prompt": (
            "A warm photograph of a small church group of 5-6 diverse people gathered around a table "
            "with Bibles and coffee, engaged in animated discussion. Cozy room with warm lighting, "
            "bookshelves, plants. Fellowship and connection mood. Earth-toned environment. "
            "4:3 aspect ratio."
        ),
    },
    {
        "name": "giving-offering",
        "prompt": (
            "A tasteful overhead photograph of an offering plate on a wooden church pew with golden "
            "light streaming in from a stained glass window in amber and gold tones. A few envelopes "
            "and a small cross visible. Generosity and warmth mood. No money visible. "
            "4:3 aspect ratio."
        ),
    },
    {
        "name": "church-interior",
        "prompt": (
            "A warm serene photograph of a sunlit church sanctuary seen from the altar perspective. "
            "Rows of wooden pews stretching toward tall windows. Morning light creating golden beams. "
            "No people. Cream and warm brown tones. Peaceful, sacred atmosphere. 16:9 aspect ratio."
        ),
    },
    {
        "name": "pastor-welcome",
        "prompt": (
            "A warm editorial photograph of a friendly pastor standing at the entrance of their church, "
            "arms gently open in a welcoming gesture. Golden afternoon light. Wooden doors and stone "
            "architecture visible. Smart casual attire. Welcoming mood. 4:3 aspect ratio."
        ),
    },
]


def generate_image(prompt_data: dict) -> bytes | None:
    """Generate a single image via OpenRouter."""
    full_prompt = f"{STYLE}\n\nGenerate this image:\n{prompt_data['prompt']}"

    resp = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": MODEL,
            "messages": [{"role": "user", "content": full_prompt}],
        },
        timeout=120,
    )

    if resp.status_code != 200:
        print(f"  ERROR: HTTP {resp.status_code}: {resp.text[:200]}")
        return None

    result = resp.json()
    if "choices" not in result:
        print(f"  ERROR: No choices in response: {json.dumps(result)[:200]}")
        return None

    msg = result["choices"][0]["message"]
    images = msg.get("images", [])

    if not images:
        # Try content as list
        content = msg.get("content", "")
        if isinstance(content, list):
            for part in content:
                if part.get("type") == "image_url":
                    url = part["image_url"]["url"]
                    if url.startswith("data:"):
                        return base64.b64decode(url.split(",")[1])
        print(f"  ERROR: No images in response. Content: {str(content)[:200]}")
        return None

    # Extract from images array
    img = images[0]
    url = img.get("image_url", {}).get("url", "")
    if url.startswith("data:"):
        return base64.b64decode(url.split(",")[1])

    print(f"  ERROR: Unexpected image format: {str(img)[:200]}")
    return None


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print(f"Generating {len(IMAGES)} images via {MODEL}...")
    print(f"Output: {OUTPUT_DIR}/\n")

    success = 0
    for i, img_data in enumerate(IMAGES, 1):
        name = img_data["name"]
        print(f"[{i}/{len(IMAGES)}] {name}...")

        img_bytes = generate_image(img_data)
        if img_bytes:
            path = os.path.join(OUTPUT_DIR, f"{name}.png")
            with open(path, "wb") as f:
                f.write(img_bytes)
            size_kb = len(img_bytes) / 1024
            print(f"  Saved: {path} ({size_kb:.0f} KB)")
            success += 1
        else:
            print(f"  FAILED: {name}")

        # Brief pause between requests to be nice to the API
        if i < len(IMAGES):
            time.sleep(2)

    print(f"\nDone! {success}/{len(IMAGES)} images generated in {OUTPUT_DIR}/")


if __name__ == "__main__":
    main()
