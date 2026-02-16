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
