/* ================================
   CYBERPUNK CALCULATOR - EFFECTS MANAGER
   Advanced visual effects and particle system
   ================================ */

'use strict';

class EffectsManager {
    constructor() {
        this.particlesContainer = document.getElementById('particlesContainer');
        this.calculator = document.querySelector('.calculator');
        this.display = document.querySelector('.display');
        
        // Effect settings
        this.settings = {
            particleCount: 20,
            particleLifetime: 2000,
            particleSpeed: 2,
            glitchDuration: 300,
            rainDropInterval: 100,
            maxParticles: 100
        };
        
        // Active effects tracking
        this.activeEffects = new Set();
        this.particlePool = [];
        this.matrixChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        
        this.init();
    }
    
    /* ================================
       INITIALIZATION
       ================================ */
    
    init() {
        this.createScreenFlash();
        this.initializeParticlePool();
        this.startBackgroundEffects();
        
        console.log('🎨 Effects Manager initialized');
    }
    
    createScreenFlash() {
        if (!document.querySelector('.screen-flash')) {
            const flash = document.createElement('div');
            flash.className = 'screen-flash';
            document.body.appendChild(flash);
        }
    }
    
    initializeParticlePool() {
        // Pre-create particles for better performance
        for (let i = 0; i < this.settings.maxParticles; i++) {
            const particle = this.createParticleElement();
            particle.style.display = 'none';
            this.particlePool.push(particle);
        }
    }
    
    startBackgroundEffects() {
        // Start multiple types of falling objects
        this.startFloatingSymbols();
        this.startDigitalRain();
        this.startCyberpunkParticles();
        this.startCodeFragments();
        this.startNeonShapes();
        
        // Start subtle grid pulse
        if (this.calculator) {
            this.calculator.addEventListener('mouseenter', () => {
                this.pulseCalculatorBorder();
            });
        }
    }
    
    /* ================================
       PARTICLE SYSTEM
       ================================ */
    
    createParticleExplosion(x = null, y = null) {
        if (!this.particlesContainer) return;
        
        // Get button position if coordinates not provided
        if (x === null || y === null) {
            const equalsButton = document.querySelector('[data-action="equals"]');
            if (equalsButton) {
                const rect = equalsButton.getBoundingClientRect();
                x = rect.left + rect.width / 2;
                y = rect.top + rect.height / 2;
            } else {
                x = window.innerWidth / 2;
                y = window.innerHeight / 2;
            }
        }
        
        // Create particle burst
        const colors = ['blue', 'pink', 'green', 'purple', 'yellow'];
        
        for (let i = 0; i < this.settings.particleCount; i++) {
            setTimeout(() => {
                this.createParticle(x, y, colors[i % colors.length]);
            }, i * 50);
        }
        
        // Screen flash effect
        this.screenFlash();
    }
    
    createParticle(startX, startY, colorClass = 'blue') {
        const particle = this.getParticleFromPool();
        if (!particle) return;
        
        // Reset particle properties
        particle.className = `particle ${colorClass}`;
        particle.style.display = 'block';
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        
        // Random movement direction
        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 100;
        const deltaX = Math.cos(angle) * velocity;
        const deltaY = Math.sin(angle) * velocity;
        
        // Set CSS custom properties for animation
        particle.style.setProperty('--random-x', deltaX + 'px');
        particle.style.setProperty('--random-y', deltaY + 'px');
        
        // Start animation
        particle.classList.add('particle-explosion');
        
        // Return to pool after animation
        setTimeout(() => {
            this.returnParticleToPool(particle);
        }, this.settings.particleLifetime);
    }
    
