# Islamic Kids — TODO

What is true, and what is left. This file merges the original UI-polish backlog with the findings
of the full-site team review of **2026-09-03** (`ceo`, `islamic-content-scholar`,
`arabic-language-reviewer`, `link-integrity-auditor` + `audio-narration-engineer`,
`accessibility-auditor` + `frontend-lead`, `kids-learning-designer`).

Full evidence with `file:line` citations is in `claudeteam/log_chat/*.log`.

**What this project is:** a father reading Islamic stories and Quran to his own son, at home, with
full control over what his son sees. Priorities below are ranked by what *that* father and *that*
son would actually notice.

---

## Verified correct — the assurance side

Worth stating plainly, because it is the point of the whole exercise:

- **The scripture is sound.** Every verse card and every complete-surah block across all 19
  surah pages diffs clean against `api.alquran.cloud` simple-script text, and Ayat al-Kursi's 8
  phrase-cards concatenate to 2:255. This is now a script — `scripts/verify-scripture.py` — so it
  is re-run rather than re-argued. It compares in two tiers: the consonantal letters must match
  exactly, while diacritic differences are reported but allowed, because the pages legitimately
  mix orthographic styles (the Uthmani script omits a sukun where the simple script writes one,
  and shows idgham with a shadda). Both render as the same recitation. No critical or major
  findings.
- **Al-Fatiha now follows the standard Hafs counting** — Bismillah is verse 1, the final verse is
  whole, the badge says 7. Verified and holding.
