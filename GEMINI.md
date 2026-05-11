# Chanavee's Portfolio & Games

This project is a personal portfolio website that also hosts a collection of web-based mini-games. It is built as a static site using vanilla web technologies.

## Project Overview

- **Technologies:** HTML5, CSS3, Vanilla JavaScript (ES6+), JSON.
- **Architecture:** A main portfolio landing page with navigation to standalone games.
- **Hosting:** Designed for GitHub Pages (hosted at `chanavee.github.io`).

## Directory Structure

- `/index.html`: The main portfolio landing page.
- `/main/`: Core assets for the portfolio site.
  - `/css/style.css`: Global styles, typography, and layout.
  - `/js/script.js`: Global interactivity (smooth scrolling, fade-in animations).
  - `/img/`: Global images and favicons.
- `/games/`: Contains individual game projects.
  - `imposter.html`, `poster.html`, etc.: Standalone game entry points.
  - `/*-resource/`: Game-specific assets (CSS, JS, JSON data, images).
- `README.md`: Basic instructions for local development.

## Building and Running

Since this is a static project, there is no build step.

### Development Server
To run the project locally, use a static file server. The recommended command is:
```bash
npx http-server -p 9000
```
Then open `http://localhost:9000` in your browser.

## Development Conventions

- **Vanilla First:** Prefer vanilla CSS and JavaScript over frameworks to keep the site lightweight and fast.
- **Responsive Design:** All pages and games should be mobile-friendly, utilizing media queries and flexible layouts.
- **Modularity:** Keep game-specific logic and styles within their respective `/*-resource` directories to maintain a clean separation of concerns.
- **Data-Driven Games:** Games like "Imposter" use JSON files (`/games/imposter-resource/*.json`) for content, making it easy to add new categories or words.

## Key Files

- `index.html`: The central hub of the project.
- `main/css/style.css`: Defines the "premium" minimalist aesthetic of the portfolio.
- `main/js/script.js`: Handles UX enhancements like the intersection observer for animations.
- `games/imposter.html`: A party game logic implementation.
- `games/poster.html`: A movie poster guessing game with grid-based reveal mechanics.
- `games/this-or-that.html`: A "This or That" decision game.
- `games/oscars-2026.html`: An Oscars 2026 game/page.