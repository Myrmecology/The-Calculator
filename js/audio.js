/* ================================
   CYBERPUNK CALCULATOR - AUDIO MANAGER
   Web Audio API implementation with procedural sound generation
   ================================ */

'use strict';

class AudioManager {
    constructor() {
        // Audio context setup
        this.audioContext = null;
        this.isEnabled = true;
        this.volume = 0.3;
        
        // Sound cache
        this.soundCache = new Map();
        
        // Audio settings
        this.settings = {
            sampleRate: 44100,
            clickFrequency: 800,
            clickDuration: 0.1,
            equalsFrequency: 400,
            equalsDuration: 0.3,
            errorFrequency: 200,
            errorDuration: 0.5,
            easterEggDuration: 1.0
        };
        
        // Audio nodes
        this.masterGain = null;
        
        this.init();
    }
    
    /* ================================
       INITIALIZATION
       ================================ */
    
    async init() {
        try {
            await this.initializeAudioContext();
            this.createMasterGain();
            this.setupVolumeControl();
            this.preloadSounds();
            
            console.log('🔊 Audio Manager initialized');
        } catch (error) {
            console.warn('Audio initialization failed:', error);
            this.isEnabled = false;
        }
    }
    
    async initializeAudioContext() {
        // Handle different browser implementations
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        
        if (!AudioContext) {
            throw new Error('Web Audio API not supported');
        }
        
        this.audioContext = new AudioContext();
        
        // Handle suspended state (required by browsers for user interaction)
        if (this.audioContext.state === 'suspended') {
            await this.resumeAudioContext();
        }
    }
    
