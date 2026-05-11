const PROMPTS = [
    { left: "Cold", right: "Hot" },
    { left: "Useless", right: "Useful" },
    { left: "Low Quality", right: "High Quality" },
    { left: "Predictable", right: "Unpredictable" },
    { left: "Basic", right: "Extraordinary" },
    { left: "Hard to Do", right: "Easy to Do" },
    { left: "Guilty Pleasure", right: "Openly Love" },
    { left: "Bad for You", right: "Good for You" },
    { left: "Messy Food", right: "Clean Food" },
    { left: "Nature", right: "Nurture" },
    { left: "Soft", right: "Hard" },
    { left: "Quiet", right: "Loud" },
    { left: "Normal Greeting", right: "Weird Greeting" },
    { left: "Common", right: "Rare" },
    { left: "Uncool", right: "Cool" },
    { left: "Boring", right: "Exciting" },
    { left: "Underestimated", right: "Overestimated" },
    { left: "Small", right: "Large" },
    { left: "Short Lived", right: "Long Lived" },
    { left: "Dark", right: "Light" },
];

const PHASES = {
    SETUP: 'setup',
    PSYCHIC: 'psychic',
    TEAM: 'team',
    REVEAL: 'reveal'
};

// State
let phase = PHASES.SETUP;
let currentPrompt = null;
let targetValue = 50;
let guessValue = 50;
let totalScore = 0;
let roundScore = 0;
let isInteractive = false;

// DOM Elements
const elScore = document.getElementById('score');
const phaseSetup = document.getElementById('phase-setup');
const phaseGame = document.getElementById('phase-game');
const promptLeft = document.getElementById('prompt-left');
const promptRight = document.getElementById('prompt-right');

const targetZones = document.getElementById('target-zones');
const guessSlider = document.getElementById('guess-slider');

const controlsPsychic = document.getElementById('controls-psychic');
const controlsTeam = document.getElementById('controls-team');
const controlsReveal = document.getElementById('controls-reveal');
const revealResult = document.getElementById('reveal-result');

// Initialize Feather Icons
feather.replace();

function drawTargetZones() {
    targetZones.innerHTML = '';
    
    const createZone = (span, className) => {
        const zone = document.createElement('div');
        zone.className = `target-zone ${className}`;
        
        let leftPos = targetValue - (span / 2);
        let width = span;
        
        if (leftPos < 0) {
            width += leftPos;
            leftPos = 0;
        }
        if (leftPos + width > 100) {
            width = 100 - leftPos;
        }
        
        zone.style.left = `${leftPos}%`;
        zone.style.width = `${width}%`;
        return zone;
    };
    
    // 2 Point Zone (±10 units = 20 span)
    targetZones.appendChild(createZone(20, 'zone-2'));
    
    // 3 Point Zone (±5 units = 10 span)
    targetZones.appendChild(createZone(10, 'zone-3'));
    
    // 4 Point Zone (±2 units = 4 span)
    targetZones.appendChild(createZone(4, 'zone-4'));
}

function updateUI() {
    elScore.textContent = totalScore;
    
    if (phase === PHASES.SETUP) {
        phaseSetup.classList.add('active');
        phaseGame.classList.add('hidden');
        phaseGame.classList.remove('active');
    } else {
        phaseSetup.classList.remove('active');
        phaseGame.classList.remove('hidden');
        phaseGame.classList.add('active');
        
        promptLeft.textContent = currentPrompt.left;
        promptRight.textContent = currentPrompt.right;
        
        // Visibility logic
        if (phase === PHASES.PSYCHIC || phase === PHASES.REVEAL) {
            targetZones.classList.remove('hidden');
        } else {
            targetZones.classList.add('hidden');
        }
        
        isInteractive = (phase === PHASES.TEAM);
        guessSlider.disabled = !isInteractive;
        
        controlsPsychic.classList.add('hidden');
        controlsTeam.classList.add('hidden');
        controlsReveal.classList.add('hidden');
        
        if (phase === PHASES.PSYCHIC) controlsPsychic.classList.remove('hidden');
        if (phase === PHASES.TEAM) controlsTeam.classList.remove('hidden');
        if (phase === PHASES.REVEAL) controlsReveal.classList.remove('hidden');
        
        guessSlider.value = guessValue;
    }
}

// Slider Interaction
guessSlider.addEventListener('input', (e) => {
    if (!isInteractive) {
        e.target.value = guessValue;
        return;
    }
    guessValue = parseFloat(e.target.value);
});

// Actions
document.getElementById('btn-start').addEventListener('click', startNewRound);
document.getElementById('btn-next-round').addEventListener('click', startNewRound);

function startNewRound() {
    currentPrompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    targetValue = Math.floor(Math.random() * 80) + 10;
    guessValue = 50;
    guessSlider.value = 50;
    roundScore = 0;
    phase = PHASES.PSYCHIC;
    
    drawTargetZones();
    updateUI();
}

document.getElementById('btn-given-clue').addEventListener('click', () => {
    phase = PHASES.TEAM;
    updateUI();
});

document.getElementById('btn-lock-guess').addEventListener('click', () => {
    const diff = Math.abs(guessValue - targetValue);
    
    if (diff <= 2) roundScore = 4;
    else if (diff <= 5) roundScore = 3;
    else if (diff <= 10) roundScore = 2;
    else roundScore = 0;
    
    totalScore += roundScore;
    phase = PHASES.REVEAL;
    
    if (roundScore > 0) {
        revealResult.innerHTML = `
            <div class="result-emoji">🎉</div>
            <div class="result-badge result-hit">+${roundScore} POINTS!</div>
        `;
    } else {
        revealResult.innerHTML = `
            <div class="result-emoji">😅</div>
            <div class="result-badge result-miss">COMPLETE MISS</div>
        `;
    }
    
    updateUI();
});
