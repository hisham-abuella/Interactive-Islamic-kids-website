# Islamic Kids — Claude Team

A standing team of specialist agents for this repo. Each is a real, dispatchable Claude Code
subagent defined in `.claude/agents/` — invoke by name with the Agent tool, or let Claude pick.

Created 2026-09-03, after a full-site audit found defects clustering in a few recurring
categories: dead third-party media, scripture presented on the wrong counting, and features
documented as site-wide that existed on one page. Each role carries this codebase's **known
failure modes**, so the next agent starts where the last one finished.

## What this project is

A father built this to **read Islamic stories and Quran to his own son**, personally, at home.
It is not a mass-market kids app and not a site a child browses alone. Two consequences drive
every decision on this team:

1. **The reader is a parent, reading aloud.** Text is a script for a grown-up voice.
2. **The owner controls what his son sees.** Anything the site pulls in from elsewhere —
   above all the YouTube embeds — is content he does not control. That is a product risk, not a
   technical detail.

## Roster

### Vision
| Agent | Owns | Edits files? |
|-------|------|--------------|
| `ceo` | Product vision, the read-aloud test, the control test, scope arbitration | No |

`ceo` applies two tests. The **read-aloud test**: does this speak well at bedtime, and is there a
place to pause and ask the child a question? The **control test**: if this changed tomorrow
without us, would we notice? Correct-but-unreadable-aloud is a defect, and `ceo` can send work
back for it.

### Content authority
| Agent | Owns | Edits files? |
|-------|------|--------------|
| `islamic-content-scholar` | Quranic text, verse numbering, hadith authenticity, aqeedah, adab | No |
| `arabic-language-reviewer` | Arabic register, translation fidelity, RTL typography, EN/AR parity | Yes |

`islamic-content-scholar` has the **final word on religious correctness**. Nobody overrules it,
`ceo` included.

### Craft
| Agent | Owns | Edits files? |
|-------|------|--------------|
| `frontend-lead` | Illuminated Page design system, CSS architecture, RTL layout, motion | Yes |
| `kids-learning-designer` | Memorization scaffolding, quiz design, cognitive load, progress | Yes |
| `audio-narration-engineer` | ElevenLabs pipeline, voice-script parity, slide indexing | Yes |

### Verification
| Agent | Checks | Edits files? |
|-------|--------|--------------|
| `link-integrity-auditor` | Hub coverage, prev/next chains, href resolution, embed liveness | No |
| `accessibility-auditor` | Contrast, touch targets, focus, motion, screen readers, RTL semantics | No |
| `qa-lead` | Reproduces claimed results, hunts regressions | No |
| `docs-keeper` | `UI/TODO.md`, `UI/plan.md`, `UI/CLAUDE.md`, `claudeteam/` currency | Yes (docs) |

## How to use them

**Adding a surah or story** — `islamic-content-scholar` verifies the scripture and hadith;
`arabic-language-reviewer` writes and checks the Arabic; `kids-learning-designer` shapes the quiz
and memorization path; `frontend-lead` handles styling; `audio-narration-engineer` wires the
narration; then `link-integrity-auditor` and `accessibility-auditor` verify in parallel; `ceo`
applies the read-aloud test; `docs-keeper` updates the docs last.

**Verifying a change already made** — run the three verification agents in parallel. They are
read-only, so they cannot conflict.

**A cross-cutting change** (tokens, shared CSS, i18n) — `frontend-lead` leads,
`arabic-language-reviewer` confirms EN/AR parity held, `qa-lead` verifies, `docs-keeper` updates.

**A scope or priority question** — `ceo` decides. Domain experts keep authority over factual and
religious matters; `ceo` does not overrule them on correctness.

## Working pattern: one lead, with helpers

Work items are tackled one at a time, each with a single **lead** that pulls in others rather than
doing everything itself.

Rules for the lead:

1. **Delegate the parallelisable parts.** EN and AR, or one page per agent — do not run serially
   what can run at once.
2. **Do not self-certify.** Dispatch `qa-lead` at the end to reproduce your before/after numbers.
   An agent grading its own work has missed things here before.
3. **Ask the domain expert rather than guessing** on anything scriptural or linguistic.
4. **You own the final report**, including what you deliberately did not fix and why, and any
   check result you believe is a false positive.
5. **Measure before and after**, and quote both numbers. "Fixed" without a number is not a result.

## Working rules

1. **EN and AR change together.** Any structural or content change lands in both, or it does not
   land. This is the rule most often broken here.
2. **The files on disk are the truth.** `UI/CLAUDE.md` documented a site-wide language toggle that
   existed on one page of nineteen. Verify against the files.
3. **Distinguish built / reachable / translated / narrated.** These have diverged: Prophet Musa is
   built, reachable and translated, with scripts written and **no audio generated**.
4. **Evidence or it did not happen.** A finding needs a `file:line` and a quote. A fix needs a
   verification command.
5. **External media rots.** Re-check every YouTube embed each pass. Three died silently and shipped
   showing "Video unavailable" to a child.
6. **Report scope decisions, do not make them.** Several open items are the owner's call —
   especially anything touching how scripture is presented. Surface with a recommendation.

## Known tooling traps

Recorded because they have each produced a false conclusion on this repo:

- **Browser caching** makes CSS and JS fixes look unapplied. Serve with no-cache headers before
  concluding a rule does not apply.
- **The language toggle is stateful** (`localStorage: islamicKidsLang`). A test that clicks it
  starts from whatever the last test left. Assert the starting state first.
- **Regex extractors miss nested inline markup** (`<em><strong>`), silently skipping those strings.
- **The GoatCounter tag is protocol-relative** (`//gc.zgo.at/count.js`). A file-existence check
  reports it broken. It is not.
- **Two translation systems coexist:** `data-ar` (site-wide, `bilingual.js`) and `data-i18n`
  (the Adam story, `translations.js`). A checker that simulates only one will report the other
  page as untranslated.
- **The site uses simple/imlaei Quranic script**, not Uthmani rasm. Diffing against the Uthmani
  edition shows false positives on every page.

## Logs

Agents append to `claudeteam/log_chat/<agent-name>.log` so later runs can read what earlier ones
found. Tag entries `[FINDING]`, `[DECISION]`, `[ISSUE]`, `[BLOCKER]`, `[DONE]`, with dates.
Full review reports go in `claudeteam/reviews/`.

## Reference

- `UI/CLAUDE.md` — how the site works: structure, narration, language toggle, local dev
- `UI/TODO.md` — open work: defects and backlog, merged across reviews
- `UI/plan.md` — content roadmap: stories and surahs, built vs planned, pending audio
- `theme.md` — the Illuminated Page design direction
