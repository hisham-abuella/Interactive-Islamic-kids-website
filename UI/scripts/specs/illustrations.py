"""Scene plates for the five story pages.

Non-figurative by rule. Depicting the prophets is impermissible, so no plate
here contains a person — not the prophets, not Pharaoh, not the angels, not a
crowd. Each scene is carried by its *setting and its objects* instead: the
half-built ark rather than the carpenter, the empty pedestals and the axe
rather than Ibrahim, the parted water rather than the people walking through
it. Animals, weather, architecture, plants and light are all fair game and do
most of the work.

Style follows "The Illuminated Page": every plate is a manuscript miniature in
the site's own palette — Iznik turquoise and cobalt, manuscript gold, on
parchment — so the art reads as part of the page rather than stock imagery
dropped onto it.

Rendered by `scripts/build-illustrations.py` through the local Draw Things
engine. No image leaves the machine.
"""

# Appended to every prompt: holds the palette and the manuscript idiom steady
# across all 48 plates so they read as one hand.
STYLE = (
    "Ottoman and Persian manuscript illumination, flat gouache on cream parchment, "
    "Iznik turquoise and cobalt blue with manuscript gold leaf outlines, "
    "stylized geometric forms, fine gold rule border, warm and gentle, "
    "children's picture book, no people, no figures, no text"
)

# The guard rail. "person/human/figure" is repeated in several forms on purpose:
# a single term leaks a stray silhouette into roughly one plate in ten.
NEGATIVE = (
    "people, person, human, human figure, man, woman, child, baby, face, portrait, "
    "silhouette of a person, hands, crowd, angel, deity, idol statue of a person, "
    "rider, riders, riding, mounted figure, passenger, traveller, robed figure, "
    "anthropomorphic sun, sun with a face, moon with a face, face in the sky, "
    "text, writing, calligraphy, arabic letters, latin letters, numbers, watermark, "
    "signature, photorealistic, photograph, 3d render, cgi, horror, scary, gore, "
    "rainbow, rainbows, prismatic arc, "
    "kaaba, mosque, minaret, dome with a finial, shrine, temple, religious building, "
    "star and crescent emblem, religious symbol, flag, banner with an emblem, "
    "blurry, low quality, "
    # Round 2 (scholar review of the print volumes, 2026-11-04). Each of these got into a
    # shipped plate: pseudo-Arabic panels and a frieze (Musa 3, 7), a Latin signature on a
    # dune (Ibrahim 3), suns and moons with faces (Nuh 3), a stone circle or hooded file on a
    # ridge (Falaq 1), a face in a rock (Ash-Sharh 1), a mushaf-like book under footprints
    # (Zalzalah 4), a Torah-like scroll (Bayyinah 1), a sheep on a prayer rug (Kawthar 2),
    # a generated Ka'bah (Ibrahim 8). The Ka'bah and the mushaf are never generated.
    "letters, script, inscription, hieroglyphs, glyphs, frieze with symbols, "
    "artist signature, monogram, seal, "
    "faces on celestial bodies, smiling sun, smiling moon, eyes in the sky, "
    "human figures, silhouettes, standing stones, hooded figures, face in the rock, "
    "pareidolia, "
    "book, books, open book, mushaf, scroll, scrolls, parchment roll, "
    "prayer rug, prayer mat, "
    "kaaba, cube building, black cube, "
    "blood, red droplets, splatter, "
    # Round 2, try 2: Musa 3 grew a tiled, mihrab-like arch with a band of pseudo-script in it.
    "mihrab, prayer niche, arched niche, inscription band"
)

# The rug negative above is per plate (scholar, site-fixes confirmation, 2026-11-04). An empty
# prayer rug is a respectful way to show salah without a person, and four surah plates ask for
# one. Those plates drop "prayer rug, prayer mat" and get RUG_PLATE_NEGATIVE instead: a rug is
# never shown with an animal on it, under shoes or feet, as a sacrifice surface, or with a
# woven Ka'bah, mosque or text. Every other plate keeps the rug negative (Kawthar 2: a sheep
# on a prayer rug).
RUG_NEGATIVE = "prayer rug, prayer mat, "
RUG_PLATE_NEGATIVE = ("kaaba on the rug, mosque picture on the rug, writing on the rug, "
                      "animal on the rug, shoes on the rug, ")
RUG_PLATES = {
    ("surah-an-nasr", 3),      # tasbih and istighfar: a rug with prayer beads in a courtyard
    ("surah-al-maun", 4),      # "woe to those who pray": a neglected, rolled rug
    ("surah-al-bayyinah", 5),  # "establish prayer and give zakah": a rug beside a bowl of grain
    ("surah-ash-sharh", 7),    # "when you are free, stand up": a rug on a rooftop at evening
}


def negative_for(story, key):
    """The negative prompt for one plate: NEGATIVE, with the rug terms swapped on a rug plate."""
    if (story, key) in RUG_PLATES:
        return NEGATIVE.replace(RUG_NEGATIVE, RUG_PLATE_NEGATIVE)
    return NEGATIVE

