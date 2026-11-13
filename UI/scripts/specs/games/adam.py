"""Art for game 05, The Garden of Choices (Adam), the fifth painted game (2026-11-12).

Every prompt, seed and negative for every sprite is recorded here, as the scholar's art checklist
requires (claudeteam/reviews/game-islamic-review-2026-11-03.md, 3a.7). Read by
scripts/build-game-art.py. Human-readable copy: claudeteam/reviews/game-adam-art.md.

Rules carried by these prompts:
- STYLE and NEGATIVE are imported from specs/illustrations.py and used word for word (build-game-art.py appends
  STYLE to every prompt), so the game matches the story plates. The game list of 3a.3 is appended (as for Nuh,
  Musa, Yusuf and Ibrahim).
- Things only (3a.1): a garden, trees, a river, lawns, flowers, fruit, a basket, a courtyard, a clay pot, a jug,
  seedlings, a ball, fallen leaves, a sleeping cat. No prophet, no person, no Adam, no Hawa, no angel, no Iblis,
  no Mama, no child, no hands.
- Adam bans (3a.4 and the gate-1 rulings for 05): the forbidden tree is not an apple tree and bears no fruit at
  all (the child can never take from it); no apple anywhere in the game; no serpent, no snake, no creature by the
  tree; Shaytan is never drawn (only narrated); no fruit being held, no hands, no bitten fruit.
- Lessons from Nuh, Musa, Yusuf and Ibrahim (their gate-2 sections): no X or cross shapes from poles, bars, rails,
  ropes, bands or tile grids; no script-like marks, borders or corner signatures; no eye-like orbs or lozenges with
  a dot (no medallions); no faces in the sun or moon (no sun or moon is prompted at all); plain surfaces on round
  things (the model paints motifs on any plain surface).
- Consistent states: the garden at full light -> the garden dimmed after the slip -> the earth at dawn are
  Qwen-Image-Edit edits of ONE master per composition, so they crossfade in register.

Kinds (as in nuh.py):
- "plate":   full-bleed background, Z-Image Turbo, kept whole.
- "edit":    Qwen-Image-Edit 2511 applied to the plate named in `source`.
- "cutout":  Z-Image Turbo on a plain ground, then rembg (under the heavy lane), trim, fine ink outline,
             tint-match, WebP with alpha.
- "derived": made in the export without a model (the pot's three shards are cut from the approved pot).
"""
import zlib

from specs.illustrations import NEGATIVE, STYLE  # noqa: F401  (STYLE is appended by build-game-art.py)

Z_MODEL = "z_image_turbo_1.0_q8p.ckpt"
EDIT_MODEL = "qwen_image_edit_2511_q8p.ckpt"

# Section 3a.3 game additions (as in the other games), plus the Adam bans of 3a.4 and gate 1 (05).
GAME_NEGATIVE = (
    "figure, cross, crucifix, church, menorah, star of david, om symbol, yin yang, buddha, "
    "statue, idol, totem, pentagram, evil eye, hamsa, zodiac, halo, wings on a person, cherub, "
    "serpent, snake, devil, horns, skull, blood, weapon, sword, spear, gore, apple tree, bikini, bare shoulders, "
    "apple, apples, red apple, green apple, snake in a tree, serpent coiled on a branch, lizard, "
    "figures, faces, face, eyes, mouth, facial features, fruit being held, hands holding fruit, bitten fruit, bite mark, "
    "crossed poles, x shape, crossbar, lattice, trellis, window bars, mullions, tile grid, "
    "medallion, concentric lozenge, lozenge with a dot, eye motif, nazar, script-like marks, corner signature"
)
NEG = f"{NEGATIVE}, {GAME_NEGATIVE}"
NO_BODIES = "moon, crescent, sun, sun disc, planet, comet, rays of light from the sky"

# Appended to every cut-out source prompt so rembg has a clean edge to find.
ISOLATE = "single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow"
PLAIN = "plain surface with no pattern, no motif and no decoration painted on it"


