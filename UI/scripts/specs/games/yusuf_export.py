"""Export stage for game 02, Yusuf's Journey (no model is loaded here: Pillow only).

Plates: crop each state relative to its own painted gold rule (as for Musa: the Qwen edits redraw the frame a few
pixels off), so day, night, hard years and evening crossfade in register; WebP. The landscape plates ship a little
wider than Musa's (1440 px), because the granary beat zooms the camera in on Egypt.
Cut-outs: trim to alpha, a fine dark-ink outline (miniature idiom, not a sticker rim), a light tint-match towards the
plates' warm parchment, WebP with alpha. Shared helpers come from nuh_export.py and musa_export.py.
Writes images/games/yusuf/manifest.json with world sizes and sprite aspects.
"""
import json
from pathlib import Path

from PIL import Image

from specs.games.musa_export import frame_box
from specs.games.nuh_export import clean_alpha, flood_cut, save_sprite  # noqa: F401

# land inset is wider than Musa's: the hard-years and evening edits paint a patterned band inside the gold rule (same inset
# for every state, so the crossfades stay in register)
INSET = {"land": (0.03, 0.036, 0.03, 0.036), "port": (0.024, 0.016, 0.024, 0.018)}
FALLBACK = {"land": (0.04, 0.06, 0.04, 0.065), "port": (0.065, 0.045, 0.065, 0.06)}
PLATE_W = {"land": 1440, "port": 760}
STATES = ("day", "night", "hard", "eve")
QUALITY = 72

SPRITE_MAX = {  # longest side in shipped pixels (about 2x the largest display size)
    "well": 340, "camel": 420, "palm": 420, "door": 300, "sheaf": 260,
    "sun": 220, "moon": 220,
}
# the sun and moon discs are as pale as the ground at their centres: rembg cut them hollow (a ring, which can read as an
# eye-like orb). They are cut by the model-free edge flood fill unioned with rembg's mask (the Nuh sheep / Musa lantern method).
FLOOD_CUT = {"moon": 0.06, "door": 0.08, "palm": 0.08}   # door: rembg dropped the brown door leaf itself; palm: torn fronds
# the sun's soft warm edge fades into the pale ground, so neither rembg nor the edge flood fill finds it: being a plain
# disc, it is cut by a circle fitted to its saturated gold pixels (a cut, not a retouch: no painted pixel is changed).
DISC_CUT = {"sun": 0.06}


def disc_cut(raw: Path, name: str, crop: float):
    import numpy as np
    from PIL import ImageDraw, ImageFilter
    im = Image.open(raw / f"{name}.png").convert("RGB")
    w, h = im.size
    m = int(min(w, h) * crop)
    im = im.crop((m, m, w - m, h - m))
    hsv = np.asarray(im.convert("HSV")).astype(int)
    ys, xs = np.nonzero(hsv[..., 1] > 90)          # the gold disc and its rim; the cream ground is barely saturated
    x0, x1, y0, y1 = np.percentile(xs, 0.5), np.percentile(xs, 99.5), np.percentile(ys, 0.5), np.percentile(ys, 99.5)
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).ellipse((x0 - 2, y0 - 2, x1 + 2, y1 + 2), fill=255)
    out = im.convert("RGBA"); out.putalpha(mask.filter(ImageFilter.GaussianBlur(1.2)))
    out.save(raw / f"{name}.cut.png")


def plates(raw: Path, out: Path, man: dict):
    for comp in ("land", "port"):
        for st in STATES:
            src = raw / f"plate-{st}-{comp}.png"
            if not src.exists():
                print("  missing", src.name)
                continue
            im = Image.open(src).convert("RGB")
            w, h = im.size
            fb = frame_box(im)
            if fb:
                l, t, r, b = fb; fw, fh = r - l, b - t; il, it, ir, ib = INSET[comp]
                im = im.crop((round(l + fw * il), round(t + fh * it), round(r - fw * ir), round(b - fh * ib)))
            else:
                print("  no frame found, fallback crop:", src.name)
                cl, ct, cr, cb = FALLBACK[comp]
                im = im.crop((round(w * cl), round(h * ct), round(w * (1 - cr)), round(h * (1 - cb))))
            tw = PLATE_W[comp]
            th = man["world"].get(comp, [tw, round(im.height * tw / im.width)])[1]   # every state on the first one's size
            im = im.resize((tw, th), Image.LANCZOS)
            im.save(out / f"plate-{st}-{comp}.webp", "WEBP", quality=QUALITY, method=6)
            man["world"][comp] = [tw, th]


def export(raw: Path, out: Path):
    out.mkdir(parents=True, exist_ok=True)
    for name, crop in FLOOD_CUT.items():
        if (raw / f"{name}.png").exists():
            flood_cut(raw, name, crop)
    for name, crop in DISC_CUT.items():
        if (raw / f"{name}.png").exists():
            disc_cut(raw, name, crop)
    man = {"world": {}, "aspects": {}}
    plates(raw, out, man)
    for name, mx in SPRITE_MAX.items():
        p = raw / f"{name}.cut.png"
        if not p.exists():
            print("  missing", p.name)
            continue
        im = clean_alpha(Image.open(p).convert("RGBA"))
        save_sprite(im, im.getchannel("A").getbbox(), name, out, mx, man)
    # the grain bags are the cloth bundle already approved on Musa (scholar gate 2b, 2026-11-06), copied byte for byte:
    # every Yusuf sack render carried a star motif (see yusuf.py), so no new image is needed for them
    import shutil
    shutil.copyfile(out.parent / "musa" / "bundle.webp", out / "bundle.webp")
    with Image.open(out / "bundle.webp") as b:
        man["aspects"]["bundle"] = round(b.width / b.height, 4)
    (out / "manifest.json").write_text(json.dumps(man, indent=1))
    total = sum(f.stat().st_size for f in out.glob("*.webp"))
    print(f"exported {len(list(out.glob('*.webp')))} webp, {total / 1024:.0f} KB")
