# Game 03, The Path Through the Sea (Musa): art list, prompts, seeds and rejects

Owner: `kids-game-designer`, 2026-11-06. Status: **pending scholar gates 2-3** (2a prompts, 2b contact
sheet, 3 build). This file is the designer's self-check only; no scholar agent was available in this
session. The images were rendered under the owner's standing approval of the painted-games direction.
Nothing here is linked from the story or the hub until the scholar signs off 2a, 2b and 3.

- Source of truth for prompts and seeds: `UI/scripts/specs/games/musa.py`. Renderer:
  `UI/scripts/build-game-art.py musa gen|cut|export`; export rules: `UI/scripts/specs/games/musa_export.py`.
- `STYLE` and `NEGATIVE` are imported from `UI/scripts/specs/illustrations.py` and used **word for word**.
  The game additions are the 3a.3 list (as for Nuh, with `bikini, bare shoulders`), the Musa bans of 3a.4
  (no people between the walls, no chariots or riders), and for this game: no army, soldier, horse, wheel,
  staff, rod, stick or hand; no bodies, corpse, drowning, wreckage, debris or floating objects; no moon or
  crescent (a crescent beside the painted stars could read as an emblem, 3b.3).
- Seeds are `crc32("game-musa/<asset>") % 2,000,000`; a rejected render is rerolled with a new seed
  (suffix `-r2`, `-r3`), never retouched.
- Models: Z-Image Turbo 1.0 (q8p) for the master plates and cut-out sources; Qwen-Image-Edit 2511 (q8p) for
  every state change, so night, split, dawn and calm keep one composition. Dawn is an edit of the *split*
  plate (so the walls and path stay in register); calm is an edit of the night master.
- Pipeline: Draw Things only through `~/.local/bin/draw-things-cli` (RAM gate + heavy lane, one job at a
  time; `ram-gate status` checked first, never `RAMGATE_DISABLE`) -> rembg `isnet-general-use` under
  `ram-gate run --heavy`, run only while no Draw Things job was alive -> Pillow export (no model): crop each
  plate relative to its **own painted gold rule** (found by its gold pixels; the Qwen edits redraw the
  frame up to 1.5% larger, so a fixed crop would make the crossfades swim), trim cut-outs, 2 px dark-ink
  outline, light tint-match to the parchment, WebP. Raw renders: `UI/art-raw/musa/` (gitignored;
  rejects kept in `UI/art-raw/musa/rejected/`).
- The models were unloaded when done: `draw-things-cli` exits after each job (shim), rembg ran in its own
  process under the heavy lane and exited.

## The scene and its layers

| Layer (back to front) | Asset | Notes |
|---|---|---|
| Night shore, the split sea, dawn, the calm sea (one painted plate per state, landscape and portrait) | `plate-{shore,split,dawn,calm}-{land,port}` | 1240 px wide (landscape), 690 px (portrait) |
| Water shimmer, twinkling stars, fish inside the walls, footprints, motes | PixiJS, procedural (no image) + `fish-a`, `fish-b` | decoration only; the game is whole without it |
| The believers' camp: two tents and a bundle (things only) | `tent` (twice, one mirrored), `bundle` | fades when the walk begins |
| The believers: small lantern-lights; never figures | DOM light glows (no image) | |
| The child's lantern | `lantern` | carried at the side of the path |
| Foreground: reeds cropped at the corners | `reeds` | |
| Frame: gold rule and girih corners | inline SVG (no image) | |

**Not generated, by rule:** Musa, any person or figure, the believers, the army or its chariots, the staff,
any hand, any text. The reward shamsa is the hand-drawn SVG approved on Nuh (scholar gate 3).

## Negative prompt (every asset)