def seed(name: str) -> int:
    """Stable per-asset seed (crc32, like build-illustrations.py). Bump the suffix to reroll."""
    return zlib.crc32(f"game-adam/{name}".encode()) % 2_000_000


GARDEN = (
    "a wide lush paradise garden seen like a manuscript painting, a soft green flowering lawn fills the bottom third "
    "of the picture, a clear calm blue river winds gently across the middle ground from left to right, leafy fruit "
    "trees with round green crowns stand at the far left and the far right, a pomegranate tree on the left and a date "
    "palm and a fig tree on the right, their low branches spread over the lawn, in the open middle distance a little "
    "right of the centre one tall slender tree stands alone on a small grassy rise, it has plain broad dark green "
    "leaves only, no fruit and no flowers on it, with open lawn all around it, nothing near it, a calm warm "
    "pale gold and turquoise sky with a few soft clouds, the lawn in front is open and clear"
)
GARDEN_TALL = (
    "a tall vertical view of a lush paradise garden seen like a manuscript painting, a soft green flowering lawn "
    "fills the bottom third of the picture, a clear calm blue river winds across the middle, a pomegranate tree at the "
    "left edge and a fig tree and a date palm at the right edge with low spreading branches, in the middle distance "
    "one tall slender tree stands alone on a small grassy rise, it has plain broad dark green leaves only, no fruit and "
    "no flowers on it, with open lawn all around it, nothing near it, a calm warm pale gold and turquoise sky with a "
    "few soft clouds fills the top third, the lawn in front is open and clear"
)
DIM_EDIT = (
    "Keep the exact same garden, trees, river, lawn, composition, style and gold border. Change only the light and "
    "the colours: it is now a grey, sombre dusk. The sky is a dull grey-violet, the greens are faded and greyish, "
    "the flowers have closed, the river is a dull slate blue, and the whole picture is quiet and dim. No sun, no "
    "moon, no stars, no people, no figures, no animals, no text."
)
EARTH_EDIT = (
    "Keep the same composition, the river's path, the hills, the style and the gold border. Change the place: it is "
    "now the wide open earth at dawn, not a garden. The lawn becomes wild grassland and patches of bare golden earth, "
    "the river becomes a small plain stream, the fruit trees become a few young wild trees and green bushes, low hills "
    "rise in the distance, and the sky is a soft clear dawn of apricot, rose and pale turquoise. Fresh, calm and "
    "hopeful. No sun disc, no moon, no people, no figures, no animals, no buildings, no text."
)
COURT = (
    "a small sunny family courtyard garden seen like a manuscript painting, a low plain sand-coloured mud-brick wall "
    "runs across the back of the picture with a lemon tree and a pomegranate tree showing above it, the floor is "
    "smooth plain packed earth of one warm sand colour with no lines and no tiles, on the left half of the picture "
    "three small square beds of dark brown soil in a row with nothing growing in them yet, on the right side a low "
    "plain flat stone ledge with nothing on it, some green bushes in the corners, a calm pale turquoise morning sky, "
    "no doors, no windows, no gate, no pots"
)
COURT_TALL = (
    "a tall vertical view of a small sunny family courtyard garden seen like a manuscript painting, a low plain "
    "sand-coloured mud-brick wall runs across the middle of the picture with a lemon tree and a pomegranate tree "
    "showing above it against a calm pale turquoise morning sky, the floor in front is smooth plain packed earth of "
    "one warm sand colour with no lines and no tiles and fills the bottom half, three small square beds of dark brown "
    "soil in a row across the lower part with nothing growing in them yet, a low plain flat stone ledge at the right "
    "against the wall with nothing on it, some green bushes in the corners, no doors, no windows, no gate, no pots"
)