    createParticleElement() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        if (this.particlesContainer) {
            this.particlesContainer.appendChild(particle);
        }
        return particle;
    }
    
    getParticleFromPool() {
        return this.particlePool.find(p => p.style.display === 'none') || this.createParticleElement();
    }
    
    returnParticleToPool(particle) {
        particle.style.display = 'none';
        particle.className = 'particle';
        particle.classList.remove('particle-explosion');
        particle.style.removeProperty('--random-x');
        particle.style.removeProperty('--random-y');
    }
    
    /* ================================
       SCREEN EFFECTS
       ================================ */
    
    screenFlash(duration = 100) {
        const flash = document.querySelector('.screen-flash');
        if (flash) {
            flash.classList.add('active');
            setTimeout(() => {
                flash.classList.remove('active');
            }, duration);
        }
    }
    
    glitchEffect(element = this.display, duration = this.settings.glitchDuration) {
        if (!element) return;
        
        const originalText = element.textContent;
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        let glitchInterval;
        let elapsed = 0;
        const intervalTime = 50;
        
        glitchInterval = setInterval(() => {
            if (elapsed >= duration) {
                element.textContent = originalText;
                element.classList.remove('glitch-zoom');
                clearInterval(glitchInterval);
                return;
            }
            
            // Create glitched text
            let glitchedText = '';
            for (let i = 0; i < originalText.length; i++) {
                if (Math.random() < 0.1) {
                    glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                } else {
                    glitchedText += originalText[i];
                }
            }
            
            element.textContent = glitchedText;
            element.classList.add('glitch-zoom');
            
            elapsed += intervalTime;
        }, intervalTime);
    }
    
    matrixRain(duration = 3000) {
        const matrixContainer = document.createElement('div');
        matrixContainer.style.position = 'fixed';
        matrixContainer.style.top = '0';
        matrixContainer.style.left = '0';
        matrixContainer.style.width = '100%';
        matrixContainer.style.height = '100%';
        matrixContainer.style.pointerEvents = 'none';
        matrixContainer.style.zIndex = '1000';
        document.body.appendChild(matrixContainer);
        
        const columnCount = Math.floor(window.innerWidth / 20);
        
        for (let i = 0; i < columnCount; i++) {
            this.createMatrixColumn(matrixContainer, i * 20, duration);
        }
        
        // Clean up after effect
        setTimeout(() => {
            if (matrixContainer.parentNode) {
                matrixContainer.parentNode.removeChild(matrixContainer);
            }
        }, duration + 1000);
    }
    
    createMatrixColumn(container, x, duration) {
        const column = document.createElement('div');
        column.style.position = 'absolute';
        column.style.left = x + 'px';
        column.style.top = '0';
        column.style.width = '20px';
        column.style.height = '100%';
        container.appendChild(column);
        
        let charInterval = setInterval(() => {
            if (!container.parentNode) {
                clearInterval(charInterval);
                return;
            }
            
            const char = document.createElement('div');
            char.className = 'matrix-char';
            char.textContent = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
            char.style.left = '0';
            char.style.top = '-20px';
            char.style.animationDelay = Math.random() * 2 + 's';
            column.appendChild(char);
            
            // Remove character after animation
            setTimeout(() => {
                if (char.parentNode) {
                    char.parentNode.removeChild(char);
                }
            }, 3000);
        }, this.settings.rainDropInterval + Math.random() * 200);
        
        setTimeout(() => {
            clearInterval(charInterval);
        }, duration);
    }
    
    /* ================================
       CALCULATOR SPECIFIC EFFECTS
       ================================ */
    
    pulseCalculatorBorder() {
        if (!this.calculator) return;
        
        this.calculator.classList.add('neon-burst');
        setTimeout(() => {
            this.calculator.classList.remove('neon-burst');
        }, 500);
    }
    
    rainbowMode(enable = true) {
        if (!this.calculator) return;
        
        if (enable) {
            this.calculator.classList.add('rainbow-mode');
            this.activeEffects.add('rainbow');
        } else {
            this.calculator.classList.remove('rainbow-mode');
            this.activeEffects.delete('rainbow');
        }
    }
    
    powerSurge() {
        if (!this.calculator) return;
        
        this.calculator.classList.add('power-surge');
        this.screenFlash(200);
        
        setTimeout(() => {
            this.calculator.classList.remove('power-surge');
        }, 300);
    }
    
    hologramEffect(element, duration = 2000) {
        if (!element) return;
        
        element.classList.add('hologram');
        
        setTimeout(() => {
            element.classList.remove('hologram');
        }, duration);
    }
    
    /* ================================
       ENHANCED FALLING EFFECTS
       ================================ */
    
    startDigitalRain() {
        const digitalChars = '01010110100101001010101100110010101001011010101';
        
        setInterval(() => {
            for (let i = 0; i < 3; i++) { // Create 3 streams at once
                this.createDigitalStream(digitalChars);
            }
        }, 200);
    }

    createDigitalStream(chars) {
        const stream = document.createElement('div');
        stream.style.cssText = `
            position: fixed;
            left: ${Math.random() * window.innerWidth}px;
            top: -20px;
            width: 20px;
            height: 100vh;
            color: rgba(0, 255, 0, ${0.3 + Math.random() * 0.4});
            font-family: 'Courier New', monospace;
            font-size: 14px;
            line-height: 20px;
            overflow: hidden;
            z-index: 3;
            pointer-events: none;
            animation: fallDown ${8 + Math.random() * 4}s linear infinite;
        `;
        
        // Fill stream with random binary
        let content = '';
        for (let i = 0; i < 50; i++) {
            content += chars[Math.floor(Math.random() * chars.length)] + '<br>';
        }
        stream.innerHTML = content;
        
        document.body.appendChild(stream);
        
        setTimeout(() => {
            if (stream.parentNode) stream.parentNode.removeChild(stream);
        }, 12000);
    }

    startCyberpunkParticles() {
        setInterval(() => {
            for (let i = 0; i < 2; i++) {
                this.createCyberpunkParticle();
            }
        }, 1500);
    }

    createCyberpunkParticle() {
        const shapes = ['●', '◆', '▲', '■', '★', '◊', '▼', '♦'];
        const colors = [
            'rgba(0, 255, 255, 0.6)',
            'rgba(255, 0, 255, 0.6)', 
            'rgba(0, 255, 0, 0.6)',
            'rgba(255, 255, 0, 0.6)',
            'rgba(255, 0, 0, 0.6)'
        ];
        
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${Math.random() * window.innerWidth}px;
            top: -30px;
            font-size: ${16 + Math.random() * 20}px;
            color: ${colors[Math.floor(Math.random() * colors.length)]};
            text-shadow: 0 0 10px currentColor;
            z-index: 4;
            pointer-events: none;
            animation: fallAndRotate ${6 + Math.random() * 4}s linear infinite;
        `;
        
        particle.textContent = shapes[Math.floor(Math.random() * shapes.length)];
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) particle.parentNode.removeChild(particle);
        }, 10000);
    }

    startCodeFragments() {
        const codeSnippets = [
            'function()', 'if(true)', 'while(1)', 'for(i=0)', 'return;', 'null', 'void', 
            'class{}', 'const x', 'let y=', 'array[]', 'object{}', 'async', 'await',
            'import', 'export', 'console.log', 'Math.PI', 'String', 'Number', 'Boolean'
        ];
        
        setInterval(() => {
            this.createCodeFragment(codeSnippets);
        }, 2000);
    }

    createCodeFragment(snippets) {
        const fragment = document.createElement('div');
        fragment.style.cssText = `
            position: fixed;
            left: ${Math.random() * window.innerWidth}px;
            top: -50px;
            color: rgba(0, 255, 255, ${0.4 + Math.random() * 0.3});
            font-family: 'Courier New', monospace;
            font-size: ${12 + Math.random() * 6}px;
            font-weight: bold;
            text-shadow: 0 0 5px currentColor;
            z-index: 3;
            pointer-events: none;
            animation: fadeAndFall ${10 + Math.random() * 5}s linear infinite;
            transform: rotate(${-15 + Math.random() * 30}deg);
        `;
        
        fragment.textContent = snippets[Math.floor(Math.random() * snippets.length)];
        document.body.appendChild(fragment);
        
        setTimeout(() => {
            if (fragment.parentNode) fragment.parentNode.removeChild(fragment);
        }, 15000);
    }

    startNeonShapes() {
        setInterval(() => {
            this.createNeonShape();
        }, 3000);
    }

    createNeonShape() {
        const shapes = ['◯', '□', '△', '◇', '☆', '◎', '▢', '▽'];
        const colors = [
            'rgba(0, 255, 255, 0.4)',
            'rgba(255, 0, 255, 0.4)',
            'rgba(0, 255, 0, 0.4)',
            'rgba(255, 100, 0, 0.4)'
        ];
        
        const shape = document.createElement('div');
        shape.style.cssText = `
            position: fixed;
            left: ${Math.random() * window.innerWidth}px;
            top: -40px;
            font-size: ${20 + Math.random() * 25}px;
            color: ${colors[Math.floor(Math.random() * colors.length)]};
            text-shadow: 
                0 0 5px currentColor,
                0 0 10px currentColor,
                0 0 15px currentColor;
            z-index: 2;
            pointer-events: none;
            animation: slowFloat ${15 + Math.random() * 10}s linear infinite;
        `;
        
        shape.textContent = shapes[Math.floor(Math.random() * shapes.length)];
        document.body.appendChild(shape);
        
        setTimeout(() => {
            if (shape.parentNode) shape.parentNode.removeChild(shape);
        }, 25000);
    }
    
    /* ================================
       FLOATING BACKGROUND ELEMENTS
       ================================ */
    
    startFloatingSymbols() {
        const symbols = [
            '+', '−', '×', '÷', '=', '∞', 'π', '√', '∑', '∂', '∫', '≠', '≤', '≥', 
            '∆', 'Ω', 'α', 'β', 'γ', 'θ', 'λ', 'μ', 'σ', 'φ', 'ψ', '∈', '∉', '⊂', '⊃',
            '∪', '∩', '∧', '∨', '¬', '⊕', '⊗', '∀', '∃', '∇', '∞', '℘', 'ℜ', 'ℑ'
        ];
        
        setInterval(() => {
            if (Math.random() < 0.9) { // 90% chance
                this.createFloatingSymbol(symbols[Math.floor(Math.random() * symbols.length)]);
            }
        }, 800); // Every 0.8 seconds
    }
    
    createFloatingSymbol(symbol) {
        const element = document.createElement('div');
        element.className = 'floating-symbol';
        element.textContent = symbol;
        element.style.left = Math.random() * window.innerWidth + 'px';
        element.style.fontSize = (2 + Math.random() * 2) + 'rem'; // Larger size
        element.style.color = `rgba(0, 255, 255, ${0.3 + Math.random() * 0.4})`; // Brighter
        element.style.animationDuration = (8 + Math.random() * 6) + 's';
        element.style.animationDelay = Math.random() * 2 + 's';
        
        document.body.appendChild(element);
        
        // Remove after animation
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, 15000);
    }
    
    /* ================================
       EASTER EGG EFFECTS
       ================================ */
    
    easterEggEffect(type) {
        switch (type) {
            case 'matrix':
                this.matrixRain(5000);
                break;
            case 'glitch':
                this.glitchEffect(this.display, 1000);
                break;
            case 'rainbow':
                this.rainbowMode(true);
                setTimeout(() => this.rainbowMode(false), 3000);
                break;
            case 'power':
                this.powerSurge();
                break;
            case 'hologram':
                this.hologramEffect(this.calculator, 3000);
                break;
            default:
                this.createParticleExplosion();
        }
    }
    
    /* ================================
       PERFORMANCE MONITORING
       ================================ */
    
    cleanup() {
        // Remove all active effects
        this.activeEffects.clear();
        
        // Clean up particles
        this.particlePool.forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
        this.particlePool = [];
        
        // Remove floating elements
        document.querySelectorAll('.floating-symbol, .matrix-char').forEach(el => {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
    }
    
    getActiveEffects() {
        return Array.from(this.activeEffects);
    }
    
    /* ================================
       STATIC METHODS
       ================================ */
    
    static createParticleExplosion(x, y) {
        if (EffectsManager.instance) {
            EffectsManager.instance.createParticleExplosion(x, y);
        }
    }
    
    static screenFlash(duration) {
        if (EffectsManager.instance) {
            EffectsManager.instance.screenFlash(duration);
        }
    }
    
    static glitchEffect(element, duration) {
        if (EffectsManager.instance) {
            EffectsManager.instance.glitchEffect(element, duration);
        }
    }
    
    static easterEggEffect(type) {
        if (EffectsManager.instance) {
            EffectsManager.instance.easterEggEffect(type);
        }
    }
    
    static getInstance() {
        if (!EffectsManager.instance) {
            EffectsManager.instance = new EffectsManager();
        }
        return EffectsManager.instance;
    }
}

/* ================================
   PERFORMANCE OPTIMIZATIONS
   ================================ */

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Debounce function for performance
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

/* ================================
   INITIALIZE EFFECTS MANAGER
   ================================ */

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.effectsManager = EffectsManager.getInstance();
    });
} else {
    window.effectsManager = EffectsManager.getInstance();
}

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden && EffectsManager.instance) {
        // Pause heavy effects when tab is not visible
        EffectsManager.instance.cleanup();
    }
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EffectsManager;
}