> people, person, human, human figure, man, woman, child, baby, face, portrait, silhouette of a person, hands, crowd, angel, deity, idol statue of a person, rider, riders, riding, mounted figure, passenger, traveller, robed figure, anthropomorphic sun, sun with a face, moon with a face, face in the sky, text, writing, calligraphy, arabic letters, latin letters, numbers, watermark, signature, photorealistic, photograph, 3d render, cgi, horror, scary, gore, rainbow, rainbows, prismatic arc, kaaba, mosque, minaret, dome with a finial, shrine, temple, religious building, star and crescent emblem, religious symbol, flag, banner with an emblem, blurry, low quality, letters, script, inscription, hieroglyphs, glyphs, frieze with symbols, artist signature, monogram, seal, faces on celestial bodies, smiling sun, smiling moon, eyes in the sky, human figures, silhouettes, standing stones, hooded figures, face in the rock, pareidolia, book, books, open book, mushaf, scroll, scrolls, parchment roll, prayer rug, prayer mat, kaaba, cube building, black cube, blood, red droplets, splatter, mihrab, prayer niche, arched niche, inscription band, figure, cross, crucifix, church, menorah, star of david, om symbol, yin yang, buddha, statue, idol, totem, pentagram, evil eye, hamsa, zodiac, halo, wings on a person, cherub, serpent, snake, devil, horns, skull, blood, weapon, sword, spear, gore, bikini, bare shoulders, chariot, chariots, wheel, horse, soldier, soldiers, army, rider, staff, stick, rod, hand, bodies, corpse, drowning, wreckage, debris, floating objects, moon, crescent, crescent moon

## Assets

### `plate-shore-land`
- Kind: plate. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 1344x896, seed **1404069**.
- Prompt (exactly as sent):

  > a wide calm sea at night seen from a high viewpoint like a manuscript painting, a broad empty beach of pale sand fills the bottom of the picture, the dark sea fills the middle and stretches up to a low far shore with soft dark hills near the top, a deep cobalt blue night sky with a few small gold stars, gentle stylized wave lines with gold edges, a few tall reeds at the water's edge on the sides, no boats, nothing on the beach, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plate-split-land`
- Kind: edit; edits `plate-shore-land`. Model: `qwen_image_edit_2511_q8p.ckpt`. Render 1344x896, seed **1815077**.
- Prompt (exactly as sent):

  > Change only the sea. Keep the exact same beach, far shore, night sky, stars, palette, style and gold border. The sea is now split in two: two tall smooth walls of deep turquoise and cobalt water stand on the left and on the right, with stylized gold-edged curling crests along their tops, and between them a straight dry path of pale golden sand runs from the beach at the bottom straight up the middle of the picture to the far shore. The path is completely empty and dry, with a few smooth pebbles. Nothing stands on the path. No people, no animals, no footprints, no boats, no text., Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plate-dawn-land`
- Kind: edit; edits `plate-split-land`. Model: `qwen_image_edit_2511_q8p.ckpt`. Render 1344x896, seed **640609**.
- Prompt (exactly as sent):

  > Keep the exact same composition, the same two walls of water, the same dry sand path, the same beach and far shore, the same palette, style and gold border. Change only the time of day: it is now the first light of dawn. The sky over the far shore glows soft apricot, rose and pale gold, the stars have faded, and warm early light touches the crests of the water walls and the far hills. The sun has not risen yet. The path stays completely empty. No people, no sun disc, no text., Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plate-calm-land`
- Kind: edit; edits `plate-shore-land`. Model: `qwen_image_edit_2511_q8p.ckpt`. Render 1344x896, seed **861234**.
- Prompt (exactly as sent):

  > Keep the exact same composition, the same beach, far shore, hills, palette, style and gold border. It is now early morning at dawn: the sky glows soft apricot, rose and pale gold and the stars have faded. The sea is whole again and lies completely calm and still, with gentle stylized gold-edged ripples. There is no path through the water. Nothing at all floats on the water and nothing lies on the beach. No boats, no people, no wreckage, no text., Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plate-shore-port`
- Kind: plate. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x1408, seed **1702898**.
- Extra negative for this asset: `grass on the sand, tufts, marks on the sand, squiggle, scribble, handwriting`
- Prompt (exactly as sent):

  > a tall vertical view of a wide calm sea at night seen from a high viewpoint like a manuscript painting, a broad empty beach of pale sand fills the bottom quarter of the picture, the dark sea fills the middle half and stretches up to a low far shore with soft dark hills, a deep cobalt blue night sky with a few small gold stars fills the top quarter, gentle stylized wave lines with gold edges, a few tall reeds at the water's edge on the sides, no boats, nothing on the beach, the sand is smooth and clean with no marks and no grass on it, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plate-split-port`
