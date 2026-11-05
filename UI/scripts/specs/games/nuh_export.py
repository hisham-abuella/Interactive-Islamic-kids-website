"""Export stage for game 01 (no model is loaded here: Pillow only).

Plates: crop off the painted gold rule border (the game draws its own frame), keep the three
states of each composition on the identical crop so they crossfade in register, WebP q68.
Cut-outs: trim to alpha, a fine dark-ink outline (miniature idiom, not a sticker rim),
a light tint-match towards the plates' warm parchment, WebP with alpha q80.
Writes images/games/nuh/manifest.json with world sizes and sprite aspects.
"""
import json
from pathlib import Path

from PIL import Image, ImageChops, ImageEnhance, ImageFilter

# fraction cropped from each edge (left, top, right, bottom): inside the painted gold rule, and
# past the engine's small corner marks near the bottom edge (text-like glyphs, 3b.4).
PLATE_CROP = {"land": (0.05, 0.06, 0.05, 0.095), "port": (0.07, 0.045, 0.07, 0.07)}
PLATE_W = {"land": 1240, "port": 690}

SPRITE_MAX = {  # longest side in shipped pixels (about 2x the largest display size)
    "ark-whole": 1100, "ark-frame": 1100, "plank": 440, "timber-pile": 460, "mallet": 240, "reeds": 420,
}
ANIMAL_MAX = 340
INK = (52, 36, 20)


# Clean-up of empty sky only (scholar 2b SHOULD 2, 2026-11-04): a faint dotted residue of the
# engine's corner mark sits in the plain sky of plate-judi-land at about x 1207-1233, y 50-77
# (with two specks above). Each row of the box is refilled with that row's sky colour sampled just
# left of it, feathered at the edges. No painted content is touched. Box in shipped pixels.
SKY_FILL = {"plate-judi-land": [(1185, 14, 1240, 84)]}


