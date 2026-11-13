# Game spec: The Garden of Choices (mockup 05)

File: `UI/mockups/games/05-adam-garden.html`. Prototype with placeholder art. Logic and rendering are separate, and assets sit in the `ART` block. **Sign-off still needed.**

- **Learning goal:** After playing, the child can say that when Adam and Hawa made a mistake they said sorry to Allah straight away and He forgave them. The child can also follow the same steps after their own mistake: own it, say sorry, put it right, and ask Allah's forgiveness.
- **Age band:** 5-9.
- **Tied to:** `UI/story-prophet-adam.html`, with the Adam translations from `UI/translations.js`.
- **Core loop:**
  - Round 1: gather fruit in the garden Allah gave and hear the one rule. There is no "kept the rule" state.
  - Round 2: after an accident, choose honesty, fix what broke, and say sorry.

## One round (about 4 min)
1. **Jannah:** drag 5 fruits into the basket. The one tree has a "Do not approach this tree" sign. Tapping it says "Allah said: do not go near this tree." No praise and no comparison with Adam. It has no fruit to take, so the child can never "do the mistake". The tree is unidentified (no apple, no serpent).
2. **The story, narrated:** the story page's text about Shaytan's whisper and the mistake is shown and the garden dims. "They slipped and made a mistake" (2:36 فأزلّهما). "They turned to Allah and asked His forgiveness... We call this istighfar." Adam's dua appears and the parent and child read it together, then press "We read it together". "Allah forgave them!" (copied text) appears, then "Allah sent them to live on earth".
3. **Parent pause 1:** "Why is it good to say sorry quickly when we make a mistake?"
4. **Your garden on earth:** drag the watering can to 3 plants. Then tap the ball, which knocks over Mama's pot.
5. **Choice:** hide the pieces, which dims the garden and explains why; blame the cat, which is explained as unfair and untrue; or tell the truth. The child then drags 3 pieces back to mend the pot.
6. **What do you say?** "Sorry, Mama, I'll be more careful" or "It's not a big deal", which gets a gentle reason. The dua is shown again with the page's note: "Say this dua when you make a mistake...".
7. **Parent pause 2:** "When you make a mistake, what are the three steps?"
8. **Ending:** "Allah loves to forgive", then "Play together again".

## Difficulty ramp
The parent tier prompts a real conversation about a mistake from this week before starting.

## EN/AR, RTL and accessibility
- All strings are bilingual, and the dua note uses the page's own Arabic.
- Keyboard: select, then choose a target. Targets are 48px or more.

## Guardrail checklist
- [x] Adam, Hawa, the angels and Iblis are never drawn. The child never plays as Adam, and the prophet's mistake is narrated from the page, never played or chosen by the child.
- [x] The dua `رَبَّنَا ظَلَمْنَا أَنفُسَنَا ...` is copied byte-for-byte from the story page. Its EN/AR translation and note come from `translations.js`.
- [x] The dua is read together by the family. It is never turned into a hold or score mechanic and never spoken by TTS.
- [ ] **Scholar:** the story text "ate from the forbidden tree / big mistake" is reused from the page. Is the wording right for a prophet (some prefer "slip", زلّة)? The same wording is already on the story page.
- [ ] **Scholar:** the Arabic phrase "قالا آسفين لله" / "say sorry to Allah" is used for istighfar. Would "نستغفر الله" be preferred?

## Scholar gate 1 (spec), 2026-11-04
Ruling: `claudeteam/reviews/game-islamic-review-2026-11-03.md` (verdict for this game: **APPROVED WITH FIXES**). All fixes below were applied by `kids-game-designer` on 2026-11-04. Gate 1 closes when the scholar confirms them. Gate 2 (art) and gate 3 (build) are still open.

| # | Ruling (severity) | Resolution |
|---|---|---|
| 1 | MUST: the child "succeeds" where a prophet slipped ("You kept the rule!") | Done. `ruleKept` is now `ruleHeard`: a single soft tap and "Allah said: do not go near this tree. Everything else in the garden was allowed." No praise, no wobble, no `S.kept`. Ending: "You learned Adam's dua, and when an accident happened you told the truth, fixed it and said sorry." |
| 2 | SHOULD: forbidden tree not an apple tree, no serpent | Done for the placeholder: 🍎 removed from the allowed fruits (🍋 instead); the forbidden tree stays a plain unidentified tree. Art brief carries the ban. |
| 3 | NOTE: "the light comes back to the garden" | Done: "Allah forgave them! Allah is the Most Merciful. Then Allah sent them to live on earth." |
| 4 | Section 5: "slip", not "big mistake" | Done in the game: "they slipped and made a mistake" / «فأزلّهما الشيطان فأخطآ». The story page (`translations.js:95,271`) still says "big mistake" (owner/site-level). |
| 5 | Section 5: istighfar, not «آسفين لله» | Done: "asked His forgiveness... We call this istighfar, and we say: Astaghfirullah"; AR «استغفرا الله» and «نستغفر الله» / «نقول أستغفر الله» replace both «آسفين لله» lines. The "hide" feedback now says Adam "turned to Allah and asked forgiveness". |
| 6 | Section 5: the slip is narrated, never played | Unchanged and compliant. |
| 7 | Adab: "Prophet" at first mention | Done: "Prophet Adam" / «النبي آدم عليه السلام». |
| S | Sound (owner decision pending): no melodies, one tone or a two-note chime | Done via the shared kit. The dua is text only. |

