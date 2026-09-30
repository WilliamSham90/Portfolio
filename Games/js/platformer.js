/*================================================
  Platformer (Clarity engine)
  Physics runs at a fixed 60 steps a second, so jumps feel the same on any
  screen. Tile scripts are plain functions (no eval), deaths and wins show
  in-game instead of alert(), and the level is copied fresh on every
  restart so the gate re-locks. The static level is drawn once to an
  offscreen canvas and just blitted each frame.
================================================*/

(function () {
    'use strict';

    const STEP = 1 / 60;
    const VIEW = 360; // world pixels shown across the canvas

    function store(key, value) {
        try {
            if (value === undefined) return localStorage.getItem(key);
            localStorage.setItem(key, value);
        } catch (e) { return null; }
    }

    /*================================================
      Level
      id: tile number used in data · colour · solid · bounce (velocity kept
      on impact) · jump (can jump while inside) · friction / gravity
      overrides · fore (drawn over the player) · script (run on entering)
    ================================================*/

    const LEVEL = {
        tile_size: 16,
        keys: [
            { id: 0, colour: '#333', solid: 0 },
            { id: 1, colour: '#888', solid: 0 },
            { id: 2, colour: '#555', solid: 1, bounce: 0.35 },
            { id: 3, colour: 'rgba(121, 220, 242, 0.4)', friction: { x: 0.9, y: 0.9 }, gravity: { x: 0, y: 0.1 }, jump: 1, fore: 1 },
            { id: 4, colour: '#777', jump: 1 },
            { id: 5, colour: '#E373FA', solid: 1, bounce: 1.1 },
            { id: 6, colour: '#666', solid: 1, bounce: 0 },
            { id: 7, colour: '#73C6FA', solid: 0, script: 'change_colour' },
            { id: 8, colour: '#FADF73', solid: 0, script: 'next_level' },
            { id: 9, colour: '#C93232', solid: 0, script: 'death' },
            { id: 10, colour: '#555', solid: 1 },
            { id: 11, colour: '#0FF', solid: 0, script: 'unlock' }
        ],
        data: [
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 6, 6, 6, 6, 6, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 7, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 4, 2, 2, 2, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 2, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 2, 1, 2, 2, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 2, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 2, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 2, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 2, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 2, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 2, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 2, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 2, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 2, 1, 2],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 4, 2, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 4, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 4, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2],
            [2, 1, 2, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 4, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2],
            [2, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 4, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2],
            [2, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 8, 1, 1, 1, 2],
            [2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2],
            [2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 9, 9, 9, 2, 10, 10, 10, 10, 10, 10, 1, 1, 1, 1, 1, 1, 1, 11, 2, 2, 2, 2, 4, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 10, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2],
            [2, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 1, 1, 1, 1, 1, 1, 2],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2],
            [2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 6, 6, 2, 2, 2, 2, 2, 2, 6, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [2, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 2, 5, 5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 1, 1, 1, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
        ],
        gravity: { x: 0, y: 0.3 },
        vel_limit: { x: 2, y: 16 },
        movement_speed: { jump: 6, left: 0.3, right: 0.3 },
        player: { x: 2, y: 2, colour: '#FF9900' }
    };

    /*================================================
      Engine
    ================================================*/

    const Clarity = function () {
        this.tile_size = 16;
        this.jump_switch = 0;
        this.viewport = { x: VIEW, y: VIEW };
        this.camera = { x: 0, y: 0 };
        this.key = { left: false, right: false, up: false };
        this.player = { loc: { x: 0, y: 0 }, vel: { x: 0, y: 0 }, can_jump: true };
        this.scripts = {};
    };

    Clarity.prototype.load_map = function (map) {
        // fresh copies every time, so scripts (like unlocking the gate) can't
        // leave the level changed after a death or restart
        const keys = map.keys.map(k => Object.assign({}, k));
        const byId = {};
        keys.forEach(k => { byId[k.id] = k; });

        this.current_map = {
            keys,
            data: map.data.map(row => row.map(id => byId[id])),
            gravity: map.gravity,
            vel_limit: map.vel_limit,
            movement_speed: map.movement_speed
        };
        this.tile_size = map.tile_size;
        this.current_map.width = Math.max(...map.data.map(r => r.length)) - 1;
        this.current_map.height = map.data.length - 1;
        this.current_map.width_p = this.current_map.width * this.tile_size;
        this.current_map.height_p = this.current_map.height * this.tile_size;

        this.player.loc.x = map.player.x * this.tile_size;
        this.player.loc.y = map.player.y * this.tile_size;
        this.player.colour = map.player.colour;
        this.player.vel = { x: 0, y: 0 };
        this.last_tile = undefined;
        this.key.left = this.key.up = this.key.right = false;

        // start the camera on the player instead of sweeping in from 0,0
        this.camera = {
            x: Math.max(0, this.player.loc.x - this.viewport.x / 2),
            y: Math.max(0, this.player.loc.y - this.viewport.y / 2)
        };
        this.render_layers();
    };

    Clarity.prototype.get_tile = function (x, y) {
        return (this.current_map.data[y] && this.current_map.data[y][x]) ? this.current_map.data[y][x] : 0;
    };

    // back and fore layers drawn once; redrawn only when a script changes a tile
    Clarity.prototype.render_layers = function () {
        const ts = this.tile_size, w = (this.current_map.width + 1) * ts, h = (this.current_map.height + 1) * ts;
        const make = () => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
        this.back = this.back || make();
        this.fore = this.fore || make();
        const b = this.back.getContext('2d'), f = this.fore.getContext('2d');
        b.clearRect(0, 0, w, h);
        f.clearRect(0, 0, w, h);
        this.current_map.data.forEach((row, y) => row.forEach((tile, x) => {
            if (!tile || !tile.colour) return;
            const ctx = tile.fore ? f : b;
            ctx.fillStyle = tile.colour;
            ctx.fillRect(x * ts, y * ts, ts, ts);
        }));
    };

    Clarity.prototype.move_player = function () {
        const p = this.player, map = this.current_map, ts = this.tile_size;
        const tX = p.loc.x + p.vel.x;
        const tY = p.loc.y + p.vel.y;
        const offset = Math.round((ts / 2) - 1);

        const tile = this.get_tile(Math.round(p.loc.x / ts), Math.round(p.loc.y / ts));

        const g = tile.gravity || map.gravity;
        p.vel.x += g.x;
        p.vel.y += g.y;
        if (tile.friction) {
            p.vel.x *= tile.friction.x;
            p.vel.y *= tile.friction.y;
        }

        const t_y_up = Math.floor(tY / ts), t_y_down = Math.ceil(tY / ts);
        const y_near1 = Math.round((p.loc.y - offset) / ts), y_near2 = Math.round((p.loc.y + offset) / ts);
        const t_x_left = Math.floor(tX / ts), t_x_right = Math.ceil(tX / ts);
        const x_near1 = Math.round((p.loc.x - offset) / ts), x_near2 = Math.round((p.loc.x + offset) / ts);

        const top1 = this.get_tile(x_near1, t_y_up), top2 = this.get_tile(x_near2, t_y_up);
        const bottom1 = this.get_tile(x_near1, t_y_down), bottom2 = this.get_tile(x_near2, t_y_down);
        const left1 = this.get_tile(t_x_left, y_near1), left2 = this.get_tile(t_x_left, y_near2);
        const right1 = this.get_tile(t_x_right, y_near1), right2 = this.get_tile(t_x_right, y_near2);

        if (tile.jump && this.jump_switch > 15) {
            p.can_jump = true;
            this.jump_switch = 0;
        } else this.jump_switch++;

        p.vel.x = Math.min(Math.max(p.vel.x, -map.vel_limit.x), map.vel_limit.x);
        p.vel.y = Math.min(Math.max(p.vel.y, -map.vel_limit.y), map.vel_limit.y);
        p.loc.x += p.vel.x;
        p.loc.y += p.vel.y;
        p.vel.x *= 0.9;

        const bounceOf = tiles => tiles.reduce((b, t) => (t.solid && t.bounce > b ? t.bounce : b), 0);

        if (left1.solid || left2.solid || right1.solid || right2.solid) {
            while (this.get_tile(Math.floor(p.loc.x / ts), y_near1).solid || this.get_tile(Math.floor(p.loc.x / ts), y_near2).solid) p.loc.x += 0.1;
            while (this.get_tile(Math.ceil(p.loc.x / ts), y_near1).solid || this.get_tile(Math.ceil(p.loc.x / ts), y_near2).solid) p.loc.x -= 0.1;
            p.vel.x *= -bounceOf([left1, left2, right1, right2]) || 0;
        }

        if (top1.solid || top2.solid || bottom1.solid || bottom2.solid) {
            while (this.get_tile(x_near1, Math.floor(p.loc.y / ts)).solid || this.get_tile(x_near2, Math.floor(p.loc.y / ts)).solid) p.loc.y += 0.1;
            while (this.get_tile(x_near1, Math.ceil(p.loc.y / ts)).solid || this.get_tile(x_near2, Math.ceil(p.loc.y / ts)).solid) p.loc.y -= 0.1;
            p.vel.y *= -bounceOf([top1, top2, bottom1, bottom2]) || 0;
            if ((bottom1.solid || bottom2.solid) && !tile.jump) p.can_jump = true;
        }

        // camera eases towards the player, clamped to the level
        const c_x = Math.round(p.loc.x - this.viewport.x / 2), c_y = Math.round(p.loc.y - this.viewport.y / 2);
        const x_dif = Math.abs(c_x - this.camera.x), y_dif = Math.abs(c_y - this.camera.y);
        if (x_dif > 5) {
            const mag = Math.round(Math.max(1, x_dif * 0.1));
            this.camera.x += c_x > this.camera.x ? mag : -mag;
            this.camera.x = Math.max(0, Math.min(map.width_p - this.viewport.x + ts, this.camera.x));
        }
        if (y_dif > 5) {
            const mag = Math.round(Math.max(1, y_dif * 0.1));
            this.camera.y += c_y > this.camera.y ? mag : -mag;
            this.camera.y = Math.max(0, Math.min(map.height_p - this.viewport.y + ts, this.camera.y));
        }

        if (this.last_tile !== tile.id && tile.script && this.scripts[tile.script]) {
            this.last_tile = tile.id;
            this.scripts[tile.script](tile);
            return;
        }
        this.last_tile = tile.id;
    };

    Clarity.prototype.update = function () {
        const p = this.player, map = this.current_map;
        if (this.key.left && p.vel.x > -map.vel_limit.x) p.vel.x -= map.movement_speed.left;
        if (this.key.right && p.vel.x < map.vel_limit.x) p.vel.x += map.movement_speed.right;
        if (this.key.up && p.can_jump && p.vel.y > -map.vel_limit.y) {
            p.vel.y -= map.movement_speed.jump;
            p.can_jump = false;
        }
        this.move_player();
    };

    Clarity.prototype.draw = function (ctx) {
        const cx = Math.round(this.camera.x), cy = Math.round(this.camera.y);
        ctx.fillStyle = '#333';
        ctx.fillRect(0, 0, this.viewport.x, this.viewport.y);
        ctx.drawImage(this.back, -cx, -cy);
        ctx.fillStyle = this.player.colour;
        ctx.beginPath();
        ctx.arc(this.player.loc.x + this.tile_size / 2 - cx, this.player.loc.y + this.tile_size / 2 - cy, this.tile_size / 2 - 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.drawImage(this.fore, -cx, -cy);
    };

    /*================================================
      Game setup
    ================================================*/

    const $ = id => document.getElementById(id);
    const canvas = $('canvas');
    const ctx = canvas.getContext('2d');
    const stage = $('stage');
    const game = new Clarity();

    let steps = 0, started = false, won = false, deaths = 0, acc = 0, last = 0, toastTimer;
    let best = parseFloat(store('platformer-best'));

    function toast(msg) {
        const t = $('toast');
        t.textContent = msg;
        t.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => t.classList.remove('show'), 1600);
    }

    const seconds = () => steps * STEP;
    const renderBest = () => { $('best').textContent = isNaN(best) ? '–' : best.toFixed(1) + 's'; };

    function restart() {
        steps = 0;
        started = false;
        won = false;
        deaths = 0;
        $('deaths').textContent = '0';
        $('time').textContent = '0.0s';
        $('winScreen').hidden = true;
        game.load_map(LEVEL);
    }

    game.scripts = {
        change_colour() {
            game.player.colour = 'hsl(' + Math.floor(Math.random() * 360) + ', 90%, 60%)';
        },
        death() {
            deaths++;
            $('deaths').textContent = deaths;
            toast('Ouch, lava! Back to the start.');
            if (navigator.vibrate) navigator.vibrate(60);
            game.load_map(LEVEL); // the clock keeps running
        },
        unlock(tile) {
            const gate = game.current_map.keys.find(k => k.id === 10);
            if (!gate.solid) return;
            gate.solid = 0;
            gate.colour = '#888';
            tile.colour = '#888';
            game.render_layers();
            toast('Click! The gate is open.');
        },
        next_level() {
            won = true;
            const time = seconds();
            const isBest = !(best <= time);
            if (isBest) {
                best = time;
                store('platformer-best', time.toFixed(1));
                renderBest();
            }
            $('winText').textContent = 'Time ' + time.toFixed(1) + 's · ' + deaths + (deaths === 1 ? ' death' : ' deaths') +
                (isBest ? ' · New best!' : ' · Best ' + best.toFixed(1) + 's');
            $('winScreen').hidden = false;
            $('againBtn').focus({ preventScroll: true });
        }
    };

    // canvas fills the stage (square), world view scaled up and kept crisp
    function resize() {
        const r = stage.getBoundingClientRect();
        const size = Math.floor(Math.min(r.width, r.height, 720));
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.style.width = canvas.style.height = size + 'px';
        canvas.width = canvas.height = Math.round(size * dpr);
        const scale = canvas.width / VIEW;
        ctx.setTransform(scale, 0, 0, scale, 0, 0);
        ctx.imageSmoothingEnabled = false;
    }

    function frame(now) {
        acc += Math.min(0.25, (now - last) / 1000);
        last = now;
        while (acc >= STEP) {
            acc -= STEP;
            if (won) continue;
            if (!started && (game.key.left || game.key.right || game.key.up)) started = true;
            game.update();
            if (started && !won) steps++;
        }
        if (started && !won) $('time').textContent = seconds().toFixed(1) + 's';
        game.draw(ctx);
        requestAnimationFrame(frame);
    }

    /*================ Input ================*/

    const KEYS = {
        ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
        ArrowUp: 'up', KeyW: 'up', Space: 'up'
    };
    document.addEventListener('keydown', e => {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        if (KEYS[e.code]) {
            if (e.code === 'Space' && e.target.closest && e.target.closest('button, a')) return;
            e.preventDefault();
            game.key[KEYS[e.code]] = true;
        } else if (e.code === 'KeyR') {
            restart();
        }
    });
    document.addEventListener('keyup', e => {
        if (KEYS[e.code]) game.key[KEYS[e.code]] = false;
    });
    window.addEventListener('blur', () => { game.key.left = game.key.right = game.key.up = false; });

    document.querySelectorAll('.control-btn').forEach(btn => {
        const k = btn.dataset.key;
        btn.addEventListener('pointerdown', e => {
            e.preventDefault();
            btn.setPointerCapture(e.pointerId);
            btn.classList.add('active');
            game.key[k] = true;
        });
        const release = () => { btn.classList.remove('active'); game.key[k] = false; };
        ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(t => btn.addEventListener(t, release));
        btn.addEventListener('contextmenu', e => e.preventDefault());
    });

    $('restartBtn').addEventListener('click', restart);
    $('againBtn').addEventListener('click', restart);
    let resizeTimer;
    window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 100); });

    renderBest();
    resize();
    restart();
    last = performance.now();
    requestAnimationFrame(frame);
})();
