"""Export stage for game 03, The Path Through the Sea (no model is loaded here: Pillow only).

Plates: crop off the painted gold rule border (the game draws its own frame), keep the four states of each
composition on the identical crop so they crossfade in register, WebP. Cut-outs: trim to alpha, a fine dark-ink
outline (miniature idiom, not a sticker rim), a light tint-match towards the plates' warm parchment, WebP with alpha.
Shared helpers come from nuh_export.py (the pipeline proven on game 01).
Writes images/games/musa/manifest.json with world sizes and sprite aspects.
"""
import json
from pathlib import Path

from PIL import Image

from specs.games.nuh_export import clean_alpha, flood_cut, save_sprite  # noqa: F401

# Registration: Qwen-Image-Edit redraws the painted gold rule a few pixels off each time (the calm edit came back
# 1.5% larger), so each state is cropped relative to its OWN painted frame, found by its gold pixels; all states of
# a composition then line up for the crossfades. INSET: fraction of the frame size kept clear inside the rule.
INSET = {"land": (0.012, 0.02, 0.012, 0.022), "port": (0.02, 0.012, 0.02, 0.016)}
FALLBACK = {"land": (0.04, 0.06, 0.04, 0.065), "port": (0.065, 0.045, 0.065, 0.06)}


def frame_box(im):
    """The painted gold rule: the outermost rows and columns that are mostly gold. None if not found."""
    import numpy as np
    a = np.asarray(im).astype(int)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    gold = ((r > 140) & (g > 100) & (b < 120) & (r - b > 60)).astype(float)
    H, W = gold.shape
    cols, rows = gold.mean(0), gold.mean(1)

    def edge(prof, rng):
        for i in rng:
            if prof[i] > 0.35:
                return i
        return None
    box = (edge(cols, range(0, W // 8)), edge(rows, range(0, H // 8)),
           edge(cols, range(W - 1, W - W // 8, -1)), edge(rows, range(H - 1, H - H // 8, -1)))
    return None if None in box else box
PLATE_W = {"land": 1240, "port": 690}
STATES = ("shore", "split", "dawn", "calm")

SPRITE_MAX = {  # longest side in shipped pixels (about 2x the largest display size)
    "lantern": 420, "tent": 520, "bundle": 180, "reeds": 560, "fish-a": 110, "fish-b": 110,
}
# cut-outs whose pale parts sit on the pale ground: cut by the model-free flood fill from the edges,
# unioned with rembg's own mask (as for the Nuh sheep)
FLOOD_CUT = {"lantern": 0.09}   # rembg cut a ragged hole in the pale glass (3b.9); the edge flood fill keeps it whole


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
            im.save(out / f"plate-{st}-{comp}.webp", "WEBP", quality=74, method=6)
            man["world"][comp] = [tw, th]


def export(raw: Path, out: Path):
    out.mkdir(parents=True, exist_ok=True)
    for name, crop in FLOOD_CUT.items():
        if (raw / f"{name}.png").exists():
            flood_cut(raw, name, crop)
    man = {"world": {}, "aspects": {}}
    plates(raw, out, man)
    for name, mx in SPRITE_MAX.items():
        p = raw / f"{name}.cut.png"
        if not p.exists():
            print("  missing", p.name)
            continue
        im = clean_alpha(Image.open(p).convert("RGBA"))
        save_sprite(im, im.getchannel("A").getbbox(), name, out, mx, man)
    (out / "manifest.json").write_text(json.dumps(man, indent=1))
    total = sum(f.stat().st_size for f in out.glob("*.webp"))
    print(f"exported {len(list(out.glob('*.webp')))} webp, {total / 1024:.0f} KB")
