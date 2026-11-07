"""Art for game 03, The Path Through the Sea (Musa), the second painted game (2026-11-06).

Every prompt, seed and negative for every sprite is recorded here, as the scholar's art checklist
requires (claudeteam/reviews/game-islamic-review-2026-11-03.md, 3a.7). Read by
scripts/build-game-art.py. Human-readable copy: claudeteam/reviews/game-musa-art.md.

Rules carried by these prompts:
- STYLE and NEGATIVE are imported from specs/illustrations.py and used word for word, so the game
  matches the story plates exactly. The game list of 3a.3 is appended, as for Nuh.
- Things only: the sea, the sand, the sky, tents, a lantern, a jar, reeds, a palm, fish (3a.1).
  No prophet, no person, no crowd, no army, no "traveller", no staff (3a.1, gate-1 ruling 03).
- Musa bans (3a.4): no people walking between the walls of water, no chariots or riders. Added here:
  no staff, no hand, no bodies or wreckage in the water (the closing of the sea is never shown as a
  drowning, 3b.7), no moon (a crescent with a star could read as an emblem, 3b.3).
- The army is never painted at all: it comes from behind the viewer, and is only a far sound.
- The believers are never painted: in the game they are small lantern-lights and soft footprints.

Kinds (as in nuh.py):
- "plate":   full-bleed background, Z-Image Turbo, kept whole.
- "edit":    Qwen-Image-Edit 2511 applied to the plate named in `source`, so a state change keeps the
             composition, palette and light identical (night shore -> split -> dawn; night -> calm dawn).
- "cutout":  Z-Image Turbo on a plain pale ground, then rembg (under the heavy lane), trim, fine ink
             outline, tint-match, WebP with alpha.
"""
import zlib

from specs.illustrations import NEGATIVE, STYLE  # noqa: F401  (STYLE is appended by build-game-art.py)

Z_MODEL = "z_image_turbo_1.0_q8p.ckpt"
EDIT_MODEL = "qwen_image_edit_2511_q8p.ckpt"

# Section 3a.3 game additions (as in nuh.py), plus the Musa bans of 3a.4 and the gate-1 ruling for 03.
GAME_NEGATIVE = (
    "figure, cross, crucifix, church, menorah, star of david, om symbol, yin yang, buddha, "
    "statue, idol, totem, pentagram, evil eye, hamsa, zodiac, halo, wings on a person, cherub, "
    "serpent, snake, devil, horns, skull, blood, weapon, sword, spear, gore, bikini, bare shoulders, "
    "chariot, chariots, wheel, horse, soldier, soldiers, army, rider, staff, stick, rod, hand, "
    "bodies, corpse, drowning, wreckage, debris, floating objects, "
    "moon, crescent, crescent moon"
)
NEG = f"{NEGATIVE}, {GAME_NEGATIVE}"

# Appended to every cut-out source prompt so rembg has a clean edge to find.
ISOLATE = "single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow"


def seed(name: str) -> int:
    """Stable per-asset seed (crc32, like build-illustrations.py). Bump the suffix to reroll."""
    return zlib.crc32(f"game-musa/{name}".encode()) % 2_000_000


SHORE = (
    "a wide calm sea at night seen from a high viewpoint like a manuscript painting, "
    "a broad empty beach of pale sand fills the bottom of the picture, "
    "the dark sea fills the middle and stretches up to a low far shore with soft dark hills near the top, "
    "a deep cobalt blue night sky with a few small gold stars, gentle stylized wave lines with gold edges, "
    "a few tall reeds at the water's edge on the sides, no boats, nothing on the beach"
)
SHORE_TALL = (
    "a tall vertical view of a wide calm sea at night seen from a high viewpoint like a manuscript painting, "
    "a broad empty beach of pale sand fills the bottom quarter of the picture, "
    "the dark sea fills the middle half and stretches up to a low far shore with soft dark hills, "
    "a deep cobalt blue night sky with a few small gold stars fills the top quarter, "
    "gentle stylized wave lines with gold edges, a few tall reeds at the water's edge on the sides, "
    "no boats, nothing on the beach"
)
SPLIT_EDIT = (
    "Change only the sea. Keep the exact same beach, far shore, night sky, stars, palette, style and gold "
    "border. The sea is now split in two: two tall smooth walls of deep turquoise and cobalt water stand "
    "on the left and on the right, with stylized gold-edged curling crests along their tops, and between "
    "them a straight dry path of pale golden sand runs from the beach at the bottom straight up the middle "
    "of the picture to the far shore. The path is completely empty and dry, with a few smooth pebbles. "
    "Nothing stands on the path. No people, no animals, no footprints, no boats, no text."
)
DAWN_EDIT = (
    "Keep the exact same composition, the same two walls of water, the same dry sand path, the same beach "
    "and far shore, the same palette, style and gold border. Change only the time of day: it is now the "
    "first light of dawn. The sky over the far shore glows soft apricot, rose and pale gold, the stars "
    "have faded, and warm early light touches the crests of the water walls and the far hills. The sun "
    "has not risen yet. The path stays completely empty. No people, no sun disc, no text."
)
CALM_EDIT = (
    "Keep the exact same composition, the same beach, far shore, hills, palette, style and gold border. "
    "It is now early morning at dawn: the sky glows soft apricot, rose and pale gold and the stars have "
    "faded. The sea is whole again and lies completely calm and still, with gentle stylized gold-edged "
    "ripples. There is no path through the water. Nothing at all floats on the water and nothing lies on "
    "the beach. No boats, no people, no wreckage, no text."
)

