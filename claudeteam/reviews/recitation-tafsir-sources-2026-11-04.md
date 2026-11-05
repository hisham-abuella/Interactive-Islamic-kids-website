# Recitation audio and tafsir sources (2026-11-04)

Research only. No site files were changed. This follows the scholar's Round 3 ruling
(`claudeteam/reviews/site-fixes-scholar-confirm-2026-11-04.md`, Part 2): no synthetic voice
recites Quran. A child may hear an ayah only from a human qari. The AR meaning line becomes a
simplified tafsir sentence based on al-Tafsir al-Muyassar, with al-Mukhtasar as the second source.

**Scope:** 148 verse cards = **141 real ayat** (Al-Fatiha 7 + 2:255 + 133 ayat from the 20 short
surahs on the site) + 7, because Ayat al-Kursi is split across **8 cards**
(`UI/ayat-al-kursi.html:133-233`). The 8 cards cover 2:255 word for word:
words 1-7, 8-12, 13-19, 20-26, 27-32, 33-40, 41-44 and 45-50. That is 50 words, the same as
the 50 timed word segments for 2:255 (see 1.4).

---

## 1. Recitation audio

### 1.1 Sources compared

| Source | Per-ayah mp3 | Bitrate | Children's / teaching qari | Word timings | Key / auth | Redistribution terms |
|---|---|---|---|---|---|---|
| **EveryAyah.com** `https://everyayah.com/data/<Reciter>/<SSSAAA>.mp3` | Yes, for every ayah | 128 kbps for the ones we want (also 64/192) | **Husary_Muallim_128kbps**, **Minshawy_Teacher_128kbps** | None on the site; see quran-align below | None. No documented rate limit. CORS is open. | **No terms published.** The home page has no about, terms or copyright text. "Contact Us" goes to `https://quran.zendesk.com/hc/en-us`, the Quran.com / Quran Foundation help desk, so Quran Foundation is now the operator to ask. |
| **Quran Foundation / Quran.com API v4** | Yes. Recitation 12 = "Mahmoud Khalil Al-Husary, Muallim". Each ayah's URL points at the **same EveryAyah file** (`//mirrors.quranicaudio.com/everyayah/Husary_Muallim_128kbps/112001.mp3`). | 128 kbps | Husary Muallim (id 12). There is no Minshawi teacher recitation in v4. | **Yes.** `verses/by_key/…?audio=12` returns word `segments` per ayah, and `/api/qdc/audio/reciters/12/audio_files?chapter=N&segments=true` returns per-surah timings. | The new API needs **OAuth2 client credentials** (`scope=content`, `x-auth-token` and `x-client-id` headers, 1-hour tokens, backend only, a pre-live app first and then production approval). The legacy `api.quran.com/api/v4` still answers without a key today. | **Restrictive.** The Developer Terms (last updated 2026-10-11) list audio as "QF Content". QF Content may not be cached or stored for **more than one week**, except through Content Sync. "A prepackaged database or build-time bundle of QF Content is not authorized". No redistribution without a signed commercial licence. **So no QF-API content may be stored in the repo.** |
| **api.alquran.cloud** (Islamic Network) `https://cdn.islamic.network/quran/audio/128/<edition>/<globalAyah>.mp3` | Yes | 128/64 | `ar.husary` and `ar.minshawi` are the **ordinary murattal** recitations. **There is no Muallim edition** (`ar.husarymuallim` returns 403). Note: `ar.alhusaynialazazichildren` (al-Azazi with children) exists. | No | Key-less, with a "soft rate limit" per IP per second | **The most explicit terms found:** recitations are licensed by the reciters or their estates for "free, non-commercial redistribution at the bitrates we publish". "Copyrights lie with the reciters", who may ask for removal. These are **byte-identical** to EveryAyah's files (2:255 for Husary: 971,883 bytes on both). |
| **Tanzil** | Its player streams third-party per-ayah audio (not verified which host). Tanzil publishes no audio terms of its own. | n/a | n/a | n/a | n/a | Its **text** licence is CC BY 3.0, verbatim only, with a credit and a link to tanzil.net. |
| **QuranicAudio.com** (runs the `mirrors.quranicaudio.com` mirror) | Surah files plus the EveryAyah mirror | n/a | n/a | n/a | n/a | "Mp3s on this site may be downloaded and used for **personal use** free of charge … you may not use these files for commercial purposes." |
| **Mp3Quran.net** | Mostly whole-surah files | varies | some | partial | n/a | No public reuse terms found. The app shows "© MP3Quran Audio Library". **Not recommended.** |
| **King Fahd Complex** (qurancomplex.gov.sa) | Its own reciters (Huthaify, Ayyub, Akhdar …). No per-ayah set was confirmed. | n/a | No | No | n/a | An English page says the Complex offers its digital audio recordings for "free general use in … internet websites". The page now returns 404, so this could not be verified. A possible route if the owner prefers an official Saudi permission, but these are not teaching recitations. |

