# Recitation sources

This folder is the only place on the site that holds Quranic audio. Everything in it is
**human recitation**. No synthetic voice (the narration clone, ElevenLabs or the browser's
speech) ever produces or plays a file here. `scripts/verify-no-recitation.py` checks this.

## husary-muallim/

- **Qari:** Sheikh Mahmoud Khalil al-Husary (1917-1980), *al-Mushaf al-Muallim*, his teaching
  recitation. It is slow and clear, and after each ayah it leaves a pause for the child to repeat.
- **Files:** one mp3 per ayah, named `SSSAAA.mp3` (surah, ayah), 128 kbps. There are 141 ayat:
  al-Fatiha 1-7, the 20 short surahs on the site, and 2:255. The total is about 24 MB.
- **From:** `https://everyayah.com/data/Husary_Muallim_128kbps/`, fetched once on 2026-11-18
  by `scripts/fetch-recitation.py`. They are served from this site; no live calls are made.
- **Terms:** EveryAyah publishes no terms of its own. The same files are distributed by
  api.alquran.cloud (Islamic Network), whose terms say the recitations are licensed by the
  reciters or their estates for free, non-commercial redistribution at the published bitrates,
  and that the copyrights belong to the reciters. This site is free and non-commercial and gives
  credit on every surah page. If a rights holder asks, this folder can be removed in one commit.
  The research is in `claudeteam/reviews/recitation-tafsir-sources-2026-11-04.md`. The owner
  approved its use on 2026-11-18.
- **Not used:** the Quran Foundation / Quran.com API. Its developer terms forbid storing or
  bundling its content.
- **`parts.json`:** Ayat al-Kursi is one ayah shown on 8 cards. This file holds the stretch of
  `002255.mp3` that each card plays. The cut points are the teaching pauses in the recording,
  and each phrase was confirmed with a local Whisper transcription. These are our own data.
- **Integrity:** `SHA256SUMS` pins every file. To check them, run
  `python3 scripts/fetch-recitation.py --check`.

Credit shown on the pages: "Recitation by Sheikh Mahmoud Khalil al-Husary (teaching
recitation), from EveryAyah.com."
