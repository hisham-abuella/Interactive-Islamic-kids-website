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

- **The scripture is sound.** Every verse card and every complete-surah block across all 10 short
  surahs diffs *exactly* against `api.alquran.cloud` simple-script text. Ayat al-Kursi's 8
  phrase-cards concatenate to an exact match of 2:255. No critical or major findings.
- **Al-Fatiha now follows the standard Hafs counting** — Bismillah is verse 1, the final verse is
  whole, the badge says 7. Verified and holding.
- **All 10 hadith trace to authentic sources** (Bukhari, Muslim, Tirmidhi, Abu Dawud, Nasa'i) with
  faithful paraphrases. No fabricated or misattributed hadith.
- **Aqeedah is sound** — the Kursi explanation, Al-Ikhlas's negations, and the Ibrahim
  star/moon/sun episode are all consistent with mainstream Sunni tafsir.
- **All 16 YouTube embeds are live** as of 2026-09-03 (re-check every pass — three died before).
- **Narration scripts are consistent**: for adam/ibrahim/nuh/yusuf, slide count == EN count ==
  AR count == audio file count, exactly. `voice-scripts.js` and `scripts/voice-scripts-data.json`
  agree.
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


- [ ] **Quiz answers are guessable from length.** 39 of 63 questions (62%) have the correct answer
      as the *strictly* longest option, plus 5 more tied — against 25% expected by chance. A child
      can score well without learning. Worst: `surah-al-ikhlas.html:251` (44 chars vs 21/22/22),
      `surah-al-kawthar.html:213`, `surah-al-maun.html:283`, `surah-al-kafirun.html:244`.
      *Fix: pad distractors to comparable length, or trim correct answers. Roughly a day.*
      Still 39/63 after the bilingual audit above — that pass fixed correctness and sense, not
      length. Note the replacement Al-Asr Q2 is itself a long correct answer, so this needs a
      deliberate pass over all 63, not incidental edits.
- [ ] **Prophet Musa has no narration audio.** 20 EN + 20 AR scripts exist and
      `AudioNarration.init('prophet-musa')` is correct, but `audio/prophet-musa/` does not exist,
      so it silently falls back to Web Speech. Fix:
      `node scripts/generate-audio-elevenlabs.js prophet-musa en` then `... ar`.
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
- [ ] **Staged memorization ("training wheels").** Every verse card always shows Arabic +
      transliteration + translation + explanation, so a child reads the transliteration instead of
      the Arabic. Add a three-stage toggle — Read / Practice (hide transliteration) / Recite
      (Arabic only, reveal on tap) — persisted per surah in `localStorage`.
- [ ] **Progress state on the Quran hub.** `quran.html` is 11 structurally identical cards with no
      progress, heading past 30. The Adam page already has a star/progress/unlock system to copy.
- [ ] **Ayat al-Kursi sits at position 2** but is the longest page on the site (767 words vs 493
      for Al-Ikhlas) and the hardest to chunk. Consider moving it later, as a graduation piece.
- [ ] **Parent affordances.** Zero instances of "ask your child", "parent tip" or a recap anywhere;
      the existing tips address the child, not the reading father. Add inline "ask your child"
      prompts, a one-line recap, and a resume point for the next night.

**Accessibility**
- [x] ~~`.nav-toggle` ~34×27px, `.lang-toggle-btn` ~37px~~ — both now 44px (lang button measured
      at 82×44 in-browser). Fixed 2026-09-03.
- [x] ~~Fullscreen button had `title` but no `aria-label`~~ — now labelled, and translated via a
      new `fullscreenToggle` key. Fixed 2026-09-03.
- [ ] No `aria-hidden` anywhere — decorative emoji in headings are announced as content.
- [x] ~~Two `<h1>`s per page~~ — the site wordmark is now a `<span class="logo-text">` on all 19
      pages, so each page has exactly one `<h1>`, its own title. Fixed 2026-09-03.
- [x] ~~`prefers-reduced-motion` missed the scroll-reveal opacity~~ — now part of the guard above.
      Fixed 2026-09-03.
- [ ] No `aria-hidden` on decorative emoji — still open (see below).

**Frontend**
- [ ] **325 hardcoded hex values** across the four page-type sheets (`stories.css` 141,
      `surah.css` 75, `interactive-story.css` 70, `story-styles.css` 39) — a regression of the
      "329 remapped once already" rule. Worst: `#1A8F80` (55×, = `--teal-500`), `#C08A2E` (22×,
      = `--gold`), `#FBF6EA` (19×, = `--parchment`), `#7A5518` (15×, **no matching token**).
- [ ] `surah.css` has **zero** `html[lang="ar"]` overrides against 34 LTR-assuming rules
      (`border-left`, `padding-left`), so RTL border accents do not mirror on surah pages.
- [ ] `.lang-toggle-btn` is defined twice (`styles.css`, `stories.css`) with different focus
      behaviour, diverging by page type through load order. The 44px minimum was added to the
      `styles.css` copy only, so the duplicate should be deleted rather than kept in sync.

**Bilingual**
- [ ] Narration does not react to a mid-slide language switch. `bilingual.js` dispatches
      `languageChanged`; `audio-narration.js` only listens for `slideChanged`. Language is picked
      up on the *next* play, so this is a polish issue, not a break.
- [x] ~~`index.html` hero CTAs had no `data-ar`~~ — "Start a story" / "Learn a surah" now
      translated. Fixed 2026-09-03.
- [ ] Nav arrows on `story-prophet-adam.html:469-470` are outside any translation attribute and do
      not mirror in RTL; arrows are dropped entirely from the Arabic on three other story pages.
- [x] ~~Double-escaped entities inside `data-ar`~~ — 3 fixed across `index.html` and
      `ayat-al-kursi.html`. Fixed 2026-09-03.
- [x] ~~Quiz score used a Western digit beside Arabic-Indic totals ("أجبت 3 من ٤")~~ — the score
      is now converted to Arabic-Indic when the page is in Arabic. Fixed 2026-09-03.
- [ ] Prophet honorifics appear only in the `<meta description>` on `story-prophet-adam.html` and
      `story-prophet-ibrahim.html`, never in visible text. (Musa fixed 2026-09-03; Yusuf's Yaqub
      fixed earlier.)

**Read-aloud**
- [ ] Rewrite the sentences that trip a parent reading aloud — `surah-fatiha.html:194` and
      `surah-al-maun.html:90-91` stack em-dash and colon asides that must be pre-read. Suggested
      rewrites are in `claudeteam/log_chat/ceo.log`.
- [ ] `ayat-al-kursi.html:99` presents the "protection until death" hadith with full certainty
      though it is scholarly disputed. Consider a soft footnote.

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
      **Meanwhile:** re-check all 16 embeds every review pass — they rot without warning.

- [ ] **Surah Al-Masad (111)** — the last Phase 2 surah, deliberately deferred: it centres on a
      curse against Abu Lahab and his wife and needs gentler framing for a young child.
- [ ] **Narration for surah pages.** The feature does not exist there at all. Now more feasible
      since Arabic text exists — needs EN/AR scripts, `surah-<id>` keys in both script stores,
      ElevenLabs generation, and `init()` calls. The pipeline itself needs no changes.
- [ ] Phase 3 surahs: Al-Fil, Al-Humazah, At-Takathur, and the rest of Juz Amma.
- [ ] Phase 1 stories: Prophet Isa, Prophet Muhammad ﷺ.

---

## P3 — original UI backlog

Carried over from the previous version of this file. Completed items are kept for the record.

- [x] Fullscreen mode, slide transitions, larger nav buttons, progress indicator, slide counter
- [x] Animated backgrounds, floating controls, swipe gestures, exit button
- [ ] **Scene-specific themes** — different colours per scene (creation = earth tones,
      Jannah = green/gold)
- [ ] **Character illustrations** instead of emojis
- [ ] **Reading mode toggle** — light/dark/sepia. Worth reconsidering as a *print/bedtime* mode,
      which serves the read-aloud use case better than a theme switcher.
- [ ] **Auto-advance option** for younger kids who cannot read yet — pairs naturally with the
      narration work above.

---

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
