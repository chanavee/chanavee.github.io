document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const setupScreen = document.getElementById('setup-screen');
    const gameScreen = document.getElementById('game-screen');
    const resultScreen = document.getElementById('result-screen');

    const categorySelect = document.getElementById('category-select');
    const playerCountInput = document.getElementById('player-count');
    const imposterCountInput = document.getElementById('imposter-count');
    const errorMsg = document.getElementById('error-msg');

    // Game Elements
    const playerTurnText = document.getElementById('player-turn');
    const card = document.getElementById('role-card');
    const cardFront = document.getElementById('card-front-content'); // "Tap to Reveal"
    const cardBack = document.getElementById('card-back-content');   // Role/Item
    const actionButton = document.getElementById('action-btn');      // "Reveal" / "Next"

    // Result Elements
    const gameStatusText = document.getElementById('game-status');

    // State
    let categories = [];
    const categoryDataCache = {}; // Cache for loaded category data
    let players = [];
    let currentItem = "";
    let currentPlayerIndex = 0;
    let isRevealed = false;
    let totalPlayers = 0;
    let totalImposters = 0;

    // Fetch Categories
    fetch('imposter-resource/category.json')
        .then(response => response.json())
        .then(data => {
            categories = data;
            populateCategories();
        })
        .catch(err => {
            console.error('Error loading categories:', err);
            errorMsg.textContent = "Failed to load game categories.";
        });

    function populateCategories() {
        if (!categories) return;

        categorySelect.innerHTML = '';
        categories.forEach((cat, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = cat.name;
            categorySelect.appendChild(option);
        });
    }

    // Helper: Shuffle Array (Fisher-Yates)
    function shuffle(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    // Event Listeners
    document.getElementById('start-btn').addEventListener('click', startGame);
    actionButton.addEventListener('click', handleAction);
    document.getElementById('new-game-btn').addEventListener('click', resetGame);

    // Validate Inputs
    function validateSetup() {
        const pCount = parseInt(playerCountInput.value);
        const iCount = parseInt(imposterCountInput.value);

        if (isNaN(pCount) || pCount < 3) return "Minimum 3 players required.";
        if (isNaN(iCount) || iCount < 1) return "Minimum 1 imposter required.";
        if (iCount >= pCount) return "Imposters must be fewer than players.";

        return null;
    }

    function startGame() {
        const error = validateSetup();
        if (error) {
            errorMsg.textContent = error;
            return;
        }
        errorMsg.textContent = "";

        const startBtn = document.getElementById('start-btn');
        startBtn.disabled = true;
        startBtn.textContent = "Loading...";

        // Setup Game State
        totalPlayers = parseInt(playerCountInput.value);
        totalImposters = parseInt(imposterCountInput.value);
        const catIndex = categorySelect.value;
        const selectedCategory = categories[catIndex];

        const onDataLoaded = (items) => {
            // Reset Button (even though screen changes, good practice)
            startBtn.disabled = false;
            startBtn.textContent = "Start Game";

            // Pick Random Item
            const randomItemIndex = Math.floor(Math.random() * items.length);
            currentItem = items[randomItemIndex];

            // Assign Roles
            players = Array(totalPlayers).fill('Innocent');
            for (let i = 0; i < totalImposters; i++) {
                players[i] = 'Imposter';
            }
            shuffle(players);

            // Reset Turn State
            currentPlayerIndex = 0;
            isRevealed = false;

            // UI Transition
            showScreen('game');
            updateGameScreen();
        };

        const onError = (err) => {
            console.error('Error loading category data:', err);
            errorMsg.textContent = "Failed to load game data.";
            startBtn.disabled = false;
            startBtn.textContent = "Start Game";
        };

        // Check Cache
        if (categoryDataCache[selectedCategory.name]) {
            onDataLoaded(categoryDataCache[selectedCategory.name]);
        } else {
            // Fetch Data for Selected Category
            fetch(`imposter-resource/${selectedCategory.file}`)
                .then(response => response.json())
                .then(items => {
                    // Cache the data
                    categoryDataCache[selectedCategory.name] = items;
                    onDataLoaded(items);
                })
                .catch(onError);
        }
    }

    function updateGameScreen() {
        // Reset Card State
        card.classList.remove('flipped');
        isRevealed = false;

        // Update Text
        playerTurnText.textContent = `Player ${currentPlayerIndex + 1}`;
        actionButton.textContent = "Hold to See Role"; // Adjusted logic slightly for better UX? Or just Click? User said "A button... done checking".
        // Let's implement: Click "Reveal" -> Shows Role -> Button becomes "Done" -> Click "Done" -> Next Player.

        actionButton.textContent = "Reveal Role";
        actionButton.classList.remove('secondary');

        cardFront.innerHTML = `<span style="font-size:3rem">?</span><br>Tap 'Reveal Role' below`;
    }

    function handleAction() {
        if (!isRevealed) {
            // REVEAL LOGIC
            revealRole();
        } else {
            // DONE / NEXT LOGIC
            nextTurn();
        }
    }

    function revealRole() {
        isRevealed = true;
        card.classList.add('flipped');

        const role = players[currentPlayerIndex];
        if (role === 'Imposter') {
            cardBack.innerHTML = `
                <div class="role-text imposter-role">IMPOSTER</div>
                <div class="instruction">Try to blend in!</div>
            `;
        } else {
            cardBack.innerHTML = `
                <div class="role-text innocent-role">${currentItem}</div>
                <div class="instruction">Remember this word!</div>
            `;
        }

        actionButton.textContent = "Hide & Pass Device";
        actionButton.classList.add('secondary'); // Visual cue that action changed
    }

    function nextTurn() {
        currentPlayerIndex++;

        if (currentPlayerIndex >= totalPlayers) {
            showResult();
        } else {
            updateGameScreen();
        }
    }

    function showResult() {
        showScreen('result');
        // In a real game, you might not want to show roles immediately.
        // But for "Game Play Step 7: Done checking", we end here.
        gameStatusText.innerHTML = `
            <h2>All Roles Assigned!</h2>
            <p>Start discussing and find the Imposter!</p>
            <br>
            <p style="color: #666; font-size: 0.8rem">Category: ${categories[categorySelect.value].name}</p>
        `;
    }

    function resetGame() {
        showScreen('setup');
    }

    function showScreen(screenName) {
        setupScreen.classList.remove('active');
        gameScreen.classList.remove('active');
        resultScreen.classList.remove('active');

        setupScreen.style.display = 'none';
        gameScreen.style.display = 'none';
        resultScreen.style.display = 'none';

        if (screenName === 'setup') {
            setupScreen.style.display = 'flex'; // Use flex due to CSS .screen.active
            setTimeout(() => setupScreen.classList.add('active'), 10);
        } else if (screenName === 'game') {
            gameScreen.style.display = 'flex';
            setTimeout(() => gameScreen.classList.add('active'), 10);
        } else if (screenName === 'result') {
            resultScreen.style.display = 'flex';
            setTimeout(() => resultScreen.classList.add('active'), 10);
        }
    }

    // Initial Load
    showScreen('setup');
});
