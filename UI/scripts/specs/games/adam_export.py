"""Export stage for game 05, The Garden of Choices (no model is loaded here: Pillow only).

Plates: the garden master is cropped inside its OWN painted gold rule (found by its gold pixels, as for Musa and
Ibrahim); the dimmed garden and the earth at dawn are Qwen edits of that master, so each is registered to it (edge
correlation of the landscape, as in ibrahim_export.register) and the three crossfade in register. The courtyard is
its own composition, centre-cropped to the same world size. Cut-outs: trim to alpha, a fine dark-ink outline, a light
tint-match towards the plates' warm parchment, WebP with alpha (shared helpers from nuh_export.py).
Mama's pot breaks into three pieces in the browser (CSS clip-path polygons over the one approved pot sprite), so no
shard art is generated. Writes images/games/adam/manifest.json with world sizes and sprite aspects.
"""
import json
from pathlib import Path

from PIL import Image

from specs.games.ibrahim_export import crop_plate, register
from specs.games.nuh_export import clean_alpha, flood_cut, save_sprite  # noqa: F401

PLATE_W = {"land": 1240, "port": 690}
STATES = ("garden", "dim", "earth", "court")
REGISTERED = {"dim", "earth"}       # edits of the garden master
# The earth edits redrew the border as a wide blue scrollwork band (script-like, 3b.4) and moved the river, so they
# cannot be registered to the garden: each is cropped to a fixed box measured INSIDE that band (render pixels), so no
# part of the band ships. {name: (left, top, right, bottom)}
INNER_BOX = {"plate-earth-land": (84, 82, 1260, 812), "plate-earth-port": (58, 66, 714, 1344)}
EDGE_TRIM = 0.012                   # a thin inner rule some renders draw just inside the found frame

SPRITE_MAX = {  # longest side in shipped pixels (about 2x the largest display size)
    "fruit-pomegranate": 200, "fruit-dates": 200, "fruit-figs": 200, "fruit-pear": 200, "fruit-orange": 200,
    "basket": 460, "jug": 260, "sprout": 260, "bloom": 300, "ball": 160, "pot": 340, "leaves": 520, "cat": 360,
}
# the sprout: rembg dropped the soil mound and punched a hole in a pale leaf (3b.9), so it is cut by the model-free
# edge flood fill (inside its painted tile frame, which the crop leaves out)
FLOOD_CUT = {"sprout": 0.2}
# a recorded, model-free clean-up per plate, if one is ever needed: {name: [(x0, y0, x1, y1), ...]} in shipped pixels
SKY_FILL = {}


def plates(raw: Path, out: Path, man: dict):
    for comp in ("land", "port"):
        master = None
        for st in STATES:
            src = raw / f"plate-{st}-{comp}.png"
            if not src.exists():
                print("  missing", src.name)
                continue
            im = Image.open(src).convert("RGB")
            if f"plate-{st}-{comp}" in INNER_BOX:
                im = im.crop(INNER_BOX[f"plate-{st}-{comp}"])
            elif st in REGISTERED and master is not None:
                im = register(im, master)
            else:
                im = crop_plate(im, comp)
                e = round(min(im.size) * EDGE_TRIM)
                im = im.crop((e, e, im.width - e, im.height - e))
                if st == "garden":
                    master = im
            tw = PLATE_W[comp]
            if comp in man["world"]:
                tw, th = man["world"][comp]
                a = tw / th
                if im.width / im.height > a:
                    nw = round(im.height * a); x0 = (im.width - nw) // 2; im = im.crop((x0, 0, x0 + nw, im.height))
                else:
                    nh = round(im.width / a); y0 = (im.height - nh) // 2; im = im.crop((0, y0, im.width, y0 + nh))
            else:
                th = round(im.height * tw / im.width)
                man["world"][comp] = [tw, th]
            im = im.resize((tw, th), Image.LANCZOS)
            name = f"plate-{st}-{comp}"
            if name in SKY_FILL:
                from specs.games.nuh_export import sky_fill
                im = sky_fill(im, SKY_FILL[name])
            im.save(out / f"{name}.webp", "WEBP", quality=80, method=6)


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
