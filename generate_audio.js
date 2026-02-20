import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import wav from 'wav';

async function saveWaveFile(
    filename,
    pcmData,
    channels = 1,
    rate = 24000,
    sampleWidth = 2,
) {
    return new Promise((resolve, reject) => {
        const writer = new wav.FileWriter(filename, {
            channels,
            sampleRate: rate,
            bitDepth: sampleWidth * 8,
        });

        writer.on('finish', resolve);
        writer.on('error', reject);

        writer.write(pcmData);
        writer.end();
    });
}

async function main() {
    // Replace with your actual Gemini API Key
    const genAI = new GoogleGenerativeAI("YOUR_GEMINI_API_KEY");

    // Use Gemini 2.0 Flash which supports high-quality audio output
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
    });

    console.log("Generating child voice audio...");

    const response = await model.generateContent({
        contents: [{
            parts: [{
                text: 'Say cheerfully in a sweet child-like voice: Hello little friend! Let\'s learn our numbers and letters together today. It\'s going to be so much fun!'
            }]
        }],
        generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: {
                        // 'Kore' is a bright, youthful voice suitable for children's content
                        voiceName: 'Kore'
                    },
                },
            },
        },
    });

    // Extract the base64 audio data
    const data = response.response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!data) {
        console.error("No audio data received. Check your API key and model access.");
        return;
    }

    const audioBuffer = Buffer.from(data, 'base64');
    const fileName = 'child_voice_welcome.wav';

    await saveWaveFile(fileName, audioBuffer);
    console.log(`Success! Audio saved to ${fileName}`);
}

main().catch(console.error);