# story id -> {key: seed}. A plate rejected at review is re-rolled with a new seed (never
# retouched); the seed that passed is recorded here so a full re-run reproduces it.
# Absent keys use the stable crc32 seed in build-illustrations.py.
SEEDS = {
    # Round 2 (2026-11-04): the crc32 seed kept the defect through two prompt changes.
    "prophet-ibrahim": {3: 996245},   # crc32 seed 891516 kept a pseudo-signature on the dune
    "prophet-musa": {3: 343892},      # crc32 seed 239163 kept a gate with pseudo-script bands
}

# story id -> {"cover": prompt, scene number -> prompt}
PLATES = {
    "prophet-adam": {
        "cover": "a paradise garden of fruit trees and four flowing rivers meeting a wide green earth, "
                 "mountains and a vast dawn sky",
        1: "a mound of smooth red clay beside a bowl of water on bare earth, a potter's workbench, "
           "soft dawn light across an empty plain",
        2: "a shaft of radiant golden light breaking across bare earth at sunrise, rays fanning out, "
           "the ground waking into colour",
        3: "tall columns of golden light descending from a deep blue sky onto an open plain, "
           "radiance filling the whole scene",
        4: "one dark ember-red flame standing alone and apart at the edge of a wide field of warm "
           "golden light, cold shadow around it",
        5: "a garden laid out like a manuscript catalogue, rows of named animals, birds, trees and "
           "flowers in small gold-ruled panels",
        6: "a lush paradise garden with rivers of clear water, fruit trees heavy with pomegranates "
           "and dates, birds, flowering vines",
        7: "a single ornate tree standing alone at the centre of a walled garden, gold fence around "
           "it, blossoms and still water",
        8: "fallen fruit and scattered leaves on the ground beneath a great tree, muted dusk colours, "
           "the garden quiet and empty",
        9: "gentle rain falling through warm dawn light over a garden, clearing sky, "
           "fresh green leaves and still pools catching the light",
        10: "a wide earth landscape of mountains, rivers, green fields and desert under an enormous "
            "sky, a new world at sunrise",
    },
    "prophet-ibrahim": {
        "cover": "a wide desert horizon at first light, the last few stars fading in a deep violet "
                 "sky, the sun's first rays rising gold over the dunes",
        1: "the mouth of a quiet cave in a rocky desert hillside at dawn, date palms below, "
           "distant hills, soft rose and gold light, sheltered and still",
        2: "an enormous night sky crowded with golden stars above dark desert dunes, "
           "the Milky Way arching over",
        # A Latin pseudo-signature kept appearing on the left dune (scholar M5, 2026-11-04).
        3: "a full silver moon high over a dark blue desert, long shadows on smooth clean "
           "unmarked dunes, empty sand, cool night light",
        4: "a blazing golden sun low over a desert horizon, long rays, heat shimmering "
           "above the sand",
        5: "a dim temple hall of empty carved stone pedestals and plain stone blocks, "
           "an axe leaning against the largest pedestal, dust in the air",
        6: "a great bonfire in a stone courtyard whose flames burn cool turquoise and blue "
           "instead of orange, calm and strange",
        7: "flames turning into a blooming garden, fire becoming roses and green leaves, "
           "turquoise and gold, flowers opening where the fire was",
        # The Ka'bah is never image-generated (11-03 ruling). Squared blocks and a foundation
        # line still came out as a generated Ka'bah with invented tiles (scholar, 2026-11-04).
        # Now only loose tools and rough stones on open sand: no building, no walls, no cube.
        8: "a builder's tools lying on the sand of an open desert valley at dusk: a coil of rope, "
           "a wooden mallet, an iron chisel and a small heap of rough rounded stones, a clay "
           "water jar, low hills and a rose and gold sky, open empty ground",
    },
    "prophet-musa": {
        "cover": "a great sea parted into two towering walls of turquoise water with a dry sand path "
                 "running between them",
        1: "the river Nile at night, tall papyrus reeds crowding the bank, still dark water, "
           "stars reflected on the surface, no buildings on the horizon",
        2: "a small woven basket floating among river reeds on calm water, morning light, "
           "lotus flowers and dragonflies",
        # Was "painted lotus columns ... gold and turquoise tilework": the engine filled the walls
        # with gold pseudo-Arabic panels and set a mihrab-like arch (scholar M3, 2026-11-04).
        # Try 2 still grew a gate with pseudo-script bands: "palace" summons decorated
        # architecture. The palace garden is now shown with no building in it at all.
        3: "a royal riverside garden on the bank of the Nile, a long rectangular reflecting pool "
           "with lotus flowers in the foreground, rows of date palms and papyrus along the "
           "water, green lawns, the river and wide open blue sky beyond, no buildings",
        4: "a humble doorway of a mud-brick home at dawn, an empty wooden cradle inside, "
           "warm light falling across the threshold",
        5: "a tree glowing with white and gold light on a dark mountainside at night, "
           "radiance spilling down the rock, stars above",
        6: "a wooden staff lying on desert sand beside a coiled serpent, a pool of white-gold "
           "radiance on the ground, night sky",
        # Was "painted lotus columns": the ceiling frieze came out as a band of pseudo-script
        # glyphs (scholar M4, 2026-11-04). Plain stone, no frieze.
        # Shipped: round-2 try 1 (crc32 seed 1109794, rendered before the "mihrab ... inscription
        # band" negatives were added, so a re-run will not be pixel-identical). Tries 2-4 (narrow
        # slits; new seeds) grew a figure relief on a column, hieroglyph walls and a signature.
        # Scholar to confirm the glazed window grids in try 1 do not read as crosses.
        7: "a vast Egyptian stone hall with tall plain smooth sandstone columns and an empty "
           "stone seat on a raised dais, shafts of light from high windows, bare undecorated "
           "walls and a plain ceiling",
        8: "ropes and wooden staffs scattered across the sand of a great arena, one enormous "
           "serpent coiled among them, banners above",
        9: "a stormy sea against a steep shore under dark thunderclouds, a cloud of dust rising "
           "on the far horizon, waves breaking",
        10: "the sea split into two towering walls of turquoise water with a dry sandy path running "
            "between them, fish visible inside the walls",
    },
    "prophet-nuh": {
        "cover": "a great wooden ark riding calm water beneath a wide clearing sky, "
                 "a green mountain behind, soft golden light breaking through the clouds",
        1: "an open desert plain at dawn, a single tall date palm, distant blue hills, "
           "wide rose and gold sky",
        2: "a village of mud-brick houses under an enormous dusk sky, the crescent moon and "
           "first stars appearing above the rooftops",
        # Was "rings of suns and moons circling in the sky": the engine drew them with faces
        # (scholar M2, 2026-11-04). The years now pass in the tree's seasons, with no sky bodies.
        3: "a great gnarled old tree alone on a grassy hill, one side of its crown in spring "
           "blossom, one side in autumn gold, fallen leaves on the ground around it to show many "
           "years passing, a plain clear pale sky",
        4: "a half-built wooden ark on dry land far from any water, stacks of timber, "
           "a saw and wood shavings, bright day",
        5: "pairs of animals walking in a long procession toward a wooden ark — two elephants, "
           "two lions, two deer, birds flying above",
        6: "torrential rain falling from black clouds onto a vast sea, a wooden ark riding high "
           "waves, lightning behind",
        # 11:44: the water went down and the ark came to rest on Judi. No dove and no olive
        # leaf: that detail is from Genesis 8:8-11, not the Quran (scholar ruling 2026-11-03).
        7: "a wooden ark resting safely on top of a green mountain, the floodwater going down "
           "far below, an empty clearing sky with soft golden light breaking through the parting "
           "clouds, calm and peaceful",
    },
    "prophet-yusuf": {
        # Deliberately NOT eleven. See the note on scene 1 below.
        "cover": "a deep cobalt night sky scattered with many small golden stars above quiet desert "
                 "dunes, a plain golden sun disc on the left and a separate silver crescent moon well "
                 "apart on the right, the two never touching or overlapping, flat smooth geometric "
                 "emblems with no markings and no faces on them",
        # The dream in 12:4 is *eleven* stars, and the engine cannot count: asked for
        # eleven it drew twelve, then nine. Rather than ship a plate that contradicts
        # the verse the page quotes, the picture is composed so it never claims a
        # number — a scattered field of stars, with the sun and moon as the two forms
        # that matter. The text beside it carries the count, which is where a count
        # belongs. Do not "fix" this by asking for eleven again.
        1: "a deep cobalt night sky scattered with many small golden stars above sleeping dunes, "
           "one large plain golden sun disc and one large silver crescent moon together at the "
           "centre, every shape a flat geometric emblem with no face on it",
        2: "a desert tent at dawn with a glowing lantern at its open door, camels resting outside, "
           "soft rose light on the sand",
        3: "a deep dark stone well in the desert, a rope hanging down it, a single shaft of light "
           "falling to the water far below",
        4: "two camels standing at rest on golden dunes at sunset beside a stack of bundles, "
           "woven baskets and clay water jars set down on the sand, empty wooden saddles on "
           "the ground, long shadows",
        5: "a stone prison window with heavy bars, a bright shaft of light coming through, "
           "date palms visible outside",
        6: "seven fat healthy cows and seven thin cows in two rows, with seven green ears of wheat "
           "and seven dry ones, laid out like a manuscript panel",
        7: "great granaries filled with golden wheat sheaves, storehouse doors open, "
           "brass weighing scales, baskets of grain",
        8: "an Egyptian courtyard at night with a long low table of bread, dates and pomegranates, "
           "eleven glowing lamps, open sky above",
    },
}


def all_plates():
    """(story_id, key, prompt) for every plate, in page order."""
    for story, plates in PLATES.items():
        for key in ["cover"] + sorted(k for k in plates if k != "cover"):
            yield story, key, plates[key]