ASSETS = {
    # ---------- round 1: the garden (Jannah), one master per composition, two edits each ----------
    "plate-garden-land": dict(kind="plate", w=1344, h=896, prompt=GARDEN, neg_extra=NO_BODIES),
    "plate-dim-land": dict(kind="edit", w=1344, h=896, source="plate-garden-land", prompt=DIM_EDIT, neg_extra=NO_BODIES),
    "plate-earth-land": dict(kind="edit", w=1344, h=896, source="plate-garden-land", prompt=EARTH_EDIT, neg_extra=NO_BODIES),
    "plate-garden-port": dict(kind="plate", w=768, h=1408, prompt=GARDEN_TALL, neg_extra=NO_BODIES),
    "plate-dim-port": dict(kind="edit", w=768, h=1408, source="plate-garden-port", prompt=DIM_EDIT, neg_extra=NO_BODIES),
    "plate-earth-port": dict(kind="edit", w=768, h=1408, source="plate-garden-port", prompt=EARTH_EDIT, neg_extra=NO_BODIES),
    # ---------- round 2: the child's own garden on earth ----------
    "plate-court-land": dict(kind="plate", w=1344, h=896, prompt=COURT, neg_extra=NO_BODIES),
    "plate-court-port": dict(kind="plate", w=768, h=1408, prompt=COURT_TALL, neg_extra=NO_BODIES),

    # ---------- cut-outs: the fruit of the allowed trees (never from the one tree), whole and untouched ----------
    "fruit-pomegranate": dict(kind="cutout", w=768, h=768, neg_extra="cut open, seeds, halves", prompt=(
        "one whole ripe red pomegranate with its small crown, smooth matte skin, not cut open, two small green leaves "
        "on a short stem, " + ISOLATE)),
    "fruit-dates": dict(kind="cutout", w=768, h=768, neg_extra="bowl, plate", prompt=(
        "one small cluster of ripe glossy brown dates hanging on a short golden stalk, " + ISOLATE)),
    "fruit-figs": dict(kind="cutout", w=768, h=768, neg_extra="cut open, halves, seeds", prompt=(
        "two whole ripe purple figs side by side on a short stem with one green fig leaf, smooth matte skin, not cut "
        "open, " + ISOLATE)),
    "fruit-pear": dict(kind="cutout", w=768, h=768, neg_extra="apple, round fruit", prompt=(
        "one whole ripe golden-green pear with a long narrow neck, a short brown stem and one green leaf, smooth matte "
        "skin, " + ISOLATE)),
    "fruit-orange": dict(kind="cutout", w=768, h=768, neg_extra="apple, cut open, slices", prompt=(
        "one whole ripe orange citrus fruit with dimpled orange peel and two green leaves on a short twig, " + ISOLATE)),
    "basket": dict(kind="cutout", w=1024, h=768, neg_extra="handle, fruit, lid, checks, grid", prompt=(
        "one low wide empty round basket of natural golden straw seen from the side, no handle, soft even horizontal "
        "coils, " + PLAIN + ", " + ISOLATE)),
    # ---------- cut-outs: round 2 ----------
    "jug": dict(kind="cutout", w=768, h=768, neg_extra="engraving, inscription, hands", prompt=(
        "one small plain brass watering jug with a round body, a long thin curved spout and one handle, polished "
        "brass, " + PLAIN + ", " + ISOLATE)),
    "sprout": dict(kind="cutout", w=768, h=768, neg_extra="pot, flowers", prompt=(
        "one tiny young green seedling with two small round leaves growing from a small mound of dark brown soil, "
        + ISOLATE)),
    "bloom": dict(kind="cutout", w=768, h=768, neg_extra="pot, vase", prompt=(
        "one small young flowering plant with fresh green leaves and three closed cup-shaped soft pink tulip flowers, "
        "growing from a small mound of dark brown soil, " + ISOLATE)),
    "ball": dict(kind="cutout", w=768, h=768, neg_extra="stitching, seams, panels, stripes, star, pentagon, football", prompt=(
        "one small soft round ball of plain smooth red-brown leather, one single colour all over, no seams, " + PLAIN
        + ", " + ISOLATE)),
    "pot": dict(kind="cutout", w=768, h=1024, neg_extra="flowers, plant, band, glaze pattern, handles", prompt=(
        "one round-bellied clay pot with a short wide neck, plain smooth warm terracotta, standing upright, whole, "
        + PLAIN + ", " + ISOLATE)),
    "leaves": dict(kind="cutout", w=1024, h=768, neg_extra="branch, twig, sticks", prompt=(
        "one small low heap of fallen dry autumn leaves in soft browns, ochres and greens, " + ISOLATE)),
    "cat": dict(kind="cutout", w=1024, h=768, neg_extra="open eyes, staring, standing cat", prompt=(
        "one small soft grey tabby cat curled up fast asleep in a round ball, its head tucked into its tail, peaceful, "
        + ISOLATE)),
}


