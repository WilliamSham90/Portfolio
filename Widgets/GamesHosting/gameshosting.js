// ============================================================================
// gameshosting.js — Steam Workshop / mod-tools items, split out of Projects.
// ============================================================================

import { createPaginatedGrid, buildProjectCard } from '../core.js';

const hosting = [
    { title: 'COD BO3 Crash Bandicoot', img: 'Crash%20bandicoot.png', url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3234555216&searchtext=crash', tags: ['Radiant', 'Game Dev'], icon: 'fab fa-steam', descEn: 'Custom zombie map on Steam Workshop', descAf: 'Pasgemaakte zombie kaart op Steam Workshop' },
    { title: 'Forgotten Room 115', img: 'forgotten%20room%20115.png', url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3326520485', tags: ['Radiant', '3D Modeling'], icon: 'fab fa-steam', descEn: 'Custom COD BO3 zombie map with unique mechanics', descAf: 'Pasgemaakte COD BO3 zombie kaart met unieke meganika' },
    { title: 'Cod bo3 mod tools super', img: 'discorcod.png', url: '#', tags: ['Mods', '3D Models', 'Scripts'], icon: 'fab fa-discord', descEn: 'Custom COD BO3 zombie Mods, Scripts, 3D models', descAf: 'Pasgemaakte COD BO3 zombie Mods, Skrifte, 3D modelle' }
];

export function initGamesHosting() {
    createPaginatedGrid({
        gridId: 'hosting-grid',
        buttonId: 'hosting-load-more',
        items: hosting,
        renderCard: buildProjectCard
    });
}
