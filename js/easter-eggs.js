/* ================================
   CYBERPUNK CALCULATOR - EASTER EGGS
   Hidden features and special interactions
   ================================ */

'use strict';

class EasterEggs {
    constructor() {
        // Easter egg configuration
        this.easterEggs = new Map([
            [1337, { type: 'leet', message: 'ELITE HACKER MODE', effect: 'matrix' }],
            [404, { type: 'error', message: 'ERROR: CALCULATION NOT FOUND', effect: 'glitch' }],
            [69, { type: 'nice', message: 'NICE', effect: 'rainbow' }],
            [420, { type: 'blaze', message: 'BLAZING CALCULATIONS', effect: 'green-glow' }],
            [42, { type: 'answer', message: 'THE ANSWER TO EVERYTHING', effect: 'hologram' }],
            [666, { type: 'devil', message: 'DIABOLICAL NUMBERS', effect: 'red-glow' }],
            [777, { type: 'lucky', message: 'LUCKY NUMBER!', effect: 'golden' }],
            [8008, { type: 'retro', message: 'CLASSIC CALCULATOR HUMOR', effect: 'flip' }],
            [1984, { type: 'orwell', message: 'BIG BROTHER IS CALCULATING', effect: 'surveillance' }],
            [3.14159, { type: 'pi', message: 'PI DETECTED', effect: 'circle' }],
            [2.71828, { type: 'euler', message: 'EULER\'S NUMBER', effect: 'spiral' }],
            [0, { type: 'zero', message: 'THE VOID STARES BACK', effect: 'void' }]
        ]);
        
        // Special sequences and combinations
        this.sequences = {
            konami: [38, 38, 40, 40, 37, 39, 37, 39, 66, 65], // ↑↑↓↓←→←→BA
            fibonacci: [1, 1, 2, 3, 5, 8, 13, 21],
            primes: [2, 3, 5, 7, 11, 13, 17, 19]
        };
        
        // State tracking
        this.state = {
            lastResults: [],
            sequenceProgress: {},
            specialModeActive: null,
            easterEggCount: 0
        };
        
        // DOM references
        this.messageContainer = document.getElementById('easterEggContainer');
        this.messageElement = document.getElementById('easterEggMessage');
        
        this.init();
    }
    
    /* ================================
       INITIALIZATION
       ================================ */
    
    init() {
        this.setupKeyboardSequences();
        this.setupSpecialDateEffects();
        this.createHiddenFeatures();
        
        console.log('🥚 Easter Eggs initialized - ' + this.easterEggs.size + ' secrets loaded');
    }
    
    setupKeyboardSequences() {
        let konamiSequence = [];
        
        document.addEventListener('keydown', (e) => {
            konamiSequence.push(e.keyCode);
            
            // Keep only the last 10 keys
            if (konamiSequence.length > 10) {
                konamiSequence.shift();
            }
            
            // Check for Konami code
            if (this.arraysEqual(konamiSequence, this.sequences.konami)) {
                this.triggerKonamiCode();
                konamiSequence = [];
            }
        });
    }
    
    setupSpecialDateEffects() {
        const now = new Date();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        
        // Special dates
        if (month === 3 && day === 14) { // Pi Day
            this.triggerSpecialDate('pi-day');
        } else if (month === 4 && day === 20) { // 4/20
            this.triggerSpecialDate('420-day');
        } else if (month === 10 && day === 31) { // Halloween
            this.triggerSpecialDate('halloween');
        } else if (month === 12 && day === 25) { // Christmas
            this.triggerSpecialDate('christmas');
        }
    }
    
    createHiddenFeatures() {
        // Secret developer mode (10 clicks on display)
        let clickCount = 0;
        const display = document.querySelector('.display');
        
        if (display) {
            display.addEventListener('click', () => {
                clickCount++;
                if (clickCount === 10) {
                    this.activateDeveloperMode();
                    clickCount = 0;
                }
                
                // Reset counter after 5 seconds
                setTimeout(() => {
                    if (clickCount < 10) clickCount = 0;
                }, 5000);
            });
        }
    }
    
