// ============================================================================
// playground.js — Demos, Widgets and Games sub-sections: each is its own
// data array + independently paginated grid, sharing the same card style
// and iframe lazy-load observer from core.js.
//
// Demos and Widgets both live in the "Codelab" folder on GitHub (renamed
// from "Pages" — see CODELAB_BASE in core.js); Games live in the "Games"
// folder. The folder itself is unchanged: only the base URL points at its
// new name.
// ============================================================================

import { GAMES_BASE, CODELAB_BASE, createPaginatedGrid, buildGameLikeCard, observeGameCards } from '../core.js';

const games = [
    {
        id: 'minesweeper',
        title: 'Minesweeper',
        file: 'minesweeper.html',
        icon: 'fas fa-bomb',
        tags: ['Puzzle', 'Classic', 'JavaScript'],
        descEn: 'Classic minesweeper game with multiple difficulty levels',
        descAf: 'Klassieke mynveer-speletjie met verskeie moeilikheidsgrade'
    },
    {
        id: 'platformer',
        title: 'Platformer',
        file: 'platformer.html',
        icon: 'fas fa-running',
        tags: ['Action', 'Platform', 'Canvas'],
        descEn: 'Side-scrolling platformer with challenging obstacles',
        descAf: 'Sy-rollende platform met uitdagende hindernisse'
    },
    {
        id: 'pong',
        title: 'Pong',
        file: 'pong.html',
        icon: 'fas fa-table-tennis',
        tags: ['Arcade', 'Classic', 'Multiplayer'],
        descEn: 'The classic arcade game - play against AI or a friend',
        descAf: 'Die klassieke arcade-speletjie - speel teen KI of \'n vriend'
    },
    {
        id: 'snake',
        title: 'Snake Game',
        file: 'snake_game.html',
        icon: 'fas fa-worm',
        tags: ['Arcade', 'Classic', 'JavaScript'],
        descEn: 'Guide the snake to eat and grow without hitting walls',
        descAf: 'Lei die slang om te eet en te groei sonder om mure te tref'
    },
    {
        id: 'tower',
        title: 'Tower Blocks',
        file: 'tower_blocks.html',
        icon: 'fas fa-cubes',
        tags: ['Puzzle', 'Stacking', 'Skill'],
        descEn: 'Stack blocks as high as you can - precision required!',
        descAf: 'Stapel blokke so hoog as moontlik - presisie vereis!'
    },
    {
        id: 'wordguess',
        title: 'Word Guess',
        file: 'word_guess.html',
        icon: 'fas fa-spell-check',
        tags: ['Word', 'Puzzle', 'Brain'],
        descEn: 'Guess the hidden word before running out of attempts',
        descAf: 'Raai die verborge woord voordat pogings opraak'
    },
    {
        id: 'Slots',
        title: 'Slots',
        file: 'slots.html',
        icon: 'fas fa-dice',
        tags: ['luck', 'skill', 'fun'],
        descEn: 'Play a custom slot machine created by me',
        descAf: 'Speel \'n unieke slotmasjien speletjie gemaak deur my'
    }
];