ASSETS = {
    # ---------- background plates: landscape (tablet, laptop) ----------
    "plate-shore-land": dict(kind="plate", w=1344, h=896, prompt=SHORE),
    "plate-split-land": dict(kind="edit", w=1344, h=896, source="plate-shore-land", prompt=SPLIT_EDIT),
    # dawn is an edit of the split plate (not the master), so the walls and path stay in register
    "plate-dawn-land": dict(kind="edit", w=1344, h=896, source="plate-split-land", prompt=DAWN_EDIT),
    "plate-calm-land": dict(kind="edit", w=1344, h=896, source="plate-shore-land", prompt=CALM_EDIT),
    # ---------- background plates: portrait (phone), composed on their own ----------
    "plate-shore-port": dict(kind="plate", w=768, h=1408, prompt=SHORE_TALL),
    "plate-split-port": dict(kind="edit", w=768, h=1408, source="plate-shore-port", prompt=SPLIT_EDIT),
    "plate-dawn-port": dict(kind="edit", w=768, h=1408, source="plate-split-port", prompt=DAWN_EDIT),
    "plate-calm-port": dict(kind="edit", w=768, h=1408, source="plate-shore-port", prompt=CALM_EDIT),

    # ---------- cut-outs ----------
    # the child's lantern (and, small, every believer's light). Plain metal: a pierced lantern pattern
    # is the likeliest place for pseudo-script (3b.4).
    "lantern": dict(kind="cutout", w=768, h=1024, prompt=(
        "one small hanging brass lantern with a round body, a plain ring handle on top and clear glass "
        "panes glowing with warm golden light inside, plain smooth metal with no pattern, no holes and "
        "no writing, " + ISOLATE)),
    # the believers' camp on the near shore: things only (gate-1: people never drawn)
    "tent": dict(kind="cutout", w=1024, h=768, prompt=(
        "one small plain cloth tent of undyed beige wool, a simple low triangular shape on two short "
        "wooden poles, the door flap closed, no pattern, no decoration, " + ISOLATE)),
    "jar": dict(kind="cutout", w=768, h=768, prompt=(
        "one plain terracotta clay water jar with two small handles, no pattern, no decoration, " + ISOLATE)),
    "bundle": dict(kind="cutout", w=768, h=768, prompt=(
        "one small travel bundle of plain undyed cloth tied up with a rope knot, resting on the ground, "
        "no pattern, " + ISOLATE)),
    # foreground framing, cropped at the corners
    "reeds": dict(kind="cutout", w=768, h=1024, prompt=(
        "a clump of tall slender green reeds and papyrus stems with feathery tops, growing upward, " + ISOLATE)),
    "palm": dict(kind="cutout", w=768, h=1024, prompt=(
        "one date palm tree with a slender gently curved trunk and a crown of green fronds, whole tree "
        "visible, " + ISOLATE)),
    # glimpsed inside the walls of water (decoration; scholar question 2 in game-musa-art.md)
    "fish-a": dict(kind="cutout", w=768, h=768, prompt=(
        "one small turquoise fish swimming, side view, whole fish visible, gentle, " + ISOLATE)),
    "fish-b": dict(kind="cutout", w=768, h=768, prompt=(
        "one small golden yellow fish swimming, side view, whole fish visible, gentle, " + ISOLATE)),
}


