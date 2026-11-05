# Game spec: Ayah Lanterns (mockup 07)

Status: MOCKUP at `UI/mockups/games/07-ayah-lanterns.html`. Needs sign-off from the scholar and the learning designer.

- **Learning goal:** After playing, the child can put the whole ayat of Surah Al-Ikhlas (and, as a harder tier, Al-Fatiha) in their correct order and say what each one is about.
- **Age band:** 5-8 for Al-Ikhlas with helpers; 8-11 for Al-Fatiha or the "Arabic only" tier.
- **Tied to:** `surah-al-ikhlas.html`, `surah-fatiha.html`.
- **Core loop:** listen to (or read) an ayah, find the lantern that holds it, and hang it on the string in order. The courtyard brightens with each lantern.
- **Round:** pick a surah and a help level. The lanterns are dealt shuffled (never already in order). The child taps or drags each one to the string. A correct lantern flies into its slot, lights, chimes one step higher, and plays the site's narration of that ayah's meaning. At half-way comes a parent pause card. When the string is full, the whole surah is shown in order to recite together, with the page's closing line.
- **Whole ayat only.** Words are never scrambled. Bismillah is ayah 1 of Al-Fatiha, following the site's counting.
- **Failure (hint ladder):** 1st wrong: "Not yet — that ayah is waiting for its turn" plus a first-ayah cue. 2nd: the next ayah's meaning is played ("which lantern holds it?"). 3rd (4th on the harder tier): the right lantern glimmers. The wrong lantern swings back. No penalty, and no counter is shown.
- **Pause point:** the page's own parent question ("Can you tell me one thing this surah says about Allah?" / "Which line are we asking Allah for something in?").
- **Difficulty ramp:** Al-Ikhlas (4) is followed by Al-Fatiha (7). "With helpers" shows the EN meaning on each lantern; "Arabic only" hides it and delays the glimmer.
- **Audio:** `UI/audio/<surah>/<lang>/verse-N.mp3` exists for both surahs. Note these files are narrations of each ayah's **meaning and explanation**, not recitations. If a file fails to load, speech synthesis reads the meaning, as the site's `surah-narration.js` does.
- **EN/AR/RTL:** the string runs right to left in AR. In AR the cards show only the ayah, since the meaning is heard rather than printed.
- **Accessibility:** every lantern is a `<button>` (tap or Enter places it), and drag is optional. The listen buttons are 48px. Esc closes the pause card. Reduced motion skips the flight animation. Bedtime mode softens colours and halves chime volume.

## Guardrail checklist
- [x] Ayah text copied character-for-character from the surah pages (verified by script: every diacritised Quran string in the file is a substring of a site page).
- [x] Whole-ayah sequencing only (the brief's "safe default").
- [x] No figures. No music, only chimes with a mute toggle.
- [ ] Scholar: approve verse-order sequencing for Al-Fatiha in game form, and the hint "The first ayah starts with a command: Say!"
- [ ] Owner: should the game use a **recitation** audio track (none exists on the site) instead of the meaning narration?

## Scholar gate 1 (spec), 2026-11-04
Ruling: `claudeteam/reviews/game-islamic-review-2026-11-03.md` (verdict for this game: **APPROVED WITH FIXES**). All fixes below were applied by `kids-game-designer` on 2026-11-04. Gate 1 closes when the scholar confirms them. Gate 2 (art) and gate 3 (build) are still open.

| # | Ruling (severity) | Resolution |
|---|---|---|
| 1 | MUST: the fallback has TTS read the Quran's Arabic (`speak(s.ayat[i].ar)`) | Done. `playAyah` never passes `ayat[i].ar` to speech: EN falls back to the English meaning, AR stays silent (there is no Arabic meaning text in the game). `speak()` also strips any `.quran` span and «...» quote before speaking, so the Arabic hint «قُلْ» is never voiced. |
| 2 | SHOULD: chimes play over ayah audio; rising "pentatonic" chime and 3-step finale are melodic | Done. One fixed two-note chime (659 + 988 Hz) replaces the rising `STEPS` run. `playAyah` waits until the last chime has faded; `tone()` is silent while ayah audio plays; the finale chime plays only after the last ayah's audio ends; the tap tone on the 🔊 button is removed. |
| 3 | NOTE: recitation only from a licensed human qari | Recorded in the header comment; no recitation added. |
| 4 | NOTE: 112:3 wording | Site-level suggestion; the game keeps the verified page text. |
| 5 | Guardrail: a Quran card never gets a "wrong" sound or wobble | Done (found in this pass): the `softNo` buzz on a misplaced lantern is removed, and the swing/wobble animation is now a soft lift as the lantern floats back to its tray. |
