/* ================================
   CYBERPUNK CALCULATOR - CORE FUNCTIONALITY
   Senior-level JavaScript with proper architecture
   ================================ */

'use strict';

class CyberpunkCalculator {
    constructor() {
        // State management
        this.state = {
            currentOperand: '0',
            previousOperand: null,
            operation: null,
            shouldResetDisplay: false,
            isCalculating: false,
            lastResult: null,
            history: []
        };
        
        // DOM element references
        this.elements = {
            display: document.getElementById('displayText'),
            equation: document.getElementById('displayEquation'),
            displayContainer: document.querySelector('.display'),
            calculator: document.querySelector('.calculator'),
            particlesContainer: document.getElementById('particlesContainer')
        };
        
        // Constants
        this.MAX_DIGITS = 12;
        this.DECIMAL_PLACES = 8;
        
        // Initialize calculator
        this.init();
    }
    
    /* ================================
       INITIALIZATION
       ================================ */
    
    init() {
        this.attachEventListeners();
        this.updateDisplay();
        this.logStartup();
    }
    
    attachEventListeners() {
        // Number buttons
        document.querySelectorAll('[data-number]').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleNumberInput(e.target.dataset.number);
                this.addRippleEffect(e.target);
                AudioManager.playSound('click');
            });
        });
        
        // Operation buttons
        document.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleActionInput(e.target.dataset.action);
                this.addRippleEffect(e.target);
                AudioManager.playSound('click');
            });
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardInput(e);
        });
        
        // Prevent context menu on long press (mobile)
        document.addEventListener('contextmenu', (e) => {
            if (e.target.classList.contains('btn')) {
                e.preventDefault();
            }
        });
    }
    
    /* ================================
       INPUT HANDLING
       ================================ */
    
    handleNumberInput(number) {
        try {
            // Handle decimal point
            if (number === '.' && this.state.currentOperand.includes('.')) {
                return; // Prevent multiple decimal points
            }
            
            // Reset display if needed
            if (this.state.shouldResetDisplay) {
                this.state.currentOperand = number === '.' ? '0.' : number;
                this.state.shouldResetDisplay = false;
            } else {
                // Append number or replace initial zero
                if (this.state.currentOperand === '0' && number !== '.') {
                    this.state.currentOperand = number;
                } else if (this.state.currentOperand.length < this.MAX_DIGITS) {
                    this.state.currentOperand += number;
                }
            }
            
            this.updateDisplay();
            this.addDisplayAnimation('entering');
            
        } catch (error) {
            this.handleError('Number input error', error);
        }
    }
    
    handleActionInput(action) {
        try {
            switch (action) {
                case 'clear':
                    this.clear();
                    break;
                case 'equals':
    // Handle direct number easter eggs (no operation)  
    if (!this.state.operation && this.state.currentOperand !== '0') {
        const currentValue = this.state.currentOperand;
        
        // Trigger easter egg
        EasterEggs.checkResult(parseFloat(currentValue));
        
        // Force clear the calculator
        setTimeout(() => {
            console.log('Force clearing calculator'); // Debug log
            this.clear(); // Use the full clear method
            this.updateDisplay(); // Force display update
        }, 2500);
        
        return; // Don't proceed with calculation
    }
    
    // Normal calculation
    this.calculate();
    break;
                case 'decimal':
                    this.handleNumberInput('.');
                    break;
                case 'plusminus':
                    this.toggleSign();
                    break;
                case 'percent':
                    this.calculatePercent();
                    break;
                case 'add':
                case 'subtract':
                case 'multiply':
                case 'divide':
                    this.setOperation(action);
                    break;
                default:
                    console.warn(`Unknown action: ${action}`);
            }
        } catch (error) {
            this.handleError('Action input error', error);
        }
    }
    
    handleKeyboardInput(event) {
        const key = event.key;
        
        // Prevent default for calculator keys
        if (/[0-9+\-*/.=%]|Enter|Escape|Backspace/.test(key)) {
            event.preventDefault();
        }
        
        try {
            // Number keys
            if (/[0-9]/.test(key)) {
                this.handleNumberInput(key);
                this.highlightButton(`[data-number="${key}"]`);
            }
            // Operation keys
            else if (key === '+') {
                this.handleActionInput('add');
                this.highlightButton('[data-action="add"]');
            }
            else if (key === '-') {
                this.handleActionInput('subtract');
                this.highlightButton('[data-action="subtract"]');
            }
            else if (key === '*') {
                this.handleActionInput('multiply');
                this.highlightButton('[data-action="multiply"]');
            }
            else if (key === '/') {
                this.handleActionInput('divide');
                this.highlightButton('[data-action="divide"]');
            }
            else if (key === '.' || key === ',') {
                this.handleActionInput('decimal');
                this.highlightButton('[data-action="decimal"]');
            }
            else if (key === '=' || key === 'Enter') {
                this.handleActionInput('equals');
                this.highlightButton('[data-action="equals"]');
            }
            else if (key === 'Escape' || key === 'c' || key === 'C') {
                this.handleActionInput('clear');
                this.highlightButton('[data-action="clear"]');
            }
            else if (key === '%') {
                this.handleActionInput('percent');
                this.highlightButton('[data-action="percent"]');
            }
            else if (key === 'Backspace') {
                this.backspace();
            }
        } catch (error) {
            this.handleError('Keyboard input error', error);
        }
    }
    
    /* ================================
       CALCULATOR OPERATIONS
       ================================ */
    
    setOperation(operation) {
        // If there's a pending operation, calculate first
        if (this.state.operation && !this.state.shouldResetDisplay) {
            this.calculate();
        }
        
        this.state.previousOperand = this.state.currentOperand;
        this.state.operation = operation;
        this.state.shouldResetDisplay = true;
        
        this.updateEquationDisplay();
    }
    
    calculate() {
        // Check for easter eggs on simple numbers (when no operation is pending)
        if (!this.state.operation && this.state.currentOperand !== '0') {
            // This handles cases where user types a number and presses equals
            return;
        }
        
        if (!this.state.operation || !this.state.previousOperand) {
            return;
        }
        
        this.addDisplayAnimation('calculating');
        
        // Add artificial delay for dramatic effect
        setTimeout(() => {
            try {
                const prev = parseFloat(this.state.previousOperand);
                const current = parseFloat(this.state.currentOperand);
                let result;
                
                switch (this.state.operation) {
                    case 'add':
                        result = prev + current;
                        break;
                    case 'subtract':
                        result = prev - current;
                        break;
                    case 'multiply':
                        result = prev * current;
                        break;
                    case 'divide':
                        if (current === 0) {
                            this.handleDivisionByZero();
                            return;
                        }
                        result = prev / current;
                        break;
                    default:
                        return;
                }
                
                // Handle special results
                if (!isFinite(result)) {
                    this.handleInfiniteResult();
                    return;
                }
                
                // Format result
                result = this.formatResult(result);
                
                // Store in history
                this.addToHistory(`${prev} ${this.getOperationSymbol()} ${current} = ${result}`);
                
                // Update state
                this.state.currentOperand = result.toString();
                this.state.lastResult = result;
                this.state.operation = null;
                this.state.previousOperand = null;
                this.state.shouldResetDisplay = true;
                
                // Check for easter eggs with the calculated result
                EasterEggs.checkResult(result);
                
                // Visual effects
                this.addDisplayAnimation('result');
                EffectsManager.createParticleExplosion();
                AudioManager.playSound('equals');
                
                this.updateDisplay();
                this.clearEquationDisplay();
                
            } catch (error) {
                this.handleError('Calculation error', error);
            }
        }, 300);
    }
    
    clear() {
        this.state = {
            currentOperand: '0',
            previousOperand: null,
            operation: null,
            shouldResetDisplay: false,
            isCalculating: false,
            lastResult: null,
            history: this.state.history // Preserve history
        };
        
        this.updateDisplay();
        this.clearEquationDisplay();
        if (this.elements.calculator) {
            this.elements.calculator.classList.remove('rainbow-mode');
        }
        this.addDisplayAnimation('clear');
    }
    
    toggleSign() {
        if (this.state.currentOperand !== '0') {
            if (this.state.currentOperand.startsWith('-')) {
                this.state.currentOperand = this.state.currentOperand.slice(1);
            } else {
                this.state.currentOperand = '-' + this.state.currentOperand;
            }
            this.updateDisplay();
        }
    }
    
    calculatePercent() {
        const current = parseFloat(this.state.currentOperand);
        const result = current / 100;
        this.state.currentOperand = this.formatResult(result).toString();
        this.updateDisplay();
        this.addDisplayAnimation('result');
    }
    
    backspace() {
        if (this.state.currentOperand.length > 1) {
            this.state.currentOperand = this.state.currentOperand.slice(0, -1);
        } else {
            this.state.currentOperand = '0';
        }
        this.updateDisplay();
    }
    
    /* ================================
       UTILITY METHODS
       ================================ */
    
    formatResult(number) {
        // Handle very large or very small numbers
        if (Math.abs(number) >= 1e12 || (Math.abs(number) < 1e-6 && number !== 0)) {
            return parseFloat(number.toExponential(6));
        }
        
        // Round to prevent floating point errors
        const rounded = Math.round(number * Math.pow(10, this.DECIMAL_PLACES)) / Math.pow(10, this.DECIMAL_PLACES);
        
        // Remove trailing zeros
        return parseFloat(rounded.toString());
    }
    
    formatDisplayNumber(number) {
        const numStr = number.toString();
        
        // Handle very long numbers
        if (numStr.length > this.MAX_DIGITS) {
            const num = parseFloat(number);
            return num.toExponential(3);
        }
        
        return numStr;
    }
    
    getOperationSymbol() {
        const symbols = {
            'add': '+',
            'subtract': '−',
            'multiply': '×',
            'divide': '÷'
        };
        return symbols[this.state.operation] || '';
    }
    
    addToHistory(calculation) {
        this.state.history.unshift(calculation);
        if (this.state.history.length > 50) {
            this.state.history = this.state.history.slice(0, 50);
        }
    }
    
    /* ================================
       ERROR HANDLING
       ================================ */
    
    handleError(message, error) {
        console.error(`${message}:`, error);
        this.state.currentOperand = 'ERROR';
        this.updateDisplay();
        this.addDisplayAnimation('error');
        AudioManager.playSound('error');
        
        // Auto-clear error after delay
        setTimeout(() => {
            this.clear();
        }, 2000);
    }
    
    handleDivisionByZero() {
        // Easter egg for division by zero
        EasterEggs.triggerDivisionByZero();
        this.state.currentOperand = '∞';
        this.updateDisplay();
        this.addDisplayAnimation('error');
        
        setTimeout(() => {
            this.clear();
        }, 3000);
    }
    
    handleInfiniteResult() {
        this.state.currentOperand = '∞';
        this.updateDisplay();
        this.addDisplayAnimation('error');
        
        setTimeout(() => {
            this.clear();
        }, 2000);
    }
    
    /* ================================
       DISPLAY MANAGEMENT
       ================================ */
    
    updateDisplay() {
        if (this.elements.display) {
            const displayValue = this.formatDisplayNumber(this.state.currentOperand);
            this.elements.display.textContent = displayValue;
            
            // Update aria-label for accessibility
            this.elements.display.setAttribute('aria-label', `Current value: ${displayValue}`);
        }
    }
    
    updateEquationDisplay() {
        if (this.elements.equation && this.state.operation) {
            const symbol = this.getOperationSymbol();
            this.elements.equation.textContent = `${this.state.previousOperand} ${symbol}`;
        }
    }
    
    clearEquationDisplay() {
        if (this.elements.equation) {
            this.elements.equation.textContent = '';
        }
    }
    
    addDisplayAnimation(type) {
        const element = this.elements.display;
        if (!element) return;
        
        // Remove existing animation classes
        element.classList.remove('entering', 'result', 'error', 'easter-egg');
        
        // Add new animation class
        if (type) {
            element.classList.add(type);
            
            // Remove after animation completes
            setTimeout(() => {
                element.classList.remove(type);
            }, 500);
        }
    }
    
    /* ================================
       VISUAL EFFECTS
       ================================ */
    
    addRippleEffect(button) {
        button.classList.add('ripple');
        setTimeout(() => {
            button.classList.remove('ripple');
        }, 600);
    }
    
    highlightButton(selector) {
        const button = document.querySelector(selector);
        if (button) {
            button.classList.add('power-up');
            setTimeout(() => {
                button.classList.remove('power-up');
            }, 500);
        }
    }
    
    /* ================================
       DEBUGGING & DEVELOPMENT
       ================================ */
    
    logStartup() {
        console.log('🚀 Cyberpunk Calculator initialized');
        console.log('📊 State:', this.state);
        console.log('🎮 Controls: Numbers, +, -, *, /, Enter, Escape');
    }
    
    getState() {
        return { ...this.state };
    }
    
    getHistory() {
        return [...this.state.history];
    }
    
    // Public API for external access
    static getInstance() {
        if (!CyberpunkCalculator.instance) {
            CyberpunkCalculator.instance = new CyberpunkCalculator();
        }
        return CyberpunkCalculator.instance;
    }
}

/* ================================
   INITIALIZE CALCULATOR
   ================================ */

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.calculator = CyberpunkCalculator.getInstance();
    });
} else {
    window.calculator = CyberpunkCalculator.getInstance();
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CyberpunkCalculator;
}