#!/usr/bin/env node
/**
 * Per-verse narration for the surah pages.
 *
 * Story pages are slide-based, so their audio is slide-indexed. A surah page is
 * a scroll page, so the unit here is the verse: one file per verse, holding its
 * meaning and the explanation beside it. The text comes from the pages
 * themselves, so the audio cannot drift out of sync with what is written.
 *
 * Files: audio/<surah-id>/<lang>/verse-<n>.mp3   (verse numbers start at 1)
 *
 * Usage:
 *   node generate-surah-audio.js <plan.json> [--budget N] [--only a,b,c] [--lang en|ar] [--dry]
 *
 * --budget is a hard stop: the script refuses to start a request that would
 * take it past the limit, so a monthly quota cannot be overrun by accident.
 */
const fs = require('fs');
const path = require('path');

const API = 'https://api.elevenlabs.io/v1/text-to-speech';
const VOICE = 'EXAVITQu4vr4xnSDxMaL';
const MODEL = 'eleven_turbo_v2_5';
const voiceSettings = { stability: 0.75, similarity_boost: 0.75, style: 0.5, use_speaker_boost: true };

const args = process.argv.slice(2);
const planPath = args[0];
const opt = (name, dflt) => {
    const i = args.indexOf(name);
    return i >= 0 ? args[i + 1] : dflt;
};
const DRY = args.includes('--dry');
const BUDGET = parseInt(opt('--budget', '0'), 10) || Infinity;
const ONLY = (opt('--only', '') || '').split(',').filter(Boolean);
const LANGS = (opt('--lang', 'en,ar') || '').split(',').filter(Boolean);

if (!planPath || !fs.existsSync(planPath)) {
    console.error('Usage: node generate-surah-audio.js <plan.json> [--budget N] [--only ids] [--lang en|ar] [--dry]');
    process.exit(1);
}
const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey && !DRY) {
    console.error('ELEVENLABS_API_KEY not set.');
    process.exit(1);
}

const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'));
const outRoot = path.join(__dirname, '..', 'audio');

(async () => {
    let spent = 0, wrote = 0, skipped = 0;
    const ids = Object.keys(plan).filter(id => !ONLY.length || ONLY.includes(id));

    for (const id of ids) {
        for (const lang of LANGS) {
            const verses = plan[id];
            const dir = path.join(outRoot, id, lang);
            for (let i = 0; i < verses.length; i++) {
                const text = (verses[i][lang] || '').trim();
                const n = i + 1;
                if (!text) { continue; }

                const outPath = path.join(dir, `verse-${n}.mp3`);
                if (fs.existsSync(outPath)) { skipped++; continue; }

                if (spent + text.length > BUDGET) {
                    console.log(`\n! budget reached (${spent} used) - stopping before ${id}/${lang} verse ${n}`);
                    console.log(`  wrote ${wrote} files, skipped ${skipped} already present, spent ${spent} characters`);
                    return;
                }

                if (DRY) {
                    spent += text.length;
                    wrote++;
                    continue;
                }

                fs.mkdirSync(dir, { recursive: true });
                const res = await fetch(`${API}/${VOICE}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'audio/mpeg',
                        'Content-Type': 'application/json',
                        'xi-api-key': apiKey
                    },
                    body: JSON.stringify({ text, model_id: MODEL, voice_settings: voiceSettings })
                });
                if (!res.ok) {
                    console.error(`  ERROR ${id}/${lang} verse ${n}: ${res.status} ${await res.text()}`);
                    console.log(`  stopped after ${spent} characters, ${wrote} files`);
                    return;
                }
                const buf = Buffer.from(await res.arrayBuffer());
                fs.writeFileSync(outPath, buf);
                spent += text.length;
                wrote++;
                console.log(`  ${id}/${lang} verse-${n}.mp3  (${text.length} chars)`);
                await new Promise(r => setTimeout(r, 250));
            }
        }
    }
    console.log(`\nDone. ${wrote} files, ${skipped} already present, ${spent} characters${DRY ? ' (dry run)' : ''}.`);
})();