    /* ================================
       EASTER EGG DETECTION
       ================================ */
    
    checkResult(result) {
        // Convert to number and check for exact matches
        const num = parseFloat(result);
        
        // Check exact matches
        if (this.easterEggs.has(num)) {
            this.triggerEasterEgg(num);
            return true;
        }
        
        // Check approximate matches for special numbers
        if (Math.abs(num - Math.PI) < 0.001) {
            this.triggerEasterEgg(3.14159);
            return true;
        }
        
        if (Math.abs(num - Math.E) < 0.001) {
            this.triggerEasterEgg(2.71828);
            return true;
        }
        
        // Check for palindromes
        if (this.isPalindrome(result.toString())) {
            this.triggerPalindrome(result);
            return true;
        }
        
        // Check for repeated digits
        if (this.hasRepeatedDigits(result.toString())) {
            this.triggerRepeatedDigits(result);
            return true;
        }
        
        // Track result for sequence detection
        this.trackResult(result);
        
        return false;
    }
    
    checkDivisionByZero() {
        this.showEasterEggMessage('DIVIDE BY ZERO ERROR', 'You broke mathematics!', 'glitch');
        EffectsManager.glitchEffect();
        AudioManager.playSound('error');
        
        // Special void effect
        setTimeout(() => {
            this.createVoidEffect();
        }, 500);
    }
    
    /* ================================
       EASTER EGG TRIGGERS
       ================================ */
    
    triggerEasterEgg(number) {
        const egg = this.easterEggs.get(number);
        if (!egg) return;
        
        this.state.easterEggCount++;
        
        // Show message
        this.showEasterEggMessage(egg.message, this.getEasterEggDescription(egg.type), egg.effect);
        
        // Trigger visual effect
        this.triggerVisualEffect(egg.effect);
        
        // Play special sound
        AudioManager.playSound('easter-egg');
        
        // Log achievement
        console.log(`🥚 Easter egg triggered: ${egg.type} (${number})`);
        
        // Special handling for certain easter eggs
        this.handleSpecialEasterEgg(egg.type, number);
    }
    
    triggerKonamiCode() {
        this.showEasterEggMessage('KONAMI CODE ACTIVATED!', 'You are a true gamer', 'matrix');
        EffectsManager.easterEggEffect('matrix');
        AudioManager.playSequence(['success', 'easter-egg', 'success'], 300);
        
        // Activate rainbow mode for 10 seconds
        EffectsManager.getInstance().rainbowMode(true);
        setTimeout(() => {
            EffectsManager.getInstance().rainbowMode(false);
        }, 10000);
    }
    
    triggerDivisionByZero() {
        this.showEasterEggMessage('UNDEFINED BEHAVIOR', 'You\'ve entered the void', 'void');
        this.createVoidEffect();
        AudioManager.playFrequencySweep(1000, 100, 2.0);
    }
    
    triggerSpecialDate(dateType) {
        const messages = {
            'pi-day': { text: 'HAPPY PI DAY!', desc: 'π = 3.14159...', effect: 'circle' },
            '420-day': { text: 'HAPPY 420!', desc: 'Blazing calculations', effect: 'green-glow' },
            'halloween': { text: 'SPOOKY CALCULATIONS!', desc: 'BOO!', effect: 'spooky' },
            'christmas': { text: 'MERRY CALCUMAS!', desc: 'Ho ho ho!', effect: 'festive' }
        };
        
        const message = messages[dateType];
        if (message) {
            this.showEasterEggMessage(message.text, message.desc, message.effect);
            this.triggerVisualEffect(message.effect);
        }
    }
    