## Painted build, 2026-11-12 (`kids-game-designer`)
The fifth painted game, built to the Nuh, Musa, Yusuf and Ibrahim standard: `UI/games/adam-garden.html` (source
`UI/mockups/games/_src/src/05-adam-garden-painted.html`, built by `_src/build.py`, which copies the dua 7:23 from
`story-prophet-adam.html` and its title, meaning line, note and four page sentences from `translations.js`, the page's
i18n source), `UI/games/adam/adam.js`, `adam.css`, art in `UI/images/games/adam/` (prompts and seeds:
`UI/scripts/specs/games/adam.py`; record: `claudeteam/reviews/game-adam-art.md`; contact sheet:
`claudeteam/reviews/game-adam-contact-sheet.png`). The CSS-shape mockup `UI/mockups/games/05-adam-garden.html` is kept
as it was. **Not linked** from the story or the hub: gates 2 (art) and 3 (build) are open.

**One round, as built** (about 4-5 minutes; gate-1 wording kept, new lines marked (new)).
1. **The garden (Jannah)**, one painted plate: a pomegranate tree, date palms (landscape) or a fig tree (portrait), a
   river, and in the open middle one tree standing alone on a hill with plain leaves and no fruit. "Prophet Adam and
   Hawa lived in Jannah, a beautiful garden with everything they could want. Gather five fruits from the trees into
   the basket: drag each one, or tap it." Baba's recording: "They lived happily together in Jannah, which means
   paradise." (slide 5, one sentence). Five fruits hang only on the allowed trees (pomegranates and dates; pomegranates
   and figs on the phone, matching the painted trees). Each one is named as it goes in ("A pomegranate into the basket.")
   and lands visibly in the basket. No count, no score.
2. **The one rule.** After the basket is full (or earlier, if the child taps it): "One tree in the garden was different.
   Tap the tall tree that stands by itself." The tap gives the page's own sentence in indirect speech: "Allah told Adam
   and Hawa they could enjoy everything in Jannah, but that there was ONE tree they must not go near." with Baba's
   recording of it (slide 6). No praise, no "kept" state. The tree is never a drop target and has nothing to take; a
   second tap during gathering says "This tree has no fruit to take. Gather the fruit from the other trees." (new)
3. **The slip, narrated, never played.** Next: the fruit and the basket fade, the garden crossfades to the dimmed
   garden (a Qwen edit of the same plate), and the ribbon shows the page's sentence: "Shaytan whispered to Adam and Hawa
   and tricked them. They slipped and made a mistake: they ate from the forbidden tree. As soon as they did, they
   realized what they had done." Nothing is drawn for Shaytan. No recording (slide 7 is never used).
4. **Istighfar by name** (the scholar's own wording): "Adam and Hawa turned to Allah and asked His forgiveness: they
   said sorry to Allah. We call this istighfar, and we say: Astaghfirullah."
5. **Adam's dua, read together.** The cobalt-ruled cartouche shows the dua exactly as on the story page, with its title
   and meaning line; "This is the dua they said. Read it together, then tap the button." -> **We read it together**. The
   narration never speaks it; the listen button is hidden while it is on screen.
6. **Forgiven.** The page's sentence is read over the still, dim garden: "And SubhanAllah - Allah forgave them! Allah is
   the Most Merciful!" No light, no motes, and a single soft tone (never the win chime). (Changed after scholar gate 3,
   3.2 and 3.3: the glow rose out of the one tree's crown and followed the family's tap.)
7. **To earth.** The scene becomes the earth at dawn (a Qwen edit of the same plate: wild grass, a stream, young trees;
   never "the light came back to the garden"), with the page's sentence "Adam and Hawa were sent to live on Earth. Allah
   told them that Earth would be their home, and from them would come all the people of the world - including you!" and
   Baba's recording of it (slide 9).
8. **Parent pause 1** (as approved), then "Next: our own garden", a page-turn wipe in the reading direction.
9. **Your garden on earth** (a painted courtyard: a lemon tree, a pomegranate tree, three earth beds, a stone ledge, a
   grey cat asleep in the shade). "Here is your own garden on earth. The little plants are thirsty: drag the water jug
   to each one, or tap a plant." (new wording of the approved step) Each sprout tilts the jug, a soft pour, and grows into
   a tulip plant: "It grew!"
10. **The accident** (as approved): "All watered. Time to play: tap the ball!" The ball rolls to Mama's clay pot, the pot
    tips with a soft muffled knock and lies in three pieces (the same painted pot cut by three polygons in the browser).
    "Oh no! The ball knocked over Mama's clay pot and it broke. Nobody saw. What will you do?"
11. **The choice** (three buttons, shuffled, alike): *Hide the pieces under the leaves* -> a heap of leaves covers the
    pieces and a gloom falls on the garden, with the approved text, then **Choose again** lifts it; *Say the cat did it*
    -> the sleeping cat glows softly: "The cat was fast asleep the whole time. It would be blamed for something it did
    not do. That is not fair, and it is not true. Let us choose again." (new first sentence); *Tell the truth and help fix
    it* -> "That is brave! Now let us fix it: drag the pieces back onto the pot, or tap each piece."
12. **Mending**: each piece glides back into place ("It fits."); the whole pot returns with fine seams where it was mended.
13. **Saying sorry** (as approved): "Sorry, Mama. I will be more careful." / "It is not a big deal." (gentle reason, choose
    again). Then the approved line "Mama smiles and forgives you. And we can ask Allah to forgive us too, like Adam: we say
    Astaghfirullah." with a parchment card «أستغفر الله» / "Astaghfirullah: I ask Allah to forgive me" and **We said it
    together**; Baba's recording "Remember, when you make a mistake, say sorry to Allah - He loves to forgive!" (slide 16,
    one sentence; AR «تذكر، عندما تخطئ، استغفر الله - فهو يحب أن يغفر!»).
