# 🌟 Cyberpunk Calculator

A futuristic, neon-themed calculator with stunning visual effects, sound design, and hidden easter eggs. Built with expert-level vanilla JavaScript, CSS3, and Web Audio API.

![Cyberpunk Calculator](https://img.shields.io/badge/Status-Complete-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🎨 Visual Effects
- **Neon Glow Effects** - Cyberpunk-themed UI with animated borders and shadows
- **Particle Explosions** - Dynamic particle system triggered on calculations
- **Screen Effects** - Glitch animations, scanlines, and holographic overlays
- **Responsive Design** - Optimized for all screen sizes and devices
- **Dark Cyberpunk Theme** - Immersive Blade Runner-inspired aesthetics

### 🔊 Audio Experience
- **Procedural Sound Generation** - Web Audio API creates all sounds in real-time
- **Interactive Audio** - Different sounds for buttons, calculations, and easter eggs
- **Volume Control** - Built-in audio toggle and volume management
- **Sound Sequences** - Musical progressions for special events

### 🥚 Easter Eggs & Secrets
- **Special Numbers** - Hidden reactions to famous numbers (1337, 404, 69, 420, 42, etc.)
- **Konami Code** - Classic gaming easter egg with special effects
- **Developer Mode** - Hidden debug panel (click display 10 times)
- **Date-Based Events** - Special effects on Pi Day, Halloween, Christmas, etc.
- **Pattern Recognition** - Palindromes and repeated digits trigger effects

### ⌨️ Advanced Features
- **Full Keyboard Support** - Complete keyboard navigation and shortcuts
- **Error Handling** - Graceful error management with visual feedback
- **Performance Optimized** - Efficient animations and memory management
- **Accessibility** - ARIA labels and screen reader support
- **Mobile-First** - Touch-optimized with haptic feedback simulation

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for audio features) or GitHub Pages

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Myrmecology/The-Calculator.git
cd cyberpunk-calculator

# Using Python 3
python -m http.server 8000

# Using Node.js (if you have live-server installed)
npx live-server

# Using PHP
php -S localhost:8000

Open in browser:
http://localhost:8000

Keyboard Shortcuts
Numbers:     0-9
Operations:  + - * /
Equals:      = or Enter
Clear:       Escape or C
Decimal:     . (period)
Percentage:  %
Backspace:   Backspace

Easter Eggs (Spoiler Alert!)
Try calculating these numbers:

1337 - Elite Hacker Mode
404 - Error Message
42 - Answer to Everything
69 - Nice
420 - Blazing Effect
0 ÷ 0 - Void Effect

Secret Sequences:

Konami Code: ↑↑↓↓←→←→BA
Click display 10 times: Developer Mode

🏗️ Architecture
File Structure
cyberpunk-calculator/
├── index.html              # Main HTML structure
├── css/
│   ├── main.css            # Core styles and layout
│   ├── neon-effects.css    # Glow effects and lighting
│   ├── animations.css      # CSS animations and transitions
│   └── responsive.css      # Responsive breakpoints
├── js/
│   ├── calculator.js       # Core calculator logic
│   ├── effects.js          # Visual effects manager
│   ├── audio.js            # Web Audio API implementation
│   └── easter-eggs.js      # Hidden features and secrets
├── assets/
│   ├── sounds/             # Audio file placeholders
│   └── fonts/              # Custom font files
└── README.md               # Project documentation

Technical Stack

HTML5 - Semantic markup with accessibility features
CSS3 - Custom properties, Grid, Flexbox, animations
Vanilla JavaScript - ES6+ with class-based architecture
Web Audio API - Real-time audio synthesis
CSS Animations - Hardware-accelerated transitions

Key Classes

CyberpunkCalculator - Main calculator logic and state management
EffectsManager - Particle system and visual effects
AudioManager - Sound generation and playback
EasterEggs - Hidden features and special interactions

🎯 Performance
Optimizations

CSS Custom Properties - Efficient theming and color management
Hardware Acceleration - GPU-accelerated animations
Particle Pooling - Reused DOM elements for better performance
Event Delegation - Optimized event handling
Lazy Loading - Effects loaded on demand

Browser Support

Chrome 80+
Firefox 75+
Safari 13+
Edge 80+

🛠️ Development
Adding New Features

New Easter Egg:

javascript// In easter-eggs.js
this.easterEggs.set(newNumber, {
    type: 'custom',
    message: 'YOUR MESSAGE',
    effect: 'your-effect'
});

New Visual Effect:

javascript// In effects.js
createCustomEffect() {
    // Your effect code here
}

New Sound:

javascript// In audio.js
generateCustomSound() {
    // Web Audio API code here
}

Built with 💚 Happy coding

