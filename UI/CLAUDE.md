# Islamic Kids Stories - UI

Interactive Islamic stories for children with bilingual support (English/Arabic).

## Project Structure

```
UI/
├── index.html              # Landing page
├── stories.html            # Stories listing
├── story-prophet-adam.html # Prophet Adam story (interactive)
├── styles.css              # Global styles
├── stories.css             # Story-specific styles
├── stories.js              # Story navigation & slides
├── interactive-story.js    # Interactive elements (quiz, drag-drop)
├── translations.js         # i18n (English/Arabic)
├── voice-scripts.js        # Narration scripts for TTS
├── audio-narration.js      # Audio playback system
├── scripts/                # Build/generation scripts
│   ├── generate-audio-elevenlabs.js  # TTS audio generator
│   └── .env                # API keys (gitignored)
└── audio/                  # Generated audio files
    └── prophet-adam/
        ├── en/             # English audio
        └── ar/             # Arabic audio
```

## Skills

### /generate-audio
Generate audio narration using ElevenLabs TTS.

```bash
cd UI/scripts
export $(cat .env | xargs) && node generate-audio-elevenlabs.js prophet-adam en
```

See `.claude/skills/generate-audio.md` for full documentation.

## Development

### Run locally
```bash
cd UI
python3 -m http.server 8080
# Open http://localhost:8080
```

### Language Toggle
- Stories support English and Arabic
- Toggle button in navbar (AR/EN)
- RTL support for Arabic

### Audio Narration
- Auto-plays on slide change (when enabled)
- Falls back to Web Speech API if no audio files
- Supports speed control (0.75x - 1.5x)

## Environment Variables

Create `scripts/.env`:
```
ELEVENLABS_API_KEY=your_key_here
```

Get key from: https://elevenlabs.io/app/settings/api-keys