14. **Parent pause 2** (as approved), then evening in the courtyard (new: "Evening comes to your garden. The plants are
    growing, and the pot is whole again."), the reward (lamp glow over the mended pot, the shamsa approved on Nuh, a
    two-note chime, a few slow motes) and the ending page: "Allah loves to forgive", the approved body, the dua with its
    title, meaning and the page's note ("Say this dua when you make a mistake and want Allah's forgiveness!"), **Play
    together again**, **Back to the story**, and the tier box.

**Tier ("next time")**: before the round, a parent pause: "Before we start: what is one mistake you made this week? What
did you do about it?" (idea: the grown-up can share one of their own first); and before each choice the ribbon adds
"Grown-up: before tapping, ask your child to say why."

**Not in this game, by the gate-1 rulings:** Adam, Hawa, the angels, Iblis or any figure; Mama (a voice only); a serpent,
an apple or any fruit on the one tree; the child picking or eating from the tree; "you kept the rule".

**Voice:** only Baba's recorded story narration, four single sentences cut inside recorded pauses and checked with
Whisper large-v3-turbo under the RAM gate (heavy lane). Never slide 7 (the slip; the AR dual verbs are in doubt), never
slide 8 or 11 (they contain the dua), no browser TTS. The fade sits in the last 80 ms before the cut (inside the pause).

| Beat | Clip | Cut (s) | Edge levels (40 ms RMS) | Whisper heard |
|---|---|---|---|---|
| intro | EN slide 5 | 5.10-9.05 | -94 / -78 dBFS | "They lived happily together in Jannah, which means paradise." |
| intro | AR slide 5 | 3.28-5.95 | -78 / -61 (10 ms) | «عشا معا بسعادة في الجنة» (the full file is heard as «عاشا»; the cut starts at the quietest 10 ms of a 100 ms pause) |
| the rule | EN slide 6 | 0-6.90 | file start / -79 | "Allah told Adam and Hawa they could enjoy everything in Jannah but that there was one tree they must not go near." |
| the rule | AR slide 6 | 0-8.60 | file start / -98 | «أخبر الله آدم وحواء إنهما يستطيعان الاستمتاع بكل شيء في الجنة إلا شجرة واحدة نهاهما أن يقرب منها.» |
| earth | EN slide 9 | 0-9.50 | file start / -88 | "Adam and Hawa were sent to live on earth. Allah told them ... including you." |
| earth | AR slide 9 | 0-10.82 (was 10.44, scholar 3.4) | file start / -48 (10 ms; the fade 10.74-10.82 falls on a breath, -42 to -48) | «أرسل آدم وحواء للعيش على الأرض ... بما فيهم أنت» ends on «أنت» (10.08-10.48), nothing of «نحن» (re-checked 2026-11-12, Whisper under the RAM gate) |
| istighfar | EN slide 16 | 5.40-10.50 | -68 / -70 | "Remember, when you make a mistake, say sorry to Allah, He loves to forgive." |
| istighfar | AR slide 16 | 5.57-10.40 | -64 / -55 (10 ms) | «تذكر عندما تخطئ استغفر الله فهو يحب أن يغفر» |

**Sound:** no music. A low breath of air (filtered noise), a soft pour, a leaf rustle, a ball rolling on earth, a soft
muffled knock (never a crash), single bell tones and the two-note chimes (`good` 659/988, `done` 523/784). Ducked under
Baba's voice. **Sounds off and quiet moments** (the master-gain gate of the Yusuf review): Sounds off ramps the master to
0 in 0.25 s and suspends the AudioContext; the air's swell is a gain stage after its level. Measured trace (AnalyserNode on
the master output, RMS of 8192 samples, headless Chromium, `scratchpad/adam-game/audio-trace.json`): sound on -45 to -46
dBFS; 0.3 s after Sounds off -70 dBFS (inside the ramp); from 1 s to 7 s after, the context is `suspended` and every
reading is -inf; a quiet moment with the air faded to 0 and the context `running`: every reading from 1.5 s to 7.5 s is
-inf. The Sounds-off click also stops Baba's clip (it plays outside the Web Audio master).

**The dua's marks:** 7:23 here has no waqf sign; the dua lines have 1.9-1.95 line height and 0.3 em top padding, so no
shadda or tanwin rises into the kicker line (checked in the dua and ending screenshots, both sizes).

**Verification (2026-11-12, designer):** `node --check`; seven headless play-throughs, all complete to the ending and
"Play together again" (restarts in the garden with five fruits): tablet 1180x820 EN (drag) and AR (drag, the tree heard
early), phone 390x844 EN and AR (tap), keyboard-only tablet EN and phone AR (Tab/Enter only; focus ends on "Play together
again"), and AR tablet with reduced motion. Every choice takes the wrong answers first (hide, then the cat, then the
truth; "not a big deal", then sorry). No console errors, no page scroll (scrollHeight = innerHeight at every screenshot),
no request outside localhost, "Back to the story" -> `../story-prophet-adam.html`. Targets 48 px or more (fruit hit areas
grow 14 px past the sprite; buttons 64 px; the tier box sits in a 48 px label). Scripture diff (`scripture_diff.py`): the
dua is byte-identical to the story page's dua box (and its scene-9 copy), its letters are 7:23 after «قالا»; title,
meaning and note EN and AR, and the four page sentences EN and AR, are byte-identical to `translations.js`; no dua text
in the JS; no speech synthesis; clips only from slides 5, 6, 9, 16; no apple, serpent or snake; no "kept the rule".
`verify-no-recitation.py --transcripts` on 153 strings (every JS and HTML string plus the eight Whisper transcripts):
0 flagged (the on-screen dua alone is flagged, as expected, and is never voiced). All six site verifiers pass (chain,
illustrations, narration, no-recitation, quizzes, scripture). Art: 19 WebP, 989 KB.