- **All 10 hadith trace to authentic sources** (Bukhari, Muslim, Tirmidhi, Abu Dawud, Nasa'i) with
  faithful paraphrases. No fabricated or misattributed hadith.
- **Aqeedah is sound** — the Kursi explanation, Al-Ikhlas's negations, and the Ibrahim
  star/moon/sun episode are all consistent with mainstream Sunni tafsir.
- **All 25 YouTube embeds are live** as of 2026-09-06, re-checked via the oEmbed endpoint
  (re-check every pass — three died before).
- **Narration scripts are consistent**, and this is now a script: `scripts/verify-narration.py`
  checks all five stories (EN == AR == generated files) and every surah page (verse cards ==
  files, flagging a *partial* set, which would stop mid-read). Re-checked 2026-09-11: all five
  stories in step, every surah page fully voiced except Al-Qari'ah, which is knowingly on
  speech-synthesis until the quota resets.
  The slide count is deliberately *not* in that script: `stories.js` assembles slides at runtime,
  so it only exists in a browser. Measured there — adam 18, ibrahim 16, musa 20, nuh 16, each
  equal to its script count with no slide left unscripted. Yusuf is `classic-scroll` by design
  and builds no slides at all; its narration plays through its 17 scripts in order regardless,
  confirmed by watching it request `slide-0.mp3` and start. A checker that counted slides
  statically would have reported Yusuf as broken; it is not.
- **The Arabic is trustworthy** — natural, warm MSA with correct dual agreement and consistent
  terminology; nested inline markup round-trips; no hardcoded English left in the JS.

---

## Fixed in this pass (2026-09-03)

- [x] **Al-Fatiha joined the Quran ring.** It dead-ended to Home/Stories; the first surah a child
      learns was outside the chain. Both chains are now complete and symmetric (verified).
- [x] **Story chain repaired.** Nuh and Musa both pointed "next" to Yusuf, so Musa was unreachable
      by the chain. Order now matches the hub: adam → ibrahim → nuh → yusuf → musa.
- [x] **`ٱقْرَأْ` hero contrast.** `--gold` on parchment was 2.82:1, failing even the 3:1 large-text
      bar. Now `--gold-text` at 5.06:1.
- [x] **30 Arabic strings in `translations.js`** had punctuation hard-coded at the *front*
      (`!اضغط...`) as an RTL workaround. Moved to the end.
- [x] **`data-ar` / `data-i18n` conflict** on the Adam page: 9 elements carried both, so the older
      system clobbered the newer value on every switch. `data-ar` removed from those 9.
- [x] Prophet Yaqub given his honorific in visible text.
- [x] `class="hadith"` mislabels corrected with `.quran-quote` (a Quranic verse) and
      `.scholar-quote` (an athar of ash-Shafi'i), documented in `surah.css`.

---

## P0 — do next

**Quiz bilingual audit (2026-09-03): 63 questions / 252 options reviewed in both languages.**
Parity is 100% — 60 questions carry `data-ar`, the 3 on the Adam page are covered by `data-i18n`.
Every question has exactly one correct option and no duplicate choices, and the correct answer is
the same answer in both languages throughout. Fixed in that pass:
- Three "what does X mean?" questions answered themselves once the page was Arabic
  (`ماذا تعني كلمة "الفاتحة"؟` → `الفاتحة`). Al-Fatiha, Al-Falaq and An-Nas now use real glosses,
  and near-synonym distractors ("The Closing"/"The End") were replaced in both languages.
- `surah-al-maun.html` glossed the distractor "The Daybreak" as `الفلق` (a surah name) instead of
  `الصبح` (the meaning).
- `surah-al-asr.html` Q2 asked what Allah swears by ("Time") — the same answer as Q1, so it was
  free once Q1 was answered. Replaced with a question on the surah's core message.


- [x] ~~**Quiz answers are guessable from length.**~~ Fixed 2026-09-04. (The *position* tell was
      a separate, larger problem, found and fixed 2026-09-06 — see the regressions section.)
      Fixed 2026-09-04. Was 39 of 63 (62%) with
      the correct answer strictly longest, against 25% expected by chance. Now **2 of 63 (3%)
      longest and 5 (8%) shortest, with 89% mid-range** — neither extreme is a usable signal, and
      the tell was checked in both directions so it is not merely inverted. 70 distractors were
      rewritten across both languages, lengthened into more plausible wrong answers rather than
      trimming correct ones, which would have cost teaching value.
      The handful left are deliberate: gaps of 1–2 characters that no child could exploit, and
      fixed terms like "Ameen" and one-word meanings like "Time" that cannot be padded without
      damaging them.

- [x] ~~**Prophet Musa has no narration audio.**~~ Generated 2026-09-05, EN and AR (7,770
      characters). All five stories now have complete narration: slide count == EN == AR ==
      audio-file count for every one.

- [x] ~~**Scroll-reveal hides content with no fallback.**~~ Fixed 2026-09-03. `surah.js` now only
      hides cards when it can guarantee something will bring them back (IntersectionObserver
      present and reduced-motion not requested), and a new `@media print` block forces
      `opacity: 1 !important`, which beats the inline style. Printing a surah to read aloud now
      works whether or not the page was scrolled. Both paths verified in a browser.
- [x] ~~Decide the YouTube question.~~ **Decided 2026-09-03: keep YouTube for now, revisit later.**
      Moved to P2 below. Do not re-open this in a review — it is a known, accepted risk, not an
      oversight.

---

## P1 — soon

**Learning**
- [x] ~~**Staged memorization ("training wheels")**~~ — built 2026-09-05 on all 11 Quran pages.
      **Read** shows everything, **Practice** drops the transliteration, **Recite** leaves only the
      Arabic with the meaning one tap away. The stage is remembered per surah, so a child who has
      moved on does not land back on Read every night. Verified each stage in a browser.
      Note: in Arabic mode Read and Practice look the same, because transliteration is already
      hidden there by design — an Arabic reader does not need it.
- [x] ~~**Progress state on the Quran hub**~~ — built 2026-09-05. Every surah card carries a state
      the child sets themselves (not started → learning → memorized), with a counter and a
      "pick up where you left off" link to the surah currently being learned. Stored on the device
      only; no account, nothing leaves the browser. Also removed the stale "NEW" ribbons, which
      were on two arbitrary cards and are now redundant. Verified in a browser, including that
      tapping a badge inside a card link does not navigate.
- [x] ~~**Ayat al-Kursi sat at position 2**~~ — moved to last, as a graduation piece, 2026-09-05.
      Hub card order and the full prev/next chain were rewritten together and verified symmetric:
      Fatiha → Al-Ikhlas → Al-Falaq → An-Nas → Al-Kawthar → Al-Asr → An-Nasr → Al-Kafirun →
      Al-Maun → Quraysh → Ayat al-Kursi.
- [x] ~~**Parent affordances**~~ — built 2026-09-05. Every surah page now ends with a card written
      to the adult, not the child: one **question to ask** at the pause and one **line to finish
      with**, both specific to that surah and in both languages. The resume point is covered by the
      memorization map's "pick up where you left off" link.

**Accessibility**
- [x] ~~`.nav-toggle` ~34×27px, `.lang-toggle-btn` ~37px~~ — both now 44px (lang button measured
      at 82×44 in-browser). Fixed 2026-09-03. **Six more controls were still under the floor and
      were fixed 2026-09-07** — see the regressions section. Every visible control on all five
      page types now measures ≥44px at desktop and at 375px.
- [x] ~~Fullscreen button had `title` but no `aria-label`~~ — now labelled, and translated via a
      new `fullscreenToggle` key. Fixed 2026-09-03.

- [x] ~~Two `<h1>`s per page~~ — the site wordmark is now a `<span class="logo-text">` on all 19
      pages, so each page has exactly one `<h1>`, its own title. Fixed 2026-09-03.
- [x] ~~`prefers-reduced-motion` missed the scroll-reveal opacity~~ — now part of the guard above.
      Fixed 2026-09-03.
- [x] ~~No `aria-hidden` anywhere~~ — 344 ornamental elements silenced across all 19 pages
      (floating stars, crescent, section icons, scene illustrations). `verse-number` and
      `fact-number` were deliberately left announced: they carry real information. Fixed 2026-09-04.

**Frontend**
- [x] ~~**325 hardcoded hex values** across the four page-type sheets~~ — 303 tokenised
      2026-09-04, leaving 22 (the reserved red, plus true one-offs). Ten recurring shades that had
      no token gained one: `--card`, `--gold-ink`, `--gold-ink-strong`, `--gold-wash`,
      `--parchment-warm`, `--rule-warm`, `--cobalt-deep`, `--cobalt-mid`, `--cobalt-pale`,
      `--cobalt-wash`. Every replacement was hex → token of the identical value; verified in a
      browser that computed colours are unchanged and no token is undefined.
- [x] ~~`surah.css` has zero `html[lang="ar"]` overrides~~ — the "34 LTR-assuming rules" was an
      overcount; only 4 were directional and 3 needed mirroring. `.intro-card`,
      `.intro-card.highlight` and `.did-you-know` now flip their accent stripe to the reading
      edge (the rest were already covered cross-file by `stories.css`). Verified by toggling
      language in a browser. Fixed 2026-09-04.
- [x] ~~`.lang-toggle-btn` defined twice~~ — the `stories.css` copy is deleted, so the control no
      longer diverges by page type and the 44px target applies everywhere. Fixed 2026-09-04.

**Bilingual**
- [x] ~~Narration does not react to a mid-slide language switch~~ — `audio-narration.js` now
      listens for `languageChanged` and, if narration is playing, restarts the current slide in
      the new language. Fixed 2026-09-04.
- [x] ~~`index.html` hero CTAs had no `data-ar`~~ — "Start a story" / "Learn a surah" now
      translated. Fixed 2026-09-03.
- [x] ~~Arabic nav labels lost their direction arrows~~ — 8 story nav labels now carry an arrow
      pointing the RTL way. Fixed 2026-09-04.
- [x] ~~Double-escaped entities inside `data-ar`~~ — 3 fixed across `index.html` and
      `ayat-al-kursi.html`. Fixed 2026-09-03.
- [x] ~~Quiz score used a Western digit beside Arabic-Indic totals ("أجبت 3 من ٤")~~ — the score
      is now converted to Arabic-Indic when the page is in Arabic. Fixed 2026-09-03.
- [x] ~~Prophet honorifics missing from visible text~~ — Adam and Ibrahim now carry them in their
      visible titles, in both languages. All five story pages are consistent. Fixed 2026-09-04.

**Read-aloud**
- [x] ~~Rewrite the sentences that trip a parent reading aloud~~ — Al-Fatiha's verse 7
      explanation is now four short sentences, and Al-Maun's rhetorical aside became a real
      **"Ask your child:"** prompt with a line break — the first instance of the parent
      affordance below. Fixed 2026-09-04.
- [x] ~~`ayat-al-kursi.html` presented a scholarly-disputed hadith with full certainty~~ — now
      "It is also reported that…" with a one-line note that scholars differ, in both languages.
      Fixed 2026-09-04.

---

## P2 — content roadmap

See `plan.md` for the full list. Immediate:

- [ ] **Revisit the YouTube dependency** (decided 2026-09-03: keep for now). All 16 pages embed
      videos the owner does not control, on plain `youtube.com/embed` with no `rel=0`, no
      `modestbranding`, not `youtube-nocookie.com` — so a child gets end-screen recommendations
      from any channel, a "Watch on YouTube" escape, and ads. Three have already died silently.
      *Ranked options when revisited:* (1) drop video and lean on the site's own ElevenLabs
      narration — `ceo` recommendation; (2) self-host the video; (3) the father records his own
      narration; (4) `youtube-nocookie.com` + `rel=0` — a ~10-minute bandage that reduces
      recommendations and tracking but stops neither deletion nor ads.
      **Meanwhile:** re-check all 25 embeds every review pass — they rot without warning.
      Checked 2026-09-06: all 25 live.

- [x] ~~**Surah Al-Masad (111)**~~ — built 2026-09-05, completing Phase 2. Framed around
      *choice* rather than punishment: Abu Lahab had wealth and was the Prophet's own uncle, and
      none of it helped him because of what he chose. The fire is stated once, as the Quran states
      it, without dwelling. Arabic verified verse-by-verse against alquran.cloud; embed checked
      live; chain and hub updated (Quraysh → Al-Masad → Ayat al-Kursi).
- [x] ~~**Narration for surah pages.**~~ Built and generated 2026-09-05.
      Story pages are slide-based, so a scroll page needed a different unit: **the verse**. Each
      verse card has its own Listen button, plus one control that reads the whole surah verse by
      verse. The spoken text is taken from the page itself — the translation and the explanation
      beside it — so narration cannot drift out of sync with what is written, and it falls back to
      the browser's own speech synthesis wherever a file is missing.
      **All 12 surahs, both languages: 122 files** (61 EN + 61 AR).
      My earlier "79,323 characters, does not fit" estimate was wrong — it costed narrating whole
      pages. Per-verse is 23,682, and the actual charge was lower still.

- [x] ~~Phase 3 surahs~~ — **all ten done.** Al-Fil and Az-Zalzalah (2026-09-05); Ad-Duha,
      Ash-Sharh, At-Tin, Al-Humazah, At-Takathur and Al-Qari'ah (2026-09-06); Al-Adiyat and
      Al-Bayyinah (2026-09-11). The Quran section is now **22 pages**.
      Al-Bayyinah needed the most care: its verse 6 names a group and a punishment, so the page
      says plainly, in both languages, that this is about *the choice to reject the proof after
      seeing it clearly* — not about anyone's family or people. The fire is stated once, as the
      Quran states it, and the surah's weight is put where it belongs: verse 5 (sincerity,
      prayer, zakah) and the ending where Allah is pleased with them and they with Him.
      Note on budget: each new surah costs ~1,900-2,700 ElevenLabs characters for its per-verse
      narration in both languages, and the ElevenLabs counter **settles behind actual use** — it
      has now been watched drifting down twice after a batch (7,702 → 5,414, then 5,414 → 3,264).
      Re-read the real balance immediately before generating, and keep the `--budget` hard stop.
      The pipeline is now three scripts, so a surah is a content spec rather than 400 hand-written
      lines: `scripts/specs/<name>.py` holds the content, `scripts/build-surah.py` renders it
      through `scripts/surah-page-template.py`, and `scripts/build-narration-plan.py` reads the
      finished page back to produce the narration plan.
- [x] ~~**Surah Ad-Duha (93), Ash-Sharh (94) and At-Tin (95)**~~ — built 2026-09-06 from the
      generator. Chosen together because they run consecutively in the mushaf and carry one
      thread a child can hold: Allah has not left you (Ad-Duha), the ease comes *with* the
      hardship (Ash-Sharh), and you were made in the finest form (At-Tin). Ad-Duha's verse 7
      is glossed as "not yet knowing the way", the mainstream reading, rather than anything
      that would suggest error in a prophet.
      Verified: all 27 verses and the three complete-surah blocks diff clean against
      alquran.cloud; embeds live; each quiz has exactly one correct option per question with
      full EN/AR parity; chain re-verified symmetric across 17 pages; narration generated for
      both languages (54 files, 7,160 characters). Stage picker, bedtime mode, language toggle
      and per-verse audio all exercised in a browser.

- [x] ~~**Narration for Al-Qari'ah, Al-Adiyat and Al-Bayyinah**~~ — generated 2026-09-23, after the
      quota reset. All three in one batch as planned: **60 files** (30 verses × EN + AR),
      **8,361 characters**, none skipped, against a 33,264-character allowance that had reset to
      zero used. `verify-narration.py` now reports all 22 surah pages complete — no page is on the
      speech-synthesis fallback any more. Scripture, chain and quiz verifiers all still pass.
      The counter lag is confirmed again: it read 956 immediately after an 8,361-character run,
      so keep reading the real balance before a batch rather than trusting the last figure seen.

- [x] ~~**Surah Al-Humazah (104), At-Takathur (102) and Al-Qari'ah (101)**~~ — built 2026-09-06,
      the warning surahs, framed the way Al-Masad was: around the *choice*, with the fire named
      once as the Quran names it and no dwelling. Al-Humazah is really an anti-mockery surah and
      lands closest to a child's day — it is the one that says words reach the heart. At-Takathur
      ends on being asked about blessings, so it is framed as gratitude rather than dread, using
      the report of dates and cool water. Al-Qari'ah turns on the scales: mountains weigh nothing,
      a kind word weighs something.
      Verified: all 28 verses and three complete-surah blocks diff clean against alquran.cloud;
      all 25 embeds live; chain symmetric across 20 pages; each quiz one correct option per
      question with full EN/AR parity. Narration generated for Al-Humazah and At-Takathur
      (34 files, 4,282 characters); Al-Qari'ah's is pending above.

- [ ] **Re-voice the English narration in the owner's own cloned voice** — decided 2026-10-01,
      then **deliberately deferred** so the illustration work could land on its own. Do not
      re-open the *choice*, only the scheduling.
      The ElevenLabs account has a cloned voice **Hisham** (`pusofH2Ro5Ny4RH6qBEO`, category
      `cloned`, labelled `en`). Samples were generated in English and in Arabic and listened to;
      the verdict was **English in that voice, Arabic left exactly as it is.** An English clone
      reading Arabic was not worth the trade, and the account already carries two professional
      Arabic voices (`Ahmed - Warm & Classic`, `Hanafi`) if the Arabic is ever revisited.
      Both generators hardcode Sarah (`EXAVITQu4vr4xnSDxMaL`) today:
      `scripts/generate-audio-elevenlabs.js` (stories, slide-indexed) and
      `scripts/generate-surah-audio.js` (surahs, verse-indexed). Only the **en** side changes;
      the `ar` entry in each must be left alone.
      Budget, measured 2026-10-01 — this does not fit in one cycle:
      stories EN 17,035 / AR 12,551; surahs EN+AR 46,929; everything 76,515, against a
      33,264-character monthly allowance. **Order agreed: the five stories in English first**
      (17,035). Re-read the live balance immediately before starting — the counter settles
      upward after a batch, so the figure on screen understates what has already gone.

- [ ] Phase 1 stories: Prophet Isa, Prophet Muhammad ﷺ.

---

## P3 — original UI backlog

Carried over from the previous version of this file. Completed items are kept for the record.

- [x] Fullscreen mode, slide transitions, larger nav buttons, progress indicator, slide counter
- [x] Animated backgrounds, floating controls, swipe gestures, exit button
- [x] ~~**Scene-specific themes**~~ — built 2026-09-05. Each of the 43 story scenes carries a
      `data-mood` (dawn, night, water, fire, earth, garden) chosen from what actually happens in
      that scene rather than cycled mechanically. Each is a wash over the existing card, so the
      manuscript ground shows through and text colour — and therefore contrast — is untouched.
      Mirrors for RTL.
- [x] ~~**Character illustrations** instead of emojis~~ — **will not do**, decided 2026-09-05.
      Not a resourcing question: depicting the prophets is impermissible, so illustrated
      characters are off the table for the story pages regardless of who draws them. The emoji and
      scene moods stay. Non-figurative illustration (landscapes, the ark, the Kaaba, ornament)
      would be permissible if ever wanted, but needs a real illustrator to be worth doing.
      **Superseded in part on 2026-10-01 — see scene plates below.** The figurative half of this
      entry still stands and always will: no plate contains a person.
- [x] ~~**Scene plates**~~ — built 2026-10-01. The "needs a real illustrator" blocker above came
      off once the illustrator could be the machine already sitting on the owner's desk: the
      pictures are rendered by the local Draw Things engine (`z_image_turbo`), so nothing is
      prompted to a paid API and no image leaves the house.
      **48 plates** — one per scene across all five stories (43), plus a cover for each (5).
      Every scene now opens with an illuminated miniature in the site's own palette instead of a
      100px emoji roundel, and the five hub cards on `stories.html` carry their story's cover.
      **Nothing figurative.** Each scene is carried by its setting and its objects: the half-built
      ark rather than the carpenter, the empty pedestals and the axe rather than Ibrahim, the
      parted water rather than the people walking through it. Pharaoh, the angels and Iblis are
      all handled the same way — as architecture, as light, as a single flame standing apart.
      Animals, weather, plants and buildings do the work. The negative prompt names the human
      figure in six different forms because one form alone leaks a stray silhouette.
      Weight: WebP, ~55-70 KB each, `loading="lazy"`, so a story page carries about 0.5 MB of art
      it only fetches as the child scrolls into it.
      The pipeline is a spec plus a build script, like the surahs: `scripts/specs/illustrations.py`
      holds the 48 prompts, `scripts/build-illustrations.py` renders them. Seeds are crc32 of the
      plate name, so re-running reproduces the same picture rather than a new one; `--force`
      redraws, and `story:scene` redraws just one when a plate comes out wrong.
      Still on emoji, deliberately: the story page heroes and the `index.html` featured cards,
      whose card shape would have to change to take a banner.
      **Four things the first pass got wrong, all fixed — do not reintroduce them:**
      (1) The wiring regex was non-greedy, so on the two scenes with nested markup (Adam's
      creation animation, Ibrahim's fire scene) it left a stray `</div>` that closed the scene
      early and dropped `.scene-text` outside it — on screen the plate rendered straight through
      the words. `verify-illustrations.py` now *parses* the pages and asserts each scene encloses
      exactly one plate and exactly one `.scene-text`.
      (2) `stories.css` changed under an unchanged URL, so a returning visitor got cached CSS with
      new markup and the plate rendered at its intrinsic 960px. The link now carries
      `?v=20261001` on all seven pages, there is a `max-width/max-height` rule on the image that
      is deliberately **not** scoped to `.has-plate` so nothing can select around it, and the
      verifier fails if the `?v=` goes missing.
      (3) "A caravan of riderless camels" drew four riders with faces straight past the negative
      prompt. Negation does not work; describing a scene with nothing for a person to sit on
      does. The camels now stand at rest beside their unloaded bundles. `rider/riding/mounted`
      and `sun with a face` are in the negative prompt as well.
      (4) **The engine cannot count.** Yusuf's dream is eleven stars (12:4); asked for eleven it
      drew twelve, then nine. Both Yusuf plates are now composed so they never claim a number —
      a scattered field of stars with the sun and moon as the two forms that matter, and the
      text beside them carries the count. Do not "fix" this by asking for eleven again.
- [x] ~~**Surah plates**~~ — built 2026-10-03, finished 2026-10-08. **68 plates** across 19 surah
      pages and Ayat al-Kursi, one above each group of verses, so scrolling the verses tells the
      surah in pictures. Spec `scripts/specs/surah_plates.py`, rendered with
      `build-illustrations.py --surahs`, placed by `scripts/place-surah-plates.py` (idempotent;
      `build-surah.py` calls it, so a rebuilt page keeps its plates). Rules on top of the story
      ones: nothing depicts Allah, the Throne or Kursi, or the unseen; verses about the Fire,
      the graves and the Scales get no plate; Ayat al-Kursi is shown through the heavens and
      the earth with no chair in it. **Al-Fatiha and Al-Ikhlas have no pictures** — they get
      an illuminated frame (`images/surahs/illuminated-frame.webp`, border only) with the real
      text typeset inside in Amiri Quran; Al-Ikhlas because any picture risks reading as a
      likeness. Every plate was checked at full size, not on a contact sheet — at 640px wide
      the leaks are invisible. What leaked, so the next batch can avoid it:
      (1) **Small people in busy landscapes.** A 10px robed figure under a tree, a swimmer in
      a river. Busy scenes with open ground invite them; close, filled compositions (a deer at
      a lake, kneeling camels beside bales) do not. Riders came back on every moving caravan.
      (2) **Fake script** in any sky or above any arch. Re-prompt; the negative does not stop it.
      (3) **Rugs render as photographs** in perspective. "A Persian miniature, flat and frontal
      with no perspective" fixed it. An arched tiled niche with a hanging lamp also invites
      fake calligraphy above the arch; a plain courtyard does not.
      (4) **Similes are taken literally.** "Tracks spreading like the fingers of a hand" drew
      hands. Describe the shape, never the comparison.
      `surah.css` is now linked with `?v=20261008` for the same cached-stylesheet reason as
      the stories, and `verify-illustrations.py` checks every surah plate sits directly above
      its verse card, is decorative and lazy, and that the `?v=` is there.
      Rainbows were removed at the owner's request (Adam 9, Nuh cover, Nuh 7) and `rainbow` is
      in the negative prompt, so a re-render will not bring them back.
      **No sacred site and no religious emblem in any plate** — owner's instruction, 2026-10-02,
      and it sits alongside the no-figures rule as a standing constraint on this whole set.
      Four plates were redrawn for it: Ibrahim's cover and scene 8 had the Kaaba, Ibrahim's
      scene 1 came out as a blue-domed shrine, and Musa's scene 1 put a domed palace skyline on
      the horizon. Scene 8 is still *about* building — it now shows the site, with squared stone
      stacked, a foundation marked out, mallets and rope, and nothing yet built. `kaaba`,
      `mosque`, `minaret`, `dome with a finial`, `shrine`, `religious building` and
      `star and crescent emblem` are all in the negative prompt now.
      Two things were kept on purpose, so a later pass does not churn them: the natural sun, moon
      and stars where the Quran's own narrative turns on them (Ibrahim 2-4 are the star, the moon
      and the sun; Yusuf's dream is the sun, the moon and the stars), and plain arcades and
      arches as manuscript decoration. Neither is an emblem. If the owner wants those gone too,
      that is a different and much larger pass.
- [x] ~~**Reading mode toggle**~~ — shipped 2026-09-05 as a **bedtime mode** rather than a
      light/dark/sepia switcher, because the real use case is reading aloud in a dim room. A moon
      button in the navbar of all 20 pages dims the parchment to a warm, low-blue ground; the
      choice persists per device. Every text/background pair was measured: body 8.77:1, verse
      Arabic 11.25:1, translation 13.79:1, Quranic text 9.42:1.
- [x] ~~**Auto-advance option**~~ — built 2026-09-05. A ⏭ toggle in the narration control bar; when
      on, the story turns its own page 1.2s after a slide's narration ends, so a child too young to
      read never has to tap. Off by default, remembered per device, and cancelled if playback is
      stopped by hand. Verified in a browser that it advances when on and stays put when off.

---

## Regressions caught after shipping

- **2026-09-05 — the LTR safety net forced Quranic text left-to-right in Arabic mode.**
  The net added on 2026-09-03 targeted `p:not([data-ar])` so untranslated English would not be
  right-aligned. Quranic verses carry no `data-ar` *by design* — scripture is not translated — so
  they matched it, and `.arabic` / `.arabic-full` / `.arabic-large` computed to
  `direction: ltr; text-align: left` whenever the page was in Arabic. The sacred text was being
  rendered in the wrong reading direction on all 11 Quran pages.
  Fixed by excluding the scripture classes from the net and pinning them to `direction: rtl`
  unconditionally. Verified: verse, complete-surah and bismillah all compute `rtl` in **both**
  languages now, identical in each.
  *Lesson: `:not([data-ar])` is not a safe proxy for "untranslated" — some content is deliberately
  never translated. Any future rule keyed on the absence of `data-ar` must exclude scripture.*

- **2026-09-06 — Al-Fatiha's complete-surah block still split verse 7 in two.**
  The 2026-09-03 pass fixed the Hafs counting in the *verse cards* — bismillah as verse 1, the
  final verse whole, the badge reading 7 — but the "Complete Surah" block below them was not
  touched. It broke verse 7 across two lines with an ayah-end mark (۝) between them, so the block
  displayed **8** ayah marks for a 7-ayah surah, contradicting the cards directly above it.
  Rejoined into one line. Found by `scripts/verify-scripture.py`, which now checks the block
  separately from the cards rather than assuming they agree.
  *Lesson: the same content rendered twice on one page needs both copies checked. Fixing the
  cards did not fix the block, and nothing tied them together.*

- **2026-09-06 — the correct quiz answer was sitting in slot 2 in 74% of questions.**
  The 2026-09-04 pass fixed the *length* tell (the correct answer being the longest) and got it
  down to 3%. Nobody measured **position**, and it was much worse: across all 95 questions the
  answer was the second option 70 times, and the fourth option **once**. "Always tap the second
  one" outscored knowing the surah. Five of the six surah pages added on 2026-09-06 were
  literally `[2, 2, 2, 2]`, so this pass made an existing problem worse before catching it.
  Fixed by rotating the correct option into a target slot on all 25 pages — 76 of 95 questions
  moved. Distribution is now 24/24/24/23 across the four slots, and every option's text is
  byte-identical to before: only the order changed, verified by comparing sorted option sets
  before and after. Two constraints on the new layout: no slot holds more than two of a page's
  questions, and no page uses each slot exactly once (which would let a child deduce the fourth
  answer from the first three).
  Guarded by `scripts/verify-quizzes.py`, which measures position, length *and* duplicates in
  both languages. Re-run it whenever questions are added.
  *Lesson: "is this quiz guessable?" has more than one answer. Fixing the tell we thought of
  left a stronger one untouched for two years of content.*

- **2026-09-07 — five controls were below the 44px touch target, and the hero badges failed AA.**
  The 2026-09-03 pass fixed `.nav-toggle` and `.lang-toggle-btn` to 44px, but nothing measured
  the rest, so the floor was never actually site-wide. Found by measuring every visible
  `button`/`a` on each page type at both desktop and 375px:
  `.nav-links a` (41px), `.verse-listen` (40px), the narration bar's `.speed-btn` and
  `.auto-play-btn` (40px each, styled from inside `audio-narration.js` rather than a stylesheet,
  which is why they were missed), story `.quiz-option` (43.8px), and `.progress-badge` (32px).
  The badge mattered most: it sits *inside* the hub card's link, so a miss does not do nothing —
  it navigates away to the surah. All six are now 44px, verified with the nav open at 375px and
  with the badge still not navigating when tapped.
  Separately, `.info-badge` in the surah hero was **2.72:1** — white 15px text on a pale pill over
  the teal gradient, against the 4.5:1 AA needs for normal-size text. Darkening the pill instead
  of lightening it gives **6.99:1** and keeps the glass look. The h1 (3.41) and subtitle (3.45)
  pass the 3.0 large-text bar and were left alone.
  *Lesson: measure contrast against what is actually painted under the text. A first pass that
  read only `background-color` scored the hero title at 1.08:1 (it sits on a gradient) and the
  badge at 3.59 (its own translucent pill was not composited in). Both numbers were wrong — one
  far too alarming, one not alarming enough.*

- **2026-09-10 — the Quran was marked as English text for screen readers.**
  Every `.arabic`, `.arabic-full`, `.arabic-large` and `.arabic-text` element inherited
  `lang="en"` from `<html>` whenever the page was showing English — which is most of the time
  for the child this site is for. A screen reader would pronounce the verse being memorised with
  an English voice. 173 elements across 25 pages; not one of them declared its own language.
  The site already knew the right pattern — `index.html`'s hero `ٱقْرَأْ` carries
  `lang="ar" dir="rtl"` — it was just applied in one place out of 174.
  Scripture is never translated, so it is always Arabic whichever language the page is showing:
  all 173 now carry `lang="ar"`, and `surah-page-template.py` emits it, so new pages get it free.
  The 20 surah subtitles ("The Fig - التين") hold both scripts in one element, so the Arabic half
  is now wrapped in `<span lang="ar">`; the template does this at render time. Verified the
  wrapper round-trips through a language switch and back.
  *Still deliberately unmarked:* inline honorifics inside English prose (`عليه السلام`, `ﷺ`) and
  the language button's own `عربي` label, which a screen reader never reads because the button
  is announced from its `aria-label`. Worth doing if the site ever gets a real screen-reader
  pass; not worth 200 inline spans today.
  *Lesson: `dir` was fixed twice in this file's history and `lang` never came up. They are not
  the same attribute — direction is how it looks, language is how it sounds.*

- **2026-09-10 — rebuilding a page silently reverted a chain link.**
  `surah-at-tin.html` was inserted into the chain by editing the generated HTML, not the spec.
  The spec still said `next: ayat-al-kursi`, so the next `build-surah.py` run put the old link
  back and At-Tin stopped pointing at Al-Humazah. Caught by `verify-chain.py` on the very next
  run, which is the only reason it did not ship.
  `verify-chain.py` now also checks **every spec's `prev`/`next` against the hub order**, so a
  stale spec fails the check even while the built HTML still looks right.
  *Lesson: with a generator, the spec is the source of truth. Patching generated output is a
  change with a timer on it.*

- **2026-09-11 — rebuilding a page reverted the quiz shuffle, on two pages.**
  The 2026-09-06 fix that spread the correct answer across all four slots was applied to the
  *built HTML*. Most surah pages are generated from specs, so the moment one was rebuilt for an
  unrelated reason its quiz went straight back to `[2, 2, 2, 2]`. It happened to At-Tin (rebuilt
  for the `lang="ar"` fix) and Al-Qari'ah (rebuilt for a chain fix), and it was caught only
  because the site-wide distribution drifted in a way the arithmetic could not explain: slot 2
  rose by 9 when only 8 questions had been added.
  Fixed properly: `surah-page-template.py` now places the correct option itself, at a slot
  derived from the surah's slug, with the same two constraints (no slot more than twice per page;
  a four-question page never uses each slot exactly once). Rebuilds are byte-identical, so it
  cannot be lost again. Distribution across the 100 scored questions is 29/21/26/24.
  *Lesson: this is the second time a fix patched into generated output was quietly undone by a
  rebuild — the first was a chain link, days earlier. With a generator there are only two safe
  places for a property: the spec, or the generator. Anywhere else has a timer on it.*

## Known false positives — do not re-chase

Each of these was reported by a checker and disproved on inspection. Recorded so the next pass does
not spend time on them:

- **`.arabic-full` contrast is fine.** Reported as 1.86:1 by pairing it with `.verse-card`'s cream
  background. It only ever renders inside `.full-surah-card`, whose background is `var(--ink)`
  (#14383A), giving **6.70:1 — passes AA**.
- **`//gc.zgo.at/count.js` is not a broken link.** It is the protocol-relative GoatCounter tag.
- **The Adam page is not untranslated.** It uses the older `data-i18n` path, so a checker that
  simulates only `data-ar` reports it as English. Verified translating correctly in a browser.
- **Regex extractors miss nested inline markup** (`<em><strong>`), reporting translated strings as
  missing. Check by simulating the switch, not by attribute presence.