### 1.2 Word timing data

- **cpfair/quran-align** (`https://github.com/cpfair/quran-align`, release 2016-11-24):
  `Husary_Muallim_128kbps.json` is included. The data is under **CC BY 4.0** (Copyright (c) 2016
  Collin Fair). I downloaded it and checked: its 112:1 and 2:255 segments are **identical** to what
  Quran.com serves (Quran.com uses this data). 2:255 has 50 segments, the last ending at
  108,990 ms, with 0 deletions and 0 transpositions. The format is `[wordStart, wordEnd, ms_from, ms_to]`
  per ayah file.
  **This is the licence-clean timing source.** It lets the site highlight words and play the
  8 Ayat al-Kursi parts from the one 2:255 file without cutting it.
  It does not cover Minshawy_Teacher. Quoted accuracy is a mean error of about 73 ms, and under 1% of words are wrong.
- Word indices follow the Quran.com word list. The site's imla'i words line up one to one for
  the ayat checked (2:255 has 50 words both ways). The download script should still check that
  the word count of every card equals the segment count.

### 1.3 Which qari for a child

**Recommended: Mahmoud Khalil al-Husary, Muallim (teaching) recitation, `Husary_Muallim_128kbps`.**
- It was made for teaching: slow and very clear, with precise makharij and tajwid.
- Each per-ayah file ends with a **gap of about 2.75 s for the child to repeat**. Checked on
  112:1: 6.0 s long, recitation 0-3.26 s, then silence. The ordinary Husary file is 5.8 s with almost no tail.
- It has free CC BY word timings, and it is the teaching recitation that Quran.com itself offers.
- **Availability checked by HTTP HEAD on all 141 ayat: 141/141 present**, including 2:255
  (1.83 MB, about 115 s). Total about **24.0 MB**.

Alternative: **Minshawy_Teacher_128kbps** (al-Minshawi teaching recitation, with children
repeating). **141/141 present**, 29.0 MB. It has no CC BY timing file, and its 112:1 sample shows no
repeat gap. **Someone must listen to it** to confirm whether children's voices are in the files.
Keep it as a second choice only.

Murattal fallback (no teaching pauses): `Husary_128kbps` (also on alquran.cloud as `ar.husary`).

### 1.4 Licence status: the honest summary

**No source gives a clear written licence for self-hosting these mp3s in a public GitHub repo.**
- The rights are the **reciters' (estates')** and the recording publishers'. Husary died in 1980;
  the Muallim recording is a commercial Egyptian recording that has circulated freely for decades.
- **alquran.cloud** says these same files are licensed for **free, non-commercial redistribution**
  at the published bitrates. That is the best written basis found, and the site is non-commercial.
- **EveryAyah publishes no terms. QuranicAudio says personal use only. Quran Foundation's API terms
  forbid storing anything fetched through its API.** So download from **EveryAyah directly, not
  through the QF API**, and do not store any QF API responses.
- Many open-source apps and datasets bundle EveryAyah files with a credit and a link back.
  That is common practice, not a licence.

---

## 2. Tafsir