**Screenshots** (`/private/tmp/claude-501/-Users-hishamabuella-Work-Interactive-Islamic-kids-website/e8e68c51-18d1-4a2c-bedb-40bde535d502/scratchpad/adam-game/`):
`shots/{tab,phone}-{en,ar}-NN-*.png` (every stage, start to end), `shots/kb-{en,ar}-*`, `shots/tab-ar-rm-*`,
`review-{tab,phone}-{en,ar}.png` (all stages), `beside-garden-scene6.png` and `beside-court-scene10.png` (the game beside
the Adam story plates).

### Gates
- Gate 1 (spec): approved with fixes 2026-11-03/04; fixes applied (table above). New lines for the scholar's gate 3 are
  marked (new) in the round above, plus the fruit names, `treeMore`, `missBasket`, `missJug`, `piece`, `missPiece`,
  `again`, `sayIt`, `evening`, `tierStartQ`/`tierStartH`, and the istighfar card «أستغفر الله» / "Astaghfirullah: I ask
  Allah to forgive me".
- Art gate: prompts (2a) pending; contact sheet (2b) pending (`claudeteam/reviews/game-adam-contact-sheet.png`). Designer
  self-check and four questions: `game-adam-art.md`.
- Gate 3 (build): pending. **Not linked** from the story or the hub. Not committed (coordinator, 2026-11-12: keep it off
  main until the scholar clears it).

**Designer questions for gate 3:**
1. (Answered: no. The mercy light and its motes are removed; see "Fixes after gates 2-3".) The dimmed garden stays dim while
   "Allah forgave them" is read, then the scene becomes the earth at dawn.
2. "The cat was fast asleep the whole time" makes the cat option obviously unfair; is a visibly sleeping cat fine?
3. The fruit is named as it is gathered ("A pomegranate into the basket."). Any concern about the child gathering fruit
   in Jannah (gate 1 approved it as exploring the garden Allah gave)?
4. Whisper hears the AR intro clip's first word as «عشا» (short a) though the full recording is heard as «عاشا»; the cut
   is at the quietest point of the pause. Acceptable, or drop the AR intro clip?

## Scholar gates 2-3 (2026-11-12)
`islamic-content-scholar`, 2026-11-12, working tree on `main` at ac6af44 (the Adam game is uncommitted). This was a
read-only review: no game file was edited.

**Summary.** Gate 1 is confirmed. 2a (prompts): **PASS**. 2b (images): **PASS WITH FIXES**. All 19 WebP are approved
for use, with one SHOULD. 3 (build): **PASS WITH FIXES**, with two MUSTs:
1. On the phone, a pomegranate hangs on the one tree.
2. The "mercy" glow and its motes rise out of the one tree's crown as Allah's forgiveness is read.

**Linking: not yet.** Link from the end of `story-prophet-adam.html` once 3.1 and 3.2 are applied and I have seen
`phone-{en,ar}-01-start`, `phone-{en,ar}-02-fruit-2` and `{tab,phone}-{en,ar}-*-forgave` re-shot.

### Gate 1: confirmed in the painted build
- **Adam's slip is narrated, never played.**
  - The one tree is never a drop target and has nothing to take (`UI/games/adam/adam.js:405-421`).
  - Tapping it gives only the page's sentence in indirect speech, with no praise and no "kept" state.
  - The slip is the page's own text (`UI/games/adam-garden.html:101`): "They slipped and made a mistake" /
    «فأزلّهما الشيطان فأخطآ». This follows 2:36 and 7:20 («فوسوس لهما الشيطان»).
  - Nothing is drawn for Shaytan.
- **Istighfar by name.** `adam.js:69-70`: «ندم آدم وحواء، فتوجّها إلى الله واستغفراه. وهذا اسمه الاستغفار، ونقول: أستغفر الله.»
  The dual forms (توجّها، استغفراه، قالاه، اقرآه، المسا) are all correct.
- **Adab.** "Prophet Adam" / «النبي آدم عليه السلام» at first mention (`:62-63`).
- **No figures.** Adam, Hawa, Mama, the angels and Iblis never appear, and there is no apple or serpent.
- **The child never plays Adam.** The child's own mistake is a ball and a pot, in the child's own garden.
- **Endings.** "Allah loves to forgive" is sound: the dua «إنك عفو تحب العفو فاعف عني» (Tirmidhi 3513, sahih).
  "Allah forgave them! Allah is the Most Merciful" (`adam-garden.html:102`) follows 2:37 and 7:23.

### Re-checks (my own measurements)
- **Dua 7:23**
  - Byte-identical: `adam-garden.html:109` and `:152` against `story-prophet-adam.html:303` and `:368` (194 bytes, a Python
    `==` on the UTF-8).
  - Against `api.alquran.cloud/v1/ayah/7:23/quran-simple`: after normalising, «ربنا ظلمنا انفسنا وان لم تغفر لنا
    وترحمنا لنكونن من الخاسرين» is the ayah exactly, after «قالا».
  - The diacritised text differs only by the story page's own convention:
    - the idgham shadda in «لَّمْ»;
    - no sukun on «أَنفُسَنَا» and «وَإِن»;
    - shadda/fatha stored in the other order in «رَبَّنَا» and «لَنَكُونَنَّ» (the rendering is the same).
  - None of these is an error.
  - The EN and AR meaning lines and the note are the page's own text.
