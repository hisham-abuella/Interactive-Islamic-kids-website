#!/usr/bin/env node
/**
 * Google Cloud Text-to-Speech Audio Generator (BACKUP)
 * Generates audio files for Islamic Kids Stories narration
 *
 * Prerequisites:
 * 1. Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install
 * 2. Create a project in Google Cloud Console
 * 3. Enable Text-to-Speech API
 * 4. Create service account and download JSON key
 * 5. Set GOOGLE_APPLICATION_CREDENTIALS environment variable
 *
 * Usage:
 *   node generate-audio-google.js [story-id] [language]
 *
 * Examples:
 *   node generate-audio-google.js prophet-adam en
 *   node generate-audio-google.js prophet-adam ar
 *   node generate-audio-google.js prophet-adam        # generates both languages
 */

const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

// Voice configurations for each language
const voiceConfig = {
    en: {
        languageCode: 'en-US',
        name: 'en-US-Wavenet-F', // Female voice, good for kids
        ssmlGender: 'FEMALE'
    },
    ar: {
        languageCode: 'ar-XA',
        name: 'ar-XA-Wavenet-A', // Arabic female voice
        ssmlGender: 'FEMALE'
    }
};

// Audio encoding settings
const audioConfig = {
    audioEncoding: 'MP3',
    speakingRate: 0.9, // Slightly slower for kids
    pitch: 0, // Normal pitch
    volumeGainDb: 0
};

// Voice scripts data (copy from voice-scripts.js)
const voiceScripts = require('./voice-scripts-data.json');

async function generateAudio(storyId, lang) {
    const client = new textToSpeech.TextToSpeechClient();

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

    // Create output directory
    const outputDir = path.join(__dirname, '..', '..', 'audio', storyId, lang);
    fs.mkdirSync(outputDir, { recursive: true });

    console.log(`\nGenerating audio for: ${storyId} (${lang})`);
    console.log(`Output directory: ${outputDir}`);
    console.log(`Total slides: ${scripts.length}\n`);

    for (const script of scripts) {
        const slideNum = script.slide;
        const text = script.script;
        const title = script.title;

        console.log(`  [${slideNum + 1}/${scripts.length}] ${title}...`);

        const request = {
            input: { text: text },
            voice: voiceConfig[lang],
            audioConfig: audioConfig
        };

        try {
            const [response] = await client.synthesizeSpeech(request);

            const outputPath = path.join(outputDir, `slide-${slideNum}.mp3`);
            fs.writeFileSync(outputPath, response.audioContent, 'binary');

            console.log(`      Saved: slide-${slideNum}.mp3`);
        } catch (error) {
            console.error(`      Error: ${error.message}`);
        }
    }

    console.log(`\nCompleted ${lang} audio generation for ${storyId}!`);
}

async function main() {
    const args = process.argv.slice(2);
    const storyId = args[0] || 'prophet-adam';
    const lang = args[1];

    console.log('='.repeat(50));
    console.log('Google Cloud TTS Audio Generator');
    console.log('Islamic Kids Stories');
    console.log('='.repeat(50));

    // Check for credentials
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        console.warn('\nWarning: GOOGLE_APPLICATION_CREDENTIALS not set!');
        console.warn('Make sure to set this environment variable to your service account key path.\n');
    }

    if (lang) {
        // Generate for specific language
        await generateAudio(storyId, lang);
    } else {
        // Generate for both languages
        await generateAudio(storyId, 'en');
        await generateAudio(storyId, 'ar');
    }

    console.log('\nAll done!');
}

// Check if running directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { generateAudio };