| Source | al-Muyassar | al-Mukhtasar | Terms |
|---|---|---|---|
| **QuranEnc.com** (Encyclopedia of the Noble Quran) API `https://quranenc.com/api/v1/translation/sura/<key>/<sura>` and `/aya/<key>/<s>/<a>`; also SQLite downloads | `arabic_moyassar` ✔ (2:255 and 112:1 fetched) | **`arabic_mokhtasar` ✔** (2:255 fetched). Also `english_mokhtasar` ✔ | **The only explicit republishing permission found** ("Contents of the translations can be downloaded and re-published"), on these conditions: no modification, addition or deletion; credit the publisher and the source (QuranEnc.com); give the version number; keep the transcript information; report notes to them; keep to the latest version; no inappropriate adverts. No key is needed. The `/translations/list` endpoint does not list the Arabic keys, so record the **retrieval date** as the version, or ask them for one. |
| **api.alquran.cloud** `…/v1/surah/<n>/ar.muyassar` | ✔ ("King Fahad Quran Complex"). The text is identical to QuranEnc's apart from spacing. | ✖ | The translations come from Tanzil. Tanzil's translation page: "for **non-commercial purposes only**", and link back if you use more than 3. |
| **Quran.com API v4** tafsir id **16** `ar-tafsir-muyassar` | ✔ | ✖ | QF Developer Terms: no storage beyond 1 week, no bundling. **Do not use it as the stored source.** |
| **King Fahd Complex** (qurancomplex.gov.sa) | The original publisher | n/a | No online reuse licence was found. One page offers its publications for "free general use in … internet websites", but it could not be fetched (404). |
| **Tafsir Center for Quranic Studies** (tafsir.net, مركز تفسير) | n/a | The original publisher | The print edition says «جميع حقوق الطبع محفوظة لمركز تفسير للدراسات القرآنية». Feedback address: almokhtasar@tafsir.net. QuranEnc publishes the Mukhtasar in cooperation with them, so QuranEnc's terms are the practical licence. |

**How the site uses it.** The site does **not** republish either tafsir. The team writes its own short
child-level Arabic sentence per card, *informed by* al-Muyassar (and checked against al-Mukhtasar),
and the scholar approves it. That is original explanatory writing, not a reproduction, so the
"no modification" rule applies only to any verbatim copy we keep. The page shows a credit:
«المعنى مبسَّط اعتماداً على التفسير الميسر (مجمع الملك فهد)». Keep the verbatim source text in the
repo only as a reference for the scholar, unchanged and with the QuranEnc credit, version/date and link.

**English meaning lines.** The site's EN lines are already the team's own child wording. If a
published English source is wanted for checking:
- **Saheeh International**: the Abul-Qasim print edition requires **written permission** to reproduce.
  QuranEnc does carry `english_saheeh` (it labels the publisher "Noor International Center") under the terms above.
- **Recommended:** `english_mokhtasar` on QuranEnc. It matches the AR second source, is written as
  plain explanation, and has republishing permission. Use it as a reference; the EN lines stay
  team-written and scholar-checked.

---

## 3. Practical plan

### 3.1 One-off fetch script: `UI/scripts/fetch-recitation-and-tafsir.py` (to be written)

- Inputs: the list of 141 ayah keys (Fatiha 1-7, 2:255, and the 20 surahs on the site),
  plus the 2:255 card split above.
- **Recitation:** `GET https://everyayah.com/data/Husary_Muallim_128kbps/SSSAAA.mp3`, one request at
  a time with a 0.5 s pause; about 24 MB, run once. → `UI/recitation/husary-muallim/SSSAAA.mp3`
  (e.g. `112001.mp3`, `002255.mp3`). The folder is **outside `UI/audio/`** so that it is never
  mistaken for narration, and so that `scripts/verify-no-recitation.py` check 2 ("audio on disk")
  can treat it as **human recitation**, an explicit allowed class.
- **Timings:** extract the 141 entries from quran-align's `Husary_Muallim_128kbps.json` →
  `UI/recitation/husary-muallim/timings.json` (`{"112:1": [[0,1,150,710],…]}`). Add `parts` for
  2:255: `[[1,7],[8,12],[13,19],[20,26],[27,32],[33,40],[41,44],[45,50]]` → millisecond ranges.
  Check that the last segment ends before the file's length (`ffprobe`), to catch any re-encoding
  since 2016. Spot-check 5 ayat by ear.
