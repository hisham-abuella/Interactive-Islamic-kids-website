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
    "blurry, low quality"
)

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
        "cover": "the Kaaba as a simple stone cube in a desert valley beneath a sky of golden stars "
                 "and a crescent moon",
        1: "a small stone dwelling in a quiet desert valley at dawn, date palms, distant hills, "
           "soft rose and gold light",
        2: "an enormous night sky crowded with golden stars above dark desert dunes, "
           "the Milky Way arching over",
        3: "a full silver moon high over a dark blue desert, long shadows on the dunes, "
           "cool night light",
        4: "a blazing golden sun low over a desert horizon, long rays, heat shimmering "
           "above the sand",
        5: "a dim temple hall of empty carved stone pedestals and plain stone blocks, "
           "an axe leaning against the largest pedestal, dust in the air",
        6: "a great bonfire in a stone courtyard whose flames burn cool turquoise and blue "
           "instead of orange, calm and strange",
        7: "flames turning into a blooming garden, fire becoming roses and green leaves, "
           "turquoise and gold, flowers opening where the fire was",
        8: "the Kaaba as a simple stone cube under a starry night sky, open desert ground, "
           "lanterns on the sand, no crowd",
    },
    "prophet-musa": {
        "cover": "a great sea parted into two towering walls of turquoise water with a dry sand path "
                 "running between them",
        1: "the river Nile at night, tall papyrus reeds along the bank, the silhouette of an Egyptian "
           "palace far off, stars on the water",
        2: "a small woven basket floating among river reeds on calm water, morning light, "
           "lotus flowers and dragonflies",
        3: "an Egyptian palace courtyard with painted lotus columns, a still reflecting pool, "
           "gold and turquoise tilework",
        4: "a humble doorway of a mud-brick home at dawn, an empty wooden cradle inside, "
           "warm light falling across the threshold",
        5: "a tree glowing with white and gold light on a dark mountainside at night, "
           "radiance spilling down the rock, stars above",
        6: "a wooden staff lying on desert sand beside a coiled serpent, a pool of white-gold "
           "radiance on the ground, night sky",
        7: "a vast Egyptian throne hall with painted lotus columns and an empty stone throne, "
           "shafts of light from high windows",
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
        3: "a great gnarled tree alone on a hill, rings of suns and moons circling in the sky "
           "above it to show the passing years",
        4: "a half-built wooden ark on dry land far from any water, stacks of timber, "
           "a saw and wood shavings, bright day",
        5: "pairs of animals walking in a long procession toward a wooden ark — two elephants, "
           "two lions, two deer, birds flying above",
        6: "torrential rain falling from black clouds onto a vast sea, a wooden ark riding high "
           "waves, lightning behind",
        7: "a white dove carrying a green olive leaf flying above a wooden ark resting on a green "
           "mountain, clearing sky with soft golden light breaking through the parting clouds",
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