def items():
    for name, a in ASSETS.items():
        yield name, {**a, "seed": a.get("seed", seed(name))}


# ---------- review of the first renders (designer self-check against 3b, 2026-11-12) ----------
# r1 plate-garden-land (seed 175932): no tree stands alone; the only tree in the open middle is a young date palm,
# which would IDENTIFY the one tree (gate 1: the tree stays unidentified). Rejected.
# r1 plate-garden-port (seed 1887016): the lone tree is right, but the left trunk has a round knot with a dark dot at
# about x 95, y 935 (an eye in the bark, 3b.1), and two fallen pomegranates lie on the grass near a sapling (fallen
# fruit reads as fruit taken, the story plate 8 idiom of the slip). Rejected.
# r1 plate-court-land (seed 1740550): six beds in a 2 x 3 grid whose shared kerbs cross in "+" shapes (3b.3), and a
# small barred window in the left wall (3b.3, mullions). Rejected.
# r1 plate-court-port (seed 413714): bubble rings in the sky (eye-like, 3b.2), paired oval dents in the earth at the
# bottom right (footprints, 3b.1), a scribbled shape at the bottom left (3b.4 when in doubt), and a pot already on the
# floor (Mama's pot is the reviewed sprite). Rejected.
# Candidates for the reroll (three seeds each, the best kept; every candidate is recorded below and in the art record).
ONE_TREE = (
    "in the open centre of the picture, across the river on a small round green hill, one single tree stands alone: a "
    "straight smooth trunk and one round crown of plain broad dark green leaves, quite unlike the other trees, with no "
    "fruit and no flowers on it and nothing on the ground beneath it"
)
GARDEN_R2 = (
    "a wide lush paradise garden seen like a manuscript painting, a soft green lawn with small flowers fills the bottom "
    "third, a clear calm blue river winds across the middle ground, a pomegranate tree heavy with fruit stands at the "
    "far left edge, a fig tree and a date palm stand at the far right edge, their low branches reach over the lawn, "
    + ONE_TREE + ", a calm warm pale gold and turquoise sky with a few soft clouds, the lawn in front is open and clear, "
    "no fallen fruit on the ground, the tree trunks are smooth with no knots"
)
GARDEN_TALL_R2 = (
    "a tall vertical view of a lush paradise garden seen like a manuscript painting, a soft green lawn with small "
    "flowers fills the bottom third, a clear calm blue river crosses the middle, a pomegranate tree heavy with fruit at "
    "the left edge and a fig tree at the right edge with low spreading branches, " + ONE_TREE + ", a calm warm pale gold "
    "and turquoise sky with a few soft clouds fills the top third, the lawn in front is open and clear, no fallen fruit "
    "on the ground, the tree trunks are smooth with no knots"
)
COURT_R2 = (
    "a small sunny family courtyard garden seen like a manuscript painting, a low plain sand-coloured wall of smooth "
    "plaster with no openings runs across the back, a lemon tree and a pomegranate tree show above the wall, the floor "
    "is smooth plain packed earth of one even warm sand colour with no marks, no lines and no tiles, three separate "
    "small square beds of dark brown soil stand apart from each other in one row across the left half of the picture "
    "with gaps of earth between them and nothing growing in them, on the right a low plain flat stone ledge against the "
    "wall with nothing on it, a few green bushes in the corners, a calm clear pale turquoise sky, no doors, no windows, "
    "no gate, no pots, no tiles"
)
COURT_TALL_R2 = (
    "a tall vertical view of a small sunny family courtyard garden seen like a manuscript painting, a low plain "
    "sand-coloured wall of smooth plaster with no openings runs across the middle of the picture, a lemon tree and a "
    "pomegranate tree show above it against a calm clear pale turquoise sky, the floor in front is smooth plain packed "
    "earth of one even warm sand colour with no marks, no lines and no tiles and fills the bottom half, three separate "
    "small square beds of dark brown soil stand apart from each other in one row across the lower part with gaps of "
    "earth between them and nothing growing in them, a low plain flat stone ledge at the right against the wall with "
    "nothing on it, a few green bushes in the corners, no doors, no windows, no gate, no pots, no tiles"
)
CAND_NEG = ("fallen fruit, fruit on the ground, knot, knothole, bark eye, grid of beds, shared kerbs, footprints, prints, "
            "dents, marks on the ground, bubbles, rings in the sky, window, barred window, flower pot, vase")