- Kind: edit; edits `plate-shore-port`. Model: `qwen_image_edit_2511_q8p.ckpt`. Render 768x1408, seed **916554**.
- Prompt (exactly as sent):

  > Keep the bottom quarter of the picture exactly as it is: the same pale sand beach, the same reeds, in the same place. Keep the same night sky, the same far hills, the same gouache manuscript painting style and the same gold border. Change only the sea in the middle of the picture. The sea is now split in two: two tall smooth walls of deep turquoise and cobalt water stand on the left and on the right, with stylized gold-edged curling crests along their tops, and between them a straight dry path of pale golden sand runs from the beach at the bottom straight up the middle of the picture to the far shore. The path is completely empty and dry, with a few smooth pebbles. Nothing stands on the path. No people, no animals, no footprints, no boats, no text., Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plate-dawn-port`
- Shipped: **r2**, below. Rejected first render: r1, seed 1409269, the same prompt without its final sentence about the path (the far path turned into water; see the generation record).
- Kind: edit; edits `plate-split-port`. Model: `qwen_image_edit_2511_q8p.ckpt`. Render 768x1408, seed **63901**.
- Prompt (exactly as sent):

  > Keep the exact same composition, the same two walls of water, the same dry sand path, the same beach and far shore, the same palette, style and gold border. Change only the time of day: it is now the first light of dawn. The sky over the far shore glows soft apricot, rose and pale gold, the stars have faded, and warm early light touches the crests of the water walls and the far hills. The sun has not risen yet. The path stays completely empty. No people, no sun disc, no text. The pale dry sand path stays exactly as it is and still runs all the way up between the walls to the far hills; no part of the path turns into water or light., Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plate-calm-port`
- Kind: edit; edits `plate-shore-port`. Model: `qwen_image_edit_2511_q8p.ckpt`. Render 768x1408, seed **1260326**.
- Prompt (exactly as sent):

  > Keep the exact same composition, the same beach, far shore, hills, palette, style and gold border. It is now early morning at dawn: the sky glows soft apricot, rose and pale gold and the stars have faded. The sea is whole again and lies completely calm and still, with gentle stylized gold-edged ripples. There is no path through the water. Nothing at all floats on the water and nothing lies on the beach. No boats, no people, no wreckage, no text., Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `lantern`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x1024, seed **336782**.
- Extra negative for this asset: `wire guard, bars across the glass, grille, cross bars, hurricane lamp, kerosene lamp, photorealistic metal, x shape, crossed lines, diagonal lines, lattice, window panes, frame divisions`
- Prompt (exactly as sent):

  > one small cylindrical glass lantern in flat manuscript painting style: a plain clear glass cylinder glowing with a warm golden flame inside, standing between a round brass base and a round domed brass cap with a plain ring handle on top; the glass has no frame, no bars and no lines on it, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `tent`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 1024x768, seed **115694**.
- Extra negative for this asset: `crossed poles, poles crossing at the top, a-frame tent, camping tent, modern tent`
- Prompt (exactly as sent):

  > one low wide desert tent of dark brown woven wool cloth stretched over several short upright wooden poles, a long gently sloping flat roof and an open shaded front, plain cloth with no pattern, no decoration, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `jar`
- Not shipped. (not shipped: rejected twice, see above)

### `bundle`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **1431416**.
- Prompt (exactly as sent):

  > one small travel bundle of plain undyed cloth tied up with a rope knot, resting on the ground, no pattern, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `reeds`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x1024, seed **1307458**.
- Prompt (exactly as sent):

  > a clump of tall slender green reeds and papyrus stems with feathery tops, growing upward, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `palm`
- **Not shipped** (rendered, passes 3b, not needed by either composition). Record kept below.
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x1024, seed **1535063**.
- Prompt (exactly as sent):

  > one date palm tree with a slender gently curved trunk and a crown of green fronds, whole tree visible, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `fish-a`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **1589526**.
- Prompt (exactly as sent):

  > one small turquoise fish swimming, side view, whole fish visible, gentle, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `fish-b`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **557612**.
- Prompt (exactly as sent):

  > one small golden yellow fish swimming, side view, whole fish visible, gentle, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text