- **Never voiced: confirmed.**
  - No `speechSynthesis`, `speak(` or Utterance in `adam.js` or `adam-garden.html`.
  - The only audio is `audio/prophet-adam/{en,ar}/slide-{5,6,9,16}.mp3` (`adam.js:111-116, 197`). Slides 7, 8 and 11
    are never referenced. Slides 7 and 8 have uncommitted re-narrations in the tree; neither is used here.
  - While the dua is on screen, `setClip(null)` hides the listen button (`:191, :433`).
- **`verify-no-recitation.py --transcripts`.**
  - Scope: 145 strings, i.e. every EN/AR string in `adam.js`, every `data-ar` and text node in `adam-garden.html`, and the
    eight Whisper transcripts of the shipped clips.
  - Result: 2 flagged. Both are the on-screen dua (`html` cartouche and ending, 7:23), which is displayed only.
  - All eight transcripts are clean. `--self-test` passes.
  - The AR rule clip's «نهاهما أن يقربا منها» echoes 2:35 «ولا تقربا هذه الشجرة» in indirect speech. It is a paraphrase,
    not recitation, and the verifier agrees.
- **Narration cuts.** I ran ffmpeg silencedetect (-35 dB, 80 ms) on the shipped mp3s, then a 10 ms RMS profile, then
  compared with the Whisper word times in `scratchpad/adam-game/clips/words-full.json`.

  | Clip | Cut (s) | Finding |
  |---|---|---|
  | EN 5 | 5.10-9.05 | both edges in pauses (4.74-5.52, 8.91-9.22) |
  | AR 5 | 3.28-5.95 | Start: a 30 ms dip (-79 dBFS) after «لآدم». Then a -40 to -47 dBFS breath (3.29-3.51), the true gap (3.52-3.55, -69), and «عاشا» starting at 3.56. The whole word is inside the clip. End: inside 5.81-6.02. |
  | EN 6 | 0-6.90 | end inside 6.66-7.21 |
  | AR 6 | 0-8.60 | end inside 8.46-8.90 |
  | EN 9 | 0-9.50 | end inside 9.22-9.85 |
  | AR 9 | 0-10.44 | **The end is not in a pause.** 10.39-10.44 is the stop closure of «أنتَ», and its release follows at 10.45-10.50 (-20 to -24 dBFS). Whisper places «أنت» at 10.08-10.48. The 80 ms fade (from 10.36) and the cut clip the word's last syllable. The real pause is 10.75-10.89, and «نحن» starts after it. See 3.4. |
  | EN 16 | 5.40-10.50 | both edges in pauses (5.10-5.64, 10.24-10.77) |
  | AR 16 | 5.57-10.40 | Start: inside 5.41-5.60. End: a -59 dBFS dip right after «يغفر», before a quiet breath. The next sentence («استمر», loud from 10.63) is not reached. Acceptable. |

- **Sounds off is silent.**
  - `audio-trace.json`: sound on reads -45 to -46 dBFS. 0.3 s after Sounds off it reads -70 (inside the 0.25 s ramp).
    From 1 to 7 s it reads -inf with the context `suspended`. In a quiet moment with the context `running`, it reads
    -inf from 1.5 to 7.5 s.
  - Code: `adam.js:171-176` ramps the master to 0, then suspends. `:650` also stops Baba's clip and sets the air to 0.
  - The air's swell is a gain stage after its level (`:158-162`).
  - The listen button still plays a clip when tapped with Sounds off (`:652`). That is an explicit request, and it is
    the same in all four approved games.

### 2a, prompts: PASS
`UI/scripts/specs/games/adam.py` and `game-adam-art.md` meet 3a:
- Every subject is a thing: garden, trees, river, courtyard, jug, ball, pot, basket, fruit, leaves and a cat.
- `STYLE` and `NEGATIVE` are used word for word.
- The Adam bans are in every negative: apple, serpent, figures, faces, eyes, held or bitten fruit.
- The lessons of the earlier games are there: x shape, crossbar, lattice, medallion, lozenge with a dot, nazar,
  script-like marks.
- No sky body appears.
- The one tree is prompted with "no fruit and no flowers ... nothing on the ground beneath it".
- No light is prompted as divine.
- Every reroll and Qwen edit is recorded with its seed and reason.

### 2b, images: PASS WITH FIXES (19 of 19 approved, one SHOULD)
I checked every plate at 100% and in zoomed crops, every sprite at 4-6x on a light ground, and the shots at both sizes,
mirrored.
- **Designer Q1, trees across the courtyard wall** (`plate-court-land`): **not a cross**.
  - Both trunks fork into three limbs *below* the wall's top edge, so where the edge passes behind them there is a Y fork
    with a crown, not a stem with a bar.
  - The lemon trunk also passes in front of the low plinth course and stands in the bed. A band that runs the full width
    of the picture is a ground line, not a crossbar: a cross needs a short bar ending near the stem (the Musa and
    Ibrahim standard).
  - In `plate-court-port` the trunks stop at the wall top (⊥), which is also fine.
