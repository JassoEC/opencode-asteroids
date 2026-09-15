# AGENTS.md

## Project
Single-file HTML5 Canvas clone of Asteroids. No dependencies, no bundler, no build step, no tests, no linter. All game logic lives in `game.js`; `index.html` only hosts the canvas and loads the script.

## Run / Verify
- Open `index.html` directly in a browser, or run `npx serve .` (then visit `http://localhost:3000`).
- Manual verification only: play the game, check console for errors.

## Gotchas
- Canvas dimensions are duplicated and MUST stay in sync: `<canvas width="800" height="600">` in `index.html` and the `W`/`H` consts at the top of `game.js`. The game draws against a fixed 800×600 coordinate space (no resize handling).
- The entire app runs on a single 2D context; keep all drawing in `game.js` using that `ctx`.
- Screen edges wrap toroidally via the `wrap()` helper (`wrap(v, max)` in `game.js`); use it for any entity that should cross edges.
- Input uses `e.code` (`'ArrowLeft'`, `'Space'`, etc.), and one-shot presses go through `pressed(code)` (consumes the edge after a keyup). Don't poll `keys` for discrete single-fire actions like shooting.

## Conventions
- Comments and UI strings are in Spanish (`NIVEL`, `PUNTAJE`, comments like `// por tamaño`). Write new comments/strings in Spanish to match.
- Vanilla ES6 classes (no `async`/modules); keep it dependency-free.