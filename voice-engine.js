/**
 * WonderKids Voice Engine
 * Provides a consistent, high-pitched child-like voice across the entire application.
 */

window.VoiceEngine = {
    // Configuration
    pitch: 1.6,
    rate: 1.0,
    volume: 1.0,
    isMuted: false,

    /**
     * Finds the best child-like voice available in the browser.
     */
    getBestVoice: function () {
        const voices = window.speechSynthesis.getVoices();
        // Priority list for youthful/friendly sounding voices
        const priorities = [
            'Google US English',
            'Microsoft Aria Online',
            'Microsoft Zira',
            'Female',
            'Samantha'
        ];

        for (let name of priorities) {
            const voice = voices.find(v => v.name.includes(name));
            if (voice) return voice;
        }
        return voices[0];
    },

    /**
     * Unified speak function.
     * Use this instead of local speak functions.
     */
    speak: function (text, callback) {
        if (this.isMuted) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = this.pitch;
        utterance.rate = this.rate;
        utterance.volume = this.volume;

        const voice = this.getBestVoice();
        if (voice) utterance.voice = voice;

        utterance.onend = () => {
            if (callback) callback();
        };

        window.speechSynthesis.speak(utterance);
        console.log(`[VoiceEngine] Speaking: "${text}" with voice: ${voice ? voice.name : 'default'}`);
    },

    toggleMute: function () {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }
};

// Global shorthand
window.speak = function (text, callback) {
    window.VoiceEngine.speak(text, callback);
};

// Ensure voices are loaded (some browsers load them asynchronously)
window.speechSynthesis.onvoiceschanged = () => {
    console.log("[VoiceEngine] Voices loaded and ready!");
};