- **Designer Q2, the bark marks on the tall portrait trunks** (`plate-garden-port`, `plate-dim-port`): **not a cross,
  but they should go (SHOULD)**.
  - Each mark is three identical short parallel strokes, ≡. There are two per trunk, at about (40, 825), (40, 990),
    (640, 930) and (640, 1020).
  - They sit inside the trunk outline, so no arm shows beyond the stem. They are not bark texture, though: they are a
    repeated stamped symbol (it reads as ≡ / 三 / the ☰ trigram), and that falls under 3b.4, "when in doubt".
  - On the phone they are mostly cut off at the frame edge, which is why this is not a MUST. In portrait on a tablet
    (aspect < 0.8) both trunks are fully visible.
  - Fix: make a recorded Qwen edit of `plate-garden-port` (seed 419717): "remove the small horizontal marks on the two
    tall trunks; plain smooth bark; change nothing else". Then re-run the recorded dim edit on the new master to rebuild
    `plate-dim-port`, and re-measure `LAYOUT.port`.
- **Designer Q3, the ball's gold rim:** **approved**. It is one thin ring just inside the edge of a plain red disc, with
  an off-centre highlight. There is no pupil, no concentric second ring and no dot, so it reads as a ball (checked at 4x
  and in `tab-en-12`).
- **Designer Q4, the dimmed garden:** **approved**. It is a grey dusk over the same garden, with no ember, creature,
  shape or eye. The only mention of Shaytan is the page's sentence.
- **Notes (no fix):**
  - The pomegranate trunk in `plate-garden-{land,dim}` has ring knots, each with a dark centre (at about x 113-127,
    y 412-456). They are single and stacked vertically, never a side-by-side pair, so they read as bark. Accepted.
  - A few small brown flecks lie on the hill near the one tree's foot (at about x 597-690, y 510). They are leaf-like, not
    fruit, and about 6-8 px at play size. Accepted. Do not let a regeneration turn them into round coloured shapes.
  - The `bloom` leaf carries a small column of cobalt lozenges. They are small repeated ornament with no dot or ring,
    like Nuh's cloths. Accepted.
  - The cat is approved: closed eyes, calm, whole, no cushion.

Sign-off line: `Art gate: prompts reviewed 2026-11-12 (scholar); contact sheet reviewed 2026-11-12 (scholar) - 19
approved; SHOULD: remove the ≡ bark marks from plate-garden-port / plate-dim-port.`

### 3, build: PASS WITH FIXES
1. **MUST: no fruit may hang on, or touch, the one tree.**
   - `UI/games/adam/adam.js:40`, `LAYOUT.port.fruits[2] = [262, 452, 70, 'pomegranate']`, places that pomegranate
     (box about x 227-297, y 412-492) on the upper-left edge of the one tree's crown. The crown spans about x 220-480,
     y 430-645 in `plate-garden-port`.
   - Mirrored in Arabic, it sits on the crown's upper-right edge. See `shots/phone-en-01-start.png` (around 285, 580),
     `phone-en-02-fruit-2.png` and the AR phone strip.
   - In `phone-en-02` it is the *next fruit*, with the focus glow on it, so the game invites the child to take a fruit
     from that tree. This breaks the gate-1 rule this whole game rests on: the one tree has no fruit and the child never
     takes from it.
   - Fix: move that fruit onto the pomegranate tree's own leaves, clear of the crown. The whole sprite must lie left of
     about x 205 at that height, and below the long intro ribbon (y ≥ about 420). Alternatively, give it to the fig tree
     right of x 495.
   - Add a check to the play-through: in both layouts, no fruit sprite box may intersect the crown. Re-shoot
     `phone-{en,ar}-01/02`.
   - Landscape is clean: every fruit is left of x 340 or right of x 994, and the tree box is x 455-795.
2. **MUST: remove the mercy glow and its motes.**
   - Code: `adam.js:438` `app.classList.add('mercy'); Atmos.motes([L.w / 2, L.h * 0.45], 6);` and
     `UI/games/adam/adam.css:183` (`radial-gradient(... at 50% 45% ...)`).
   - Both are centred on the one tree's crown: (620, 356) in landscape and (345, 594) in portrait, against tree-box
     centres of (625, 310) and (350, 600). In `shots/tab-en-08-forgave.png` the forbidden tree is the thing that lights up,
     with bright points inside its crown.
   - Designer Q1 asked whether this light is acceptable. My answer is no, for three reasons:
     - (a) It honours the very tree of the slip, at the moment of forgiveness.
     - (b) A light that rises exactly as "Allah forgave them" is read becomes a picture of Allah's act. The Musa ruling
       stands: no light is ever connected to Allah.
     - (c) The light follows the child's tap on **We read it together**, so the family's tap seems to produce the
       forgiveness.
   - Fix: delete the `mercy` class add (`:438`) and its removal (`:442`), the motes call on `:438`, and the
     `.mercy .dim` rule (`adam.css:182-183`).
   - The beat then shows the page's words over the still dim garden, and the crossfade to the earth at dawn
     (`:442`) carries the hope. Do not replace it with a warming of the garden: gate 1, NOTE 3, rules out "the light came
     back to the garden".
   - Update the round description (step 6) and designer Q1 in this file to match.
3. **SHOULD: no win chime for reading the dua.** `adam.js:438` plays `sfx('done')`, the same two-note chime as the
   mending and the reward, straight after **We read it together**. Use `sfx('soft')` (one tone) or nothing there, so
   reading the dua is never scored (gate 1: never a score mechanic). The bead advance is progress and can stay.
4. **SHOULD: re-cut the AR earth clip end.**
   - `adam.js:114` `earth: { ..., ar: [0, 10.44] }`: 10.44 lies in the closure of «أنتَ», before its release (see the
     table above).
   - Change it to `[0, 10.82]`, inside the 10.75-10.89 pause. The 80 ms fade then falls on 10.74-10.82, which is a
     breath (-37 to -46 dBFS).
   - Re-check with Whisper (RAM gate, heavy lane) that the clip ends on «أنت» and nothing of «نحن» is heard. Update the
     cut table above.