def sky_fill(im, boxes):
    from PIL import ImageDraw
    px = im.load()
    for (x0, y0, x1, y1) in boxes:
        patch = Image.new("RGB", (x1 - x0, y1 - y0))
        pp = patch.load()
        for y in range(y0, y1):
            ref = [px[x0 - k, y] for k in range(2, 8)]
            col = tuple(sum(c[i] for c in ref) // len(ref) for i in range(3))
            for x in range(x1 - x0):
                pp[x, y - y0] = col
        mask = Image.new("L", patch.size, 0)
        ImageDraw.Draw(mask).rectangle((4, 4, patch.width + 10, patch.height - 5), fill=255)
        im.paste(patch, (x0, y0), mask.filter(ImageFilter.GaussianBlur(2.5)))
    return im


def plates(raw: Path, out: Path, man: dict):
    for comp in ("land", "port"):
        cl, ct, cr, cb = PLATE_CROP[comp]
        for st in ("dry", "flood", "judi"):
            src = raw / f"plate-{st}-{comp}.png"
            if not src.exists():
                print("  missing", src.name)
                continue
            im = Image.open(src).convert("RGB")
            w, h = im.size
            im = im.crop((round(w * cl), round(h * ct), round(w * (1 - cr)), round(h * (1 - cb))))
            tw = PLATE_W[comp]
            th = round(im.height * tw / im.width)
            im = im.resize((tw, th), Image.LANCZOS)
            if f"plate-{st}-{comp}" in SKY_FILL:
                im = sky_fill(im, SKY_FILL[f"plate-{st}-{comp}"])
            im.save(out / f"plate-{st}-{comp}.webp", "WEBP", quality=76, method=6)
            man["world"][comp] = [tw, th]


def outline(rgba: Image.Image, px: int = 2) -> Image.Image:
    a = rgba.getchannel("A").point(lambda v: 255 if v > 40 else 0)
    grown = a.filter(ImageFilter.MaxFilter(px * 2 + 1)).filter(ImageFilter.GaussianBlur(0.6))
    ink = Image.new("RGBA", rgba.size, INK + (0,))
    ink.putalpha(grown.point(lambda v: int(v * 0.85)))
    return Image.alpha_composite(ink, rgba)


def tint(rgba: Image.Image) -> Image.Image:
    rgb = rgba.convert("RGB")
    rgb = ImageEnhance.Color(rgb).enhance(0.92)
    warm = Image.new("RGB", rgb.size, (236, 214, 168))
    rgb = Image.blend(rgb, ImageChops.multiply(rgb, warm), 0.12)
    out = rgb.convert("RGBA")
    out.putalpha(rgba.getchannel("A"))
    return out


def clean_alpha(rgba: Image.Image) -> Image.Image:
    a = rgba.getchannel("A").point(lambda v: 0 if v < 24 else v)
    rgba.putalpha(a)
    return rgba


def sprite(raw: Path, name: str, bbox=None):
    p = raw / f"{name}.cut.png"
    im = clean_alpha(Image.open(p).convert("RGBA"))
    return im, (bbox or im.getchannel("A").getbbox())


def save_sprite(im, bbox, name, out: Path, maxside, man):
    pad = 6
    im = im.crop(bbox)
    canvas = Image.new("RGBA", (im.width + 2 * pad, im.height + 2 * pad), (0, 0, 0, 0))
    canvas.paste(im, (pad, pad))
    canvas = outline(tint(canvas))
    s = min(1.0, maxside / max(canvas.size))
    canvas = canvas.resize((round(canvas.width * s), round(canvas.height * s)), Image.LANCZOS)
    canvas.save(out / f"{name}.webp", "WEBP", quality=80, method=6)
    man["aspects"][name] = round(canvas.width / canvas.height, 4)
    return canvas


# The plank is a strip of the plain hull planking of ark-whole (fractions of its alpha bbox),
# with rounded, slightly ragged ends: the ark's own wood, never a separate render.
PLANK_STRIP = (0.38, 0.70, 0.62, 0.84)
ARK_POST_TOP = 0.20   # where the bow and stern posts start in ark-whole (the cabin roof is above)   # left, top, right, bottom


def plank_from_hull(raw: Path, out: Path, man: dict):
    p = raw / "ark-whole.cut.png"
    if not p.exists():
        return
    im, bb = sprite(raw, "ark-whole")
    im = im.crop(bb)
    w, h = im.size
    l, t, r, b = PLANK_STRIP
    strip = im.crop((round(w * l), round(h * t), round(w * r), round(h * b))).convert("RGBA")
    sw, sh = strip.size
    from PIL import ImageDraw
    mask = Image.new("L", strip.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((2, 2, sw - 3, sh - 3), radius=sh // 3, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(0.8))
    strip.putalpha(ImageChops.multiply(mask, strip.getchannel("A")))
    save_sprite(strip, strip.getchannel("A").getbbox(), "plank", out, SPRITE_MAX["plank"], man)


# rembg treats a white animal on a cream ground as background (it dropped the sheep's face).
# For these, cut by flood-filling the plain ground from the image edges instead (no model).
FLOOD_CUT = {"animal-sheep": 0.06, "animal-rabbit": 0.13, "ark-frame": 0.09}


def flood_cut(raw: Path, name: str, crop: float):
    im = Image.open(raw / f"{name}.png").convert("RGB")
    w, h = im.size
    m = int(min(w, h) * crop)
    im = im.crop((m, m, w - m, h - m))
    w, h = im.size
    px = im.load()
    i = int(min(w, h) * 0.04)   # sample and seed slightly inside, past any leftover frame line
    corners = [px[w // 2, i], px[i, h // 2], px[w - i, h // 2], px[w // 3, i], px[2 * w // 3, i]]  # mid-edges: frame corners are ornamented
    bg = tuple(sorted(c[k] for c in corners)[2] for k in range(3))
    diff = ImageChops.difference(im, Image.new("RGB", im.size, bg)).convert("L").point(lambda v: 255 if v > 26 else 0)
    # flood the ground (0) from every edge pixel with 128; what stays 0 is enclosed paper (inside the animal)
    from PIL import ImageDraw
    for x in range(0, w, 6):
        for y in (0, i, h - 1 - i, h - 1):
            if diff.getpixel((x, y)) == 0:
                ImageDraw.floodfill(diff, (x, y), 128)
    for y in range(0, h, 6):
        for x in (0, i, w - 1 - i, w - 1):
            if diff.getpixel((x, y)) == 0:
                ImageDraw.floodfill(diff, (x, y), 128)
    solid = diff.point(lambda v: 0 if v == 128 else 255)
    # keep only the animal: the connected shape through the middle (drops frame corners and flecks)
    cx, cy = w // 2, h // 2
    best = min(((x, y) for x in range(cx - 60, cx + 61, 4) for y in range(cy - 60, cy + 61, 4)
                if solid.getpixel((x, y)) == 255), key=lambda q: abs(q[0] - cx) + abs(q[1] - cy))
    ImageDraw.floodfill(solid, best, 200)
    alpha = solid.point(lambda v: 255 if v == 200 else 0).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.7))
    rb = raw / f"{name}.rembg.png"   # rembg's own cut, kept from the cut stage, if any
    if rb.exists():
        ra = Image.open(rb).convert("RGBA").getchannel("A")
        if ra.size == alpha.size:
            alpha = ImageChops.lighter(alpha, ra)   # union: each method misses a different pale patch
    out = im.convert("RGBA")
    out.putalpha(alpha)
    out.save(raw / f"{name}.cut.png")


def export(raw: Path, out: Path):
    out.mkdir(parents=True, exist_ok=True)
    for name, crop in FLOOD_CUT.items():
        if (raw / f"{name}.png").exists():
            flood_cut(raw, name, crop)
    man = {"world": {}, "aspects": {}}
    plates(raw, out, man)
    # the ark: whole and frame share one bbox, so the planks land exactly on the frame
    # The ark: the finished ark and the bare frame share one canvas. The Qwen edit drew the frame a
    # little smaller and lower, so it is registered here: its bounds are fitted to the finished hull
    # (full width; from the stem-post tops at ARK_POST_TOP of the ark's height down to the keel).
    if (raw / "ark-whole.cut.png").exists():
        aw, bw = sprite(raw, "ark-whole")
        aw = aw.crop(bw)
        save_sprite(aw, (0, 0) + aw.size, "ark-whole", out, SPRITE_MAX["ark-whole"], man)
        if (raw / "ark-frame.cut.png").exists():
            af, bf = sprite(raw, "ark-frame")
            af = af.crop(bf)
            W, H = aw.size
            top = round(H * ARK_POST_TOP)
            canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
            canvas.paste(af.resize((W, H - top), Image.LANCZOS), (0, top))
            save_sprite(canvas, (0, 0, W, H), "ark-frame", out, SPRITE_MAX["ark-frame"], man)
    plank_from_hull(raw, out, man)
    for name, mx in SPRITE_MAX.items():
        if name.startswith("ark") or name == "plank" or not (raw / f"{name}.cut.png").exists():
            continue
        im, bb = sprite(raw, name)
        save_sprite(im, bb, name, out, mx, man)
    for p in sorted(raw.glob("animal-*.cut.png")):
        name = p.name[:-8]
        im, bb = sprite(raw, name)
        save_sprite(im, bb, name, out, ANIMAL_MAX, man)
    (out / "manifest.json").write_text(json.dumps(man, indent=1))
    total = sum(f.stat().st_size for f in out.glob("*.webp"))
    print(f"exported {len(list(out.glob('*.webp')))} webp, {total / 1024:.0f} KB")
