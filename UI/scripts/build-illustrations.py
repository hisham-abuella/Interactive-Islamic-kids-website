#!/usr/bin/env python3
"""Render the story scene plates locally, through Draw Things.

Nothing here calls a paid API and nothing leaves the machine — the whole point
of using the local engine is that a father generating pictures for his son's
story pages does not have to send the prompts anywhere.

    python3 scripts/build-illustrations.py                  # everything missing
    python3 scripts/build-illustrations.py prophet-nuh      # one story
    python3 scripts/build-illustrations.py prophet-nuh:4    # one plate
    python3 scripts/build-illustrations.py --force …        # redo existing
    python3 scripts/build-illustrations.py --list           # prompts only

Output: images/stories/<story>/<cover|scene-N>.webp

The engine writes a ~1.1 MB PNG; that is far too heavy to put eight of on a
page, so each plate is resized and converted to WebP with Pillow and lands
around 60-90 KB. The PNG is discarded. (macOS `sips` reads WebP but cannot
write it, which is why this goes through Pillow instead.)
"""

import argparse
import subprocess
import sys
import tempfile
import zlib
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).parent))
from specs.illustrations import NEGATIVE, PLATES, STYLE, all_plates  # noqa: E402

CLI = "/opt/homebrew/bin/draw-things-cli"
MODEL = "z_image_turbo_1.0_q8p.ckpt"

# The engine reloads the model on every call (~40s), so a full run is slow but
# needs no daemon. Generous ceiling: a cold first load is the worst case.
TIMEOUT = 600

# 16:9, and both sides a multiple of 64 as the engine requires.
GEN_W, GEN_H = 1024, 576
# What actually ships. A plate never renders wider than ~720 CSS px, so 960
# still covers a 2x display without paying for pixels nobody sees.
WEB_W = 960
QUALITY = 72

ROOT = Path(__file__).resolve().parent.parent
OUT_ROOT = ROOT / "images" / "stories"


def seed_for(story: str, key) -> int:
    """Stable per-plate seed, so a re-run reproduces the same picture.

    crc32 rather than hash(): Python salts string hashing per process, so
    hash() would hand the same plate a different seed on every run.
    """
    return zlib.crc32(f"{story}/{key}".encode()) % 2_000_000


def render(story: str, key, prompt: str, dest: Path) -> bool:
    with tempfile.TemporaryDirectory() as tmp:
        png = Path(tmp) / "plate.png"
        cmd = [
            CLI, "generate",
            "--model", MODEL,
            "--prompt", f"{prompt}, {STYLE}",
            "--negative-prompt", NEGATIVE,
            "--width", str(GEN_W), "--height", str(GEN_H),
            "--seed", str(seed_for(story, key)),
            "--output", str(png),
        ]
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=TIMEOUT)
        if proc.returncode != 0 or not png.exists():
            tail = (proc.stderr or proc.stdout or "no output").strip().splitlines()[-2:]
            print(f"  FAILED {story}/{key}: {' '.join(tail)}")
            return False

        dest.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(png) as im:
            h = round(im.height * WEB_W / im.width)
            im.convert("RGB").resize((WEB_W, h), Image.LANCZOS).save(
                dest, "WEBP", quality=QUALITY, method=6
            )
    return True


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("targets", nargs="*", help="story id, or story:scene / story:cover")
    ap.add_argument("--force", action="store_true", help="re-render plates that already exist")
    ap.add_argument("--list", action="store_true", help="print prompts and exit")
    args = ap.parse_args()

    wanted = []
    for story, key, prompt in all_plates():
        tag = f"{story}:{key}"
        if args.targets and story not in args.targets and tag not in args.targets:
            continue
        wanted.append((story, key, prompt))

    if args.targets and not wanted:
        print(f"Nothing matched {args.targets}. Stories: {', '.join(PLATES)}")
        return 1

    if args.list:
        for story, key, prompt in wanted:
            print(f"{story}/{key}\n    {prompt}\n")
        return 0

    if not Path(CLI).exists():
        print(f"draw-things-cli not found at {CLI} — `brew install draw-things-cli`.")
        return 1

    made = skipped = failed = 0
    for i, (story, key, prompt) in enumerate(wanted, 1):
        name = "cover" if key == "cover" else f"scene-{key}"
        dest = OUT_ROOT / story / f"{name}.webp"
        if dest.exists() and not args.force:
            skipped += 1
            continue
        print(f"[{i}/{len(wanted)}] {story}/{name} …", flush=True)
        if render(story, key, prompt, dest):
            print(f"  wrote {dest.relative_to(ROOT)}  {dest.stat().st_size // 1024} KB", flush=True)
            made += 1
        else:
            failed += 1

    print(f"\nDone. {made} rendered, {skipped} already present, {failed} failed.")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