for base, prompt in (("plate-garden-land", GARDEN_R2), ("plate-garden-port", GARDEN_TALL_R2),
                     ("plate-court-land", COURT_R2), ("plate-court-port", COURT_TALL_R2)):
    for c in ("a", "b", "c"):
        ASSETS[f"cand-{base}-{c}"] = dict(kind="plate", w=ASSETS[base]["w"], h=ASSETS[base]["h"],
                                          seed=seed(f"{base}-r2{c}"), prompt=prompt, neg_extra=NO_BODIES + ", " + CAND_NEG)

# r1 fruit-figs (923965), fruit-pear (358922), fruit-orange (522270): each fruit is painted with large concentric blue
# lozenges (the nazar / lozenge-with-a-dot form, 3b.2; the Ibrahim bread lesson: STYLE's "Iznik turquoise and cobalt"
# makes the model decorate any plain surface). Rejected. r1 basket (310487): seen from above, its woven base is a
# spiral of concentric rings (a target / eye at play size, 3b.2) with a blue dashed band. Rejected.
# r1 fruit-pomegranate (1994042) and fruit-dates (1114522) are clean fruit, but each sits on a painted tile with
# corner ornaments; rembg keeps only the fruit (checked after the cut).
FRUIT_PLAIN = ("natural fruit colours only, a botanical study, the skin is plain and natural with no pattern, no "
               "diamond, no lozenge, no motif and no decoration painted on it")
FRUIT_NEG = "diamond, lozenge, rhombus, motif, ornament, pattern, decoration, tile, border, frame, medallion, eye"
for base, prompt in (
        ("fruit-figs", "two whole ripe purple figs side by side on a short stem with one green fig leaf, not cut open"),
        ("fruit-pear", "one whole ripe golden-green pear with a long narrow neck, a short brown stem and one green leaf"),
        ("fruit-orange", "one whole ripe orange citrus fruit with dimpled orange peel and two green leaves on a short twig")):
    for c in ("a", "b", "c"):
        ASSETS[f"cand-{base}-{c}"] = dict(kind="cutout", w=768, h=768, seed=seed(f"{base}-r2{c}"),
                                          neg_extra=ASSETS[base]["neg_extra"] + ", " + FRUIT_NEG,
                                          prompt=prompt + ", " + FRUIT_PLAIN + ", " + ISOLATE)