- **Tafsir (reference only):** `GET https://quranenc.com/api/v1/translation/sura/arabic_moyassar/<s>`
  and `…/arabic_mokhtasar/<s>` (and `english_mokhtasar`) → `UI/scripts/data/tafsir/<key>.json`,
  keyed `"s:a"`, text unchanged, with `{source, url, retrieved, terms}` in the header.
- **Manifest:** `UI/recitation/SOURCES.md` covering the reciter, recording, origin URL, the
  alquran.cloud non-commercial redistribution statement, the quran-align CC BY 4.0 credit,
  the QuranEnc credit and conditions, and the retrieval date. Also `UI/recitation/SHA256SUMS`
  (one line per mp3 and json) and a check in the verifier that the files still match it.
  That gives control: nothing changes without a commit.
- No API keys are needed. EveryAyah has no documented rate limit. QuranEnc has none either: 21
  surah calls per key. No local model is involved, so the RAM gate does not apply.

### 3.2 Playback on the site

- A separate control on each verse card: **"🎧 Listen to the recitation" / «🎧 استمع إلى التلاوة»**,
  visibly different from the father's **"▶ Meaning"** narration button. It should have its own
  icon, colour and label, and the label names the qari («بصوت الشيخ محمود خليل الحصري»).
- Card play: one `<audio>` per click, `src = recitation/husary-muallim/SSSAAA.mp3`. For the
  Ayat al-Kursi cards, play `002255.mp3` from `parts[i].from` to `parts[i].to`, with a
  `timeupdate` stop. Optionally highlight words from `timings.json` (a `<span>` per word on the
  imla'i line).
- "Recite the whole surah": play the files in order. The Muallim tail gives the child time to repeat.
- Never mix the two: the recitation and the narration never play at once, and the recitation is
  never sent to speech synthesis or the clone. No live third-party calls are made: everything is
  served from the repo, so it works offline after the first load (and with the service worker, if one is added).
- Credit line in the page footer and on a credits page: "Recitation: Sheikh Mahmoud Khalil
  al-Husary (Muallim), via EveryAyah.com · word timings: quran-align by Collin Fair (CC BY 4.0) ·
  meanings simplified from al-Tafsir al-Muyassar (King Fahd Complex) and al-Mukhtasar (Tafsir
  Center), text via QuranEnc.com".

### 3.3 Narration pipeline changes

1. Add a new field per verse card: `data-ar-meaning`, the team's simplified sentence
   (e.g. 112:1 «قُلْ يا محمد: اللهُ واحدٌ، لا شريكَ له»), drafted from `arabic_moyassar`.
   The `.translation` line no longer holds the ayah.
2. The islamic-content-scholar approves each of the 148 sentences against Muyassar and Mukhtasar,
   and checks that none contains 4 or more consecutive ayah words (the Round 3 rule).
3. `scripts/narrate-s2pro.py units()` voices the AR explanation plus `data-ar-meaning` only.
   `verify-no-recitation.py` then passes the AR verse units, `AR_VERSE_AUDIO` is turned on,
   and only after that are the 148 AR verse mp3s re-rendered with the clone (run through
   `ram-gate`, one model at a time).
4. The clone **never** speaks an ayah. Only `UI/recitation/` holds Quranic audio, and the
   verifier enforces that the folder's checksums match `SHA256SUMS`.
5. Games 07 and 08 (`07-ayah-lanterns.html:352`, `08-al-fil-seek.html:414`) switch to the
   recitation file when they mean "hear the ayah", and to the narration file for "hear the meaning".

---

## 4. Recommendation

| Need | Primary choice | Licence status |
|---|---|---|
| Recitation | **Husary Muallim 128 kbps**, per ayah from EveryAyah, self-hosted (141 files, about 24 MB) | **Grey but common practice.** The written basis is alquran.cloud's statement that the files are "licensed … for free, non-commercial redistribution". EveryAyah itself publishes no terms. **Email for permission** (see Q1). |
| Word timings | **cpfair/quran-align** `Husary_Muallim_128kbps.json` | **Clear: CC BY 4.0**, needs a credit |
| AR tafsir (main) | **al-Tafsir al-Muyassar** via QuranEnc `arabic_moyassar` | **Clear for verbatim republishing** under QuranEnc's conditions. Our child sentences are original writing based on it. |
| AR tafsir (second) | **al-Mukhtasar** via QuranEnc `arabic_mokhtasar` | Same as above. The original is © Tafsir Center. |
| EN reference | `english_mokhtasar` (QuranEnc) | Same as above. Saheeh International needs written permission from the publisher. |
| Do **not** use as the stored source | Quran Foundation API (recitation, segments, tafsir 16) | Its terms forbid storing for more than 7 days or bundling at build time |

## 5. Risks

- **The recitation has no explicit licence.** A rights holder could ask for removal. Mitigations:
  the site is non-commercial, gives full credit, keeps the files in one folder that is easy to
  remove, and the owner sends a permission email.
- **Quran Foundation terms trap.** Fetching through the QF API and committing the result would breach
  them. The plan avoids the QF API completely.
- **Timing drift.** The quran-align data is from 2016, while EveryAyah's files carry 2023-2025
  last-modified dates. If any were re-encoded, the offsets could shift, so verify duration and the last segment end.
- **Teaching-recitation content.** Each Muallim file has a repeat gap, which is good for learning
  but makes "play the whole surah" slow; offer an ordinary-speed choice (`Husary_128kbps`) later if wanted.
  The Minshawy Teacher files may contain children's voices and must be listened to before any use.
- **Repo size.** About 24 MB more on top of 81 MB of narration. Fine for GitHub Pages (1 GB soft limit).
- **Basmala.** The site shows a basmala above each surah. EveryAyah's convention plays `001001.mp3`
  for it. Ask the scholar whether to offer that or leave the basmala silent.
- **Wording drift from the tafsir.** Child sentences can oversimplify, especially on the
  attributes in 2:255 and on the unseen (101, 99, 104). Every sentence needs scholar approval.

## 6. Questions for the owner

1. **Permission emails.** Should we write (I can draft) to
   (a) Quran Foundation / EveryAyah (`developers@quran.com` or the help desk linked from everyayah.com)
   to confirm that self-hosting 141 Husary Muallim files on a free GitHub Pages site with a credit is fine, and
   (b) the Tafsir Center (`almokhtasar@tafsir.net`) and QuranEnc to tell them about the
   use, as their terms ask? Ship before the replies arrive, or wait?
2. **Qari.** Is Husary Muallim acceptable, or does the owner prefer Minshawi Teacher (after a
   listen) or a murattal recitation without repeat gaps?
3. **Would the owner rather record the ayat himself** in his real voice? The scholar allows this
   with checked pronunciation, and it is the cleanest licence. Husary would stay as the model qari.
4. **Credit placement.** Is a footer line on every surah page plus a credits page acceptable?
5. **English.** Should the EN meaning lines stay team-written (recommended) with `english_mokhtasar`
   only as a reference, or cite a published translation?
6. **Basmala audio** and **word highlighting**: in scope for the first version?

## Sources

- EveryAyah recitations list: https://everyayah.com/recitations_ayat.html ; home page/contact: https://everyayah.com/
- Quran Foundation quickstart (OAuth2): https://api-docs.quran.foundation/docs/quickstart/
- Quran Foundation Developer Terms: https://api-docs.quran.foundation/legal/developer-terms/ (also https://api-docs.quran.com/legal/developer-terms/)
- Quran.com v4 recitations/tafsirs (live): https://api.quran.com/api/v4/resources/recitations , https://api.quran.com/api/v4/resources/tafsirs
- alquran.cloud terms: https://alquran.cloud/terms-and-conditions ; audio editions: https://api.alquran.cloud/v1/edition?format=audio&language=ar
- Tanzil text licence: https://tanzil.net/docs/text_license ; translations terms: https://tanzil.net/trans/
- QuranicAudio about: https://www.quranicaudio.com/about
- quran-align (CC BY 4.0): https://github.com/cpfair/quran-align
- QuranEnc API: https://quranenc.com/en/home/api/ ; Mukhtasar page and republishing terms: https://quranenc.com/en/browse/arabic_mokhtasar
- King Fahd Complex audio page (404 at time of check): https://qurancomplex.gov.sa/en/?p=4973
- Al-Mukhtasar copyright notice (print): https://shamela.ws/book/18102/7
- Saheeh International: https://en.wikipedia.org/wiki/Sahih_International