    triggerPalindrome(result) {
        this.showEasterEggMessage('PALINDROME DETECTED!', `${result} reads the same forwards and backwards`, 'mirror');
        this.createMirrorEffect();
        AudioManager.playSound('success');
    }
    
    triggerRepeatedDigits(result) {
        this.showEasterEggMessage('REPEATED DIGITS!', `${result} has a pattern`, 'pattern');
        this.createPatternEffect();
        AudioManager.playSound('beep');
    }
    
    /* ================================
       VISUAL EFFECTS
       ================================ */
    
    triggerVisualEffect(effectType) {
        switch (effectType) {
            case 'matrix':
                EffectsManager.easterEggEffect('matrix');
                break;
            case 'glitch':
                EffectsManager.easterEggEffect('glitch');
                break;
            case 'rainbow':
                EffectsManager.easterEggEffect('rainbow');
                break;
            case 'green-glow':
                this.createColorGlow('#00ff00');
                break;
            case 'red-glow':
                this.createColorGlow('#ff0000');
                break;
            case 'golden':
                this.createColorGlow('#ffd700');
                break;
            case 'hologram':
                EffectsManager.easterEggEffect('hologram');
                break;
            case 'void':
                this.createVoidEffect();
                break;
            case 'circle':
                this.createCircleEffect();
                break;
            case 'spiral':
                this.createSpiralEffect();
                break;
            case 'flip':
                this.createFlipEffect();
                break;
            case 'surveillance':
                this.createSurveillanceEffect();
                break;
            case 'spooky':
                this.createSpookyEffect();
                break;
            case 'festive':
                this.createFestiveEffect();
                break;
            default:
                EffectsManager.createParticleExplosion();
        }
    }
    
    createColorGlow(color) {
        const calculator = document.querySelector('.calculator');
        if (calculator) {
            calculator.style.borderColor = color;
            calculator.style.boxShadow = `0 0 30px ${color}`;
            
            setTimeout(() => {
                calculator.style.borderColor = '';
                calculator.style.boxShadow = '';
            }, 3000);
        }
    }
    