5. **Designer Q2, the sleeping cat:** **approved**.
   - A visibly sleeping cat makes the unfairness concrete for a 5-year-old. Blaming an animal that did nothing is
     wrong, and the text says so plainly: "not fair, and not true".
   - The soft glow round the cat (`adam.css:280`) is a drop-shadow outline, not a ring over its head. Keep it that way.
6. **Designer Q3, gathering fruit in Jannah:** **approved, once MUST 1 is applied.**
   - 2:35 «وكلا منها رغدا حيث شئتما»: everything except the one tree was theirs to enjoy, and naming each fruit is
     harmless.
   - The approval depends on every fruit plainly hanging on an allowed tree.
7. **Designer Q4, AR intro «عشا»:** **acceptable. Keep the clip as cut.**
   - The cut starts 280 ms before the word. «عاشا» starts at 3.56 s, after the true gap (3.52-3.55), so the whole word is
     in the clip.
   - Whisper's short-a spelling of a 2.7 s isolated clip is a transcription artefact, not a truncation.
   - Optional: starting at 3.52 instead of 3.28 would drop the quiet breath. Not required.
8. **Dua 7:23: confirmed.** It is shown byte-identical to the story page and never voiced (re-checks above).
9. **Checked and approved:**
   - The child never causes a miracle or leads: watering and "It grew!" are ordinary.
   - No X or cross shapes in the HUD or icons, the pot outline or the shards.
   - No script-like marks beyond the SHOULD in 2b.
   - No eye-like orb beyond those already ruled on.
   - No face in any sky: the clouds are plain.
   - The shamsa is the one approved on Nuh (`:613-614`).
   - No music: the chimes are 659/988 and 523/784 Hz.
   - The "hide" gloom and its text are approved.
   - "Back to the story" goes to `../story-prophet-adam.html`.

### Linking verdict
**Do not link yet.** Link from the end of `story-prophet-adam.html` when:
1. 3.1 (fruit off the one tree) and 3.2 (no mercy glow or motes) are applied, and I have checked the re-shot phone and
   tablet frames, EN and AR, for the garden start, the next fruit, and the forgave beat.
2. 3.3, 3.4 and the 2b SHOULD (≡ marks) are recommended and do not block linking.

## Fixes after gates 2-3
`kids-game-designer`, 2026-11-12, on the uncommitted working tree (still unlinked and uncommitted).

| Item | Fix |
|---|---|
| 3.1 MUST: a pomegranate on the one tree (phone) | `LAYOUT.port.fruits` moved: every fruit hangs on the pomegranate tree's or the fig tree's own leaves, below the intro ribbon (current table: `adam.js:41`). Each layout now carries the one tree's crown box (`crown`, land [445, 105, 805, 380], port [215, 430, 490, 665]), and the play-through measures every rendered fruit box against it: `crownCheck.clear: true`, no hits, in all seven runs (tablet and phone, EN and AR, keyboard, reduced motion). |
| 3.2 MUST: the mercy glow and motes | Removed: no `mercy` class, no `.mercy .dim` rule, no motes at that beat. The page's sentence is read over the still, dim garden, then the crossfade to the earth at dawn. Step 6 and designer Q1 above are updated. |
| 3.3 SHOULD: win chime after the dua | `sfx('done')` -> `sfx('soft')` (one tone). The bead advance stays. |
| 3.4 SHOULD: AR earth clip end | `ar: [0, 10.82]`, inside the 10.75-10.89 pause; the 80 ms fade falls on a breath (-42 to -48 dBFS). Whisper large-v3-turbo under the RAM gate: the clip ends on «أنت» (10.08-10.48), nothing of «نحن». Cut table updated. |
| 2b SHOULD: the ≡ bark marks | `plate-garden-port` is now a recorded Qwen edit (seed 699657) of the approved r2c render 419717 that only makes the two tall trunks plain bark; `plate-dim-port` is the same recorded DIM_EDIT re-run on the new master (seed 239281, registered, no doubling in a 50/50 blend). The earth at dawn (1713284) is kept as approved. The portrait world is now 690 x 1327 (the edit's frame crops 8 px taller); `LAYOUT.port` was re-measured on the new plate (the crown and the trees did not move). Every prompt, seed and input is in `adam.py` and `game-adam-art.md`; contact sheet regenerated. |

**Checks after the fixes:** `node --check`; seven play-throughs on a separate test server (port 8766; the owner's 8765 was left
running), all complete: no console errors, no scroll, no request outside localhost, focus ends on "Play together again".
All six verifiers pass; the scripture diff passes (22/22); `verify-no-recitation --transcripts` on 153 strings: 0 flagged.
Art: 19 WebP, 948 KB.

**Re-shot frames for the scholar** (`/private/tmp/claude-501/-Users-hishamabuella-Work-Interactive-Islamic-kids-website/e8e68c51-18d1-4a2c-bedb-40bde535d502/scratchpad/adam-game/shots2/`):
`{tab,phone}-{en,ar}-01-start.png`, `-02-fruit-2.png`, `tab-en-08-forgave.png`, `phone-en-08-forgave.png`,
`tab-ar-07-forgave.png`, `phone-ar-07-forgave.png` (AR is one step shorter: the rule was heard early); the keyboard and
reduced-motion runs `kb-*`, `tab-ar-rm-*`; side-by-side strips `refix-tab.png`, `refix-phone.png` one folder up.

## Fixes after gates 2-3
`kids-game-designer`, 2026-11-12, on the uncommitted working tree.

| Item | Fix |
|---|---|
| 3.1 MUST: a pomegranate on the one tree (phone) | `LAYOUT.port.fruits` re-measured on the new portrait master: three pomegranates on the pomegranate tree's own leaves (all left of x 205 where they reach the crown's height) and two figs on the fig tree (right of x 490). Each layout now records the crown box (`crown`: land [445,105,805,380], port [215,430,490,665]) and the play-through checks, on the rendered DOM, that no fruit box touches it: `crownCheck.clear: true` in all seven runs (tablet and phone, EN and AR, keyboard, reduced motion). |
| 3.2 MUST: the mercy glow and motes | Removed: no `mercy` class, no `.mercy .dim` rule, no motes at the forgiveness beat. The page's sentence is read over the still, dim garden; the next tap crossfades to the earth at dawn. Step 6 and designer Q1 above are updated. |
| 3.3 SHOULD: no win chime after the dua | `sfx('done')` became `sfx('soft')` (one tone). |
| 3.4 SHOULD: AR earth clip end | `[0, 10.82]`, inside the 10.75-10.89 pause (-48 dBFS at the cut). Whisper large-v3-turbo under the RAM gate: «... بما فيهم أنت», «أنت» 10.08-10.48, nothing of «نحن». Cut table updated. |
| 2b SHOULD: the ≡ bark marks | `plate-garden-port` is now a recorded Qwen edit (seed **699657**) of the approved r2c render 419717 that only makes the two tall trunks plain bark; `plate-dim-port` is the same recorded DIM_EDIT re-run on the new master (seed **239281**). The earth at dawn (1713284) is kept as approved. Old renders kept in `UI/art-raw/adam/rejected/`. The new portrait world is 690 x 1327 (was 1319); `LAYOUT.port` was re-measured. Art: 19 WebP, 948 KB. |

