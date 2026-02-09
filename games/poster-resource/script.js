document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const GRID_ROWS = 10;
    const GRID_COLS = 10;
    const TOTAL_IMAGES = 20;

    // Put your images in the 'img' folder and update these filenames
    const posters = Array.from({ length: TOTAL_IMAGES }, (_, i) => `img/${i + 1}.jpg`);
    function preloadImages() {
        posters.forEach(src => {
            const img = new Image();
            img.src = src;
        });
        console.log(`${posters.length} images preloaded.`);
    }

    let availablePosters = [...posters];
    const posterImage = document.getElementById('poster-image');
    const gridOverlay = document.getElementById('grid-overlay');
    const gridContainer = document.getElementById('poster-container');
    const btnShowAll = document.getElementById('btn-show-all');
    const btnNext = document.getElementById('btn-next');
    const btnRandomReveal = document.getElementById('btn-random-reveal');
    const messageDisplay = document.getElementById('message');

    // Initialize Game
    function init() {
        preloadImages(); // Start downloading in the background
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
        btnRandomReveal.addEventListener('click', revealRandomTile);
    }

    function loadRandomPoster() {
        const selectedPoster = getRandomPosterAndRemove();
        posterImage.src = selectedPoster;
        posterImage.onerror = () => {
            // Fallback if image not found (since user hasn't added them yet)
            posterImage.alt = "Image not found: " + selectedPoster;
            gridContainer.style.backgroundColor = "#333";
            messageDisplay.textContent = "Please add images to img/ folder!";
        };
    }

    function getRandomPosterAndRemove() {
        if (availablePosters.length === 0) {
            availablePosters = [...posters]; // reset when empty
        }

        const randomIndex = Math.floor(Math.random() * availablePosters.length);
        const poster = availablePosters[randomIndex];

        // remove selected poster from array
        availablePosters.splice(randomIndex, 1);
        console.log(poster, availablePosters);
        return poster;
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

    function revealRandomTile() {
        const hiddenTiles = Array.from(document.querySelectorAll('.tile:not(.revealed)'));
        if (hiddenTiles.length > 0) {
            const randomIndex = Math.floor(Math.random() * hiddenTiles.length);
            hiddenTiles[randomIndex].classList.add('revealed');
        }
    }

    function nextPoster() {
        loadRandomPoster();
        // Recreate grid to prevent "glimpse" of image due to transition delay
        createGrid();
        messageDisplay.textContent = "";
    }

    init();
});