for c in ("a", "b", "c"):
    ASSETS[f"cand-basket-{c}"] = dict(kind="cutout", w=1024, h=768, seed=seed(f"basket-r2{c}"),
        neg_extra="handle, fruit, lid, checks, grid, spiral, concentric rings, inside of the basket, top view, blue band, pattern",
        prompt=("one low wide empty basket of natural golden straw seen exactly from the side at eye level, so only its "
                "outside wall shows and not its inside, no handle, plain even straw weave of one colour, " + ISOLATE))
# r1 jug (1176090): a blue quatrefoil medallion with a dot on the body (a cross and an eye, 3b.2-3). r1 ball (1967080):
# a four-pointed blue-and-gold medallion with a centre dot (cross + eye, 3b.2-3). r1 pot (357945): a band of blue
# quatrefoils with dots (crosses, 3b.3). All rejected. r1 sprout (407091) and bloom (1894698) are clean (the tile frame
# around the sprout is cut away by rembg).
OBJ_NEG = "diamond, lozenge, quatrefoil, rosette, medallion, motif, ornament, pattern, decoration, painted band, glaze, enamel, tile, eye"
for base, prompt in (
        ("jug", "one small plain brass watering jug with a round body, a long thin curved spout and one handle, bare "
                "polished brass of one colour all over"),
        ("ball", "one small soft round ball of bare red-brown leather, one single colour all over"),
        ("pot", "one round-bellied clay pot with a short wide neck, bare unglazed warm terracotta of one colour all over, "
                "standing upright, whole")):
    for c in ("a", "b", "c"):
        ASSETS[f"cand-{base}-{c}"] = dict(kind="cutout", w=ASSETS[base]["w"], h=ASSETS[base]["h"], seed=seed(f"{base}-r2{c}"),
                                          neg_extra=ASSETS[base]["neg_extra"] + ", " + OBJ_NEG,
                                          prompt=prompt + ", a simple everyday object with no decoration at all, " + ISOLATE)
# r1 leaves (1144947): two blue tiles with blue ovals in the heap (lozenge with a dot, an eye, 3b.2). Rejected.
# r1 cat (1544222): the cat is right (curled up, eyes closed), but it lies on a round turquoise cushion painted with
# blue motifs (a medallion behind the cat, 3b.2-3 risk). Rejected.
for c in ("a", "b", "c"):
    ASSETS[f"cand-leaves-{c}"] = dict(kind="cutout", w=1024, h=768, seed=seed(f"leaves-r2{c}"),
        neg_extra="branch, twig, sticks, " + OBJ_NEG + ", tiles, gems, jewels, stones, objects among the leaves",
        prompt=("one small low heap of fallen dry autumn leaves in soft browns, ochres and greens, only leaves and "
                "nothing else among them, " + ISOLATE))
    ASSETS[f"cand-cat-{c}"] = dict(kind="cutout", w=1024, h=768, seed=seed(f"cat-r2{c}"),
        neg_extra="open eyes, staring, standing cat, cushion, mat, rug, bed, basket, round medallion, " + OBJ_NEG,
        prompt=("one small soft grey tabby cat curled up fast asleep in a round ball on nothing, eyes closed, its head "
                "tucked into its tail, peaceful, " + ISOLATE))

