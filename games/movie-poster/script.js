document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const GRID_ROWS = 10;
    const GRID_COLS = 10;
    const TOTAL_IMAGES = 20;

    // placeholder images - USER: REPLACE THESE WITH YOUR ACTUAL IMAGE PATHS
    // Put your images in the 'img' folder and update these filenames
    // const posters = [
    //     'img/1.jpg',
    //     'img/2.jpg',
    //     'img/3.jpg',
    //     'img/4.jpg',
    //     'img/5.jpg'
    // ];
    const posters = Array.from({ length: TOTAL_IMAGES }, (_, i) => `img/${i + 1}.jpg`);

    let currentPosterIndex = -1;
    let availablePosters = [...posters];
    const posterImage = document.getElementById('poster-image');
    const gridOverlay = document.getElementById('grid-overlay');
    const gridContainer = document.getElementById('poster-container');
    const btnShowAll = document.getElementById('btn-show-all');
    const btnNext = document.getElementById('btn-next');
    const messageDisplay = document.getElementById('message');

    // Initialize Game
    function init() {
        if (availablePosters.length === 0) {
            // Reset if all shown
            availablePosters = [...posters];
            messageDisplay.textContent = "All posters shown! Restarting list.";
        }

        loadRandomPoster();
        createGrid();

        // Event Listeners
        btnShowAll.addEventListener('click', revealAll);
        btnNext.addEventListener('click', nextPoster);
    }

    function loadRandomPoster() {
        if (availablePosters.length === 0) {
            availablePosters = [...posters];
        }

        // Pick random index
        const randomIndex = Math.floor(Math.random() * availablePosters.length);
        const selectedPoster = availablePosters[randomIndex];

        // Remove from available so we don't repeat immediately until reset
        availablePosters.splice(randomIndex, 1);

        posterImage.src = selectedPoster;
        posterImage.onerror = () => {
            // Fallback if image not found (since user hasn't added them yet)
            posterImage.alt = "Image not found: " + selectedPoster;
            gridContainer.style.backgroundColor = "#333";
            messageDisplay.textContent = "Please add images to img/ folder!";
        };
    }

    function createGrid() {
        gridOverlay.innerHTML = '';
        const totalTiles = GRID_ROWS * GRID_COLS;

        for (let i = 0; i < totalTiles; i++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.index = i;

            tile.addEventListener('click', () => {
                tile.classList.add('revealed');
            });

            gridOverlay.appendChild(tile);
        }
    }

    function revealAll() {
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach(tile => {
            tile.classList.add('revealed');
        });
    }

    function nextPoster() {
        loadRandomPoster();
        // Recreate grid to prevent "glimpse" of image due to transition delay
        createGrid();
        messageDisplay.textContent = "";
    }

    init();
});