# ---------- rejections and rerolls (claudeteam/reviews/game-musa-art.md, generation record) ----------
# r2: the first portrait master (seed 214577) had an arrow-like gold pen squiggle on the empty sand at bottom left,
# which could read as a glyph (3b.4), and a small gold speck on the horizon. Rejected; rerolled before any edit used it.
ASSETS["plate-shore-port"]["seed"] = seed("plate-shore-port-r2")
# r2: the first lantern (seed 1310454) was a photoreal hurricane lamp with an X-shaped wire guard across the glass,
# which reads as a cross (3b.3), and it was out of the manuscript style. Rejected.
ASSETS["lantern"].update(seed=seed("lantern-r2"), neg_extra="wire guard, bars across the glass, grille, cross bars, hurricane lamp, kerosene lamp, photorealistic metal", prompt=(
    "one small hanging lantern in flat manuscript painting style, a plain smooth brass body shaped like a short "
    "rounded cylinder with one clear glass window band all round that glows with warm golden light, a small domed "
    "brass cap and a plain ring handle on top, no bars, no grille, no pattern, no writing, " + ISOLATE))
# r2: the first tent (seed 1133598) was a modern A-frame tent whose poles cross in an X at the apex (3b.3). Rejected.
ASSETS["tent"].update(seed=seed("tent-r2"), neg_extra="crossed poles, poles crossing at the top, a-frame tent, camping tent, modern tent", prompt=(
    "one low wide desert tent of dark brown woven wool cloth stretched over several short upright wooden poles, "
    "a long gently sloping flat roof and an open shaded front, plain cloth with no pattern, no decoration, " + ISOLATE))
# r2: the first jar (seed 893440) carried a large four-petal motif with a round centre that could read as a cross
# pattée (3b.3; when in doubt, reject). Rejected; the reroll asks for bare clay.
ASSETS["jar"].update(seed=seed("jar-r2"), neg_extra="painted pattern, flower motif, quatrefoil, glaze, ornament", prompt=(
    "one plain unpainted terracotta clay water jar with two small handles, bare reddish-brown clay with no painted "
    "design at all, " + ISOLATE))
ASSETS["palm"]["crop"] = 0.08
# The palm was rendered and passes 3b, but neither composition needed it: not shipped (images/games/musa has no palm).
ASSETS["lantern"]["crop"] = 0.09
ASSETS["tent"]["crop"] = 0.1
# r3: the second portrait master (seed 1390692) had a gold line of grass stubble on the sand at bottom right that
# reads like cursive handwriting (3b.4). Rejected. r3 asks for clean sand.
ASSETS["plate-shore-port"].update(seed=seed("plate-shore-port-r3"), neg_extra="grass on the sand, tufts, marks on the sand, squiggle, scribble, handwriting",
    prompt=SHORE_TALL + ", the sand is smooth and clean with no marks and no grass on it")
# r3: the second lantern (seed 1568664) again had diagonal lines crossing in an X in every glass pane (3b.3). Rejected.
ASSETS["lantern"].update(seed=seed("lantern-r3"), neg_extra=ASSETS["lantern"]["neg_extra"] + ", x shape, crossed lines, diagonal lines, lattice, window panes, frame divisions", prompt=(
    "one small cylindrical glass lantern in flat manuscript painting style: a plain clear glass cylinder glowing "
    "with a warm golden flame inside, standing between a round brass base and a round domed brass cap with a plain "
    "ring handle on top; the glass has no frame, no bars and no lines on it, " + ISOLATE))
# r2: the first portrait split (seed 1520561) dropped the beach, turned into
# a flat vector cartoon, and no longer registered with the shore master (3b.10 in context; the same failure as Nuh
# plate-judi-port r1). Rejected; the dawn edit chained from it was stopped before it finished. r2 asks for registration first.
ASSETS["plate-split-port"].update(seed=seed("plate-split-port-r2"), prompt=(
    "Keep the bottom quarter of the picture exactly as it is: the same pale sand beach, the same reeds, in the same "
    "place. Keep the same night sky, the same far hills, the same gouache manuscript painting style and the same gold "
    "border. Change only the sea in the middle of the picture. " + SPLIT_EDIT.replace("Change only the sea. Keep the exact same beach, far shore, night sky, stars, palette, style and gold border. ", "")))

# r2: the first portrait dawn (seed 1409269) turned the far stretch of the dry path into sunlit water, so the walk
# would end on the sea (the story says the path was dry to the far shore). Rejected. r2 spells out the path.
ASSETS["plate-dawn-port"].update(seed=seed("plate-dawn-port-r2"), prompt=DAWN_EDIT + (
    " The pale dry sand path stays exactly as it is and still runs all the way up between the walls to the far hills; "
    "no part of the path turns into water or light."))

# The jar is NOT shipped: two renders (seeds 893440, 1530807) both carried a large four-petal motif with a round
# centre that could read as a cross pattée (3b.3), even when asked for bare clay. The camp keeps the tents and the bundle.
ASSETS["jar"]["kind"] = "derived"
ASSETS["jar"]["prompt"] = "(not shipped: rejected twice, see above)"


def items():
    for name, a in ASSETS.items():
        yield name, {**a, "seed": a.get("seed", seed(name))}
