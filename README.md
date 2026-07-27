# Game Codex

**Play More. Research Less.**

Game Codex is an offline-first gaming codex for modern completionists.

Its first implementation is **Eolas Companion**, a mobile-first Palworld
companion designed to reduce research friction and return players to the game.

## Current module

**Module 01 — Foundation and Navigation**

Included screens:

- Home
- Paldex
- Regions
- Bases
- Settings

## Repository structure

```text
game-codex/
├── assets/
│   ├── icons/
│   └── images/
├── css/
│   ├── app.css
│   └── components.css
├── data/
│   └── games/
│       └── palworld/
├── docs/
├── js/
│   ├── core/
│   ├── modules/
│   └── app.js
├── index.html
├── manifest.webmanifest
└── service-worker.js
```

## Development approach

Each module must leave the published app in a usable state. Game data,
presentation, application behavior, and local assets remain separate.