    createVoidEffect() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, transparent 30%, black 70%);
            z-index: 1000;
            pointer-events: none;
            animation: voidPulse 2s ease-out forwards;
        `;
        
        document.body.appendChild(overlay);
        
        // Add animation keyframes
        if (!document.querySelector('#voidKeyframes')) {
            const style = document.createElement('style');
            style.id = 'voidKeyframes';
            style.textContent = `
                @keyframes voidPulse {
                    0% { opacity: 0; }
                    50% { opacity: 0.8; }
                    100% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            overlay.remove();
        }, 2000);
    }
    
    createMirrorEffect() {
        const calculator = document.querySelector('.calculator');
        if (calculator) {
            calculator.style.transform = 'scaleX(-1)';
            setTimeout(() => {
                calculator.style.transform = 'scaleX(1)';
            }, 1000);
        }
    }
    
    createPatternEffect() {
        const display = document.querySelector('.display-text');
        if (display) {
            display.style.backgroundImage = 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,255,255,0.1) 2px, rgba(0,255,255,0.1) 4px)';
            setTimeout(() => {
                display.style.backgroundImage = '';
            }, 2000);
        }
    }
    
    createCircleEffect() {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const circle = document.createElement('div');
                circle.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    width: ${50 + i * 20}px;
                    height: ${50 + i * 20}px;
                    border: 2px solid rgba(0, 255, 255, ${1 - i * 0.1});
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    pointer-events: none;
                    z-index: 100;
                    animation: expandFade 2s ease-out forwards;
                `;
                
                document.body.appendChild(circle);
                
                setTimeout(() => circle.remove(), 2000);
            }, i * 100);
        }
        
        // Add keyframes if not exists
        if (!document.querySelector('#circleKeyframes')) {
            const style = document.createElement('style');
            style.id = 'circleKeyframes';
            style.textContent = `
                @keyframes expandFade {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    createSpiralEffect() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const angle = (i / 20) * Math.PI * 4;
                const radius = i * 10;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                
                EffectsManager.createParticleExplosion(x, y);
            }, i * 100);
        }
    }
    
    createFlipEffect() {
        const calculator = document.querySelector('.calculator');
        if (calculator) {
            calculator.style.animation = 'flip 1s ease-in-out';
            
            if (!document.querySelector('#flipKeyframes')) {
                const style = document.createElement('style');
                style.id = 'flipKeyframes';
                style.textContent = `
                    @keyframes flip {
                        0% { transform: rotateY(0deg); }
                        50% { transform: rotateY(180deg); }
                        100% { transform: rotateY(0deg); }
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }
    
    createSurveillanceEffect() {
        // Create scanning effect
        const scanner = document.createElement('div');
        scanner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, #ff0000, transparent);
            z-index: 1000;
            pointer-events: none;
            animation: scan 2s ease-in-out;
        `;
        
        document.body.appendChild(scanner);
        
        if (!document.querySelector('#scanKeyframes')) {
            const style = document.createElement('style');
            style.id = 'scanKeyframes';
            style.textContent = `
                @keyframes scan {
                    0% { top: 0; }
                    100% { top: 100%; }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => scanner.remove(), 2000);
    }
    
    createSpookyEffect() {
        document.body.style.filter = 'hue-rotate(30deg) contrast(1.2)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 3000);
    }
    
    createFestiveEffect() {
        // Create snow effect
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const snowflake = document.createElement('div');
                snowflake.style.cssText = `
                    position: fixed;
                    top: -10px;
                    left: ${Math.random() * 100}%;
                    width: 10px;
                    height: 10px;
                    background: white;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 100;
                    animation: fall ${3 + Math.random() * 2}s linear forwards;
                `;
                
                document.body.appendChild(snowflake);
                
                setTimeout(() => snowflake.remove(), 5000);
            }, i * 100);
        }
        
        if (!document.querySelector('#fallKeyframes')) {
            const style = document.createElement('style');
            style.id = 'fallKeyframes';
            style.textContent = `
                @keyframes fall {
                    to { top: 100vh; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    /* ================================
       SPECIAL MODES
       ================================ */
    
    activateDeveloperMode() {
        this.showEasterEggMessage('DEVELOPER MODE ACTIVATED', 'Debug info enabled', 'matrix');
        
        // Add debug panel
        this.createDebugPanel();
        
        // Enable console logging
        this.enableDebugLogging();
        
        console.log('🔧 Developer mode activated');
    }
    
    createDebugPanel() {
        if (document.querySelector('.debug-panel')) return;
        
        const panel = document.createElement('div');
        panel.className = 'debug-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: #00ff00;
            padding: 10px;
            border: 1px solid #00ff00;
            border-radius: 4px;
            font-family: monospace;
            font-size: 12px;
            z-index: 1000;
            max-width: 300px;
        `;
        
        panel.innerHTML = `
            <div>Easter Eggs Found: <span id="eggCount">${this.state.easterEggCount}</span></div>
            <div>Audio Enabled: <span id="audioStatus">${AudioManager.getInstance().isEnabled}</span></div>
            <div>Effects Active: <span id="effectsStatus">${EffectsManager.getInstance().getActiveEffects().length}</span></div>
        `;
        
        document.body.appendChild(panel);
        
        // Update debug info periodically
        setInterval(() => {
            const eggCount = document.getElementById('eggCount');
            const audioStatus = document.getElementById('audioStatus');
            const effectsStatus = document.getElementById('effectsStatus');
            
            if (eggCount) eggCount.textContent = this.state.easterEggCount;
            if (audioStatus) audioStatus.textContent = AudioManager.getInstance().isEnabled;
            if (effectsStatus) effectsStatus.textContent = EffectsManager.getInstance().getActiveEffects().length;
        }, 1000);
    }
    
    enableDebugLogging() {
        // Override console methods to add visual indicators
        const originalLog = console.log;
        console.log = (...args) => {
            originalLog(...args);
            this.showDebugMessage(args.join(' '));
        };
    }
    
    showDebugMessage(message) {
        const debugMsg = document.createElement('div');
        debugMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 255, 0, 0.1);
            color: #00ff00;
            padding: 5px 10px;
            border: 1px solid #00ff00;
            border-radius: 4px;
            font-family: monospace;
            font-size: 10px;
            z-index: 1001;
            animation: fadeInOut 3s forwards;
        `;
        
        debugMsg.textContent = message;
        document.body.appendChild(debugMsg);
        
        setTimeout(() => debugMsg.remove(), 3000);
    }
    
    /* ================================
       MESSAGE DISPLAY
       ================================ */
    
    showEasterEggMessage(title, description, effectType) {
        if (!this.messageElement) return;
        
        this.messageElement.innerHTML = `
            <div style="font-size: 1.2em; margin-bottom: 5px;">${title}</div>
            <div style="font-size: 0.9em; opacity: 0.8;">${description}</div>
        `;
        
        this.messageElement.className = `easter-egg-message show ${effectType}`;
        
        setTimeout(() => {
            this.messageElement.classList.remove('show');
        }, 3000);
    }
    
    /* ================================
       UTILITY METHODS
       ================================ */
    
    isPalindrome(str) {
        const cleaned = str.replace(/[^0-9]/g, '');
        return cleaned.length > 2 && cleaned === cleaned.split('').reverse().join('');
    }
    
    hasRepeatedDigits(str) {
        const digits = str.replace(/[^0-9]/g, '');
        return digits.length > 2 && /(.)\1{2,}/.test(digits);
    }
    
    arraysEqual(a, b) {
        return a.length === b.length && a.every((val, i) => val === b[i]);
    }
    
    trackResult(result) {
        this.state.lastResults.push(result);
        if (this.state.lastResults.length > 10) {
            this.state.lastResults.shift();
        }
    }
    
    getEasterEggDescription(type) {
        const descriptions = {
            'leet': 'You are truly elite!',
            'error': 'Page not found in calculations',
            'nice': 'A number of culture',
            'blaze': 'Time to calculate',
            'answer': 'Don\'t panic!',
            'devil': 'Sinful mathematics',
            'lucky': 'Fortune favors you',
            'retro': 'Classic calculator joke',
            'orwell': 'Watching your calculations',
            'pi': 'The most famous constant',
            'euler': 'The natural logarithm base',
            'zero': 'Nothing and everything'
        };
        
        return descriptions[type] || 'You found a secret!';
    }
    
    handleSpecialEasterEgg(type, number) {
        switch (type) {
            case 'leet':
                // Enable matrix mode temporarily
                setTimeout(() => EffectsManager.easterEggEffect('matrix'), 1000);
                break;
            case 'answer':
                // Play special sound sequence
                AudioManager.playSequence(['success', 'success', 'easter-egg'], 200);
                break;
            case 'zero':
                // Trigger void effect
                setTimeout(() => this.createVoidEffect(), 500);
                break;
        }
    }
    
    /* ================================
       STATIC METHODS
       ================================ */
    
    static checkResult(result) {
        if (EasterEggs.instance) {
            return EasterEggs.instance.checkResult(result);
        }
        return false;
    }
    
    static triggerDivisionByZero() {
        if (EasterEggs.instance) {
            EasterEggs.instance.triggerDivisionByZero();
        }
    }
    
    static getInstance() {
        if (!EasterEggs.instance) {
            EasterEggs.instance = new EasterEggs();
        }
        return EasterEggs.instance;
    }
}

/* ================================
   INITIALIZE EASTER EGGS
   ================================ */

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.easterEggs = EasterEggs.getInstance();
    });
} else {
    window.easterEggs = EasterEggs.getInstance();
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EasterEggs;
}