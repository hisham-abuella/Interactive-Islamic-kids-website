#!/usr/bin/env node
/**
 * ElevenLabs Text-to-Speech Audio Generator
 * Generates audio files for Islamic Kids Stories narration
 *
 * Setup:
 * 1. Create account at https://elevenlabs.io/
 * 2. Get your API key from Profile Settings
 * 3. Set ELEVENLABS_API_KEY environment variable
 *
 * Usage:
 *   export ELEVENLABS_API_KEY="your-api-key-here"
 *   node generate-audio-elevenlabs.js [story-id] [language]
 *
 * Examples:
 *   node generate-audio-elevenlabs.js prophet-adam en
 *   node generate-audio-elevenlabs.js prophet-adam ar
 *   node generate-audio-elevenlabs.js prophet-adam        # generates both languages
 *
 * Free Tier: 10,000 characters/month
 */

const fs = require('fs');
const path = require('path');

// ElevenLabs API configuration
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

// Voice IDs - you can find more at https://api.elevenlabs.io/v1/voices
// These are default voices, you can replace with your preferred ones
const voiceConfig = {
    en: {
        voiceId: 'EXAVITQu4vr4xnSDxMaL', // Sarah - soft, friendly female voice
        modelId: 'eleven_turbo_v2_5'     // Fast, high quality (free tier compatible)
    },
    ar: {
        voiceId: 'EXAVITQu4vr4xnSDxMaL', // Using same voice with multilingual model
        modelId: 'eleven_turbo_v2_5'     // Supports 32 languages including Arabic
    }
};

// Voice settings optimized for kids' stories
const voiceSettings = {
    stability: 0.75,        // Higher = more consistent
    similarity_boost: 0.75, // Higher = more similar to original voice
    style: 0.5,             // Expressiveness
    use_speaker_boost: true
};

// Load voice scripts from JSON
function loadVoiceScripts() {
    const jsonPath = path.join(__dirname, 'voice-scripts-data.json');
    if (!fs.existsSync(jsonPath)) {
        // The stale embedded copy that used to be rebuilt here held old scripts (including a
        // transliterated ayah, removed by the no-recitation rule). The JSON is the only source.
        console.error('voice-scripts-data.json not found: it is the single source of narration text.');
        process.exit(1);
    }
    return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
}


// Generate audio using ElevenLabs API
async function generateAudio(storyId, lang) {
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
        console.error('\nError: ELEVENLABS_API_KEY environment variable not set!');
        console.error('Run: export ELEVENLABS_API_KEY="your-api-key-here"');
        process.exit(1);
    }

    const voiceScripts = loadVoiceScripts();
    const story = voiceScripts[storyId];

    if (!story) {
        console.error(`Story "${storyId}" not found!`);
        return;
    }

    const scripts = story[lang];
    if (!scripts) {
        console.error(`Language "${lang}" not found for story "${storyId}"!`);
        return;
    }

    const config = voiceConfig[lang];

    // Create output directory
    const outputDir = path.join(__dirname, '..', 'audio', storyId, lang);
    fs.mkdirSync(outputDir, { recursive: true });

    console.log(`\nGenerating audio for: ${storyId} (${lang})`);
    console.log(`Output directory: ${outputDir}`);
    console.log(`Total slides: ${scripts.length}`);
    console.log(`Voice ID: ${config.voiceId}`);
    console.log(`Model: ${config.modelId}\n`);

    let totalChars = 0;

    for (const script of scripts) {
        const slideNum = script.slide;
        const text = script.script;
        const title = script.title;
        totalChars += text.length;

        console.log(`  [${slideNum + 1}/${scripts.length}] ${title}...`);

        try {
            const response = await fetch(`${ELEVENLABS_API_URL}/${config.voiceId}`, {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': apiKey
                },
                body: JSON.stringify({
                    text: text,
                    model_id: config.modelId,
                    voice_settings: voiceSettings
                })
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`API error: ${response.status} - ${error}`);
            }

            const audioBuffer = await response.arrayBuffer();
            const outputPath = path.join(outputDir, `slide-${slideNum}.mp3`);
            fs.writeFileSync(outputPath, Buffer.from(audioBuffer));

            console.log(`      ✓ Saved: slide-${slideNum}.mp3 (${text.length} chars)`);

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));

        } catch (error) {
            console.error(`      ✗ Error: ${error.message}`);
        }
    }

    console.log(`\n✓ Completed ${lang} audio generation for ${storyId}!`);
    console.log(`  Total characters used: ${totalChars}`);
}

// List available voices
async function listVoices() {
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
        console.error('ELEVENLABS_API_KEY not set!');
        process.exit(1);
    }

    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: { 'xi-api-key': apiKey }
    });

    const data = await response.json();

    console.log('\nAvailable Voices:\n');
    for (const voice of data.voices) {
        console.log(`  ${voice.name}`);
        console.log(`    ID: ${voice.voice_id}`);
        console.log(`    Labels: ${JSON.stringify(voice.labels)}`);
        console.log('');
    }
}

// Check character usage
async function checkUsage() {
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
        console.error('ELEVENLABS_API_KEY not set!');
        process.exit(1);
    }

    const response = await fetch('https://api.elevenlabs.io/v1/user/subscription', {
        headers: { 'xi-api-key': apiKey }
    });

    const data = await response.json();

    console.log('\nElevenLabs Usage:\n');
    console.log(`  Characters used: ${data.character_count} / ${data.character_limit}`);
    console.log(`  Remaining: ${data.character_limit - data.character_count}`);
    console.log(`  Reset date: ${data.next_character_count_reset_unix ? new Date(data.next_character_count_reset_unix * 1000).toLocaleDateString() : 'N/A'}`);
}

async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    console.log('='.repeat(50));
    console.log('ElevenLabs TTS Audio Generator');
    console.log('Islamic Kids Stories');
    console.log('='.repeat(50));

    if (command === '--voices') {
        await listVoices();
        return;
    }

    if (command === '--usage') {
        await checkUsage();
        return;
    }

    if (command === '--help' || command === '-h') {
        console.log(`
Usage:
  node generate-audio-elevenlabs.js [story-id] [language]
  node generate-audio-elevenlabs.js --voices    List available voices
  node generate-audio-elevenlabs.js --usage     Check character usage

Examples:
  node generate-audio-elevenlabs.js prophet-adam en
  node generate-audio-elevenlabs.js prophet-adam ar
  node generate-audio-elevenlabs.js prophet-adam     # both languages

Environment:
  ELEVENLABS_API_KEY    Your ElevenLabs API key (required)
        `);
        return;
    }

    const storyId = command || 'prophet-adam';
    const lang = args[1];

    if (lang) {
        await generateAudio(storyId, lang);
    } else {
        await generateAudio(storyId, 'en');
        await generateAudio(storyId, 'ar');
    }

    console.log('\nAll done!');
    await checkUsage();
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { generateAudio, listVoices, checkUsage };