## Generation record (2026-11-06)

Every render went through `~/.local/bin/draw-things-cli`, one at a time (the heavy lane was shared with
other agents' voice jobs; the shim waited each time). rembg ran once, under `ram-gate run --heavy`, while
no Draw Things job was alive. Full log: `UI/art-raw/musa/gen-log.txt`; rejected renders are kept in
`UI/art-raw/musa/rejected/` (both gitignored). **24 finished renders: 15 kept (14 shipped, the palm not
shipped) and 9 rejected**; one chained edit was stopped unfinished (below) and is not counted.

| Asset | Result |
|---|---|
| `plate-shore-land` (Z-Image, 49 s) | Accepted. Small gold grass tufts on the sand are grass, not glyphs (checked at 100%). |
| `plate-split-land`, `plate-dawn-land`, `plate-calm-land` (Qwen, about 16 min each) | Accepted. The dawn edit added a plain sun disc on the horizon although the prompt said "no sun disc" (see question 1). The calm edit is empty: nothing floats, nothing lies on the beach. |
| `plate-shore-port` | r1 (seed 214577) **rejected**: an arrow-like gold pen squiggle on the empty sand (3b.4) and a gold speck on the horizon. r2 (1390692) **rejected**: a line of gold grass stubble that reads like cursive handwriting (3b.4). r3 (1702898, "the sand is smooth and clean", per-asset negatives): accepted. |
| `plate-split-port` | r1 (1520561) **rejected**: the beach was dropped, the style turned into a flat vector cartoon, and it no longer registered with the master (3b.10 in context; the same failure as Nuh `plate-judi-port` r1). The dawn edit chained from it was stopped before it finished. r2 (916554, "keep the bottom quarter exactly as it is ..."): accepted. |
| `plate-dawn-port` | r1 (1409269) **rejected**: the far stretch of the dry path became sunlit water, so the walk would end on the sea. r2 (63901, "the dry sand path ... still runs all the way up to the far hills"): accepted. |
| `plate-calm-port` (1260326) | Accepted: calm empty sea at dawn, horizon in register with the master. Slightly smoother (more airbrushed) than the other plates. |
| `lantern` | r1 (1310454) **rejected**: a photoreal hurricane lamp with an X-shaped wire guard across the glass (3b.3). r2 (1568664) **rejected**: diagonal lines crossing in an X in every pane (3b.3). r3 (336782, "a plain clear glass cylinder ... no frame, no bars and no lines"): accepted. rembg tore a ragged hole in the pale glass (3b.9), so the lantern is cut by the model-free edge flood fill unioned with the rembg mask (the Nuh sheep method). |
| `tent` | r1 (1133598) **rejected**: a modern A-frame tent whose poles cross in an X at the apex (3b.3). r2 (115694, a low desert tent of dark woven wool): accepted. |
| `jar` | r1 (893440) and r2 (1530807) **rejected**: both carried a large four-petal motif with a round centre that could read as a cross pattée (3b.3), even when asked for bare clay. **Not shipped**; the camp keeps the tents and the bundle. |
| `bundle`, `reeds`, `fish-a`, `fish-b` | Accepted first time. The bundle's diamonds and the fishes' scales are plain ornament, not script. |
| `palm` (1535063) | Passes 3b, but neither composition needed it: **not shipped**. |

Export (Pillow, no model): every plate is cropped relative to its own painted gold rule (frame boxes found
by gold pixels), so the four states of each composition crossfade in register (checked by 50/50 blends:
no doubling). Shipped: `UI/images/games/musa/`, **14 WebP, 399 KB** (8 plates, 6 sprites) plus
`manifest.json`; budget 1.5 MB and about 25 sprites.

## Self-check against section 3a (prompt rules), by `kids-game-designer`, 2026-11-06

Marked **pending scholar gate 2a**; the scholar's verdict is final.

| 3a rule | Check |
|---|---|
| 1. Things, never beings with agency | Pass. Subjects: a shore, the sea, sky, sand, walls of water, a path, tents, a bundle, a lantern, reeds, a palm, two fish. No prophet, person, crowd, army, soldier, "traveller" or staff is prompted. |
| 2. Nothing for Allah or a stand-in | Pass. Light is plain light ("first light of dawn", "warm golden light inside"). No "divine", "heavenly", beam, eye, hand or throne. |
| 3. STYLE and NEGATIVE unchanged, plus the game list | Pass. Both imported word for word from `specs/illustrations.py`; the full 3a.3 list is appended (with `bikini, bare shoulders`). |
| 4. Musa bans: no people between the walls, no chariot riders | Pass. Every split and dawn prompt says "the path is completely empty ... nothing stands on the path. No people, no animals, no footprints". The negative adds chariot, wheel, horse, soldier, army, rider, staff, rod, hand, bodies, drowning, wreckage, debris, floating objects. |
| 5. No Ka'bah, mushaf or Quran text generated | Pass. The dua is live HTML text copied from the story page. |
| 6. Modesty | Pass. The only cloth is a plain tent and a bundle. |
| 7. Every prompt, seed and negative recorded | Pass. `specs/games/musa.py` and this file (exact prompts above). |
| 8. Gated shim, one job at a time, owner go-ahead | Pass. Owner's standing approval of the painted-games direction; `ram-gate status` checked before each batch; never `RAMGATE_DISABLE`; rembg only while Draw Things was idle. |

## Contact-sheet self-check against section 3b (pending scholar gate 2b)

Sheet: `claudeteam/reviews/game-musa-contact-sheet.png` (8 plates; 6 sprites, each on a light and a dark
ground). Reviewed at thumbnail and at 100%, and in context in the play-through screenshots at 1180x820 and
390x844, EN and mirrored AR.

| 3b check | Result |
|---|---|
| 1. Any face or figure | None. No figure in the walls, on the path, on the far shore or in the tents (the tent front is an empty shade). The only faces are the two fishes' own, calm and cartoon-friendly (fish-b smiles). |
| 2. Anything for Allah, an angel or Shaytan | None. The dawn light is a plain sun disc or glow on the horizon with no face and no rays; see question 1. The reward shamsa is the SVG approved on Nuh. |
| 3. Symbols of other faiths | None after rejections: two lanterns (X bars), one tent (X poles) and two jars (four-petal motif) rejected. No moon or crescent anywhere. Mirrored AR checked: no cross appears; the portrait path meeting the far shore makes a T, not a cross (see question 3). |
| 4. Text-like glyphs | None after rejections (two portrait masters with squiggles rejected). The gold wave lines and grass tufts were checked at 100%. |
| 5. Ka'bah, mosque, minaret, mushaf | None. |
| 6. Immodesty | None (no human form). |
| 7. Violence or fear | None. No army, no chariots, no bodies, no wreckage; the calm plates are empty seas. |
| 8. Biblical or Israiliyyat details | None prompted or visible. |
| 9. Anatomy | Fish whole. The lantern glass hole from rembg was fixed by the cut method, not by retouching. |
| 10. In context, both sizes, RTL | Checked in the play-through screenshots (tablet and phone, EN and AR). |

**Questions for the scholar**
1. **The dawn sun.** Both dawn plates show the dawn glow at the far end of the path (the landscape one a
   plain sun disc on the horizon). The narration says only "the first light of morning", which fits 26:60
   «فَأَتْبَعُوهُم مُّشْرِقِينَ» (they pursued them at sunrise). Is a light at the end of the path acceptable,
   or could a child read it as a "light of Allah" stand-in? Fallback: regenerate with a softer, sunless glow.
2. **Fish in the walls.** Tapping a wall shows a ripple and a fish passing behind the water (decoration;
   the story's own plate `prophet-musa/scene-10` already paints fish in the walls). It is not narrated as a
   fact. Acceptable?
3. **The portrait path.** Where the path meets the far shore it makes a T shape against the horizon. I read it
   as a road reaching a shore, not a cross; please confirm.
4. **Mirroring.** In Arabic the whole painted world is mirrored left to right, as approved for images with no
   writing or sacred place. RTL screenshots are in the build evidence.

Sign-off line (to be completed by the scholar):
`Art gate: prompts reviewed <date> (scholar); contact sheet reviewed <date> (scholar) - 14 images approved,
M rejected and regenerated after review` (designer self-check: 14 shipped; 9 renders rejected and
regenerated or dropped before review).
