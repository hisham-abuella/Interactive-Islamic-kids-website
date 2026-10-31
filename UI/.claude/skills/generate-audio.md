# Generate Audio Narration

Generate audio narration for Islamic Kids Stories using ElevenLabs TTS.

## Setup (First Time Only)

1. Get your API key from: https://elevenlabs.io/app/settings/api-keys

2. Add your key to the `.env` file:
   ```
   cd UI/scripts
   # Edit .env file and add your key
   ```

3. Install dependencies (if not already):
   ```bash
   cd UI/scripts
   npm init -y
   npm install dotenv
   ```

## Usage

### Load API Key and Generate Audio

```bash
cd /Users/hishamabuella/Work/AI_server/Projects/Islamic_kids_website/UI/scripts

# Load env and run
export $(cat .env | xargs) && node generate-audio-elevenlabs.js prophet-adam en
```

### Available Commands

```bash
# Check your character usage/quota
export $(cat .env | xargs) && node generate-audio-elevenlabs.js --usage

# List available voices
export $(cat .env | xargs) && node generate-audio-elevenlabs.js --voices

# Generate English audio only
export $(cat .env | xargs) && node generate-audio-elevenlabs.js prophet-adam en

# Generate Arabic audio only
export $(cat .env | xargs) && node generate-audio-elevenlabs.js prophet-adam ar

# Generate both languages
export $(cat .env | xargs) && node generate-audio-elevenlabs.js prophet-adam
```

## Option: Hisham's own voice, locally (Fish S2-Pro)

No API key, no quota. Narrates every story slide and surah verse with Whisper QA into a
staging folder, then installs over `audio/`:

```bash
cd UI
uv run --project ~/Work/Whisper-audio/bakeoff python scripts/narrate-s2pro.py --stage /tmp/stage --lang en
uv run --project ~/Work/Whisper-audio/bakeoff python scripts/narrate-s2pro.py --stage /tmp/stage --lang en --flagged --tries 8
uv run --project ~/Work/Whisper-audio/bakeoff python scripts/narrate-s2pro.py --stage /tmp/stage --lang en --install
```

English is live in this voice since 2026-10-20. Arabic is rendered but **not installed**: the
clone softens ق ص ط ض in Quran text, so the Arabic stays on ElevenLabs until the owner
approves it by ear.

## Output

Audio files are saved to:
```
UI/audio/prophet-adam/en/slide-0.mp3
UI/audio/prophet-adam/en/slide-1.mp3
...
UI/audio/prophet-adam/ar/slide-0.mp3
...
```

## Character Limits (Free Tier)

- **Free tier**: 10,000 characters/month
- **English story**: ~5,000 characters
- **Arabic story**: ~4,000 characters
- **Total both**: ~9,000 characters

## Troubleshooting

**"ELEVENLABS_API_KEY not set"**
- Make sure .env file has your key
- Run: `export $(cat .env | xargs)` before the command

**"API error: 401"**
- Invalid API key - check it at https://elevenlabs.io/app/settings/api-keys

**"API error: 429"**
- Rate limited - wait a minute and try again

**Character limit exceeded**
- Wait for monthly reset or upgrade plan
- Check usage: `node generate-audio-elevenlabs.js --usage`