const demos = [
    {
        id: 'buddy terminal',
        title: 'buddy terminal',
        file: 'buddyterminal.html',
        icon: 'fas fa-palette',
        tags: ['Tamagotchi', 'commands', 'Interactive'],
        descEn: 'Hach your own pet , interact and see how it creates code and so much more.',
        descAf: 'Hou jou eie troeteldier, interaksie en kyk hoe dit kode skep en soveel meer.'
    },
    {
        id: 'Hacklab',
        title: 'Hacklab',
        file: 'Hacklab.html',
        icon: 'fas fa-palette',
        tags: ['HackLab', 'Hacking', 'Beginners'],
        descEn: 'Learn to hack web apps through 10 fun mini challenges built for beginners.',
        descAf: 'Leer om webapps te hack deur 10 pret mini-uitdagings vir beginners.'
    },
    {
        id: 'Pattern Assessment',
        title: 'Pattern Assessment',
        file: 'patternassesment.html',
        icon: 'fas fa-palette',
        tags: ['Sucure', 'Patterns', 'Live'],
        descEn: 'A secure way to pass data between windows using only HTML and JavaScript',
        descAf: 'n Veilige manier om data tussen vensters oor te dra deur slegs HTML en JavaScript te gebruik.'
    },
    {
        id: 'Document Scanner',
        title: 'Document Scanner',
        file: 'document_scanner.html',
        icon: 'fas fa-palette',
        tags: ['Camara', 'Text', 'Auto'],
        descEn: 'Can scan and flatten documents/images and even convert them to text for readability.',
        descAf: 'Kan dokumente/beelde skandeer en platmaak en selfs na teks omskakel vir leesbaarheid.'
    },
    {
        id: 'Demo Dashboard',
        title: 'Demo Dashboard',
        file: 'demodash.html',
        icon: 'fas fa-palette',
        tags: ['HTML', 'Visual', 'Dashboard'],
        descEn: 'Just for show: a fun and modern-looking dashboard.',
        descAf: 'Net vir vertoon: n prettige en modern-uitziende dashboard.'
    }
];

const widgets = [
    {
        id: 'filterlab',
        title: 'CSS Filter Showcase',
        file: 'Filterlab.html',
        icon: 'fas fa-palette',
        tags: ['CSS', 'Filters', 'Interactive'],
        descEn: 'Every CSS filter function — visualised. Click any card to copy the code.',
        descAf: 'Elke CSS-filterfunksie — gevisualiseer. Klik enige kaart om die kode te kopieer.'
    },
    {
        id: 'Particle Generator',
        title: 'Particle Generator Showcase',
        file: 'ParticleGen.html',
        icon: 'fas fa-palette',
        tags: ['Particle', 'Themes', 'Interactive'],
        descEn: 'Create your own particals and copy them for your project.',
        descAf: 'Skep jou eie deeltjies en kopieer dit vir jou projek.'
    },
    {
        id: 'Text Motion Animation',
        title: 'Text Motion Showcase',
        file: 'TextMotion.html',
        icon: 'fas fa-palette',
        tags: ['Text', 'CSS', 'Animation'],
        descEn: 'Hover cards to preview · Click copy to grab CSS + JS.',
        descAf: 'Beweeg kaarte om n voorskou te kry · Klik op kopieer om CSS + JS te kry.'
    }
];

export function initPlayground() {
    createPaginatedGrid({
        gridId: 'demos-grid',
        buttonId: 'demos-load-more',
        items: demos,
        renderCard: (entry) => buildGameLikeCard(entry, {
            basePath: CODELAB_BASE,
            ctaIcon: 'fas fa-external-link-alt',
            ctaTextEn: 'View Page',
            ctaTextAf: 'Bekyk Bladsy',
            loadingTextEn: 'Loading page...',
            loadingTextAf: 'Laai bladsy...'
        }),
        onCardsAdded: observeGameCards
    });

    createPaginatedGrid({
        gridId: 'widgets-grid',
        buttonId: 'widgets-load-more',
        items: widgets,
        renderCard: (entry) => buildGameLikeCard(entry, {
            basePath: CODELAB_BASE,
            ctaIcon: 'fas fa-external-link-alt',
            ctaTextEn: 'View Page',
            ctaTextAf: 'Bekyk Bladsy',
            loadingTextEn: 'Loading page...',
            loadingTextAf: 'Laai bladsy...'
        }),
        onCardsAdded: observeGameCards
    });

    createPaginatedGrid({
        gridId: 'games-grid',
        buttonId: 'games-load-more',
        items: games,
        renderCard: (entry) => buildGameLikeCard(entry, {
            basePath: GAMES_BASE,
            ctaIcon: 'fas fa-play',
            ctaTextEn: 'Play Game',
            ctaTextAf: 'Speel Speletjie',
            loadingTextEn: 'Loading game...',
            loadingTextAf: 'Laai speletjie...'
        }),
        onCardsAdded: observeGameCards
    });
}
