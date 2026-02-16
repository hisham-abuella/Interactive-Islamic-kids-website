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
        console.error('voice-scripts-data.json not found! Creating it...');
        createVoiceScriptsJson();
    }
    return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
}

// Create voice scripts JSON from the JS file
function createVoiceScriptsJson() {
    const voiceScripts = {
        "prophet-adam": {
            "en": [
                { "slide": 0, "title": "A Special Creation", "script": "Before there were any people on Earth, Allah decided to create something very special. Allah told the angels: I am going to create a human being from clay. Allah created Adam from different types of clay from all over the Earth. That's why people today have different skin colors - beautiful shades of brown, tan, and more!" },
                { "slide": 1, "title": "The Gift of Life", "script": "After shaping Adam's body from clay, Allah blew the soul into him. Suddenly, Adam opened his eyes! He could see, hear, think, and feel. SubhanAllah! The very first thing Adam said was Alhamdulillah - praising Allah!" },
                { "slide": 2, "title": "The Angels Bow Down", "script": "Allah commanded all the angels to bow down to Adam as a sign of respect. All the angels obeyed Allah and prostrated to Adam right away! This showed how special humans are to Allah." },
                { "slide": 3, "title": "One Who Refused", "script": "But there was one who did not bow - Iblis, also known as Shaytan. He was proud and arrogant. I am better than him! he said. You made me from fire and him from clay! Pride and arrogance are very bad. We should always be humble." },
                { "slide": 4, "title": "Adam Learns Names", "script": "Allah taught Adam the names of everything - animals, plants, objects, and more! When Allah asked the angels about these names, they didn't know. But Adam knew them all! This showed that Allah gave humans special knowledge." },
                { "slide": 5, "title": "A Companion for Adam", "script": "Allah created Hawa, also known as Eve, as a companion for Adam. They lived happily together in Jannah, which means Paradise. It was a beautiful garden with flowers everywhere, delicious fruits, rivers of pure water, friendly animals, and perfect weather always!" },
                { "slide": 6, "title": "One Rule", "script": "Allah told Adam and Hawa they could enjoy everything in Jannah, but there was ONE tree they should not go near. Do not approach this tree, Allah said. This rule was to test their obedience to Allah." },
                { "slide": 7, "title": "A Mistake", "script": "Shaytan whispered to Adam and Hawa and tricked them. They ate from the forbidden tree. As soon as they did, they realized they had made a big mistake! Shaytan is always trying to trick us. We must be careful and say A'udhu billahi min ash-shaytan ir-rajim to seek protection from him." },
                { "slide": 8, "title": "Asking for Forgiveness", "script": "Adam and Hawa felt very sorry. They turned to Allah and said: Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy on us, we will surely be among the losers. And SubhanAllah - Allah forgave them! Allah is the Most Merciful!" },
                { "slide": 9, "title": "A New Home on Earth", "script": "Adam and Hawa were sent to live on Earth. Allah told them that Earth would be their home, and from them would come all the people of the world - including you! We are all one big family, descendants of Adam and Hawa." },
                { "slide": 10, "title": "What We Learn", "script": "Let's remember what we learned from Prophet Adam. First, Allah created all humans, so we are all one family! Second, don't be proud like Iblis - always be humble. Third, when we make mistakes, we should ask Allah for forgiveness. And fourth, Allah is the Most Merciful and loves to forgive us." },
                { "slide": 11, "title": "Adam's Dua", "script": "Here is Adam's beautiful dua for forgiveness. In Arabic it is: Rabbana zalamna anfusana wa in lam taghfir lana wa tarhamna lanakoonanna minal khasireen. This means: Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers. You can say this dua whenever you make a mistake and want Allah's forgiveness!" },
                { "slide": 12, "title": "Quiz Time", "script": "Wow! You've completed the story of Prophet Adam! Now it's time for a fun quiz to see how much you remember. Answer these questions to earn bonus stars! Good luck!" },
                { "slide": 13, "title": "Question One", "script": "Question one: What was Adam created from? Was it Light, Clay, Fire, or Water? Take your time and choose the correct answer!" },
                { "slide": 14, "title": "Question Two", "script": "Question two: Who refused to bow to Adam? Was it the angels, Hawa, Iblis who is also called Shaytan, or the animals?" },
                { "slide": 15, "title": "Question Three", "script": "Question three: What happened when Adam asked Allah for forgiveness? Did Allah become angry, did Allah forgive him, did nothing happen, or did Adam have to wait?" },
                { "slide": 16, "title": "Amazing Job", "script": "Amazing job! You did wonderfully! You've learned so much about Prophet Adam today. Remember, when you make a mistake, say sorry to Allah - He loves to forgive! Keep earning stars and learning more stories!" },
                { "slide": 17, "title": "Bonus Video", "script": "Congratulations! You've unlocked a bonus video! Watch this beautiful animated story about Prophet Adam to see everything we learned come to life!" }
            ],
            "ar": [
                { "slide": 0, "title": "خلق مميز", "script": "قبل أن يكون هناك أي بشر على الأرض، قرر الله أن يخلق شيئاً مميزاً جداً. قال الله للملائكة: إني خالق بشراً من طين. خلق الله آدم من أنواع مختلفة من الطين من جميع أنحاء الأرض. لهذا السبب يملك الناس اليوم ألوان بشرة مختلفة!" },
                { "slide": 1, "title": "نعمة الحياة", "script": "بعد أن شكّل الله جسد آدم من الطين، نفخ فيه الروح. فجأة، فتح آدم عينيه! أصبح يستطيع أن يرى ويسمع ويفكر ويشعر. سبحان الله! أول شيء قاله آدم كان الحمد لله!" },
                { "slide": 2, "title": "الملائكة تسجد", "script": "أمر الله جميع الملائكة بالسجود لآدم تكريماً له. أطاعت جميع الملائكة الله وسجدت لآدم فوراً! هذا يُظهر مدى خصوصية الإنسان عند الله." },
                { "slide": 3, "title": "واحد رفض", "script": "لكن كان هناك واحد لم يسجد - إبليس، المعروف أيضاً بالشيطان. كان متكبراً ومغروراً. قال: أنا خير منه! خلقتني من نار وخلقته من طين! الكبر والغرور سيئان جداً. يجب أن نكون متواضعين دائماً." },
                { "slide": 4, "title": "آدم يتعلم الأسماء", "script": "علّم الله آدم أسماء كل شيء - الحيوانات والنباتات والأشياء وغيرها! عندما سأل الله الملائكة عن هذه الأسماء، لم يعرفوها. لكن آدم عرفها كلها! هذا يُظهر أن الله أعطى الإنسان علماً خاصاً." },
                { "slide": 5, "title": "رفيقة لآدم", "script": "خلق الله حواء لتكون رفيقة لآدم. عاشا معاً بسعادة في الجنة. كانت حديقة جميلة فيها زهور في كل مكان، وفواكه لذيذة، وأنهار من الماء النقي، وحيوانات ودودة، وطقس مثالي دائماً!" },
                { "slide": 6, "title": "قاعدة واحدة", "script": "أخبر الله آدم وحواء أنهما يستطيعان الاستمتاع بكل شيء في الجنة، لكن كانت هناك شجرة واحدة يجب ألا يقتربا منها. قال الله: ولا تقربا هذه الشجرة. كانت هذه القاعدة لاختبار طاعتهما لله." },
                { "slide": 7, "title": "خطأ", "script": "وسوس الشيطان لآدم وحواء وخدعهما. أكلا من الشجرة المحرمة. بمجرد أن فعلا ذلك، أدركا أنهما ارتكبا خطأً كبيراً! الشيطان يحاول دائماً خداعنا. يجب أن نكون حذرين ونقول أعوذ بالله من الشيطان الرجيم." },
                { "slide": 8, "title": "طلب المغفرة", "script": "شعر آدم وحواء بالندم الشديد. توجها إلى الله وقالا: ربنا ظلمنا أنفسنا وإن لم تغفر لنا وترحمنا لنكونن من الخاسرين. وسبحان الله - غفر الله لهما! الله أرحم الراحمين!" },
                { "slide": 9, "title": "منزل جديد على الأرض", "script": "أُرسل آدم وحواء للعيش على الأرض. أخبرهما الله أن الأرض ستكون موطنهما، ومنهما سيأتي جميع البشر في العالم - بما فيهم أنت! نحن جميعاً عائلة كبيرة واحدة، أحفاد آدم وحواء." },
                { "slide": 10, "title": "ما نتعلمه", "script": "دعونا نتذكر ما تعلمناه من النبي آدم. أولاً، خلق الله جميع البشر، فنحن جميعاً عائلة واحدة! ثانياً، لا تكن متكبراً مثل إبليس - كن متواضعاً دائماً. ثالثاً، عندما نخطئ، يجب أن نستغفر الله. ورابعاً، الله أرحم الراحمين ويحب أن يغفر لنا." },
                { "slide": 11, "title": "دعاء آدم", "script": "إليكم دعاء آدم الجميل للمغفرة: ربنا ظلمنا أنفسنا وإن لم تغفر لنا وترحمنا لنكونن من الخاسرين. يمكنك قول هذا الدعاء كلما أخطأت وأردت مغفرة الله!" },
                { "slide": 12, "title": "وقت الاختبار", "script": "رائع! لقد أكملت قصة النبي آدم! الآن حان وقت اختبار ممتع لنرى كم تتذكر. أجب على هذه الأسئلة لتكسب نجوماً إضافية! حظاً سعيداً!" },
                { "slide": 13, "title": "السؤال الأول", "script": "السؤال الأول: من ماذا خُلق آدم؟ هل كان من النور، أو الطين، أو النار، أو الماء؟ خذ وقتك واختر الإجابة الصحيحة!" },
                { "slide": 14, "title": "السؤال الثاني", "script": "السؤال الثاني: من رفض السجود لآدم؟ هل كانت الملائكة، أو حواء، أو إبليس الذي يُسمى أيضاً الشيطان، أو الحيوانات؟" },
                { "slide": 15, "title": "السؤال الثالث", "script": "السؤال الثالث: ماذا حدث عندما استغفر آدم الله؟ هل غضب الله، أو غفر الله له، أو لم يحدث شيء، أو كان على آدم الانتظار؟" },
                { "slide": 16, "title": "عمل رائع", "script": "عمل رائع! لقد أبدعت! تعلمت الكثير عن النبي آدم اليوم. تذكر، عندما تخطئ، استغفر الله - فهو يحب أن يغفر! استمر في كسب النجوم وتعلم المزيد من القصص!" },
                { "slide": 17, "title": "فيديو إضافي", "script": "تهانينا! لقد فتحت فيديو إضافي! شاهد هذه القصة المتحركة الجميلة عن النبي آدم لترى كل ما تعلمناه يتحول إلى حياة!" }
            ]
        }
    };

    const jsonPath = path.join(__dirname, 'voice-scripts-data.json');
    fs.writeFileSync(jsonPath, JSON.stringify(voiceScripts, null, 2));
    console.log('Created voice-scripts-data.json');
    return voiceScripts;
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