# ---------- the reroll picks (designer self-check, 2026-11-12) ----------
# garden-land: a (126194) has a dark round ball and scattered red dots on the lawn; c (526558) a fallen pomegranate on
# the lawn; b (1120712) KEPT: the one tree alone on its hill, no fruit, nothing beneath it (two floating leaves on
# the river; two pomegranates lie under their own tree at the bottom left, under the basket's place).
# garden-port: a (1737769) a pseudo-signature in the bottom-right corner (3b.4); b (671635) knot-holes on both trunks
# (eyes in the bark, 3b.1) and an X-like twig at the bottom right (3b.3); c (419717) KEPT.
# court-land: b (1275773) and c (1612267) put the trees inside the beds; a (1224903) KEPT (the lemon tree stands in
# the first bed; the sprout sits beside its trunk).
# court-port: a (536220) both trees stand in the beds; c (1165872) faint cross-hatched scratches in the bottom
# corners (3b.3 when in doubt) and gold corner brackets in the sky; b (623526) KEPT (two tiny sprouts already in the
# beds are covered by the sprout sprites).
# figs: a (779170) and b (769816) painted diamonds on one fig (3b.2-3); c (1537934) KEPT (the tile frame round it is cut away).
# orange a/b/c and pear a/b/c: every render painted blue diamonds on the skin (3b.2-3). Rejected; the shipped orange
# and pear are recorded Qwen edits that take the diamonds off (below).
def _pick(base, cand):
    a = ASSETS[cand]
    ASSETS[base] = {**ASSETS[base], "seed": a["seed"], "prompt": a["prompt"], "neg_extra": a["neg_extra"]}
for _b, _c in (("plate-garden-land", "b"), ("plate-garden-port", "c"), ("plate-court-land", "a"),
               ("plate-court-port", "b"), ("fruit-figs", "c")):
    _pick(_b, f"cand-{_b}-{_c}")
# the orange and the pear: Qwen edits of the least-decorated renders (orange b 729060, pear b 440173), taking every
# painted diamond off the skin (as the Ibrahim crust was an edit of the approved platter). Recorded inputs.
UNDECORATE = ("Keep the exact same {f}, its shape, its leaf and stem, the light, the angle, the plain pale background and "
              "the style. Remove every blue diamond and every painted mark from the skin: the skin is now plain natural "
              "{skin} all over, with no pattern, no motif and no decoration. Remove the thin gold border line around the "
              "picture. Change nothing else.")
ASSETS["fruit-orange"] = dict(kind="cutedit", w=768, h=768, source="cand-fruit-orange-b", seed=seed("fruit-orange-r3"),
    neg_extra="diamond, lozenge, motif, pattern, decoration, blue marks, border, frame",
    prompt=UNDECORATE.format(f="orange with its two leaves", skin="dimpled orange peel"))
ASSETS["fruit-pear"] = dict(kind="cutedit", w=768, h=768, source="cand-fruit-pear-b", seed=seed("fruit-pear-r3"),
    neg_extra="diamond, lozenge, motif, pattern, decoration, blue marks, border, frame",
    prompt=UNDECORATE.format(f="pear with its leaf", skin="golden-green pear skin"))
# Not shipped: the kept garden plates have pomegranate trees, date palms and (portrait) a fig tree, but no orange or
# pear tree, so the fruit the child gathers is only what grows there (pomegranates, dates, figs). The orange and pear
# edits above are never rendered.
ASSETS["fruit-orange"]["kind"] = "derived"
ASSETS["fruit-pear"]["kind"] = "derived"
# jug: a (805810) and b (1117320) painted a blue diamond panel (3b.2-3); c (514462) KEPT (bare brass; its tile frame is
# cut away). basket a/b/c (rerolls) each carry small blue diamonds round the side; ball a/b/c each a diamond or star
# medallion with a dot (3b.2-3). Rejected; the shipped basket and ball are Qwen edits that take the decoration off.
_pick("jug", "cand-jug-c")
ASSETS["basket"] = dict(kind="cutedit", w=1024, h=768, source="cand-basket-a", seed=seed("basket-r3"),
    neg_extra="diamond, lozenge, motif, pattern, decoration, blue marks, border, frame, fruit, handle",
    prompt=("Keep the exact same empty straw basket, its shape, its weave, the light, the angle, the plain pale background "
            "and the style. Remove the blue diamonds from its side: the whole basket is now plain natural golden straw of "
            "one colour, with no pattern, no motif and no decoration. Change nothing else."))