**Checks after the fixes:** rebuilt with `_src/build.py`; `node --check`; seven play-throughs (port 8766) all complete with no console errors, no scroll, no request outside localhost, focus on "Play together again", restart in the garden; all six site verifiers pass; the scripture diff passes (22/22).

**Re-shot frames for the scholar** (`/private/tmp/claude-501/-Users-hishamabuella-Work-Interactive-Islamic-kids-website/e8e68c51-18d1-4a2c-bedb-40bde535d502/scratchpad/adam-game/shots2/`):
`phone-en-01-start.png`, `phone-en-02-fruit-2.png`, `phone-en-08-forgave.png`, `phone-ar-01-start.png`,
`phone-ar-02-fruit-2.png`, `phone-ar-07-forgave.png`, `tab-en-01-start.png`, `tab-en-02-fruit-2.png`, `tab-en-08-forgave.png`,
`tab-ar-01-start.png`, `tab-ar-02-fruit-2.png`, `tab-ar-07-forgave.png` (the AR forgave beat is frame 07 because the tree
was heard early in that run). Every other stage of every run is in the same folder.

**Linking:** not done; waiting for the scholar's look at these frames. Not committed.

## Scholar sight-check (2026-11-13)
`islamic-content-scholar`, read-only, on the uncommitted working tree. I checked the re-shot frames in
`scratchpad/adam-game/shots2/` and the two summary strips (`fix-phone-start.png`, `fix-forgave.png`), and I re-read the
code. Verdict: **CLEARED TO LINK.**

- **3.1 MUST, fruit off the one tree: fixed.**
  - `adam.js:41`: the pomegranates are at x 62, 105 and 165, and the figs at x 530 and 612. In
    `phone-en-01/02` and `phone-ar-01/02` (mirrored), every fruit hangs among its own tree's leaves.
  - A clear band of sky separates every fruit from the one tree's crown, and the next fruit with the focus glow is on the
    pomegranate tree.
  - `crownCheck` reports `clear: true, hits: []` in all seven runs (`shots2/report-*.json`).
- **3.2 MUST, the mercy glow: fixed.**
  - `adam.js:438-442` now has no `mercy` class and no motes, and `grep mercy` finds nothing in `adam.js` or `adam.css`.
  - In the forgave frames (`tab-en-08`, `phone-en-08`, `tab-ar-07`, `phone-ar-07`), the page's sentence sits over the
    still, dim garden. The one tree is not lit, and no point of light appears anywhere.
- **3.3 SHOULD: done.** The beat now plays `sfx('soft')`, a single tone, so reading the dua is not scored.
- **3.4 SHOULD: done.**
  - `adam.js:114` is now `ar: [0, 10.82]`. That point lies inside the 10.75-10.89 pause I measured, so «أنتَ» is now whole.
  - The designer's Whisper check under the RAM gate found nothing of «نحن» in the clip.
- **2b SHOULD, the ≡ marks: done.**
  - The new `plate-garden-port` (Qwen edit, seed 699657) and `plate-dim-port` (seed 239281) have plain, smooth trunks. I
    checked both trunks at 3x.
  - Viewed at 100%, the edits introduced no new mark, cross, eye-like shape or script.
  - The one tree is unchanged: plain leaves, no fruit, nothing beneath it.
  - The pomegranate and fig trees and the river are as approved.
- **Unchanged and re-confirmed:**
  - Dua 7:23 is still byte-identical to `story-prophet-adam.html` (both copies, after the rebuild).
  - No TTS, and no slide 7, 8 or 11.
  - `verify-no-recitation.py --self-test` passes.
- **Housekeeping (not a ruling):** the section "Fixes after gates 2-3" appears twice in this file, as two versions of the
  same table. The designer may want to keep only the second.

Link it from the end of `story-prophet-adam.html` the same way as the Ibrahim game.