    async resumeAudioContext() {
        // Resume audio context on first user interaction
        const resumeAudio = async () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
                console.log('🎵 Audio context resumed');
            }
        };
        
        // Listen for user interaction
        const events = ['touchstart', 'touchend', 'mousedown', 'keydown'];
        const handler = () => {
            resumeAudio();
            events.forEach(event => {
                document.removeEventListener(event, handler, true);
            });
        };
        
        events.forEach(event => {
            document.addEventListener(event, handler, true);
        });
    }
    
    createMasterGain() {
        if (!this.audioContext) return;
        
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = this.volume;
        this.masterGain.connect(this.audioContext.destination);
    }
    
    setupVolumeControl() {
        // Create volume control UI (optional)
        this.createVolumeToggle();
    }
    
    createVolumeToggle() {
        const volumeToggle = document.createElement('button');
        volumeToggle.className = 'volume-toggle';
        volumeToggle.innerHTML = '🔊';
        volumeToggle.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid #00ffff;
            color: #00ffff;
            padding: 8px;
            border-radius: 4px;
            cursor: pointer;
            z-index: 1000;
            font-size: 16px;
            transition: all 0.3s ease;
        `;
        
        volumeToggle.addEventListener('click', () => {
            this.toggleAudio();
            volumeToggle.innerHTML = this.isEnabled ? '🔊' : '🔇';
        });
        
        document.body.appendChild(volumeToggle);
    }
    
    preloadSounds() {
        // Pre-generate common sounds for better performance
        this.generateSound('click');
        this.generateSound('equals');
        this.generateSound('error');
    }
    
    /* ================================
       SOUND GENERATION
       ================================ */
    
    generateSound(type) {
        if (!this.audioContext) return null;
        
        let audioBuffer;
        
        switch (type) {
            case 'click':
                audioBuffer = this.generateClickSound();
                break;
            case 'equals':
                audioBuffer = this.generateEqualsSound();
                break;
            case 'error':
                audioBuffer = this.generateErrorSound();
                break;
            case 'easter-egg':
                audioBuffer = this.generateEasterEggSound();
                break;
            case 'beep':
                audioBuffer = this.generateBeepSound();
                break;
            case 'success':
                audioBuffer = this.generateSuccessSound();
                break;
            default:
                audioBuffer = this.generateClickSound();
        }
        
        // Cache the generated sound
        if (audioBuffer) {
            this.soundCache.set(type, audioBuffer);
        }
        
        return audioBuffer;
    }
    
    generateClickSound() {
        const duration = this.settings.clickDuration;
        const sampleRate = this.audioContext.sampleRate;
        const numSamples = sampleRate * duration;
        
        const audioBuffer = this.audioContext.createBuffer(1, numSamples, sampleRate);
        const channelData = audioBuffer.getChannelData(0);
        
        for (let i = 0; i < numSamples; i++) {
            const t = i / sampleRate;
            const envelope = Math.exp(-t * 10); // Exponential decay
            const frequency = this.settings.clickFrequency;
            
            // Generate sine wave with envelope
            channelData[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.3;
        }
        
        return audioBuffer;
    }
    
    generateEqualsSound() {
        const duration = this.settings.equalsDuration;
        const sampleRate = this.audioContext.sampleRate;
        const numSamples = sampleRate * duration;
        
        const audioBuffer = this.audioContext.createBuffer(1, numSamples, sampleRate);
        const channelData = audioBuffer.getChannelData(0);
        
        for (let i = 0; i < numSamples; i++) {
            const t = i / sampleRate;
            const envelope = Math.exp(-t * 3);
            
            // Chord progression for satisfying equals sound
            const freq1 = this.settings.equalsFrequency;
            const freq2 = freq1 * 1.25; // Perfect fourth
            const freq3 = freq1 * 1.5;  // Perfect fifth
            
            const wave1 = Math.sin(2 * Math.PI * freq1 * t);
            const wave2 = Math.sin(2 * Math.PI * freq2 * t) * 0.7;
            const wave3 = Math.sin(2 * Math.PI * freq3 * t) * 0.5;
            
            channelData[i] = (wave1 + wave2 + wave3) * envelope * 0.2;
        }
        
        return audioBuffer;
    }
    
    generateErrorSound() {
        const duration = this.settings.errorDuration;
        const sampleRate = this.audioContext.sampleRate;
        const numSamples = sampleRate * duration;
        
        const audioBuffer = this.audioContext.createBuffer(1, numSamples, sampleRate);
        const channelData = audioBuffer.getChannelData(0);
        
        for (let i = 0; i < numSamples; i++) {
            const t = i / sampleRate;
            const envelope = Math.exp(-t * 2);
            
            // Dissonant sound for errors
            const freq = this.settings.errorFrequency + Math.sin(t * 20) * 50;
            const noise = (Math.random() - 0.5) * 0.1;
            
            channelData[i] = (Math.sin(2 * Math.PI * freq * t) + noise) * envelope * 0.3;
        }
        
        return audioBuffer;
    }
    
    generateEasterEggSound() {
        const duration = this.settings.easterEggDuration;
        const sampleRate = this.audioContext.sampleRate;
        const numSamples = sampleRate * duration;
        
        const audioBuffer = this.audioContext.createBuffer(1, numSamples, sampleRate);
        const channelData = audioBuffer.getChannelData(0);
        
        // Classic 8-bit style melody
        const notes = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C
        const noteLength = numSamples / notes.length;
        
        for (let i = 0; i < numSamples; i++) {
            const noteIndex = Math.floor(i / noteLength);
            const t = (i % noteLength) / sampleRate;
            const frequency = notes[noteIndex] || notes[0];
            
            const envelope = Math.max(0, 1 - (t / (noteLength / sampleRate)) * 4);
            
            // Square wave for retro sound
            const squareWave = Math.sign(Math.sin(2 * Math.PI * frequency * t));
            
            channelData[i] = squareWave * envelope * 0.2;
        }
        
        return audioBuffer;
    }
    
    generateBeepSound() {
        const duration = 0.2;
        const sampleRate = this.audioContext.sampleRate;
        const numSamples = sampleRate * duration;
        
        const audioBuffer = this.audioContext.createBuffer(1, numSamples, sampleRate);
        const channelData = audioBuffer.getChannelData(0);
        
        for (let i = 0; i < numSamples; i++) {
            const t = i / sampleRate;
            const envelope = 1 - t / duration;
            const frequency = 1000;
            
            channelData[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.3;
        }
        
        return audioBuffer;
    }
    
    generateSuccessSound() {
        const duration = 0.8;
        const sampleRate = this.audioContext.sampleRate;
        const numSamples = sampleRate * duration;
        
        const audioBuffer = this.audioContext.createBuffer(1, numSamples, sampleRate);
        const channelData = audioBuffer.getChannelData(0);
        
        // Ascending arpeggio
        const frequencies = [262, 330, 392, 523, 659]; // C major arpeggio
        const segmentLength = numSamples / frequencies.length;
        
        for (let i = 0; i < numSamples; i++) {
            const segmentIndex = Math.floor(i / segmentLength);
            const t = i / sampleRate;
            const frequency = frequencies[segmentIndex] || frequencies[0];
            
            const envelope = Math.exp(-(t % (segmentLength / sampleRate)) * 5);
            
            channelData[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.25;
        }
        
        return audioBuffer;
    }
    
    /* ================================
       SOUND PLAYBACK
       ================================ */
    
    playSound(type, volume = 1.0) {
        if (!this.isEnabled || !this.audioContext || !this.masterGain) {
            return;
        }
        
        try {
            // Get or generate the sound
            let audioBuffer = this.soundCache.get(type);
            if (!audioBuffer) {
                audioBuffer = this.generateSound(type);
            }
            
            if (!audioBuffer) return;
            
            // Create audio source
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            
            source.buffer = audioBuffer;
            gainNode.gain.value = volume * this.volume;
            
            // Connect audio graph
            source.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            // Play the sound
            source.start();
            
            // Clean up after playback
            source.onended = () => {
                source.disconnect();
                gainNode.disconnect();
            };
            
        } catch (error) {
            console.warn('Sound playback failed:', error);
        }
    }
    
    playSequence(sounds, interval = 200) {
        sounds.forEach((sound, index) => {
            setTimeout(() => {
                if (typeof sound === 'string') {
                    this.playSound(sound);
                } else {
                    this.playSound(sound.type, sound.volume || 1.0);
                }
            }, index * interval);
        });
    }
    
    /* ================================
       ADVANCED SOUND EFFECTS
       ================================ */
    
    playFrequencySweep(startFreq, endFreq, duration = 1.0) {
        if (!this.isEnabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(startFreq, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(endFreq, this.audioContext.currentTime + duration);
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playWhiteNoise(duration = 0.1, volume = 0.1) {
        if (!this.isEnabled || !this.audioContext) return;
        
        const bufferSize = this.audioContext.sampleRate * duration;
        const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const channelData = noiseBuffer.getChannelData(0);
        
        // Generate white noise
        for (let i = 0; i < bufferSize; i++) {
            channelData[i] = (Math.random() - 0.5) * 2;
        }
        
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        
        source.buffer = noiseBuffer;
        gainNode.gain.value = volume;
        
        source.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        source.start();
        
        source.onended = () => {
            source.disconnect();
            gainNode.disconnect();
        };
    }
    
    /* ================================
       AUDIO CONTROL
       ================================ */
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.masterGain) {
            this.masterGain.gain.value = this.volume;
        }
    }
    
    toggleAudio() {
        this.isEnabled = !this.isEnabled;
        if (!this.isEnabled && this.masterGain) {
            this.masterGain.gain.value = 0;
        } else if (this.isEnabled && this.masterGain) {
            this.masterGain.gain.value = this.volume;
        }
        return this.isEnabled;
    }
    
    mute() {
        this.isEnabled = false;
        if (this.masterGain) {
            this.masterGain.gain.value = 0;
        }
    }
    
    unmute() {
        this.isEnabled = true;
        if (this.masterGain) {
            this.masterGain.gain.value = this.volume;
        }
    }
    
    /* ================================
       CLEANUP AND UTILITIES
       ================================ */
    
    cleanup() {
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        this.soundCache.clear();
    }
    
    getAudioInfo() {
        return {
            isEnabled: this.isEnabled,
            volume: this.volume,
            contextState: this.audioContext ? this.audioContext.state : 'none',
            cachedSounds: Array.from(this.soundCache.keys())
        };
    }
    
    /* ================================
       STATIC METHODS
       ================================ */
    
    static playSound(type, volume) {
        if (AudioManager.instance) {
            AudioManager.instance.playSound(type, volume);
        }
    }
    
    static setVolume(volume) {
        if (AudioManager.instance) {
            AudioManager.instance.setVolume(volume);
        }
    }
    
    static toggleAudio() {
        if (AudioManager.instance) {
            return AudioManager.instance.toggleAudio();
        }
        return false;
    }
    
    static getInstance() {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }
}

/* ================================
   INITIALIZE AUDIO MANAGER
   ================================ */

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.audioManager = AudioManager.getInstance();
    });
} else {
    window.audioManager = AudioManager.getInstance();
}

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden && AudioManager.instance) {
        AudioManager.instance.mute();
    } else if (!document.hidden && AudioManager.instance) {
        AudioManager.instance.unmute();
    }
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}