ASSETS["ball"] = dict(kind="cutedit", w=768, h=768, source="cand-ball-a", seed=seed("ball-r3"),
    neg_extra="diamond, lozenge, star, motif, pattern, decoration, medallion, seams, stitching, border, frame",
    prompt=("Keep the exact same round red-brown leather ball, its size, its soft shading, the light, the plain pale "
            "background and the style. Remove the turquoise and blue diamond and the seam lines completely: the ball is "
            "now plain smooth red-brown leather of one colour all over, with no pattern, no motif, no seams and no "
            "decoration. Change nothing else."))
# pot: a and b painted bands of blue diamonds and quatrefoils (3b.2-3); c KEPT (bare terracotta; its tile frame is cut away).
_pick("pot", "cand-pot-c")
# leaves a/b/c (rerolls) each hide one or two enamel tiles with a blue diamond or a dotted lozenge among the leaves
# (3b.2-3); cat a/b/c each lie on a round turquoise cushion ringed with blue motifs (a medallion, 3b.2-3). Rejected
# as rendered; the shipped leaves and cat are Qwen edits that take the tile and the cushion away.
ASSETS["leaves"] = dict(kind="cutedit", w=1024, h=768, source="cand-leaves-c", seed=seed("leaves-r3"),
    neg_extra="tile, enamel, diamond, lozenge, motif, gem, jewel, ornament, pattern, decoration",
    prompt=("Keep the exact same heap of dry autumn leaves, their colours, the light, the angle, the plain pale "
            "background and the style. Remove the small blue and turquoise tile from the heap and fill its place with "
            "more brown and ochre leaves, so the heap is only leaves. Change nothing else."))
ASSETS["cat"] = dict(kind="cutedit", w=1024, h=768, source="cand-cat-b", seed=seed("cat-r3"),
    neg_extra="cushion, mat, rug, bed, medallion, ring, border, motif, pattern, open eyes",
    prompt=("Keep the exact same sleeping grey tabby cat, curled up with its eyes closed, its fur, its pose, the light "
            "and the style. Remove the round turquoise and blue cushion under it completely: the cat now lies curled up on "
            "the plain pale cream background, with only a very soft shadow. Change nothing else."))

# ---------- scholar gate 2b SHOULD (2026-11-12): the ≡ bark marks on the portrait trunks ----------
# The kept portrait garden (seed 419717) has two stamped "≡" marks (three short parallel strokes) on each tall trunk
# (about x 40 and x 640). Not a cross, but a repeated symbol (3b.4 when in doubt). The new master is a recorded Qwen edit
# of that render that only makes the bark plain; the dimmed garden is the same recorded DIM_EDIT re-run on the new master.
# The earth at dawn (seed 1713284, an edit of the old master) is kept: it was approved and has no such marks.
ASSETS["plate-garden-port-src419717"] = dict(kind="derived", w=768, h=1408,
    prompt="(input only: the r2c portrait garden, seed 419717, approved except for the bark marks)")
ASSETS["plate-garden-port"] = dict(kind="edit", w=768, h=1408, source="plate-garden-port-src419717", seed=seed("plate-garden-port-r3"),
    neg_extra=NO_BODIES + ", marks on the trunk, stripes on the bark, symbols, rings round the trunk, ties, bands, fruit on the middle tree",
    prompt=("Keep the exact same picture: the pomegranate tree, the lone middle tree on its hill, the fig tree, the "
            "river, the lawn, the flowers, the sky, the colours, the style and the gold border. Change only the two tall "
            "trunks at the left and right edges: remove the small groups of short horizontal marks on them, so each "
            "trunk is plain smooth bark from top to bottom. Change nothing else."))
ASSETS["plate-dim-port"] = {**ASSETS["plate-dim-port"], "seed": seed("plate-dim-port-r2")}
ASSETS["plate-earth-port"] = {**ASSETS["plate-earth-port"], "kind": "derived",
    "prompt": "(kept: rendered once as the EARTH_EDIT of the r2c master, seed 1713284, approved by the scholar 2026-11-12)"}
