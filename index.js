// ===== APP STATE =====
const App = {
    state: {
        lang: localStorage.getItem('portfolio-lang') || 'en',
        theme: localStorage.getItem('portfolio-theme') || 'dark',
        menuOpen: false,
        loaded: false
    },
    
    // Games data
    games: [
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
    ],
    
    // Pages data
    pages: [
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

    ],

    // Project data
    projects: [
        { title: 'LKDA - Strategic Creative Advertising', img: 'Lkda.png', url: 'https://www.lkda.co.za/', tags: ['Laravel', 'Umbraco', 'CMS'], descEn: 'Creative advertising agency website', descAf: 'Kreatiewe advertensie-agentskap webwerf' },
        { title: 'ATP', img: 'ATPsite.png', url: 'https://amplifytradepartners.co.za/', tags: ['WordPress', 'PHP', 'SEO'], descEn: 'Amplify Trade Partners website', descAf: 'Amplify Trade Partners webwerf' },
        { title: '3D Lazer Monkey', img: '3D%20lasermonkey.png', url: 'https://3dlasermonkey.co.za/', tags: ['WordPress', '3D'], descEn: '3D printing and laser cutting services', descAf: '3D-druk en lasersnydienste' },
        { title: 'Nissan SA', img: 'NissanSA.png', url: 'https://www.nissan.co.za/', tags: ['WordPress', 'PHP', 'SEO'], descEn: 'Official Nissan South Africa website', descAf: 'Amptelike Nissan Suid-Afrika webwerf' },
        { title: 'Nissan Angola', img: 'NissanAngola.png', url: 'https://www.nissan.co.ao/', tags: ['WordPress', 'PHP'], descEn: 'Official Nissan Angola website', descAf: 'Amptelike Nissan Angola webwerf' },
        { title: 'Nissan Uganda', img: 'NissanUganda.png', url: 'https://www.nissan.co.ug/', tags: ['WordPress', 'PHP'], descEn: 'Official Nissan Uganda website', descAf: 'Amptelike Nissan Uganda webwerf' },
        { title: 'Afrit', img: 'afrit.png', url: 'https://afrit.co.za/', tags: ['WordPress', 'PHP'], descEn: 'Trailer manufacturing company website', descAf: 'Sleepwa-vervaardigingsmaatskappy webwerf' },
        { title: 'Safal Steel', img: 'Safalsteel.png', url: 'https://www.safalsteel.com/', tags: ['WordPress', 'PHP'], descEn: 'Steel manufacturing company website', descAf: 'Staalvervaardigingsmaatskappy webwerf' },
        { title: 'Mega Master SA', img: 'Megamaster.png', url: 'https://megamaster.co.za/', tags: ['WordPress', 'E-commerce'], descEn: 'BBQ and outdoor products e-commerce', descAf: 'Braai en buite-produkte e-handel' },
        { title: 'First 4 Men', img: 'First4Men.png', url: 'https://first4men.co.za/', tags: ['WordPress', 'PHP'], descEn: 'Men\'s health and wellness website', descAf: 'Mans gesondheid en welstand webwerf' },
        { title: 'Gridcontrol', img: 'Gridcontroll.png', url: 'https://www.gridcontrol.co.za/', tags: ['WordPress', 'PHP'], descEn: 'Power solutions company website', descAf: 'Kragoplossings maatskappy webwerf' },
        { title: 'Blueasset group', img: 'Blueasset.png', url: 'https://blueassetgroup.com/za', tags: ['WordPress', 'PHP'], descEn: 'Asset management company website', descAf: 'Batebestuur maatskappy webwerf' },
        { title: 'Pinaroch', img: 'Pinaroch.png', url: 'https://pinaroch.co.za/', tags: ['Laravel', 'PHP', 'Middleware'], descEn: 'Construction company website', descAf: 'Konstruksiemaatskappy webwerf' },
        { title: 'MyBuildings Africa', img: 'My%20buildings%20africa.png', url: 'https://mybuildingsafrica.com/', tags: ['Laravel', 'CMS'], descEn: 'Property management platform', descAf: 'Eiendomsbestuur platform' },
        { title: 'myBuildings EMEA', img: 'My%20buildings%20emea.png', url: 'https://mybuildingsemea.com/', tags: ['Laravel', 'CMS'], descEn: 'Property management platform EMEA', descAf: 'Eiendomsbestuur platform EMEA' },
        { title: 'Chery', img: 'cherry%20South%20africa.png', url: 'https://www.chery.co.za/', tags: ['WordPress', 'PHP'], descEn: 'Official Chery South Africa website', descAf: 'Amptelike Chery Suid-Afrika webwerf' },
        { title: 'Goscor', img: 'Goscor%20group.png', url: 'https://goscor.co.za/', tags: ['WordPress', 'Multi-site'], descEn: 'Industrial equipment group website', descAf: 'Industriële toerusting groep webwerf' },
        { title: 'Goscor Earth Moving', img: 'Goscor%20earth%20moving.png', url: 'https://www.goscorearthmoving.co.za/', tags: ['WordPress', 'PHP'], descEn: 'Earth moving equipment website', descAf: 'Grondverskuiwingstoerusting webwerf' },
        { title: 'Goscor Lift Trucks', img: 'Goscor%20lift%20trucks.png', url: 'https://goscorlifttrucks.co.za/', tags: ['WordPress', 'PHP'], descEn: 'Forklift solutions website', descAf: 'Vurkhyser oplossings webwerf' },
        { title: 'Goscor Compressed Air', img: 'Goscor%20compressed%20air.png', url: 'https://www.goscorcompressedair.co.za/', tags: ['WordPress', 'PHP'], descEn: 'Compressed air solutions website', descAf: 'Saamgeperste lug oplossings webwerf' },
        { title: 'Goscor Cleaning', img: 'Goscor%20cleaning.png', url: 'https://goscorcleaning.co.za/', tags: ['WordPress', 'PHP'], descEn: 'Industrial cleaning equipment website', descAf: 'Industriële skoonmaaktoerusting webwerf' },
        { title: 'CTU Training', img: 'CTU%20training.png', url: 'https://ctutraining.ac.za/', tags: ['WordPress', 'Education'], descEn: 'IT training institution website', descAf: 'IT-opleidingsinstelling webwerf' },
        { title: 'HEX', img: 'Hex.png', url: 'https://hexintegratedsolutions.com/', tags: ['WordPress', 'PHP'], descEn: 'Integrated solutions company website', descAf: 'Geïntegreerde oplossings maatskappy webwerf' },
        { title: 'Real Box', img: 'Realbox.png', url: 'https://realbox.co.za/', tags: ['WordPress', 'PHP'], descEn: 'Container solutions website', descAf: 'Houer oplossings webwerf' },
        { title: 'Commercial PV', img: 'CommercialPV.png', url: 'https://commercialpv.co.za/', tags: ['WordPress', 'Solar'], descEn: 'Commercial solar solutions website', descAf: 'Kommersiële sonkrag oplossings webwerf' },
        { title: 'Battery Distributors', img: 'batterydis.png', url: 'https://batterydistributors.co.za/', tags: ['WordPress', 'E-commerce'], descEn: 'Battery products e-commerce store', descAf: 'Battery produkte e-handel winkel' },
        { title: 'Rectifier', img: 'rectifier.png', url: 'https://rectifier.co.za/', tags: ['WordPress', 'PHP'], descEn: 'Power electronics company website', descAf: 'Krag-elektronika maatskappy webwerf' },
        { title: 'Go4Green', img: 'go4green.png', url: 'https://go4greenenergy.co.za/', tags: ['WordPress', 'Green Energy'], descEn: 'Green energy solutions website', descAf: 'Groen energie oplossings webwerf' },
        { title: 'Current Automation', img: 'Current%20automation.png', url: 'https://currentautomation.ca/', tags: ['WordPress', 'E-commerce'], descEn: 'Industrial automation e-commerce', descAf: 'Industriële outomatisering e-handel' },
        { title: "CA's Meanwell", img: 'CA%20meanwell.png', url: 'https://meanwell.co.za/', tags: ['WordPress', 'E-commerce'], descEn: 'Power supply products e-commerce', descAf: 'Kragtoevoer produkte e-handel' },
        { title: 'Solar-Solution', img: 'Solar%20solutions.png', url: 'https://solar-solution.co.za/', tags: ['WordPress', 'Solar'], descEn: 'Solar energy solutions website', descAf: 'Sonkrag oplossings webwerf' },
        { title: 'Victron Products', img: 'Victron.png', url: 'https://victronproducts.co.za/', tags: ['WordPress', 'E-commerce'], descEn: 'Victron energy products e-commerce', descAf: 'Victron energie produkte e-handel' },
        { title: 'COD BO3 Crash Bandicoot', img: 'Crash%20bandicoot.png', url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3234555216&searchtext=crash', tags: ['Radiant', 'Game Dev'], icon: 'fab fa-steam', descEn: 'Custom zombie map on Steam Workshop', descAf: 'Pasgemaakte zombie kaart op Steam Workshop' },
        { title: 'Forgotten Room 115', img: 'forgotten%20room%20115.png', url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3326520485', tags: ['Radiant', '3D Modeling'], icon: 'fab fa-steam', descEn: 'Custom COD BO3 zombie map with unique mechanics', descAf: 'Pasgemaakte COD BO3 zombie kaart met unieke meganika' },
        { title: 'Cod bo3 mod tools super', img: 'discorcod.png', url: '#', tags: ['Mods', '3D Models', 'Scripts'], icon: 'fab fa-discord', descEn: 'Custom COD BO3 zombie Mods, Scripts, 3D models', descAf: 'Pasgemaakte COD BO3 zombie Mods, Skrifte, 3D modelle' }
    ]
};

// ===== UTILITIES =====
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

function debounce(fn, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

function throttle(fn, limit) {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== LANGUAGE =====
function setLanguage(lang) {
    App.state.lang = lang;
    $$('[data-text-en], [data-text-af]').forEach(el => {
        const text = el.getAttribute(`data-text-${lang}`);
        if (text) el.textContent = text;
    });
    $$('[data-placeholder-en], [data-placeholder-af]').forEach(el => {
        const ph = el.getAttribute(`data-placeholder-${lang}`);
        if (ph) el.placeholder = ph;
    });
    $('.lang-text').textContent = lang === 'en' ? 'AF' : 'EN';
    localStorage.setItem('portfolio-lang', lang);
}

// ===== THEME =====
function setTheme(theme) {
    App.state.theme = theme;
    document.body.setAttribute('data-theme', theme);
    $('#themeToggle i').className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('portfolio-theme', theme);
}

// ===== NAVIGATION =====
function initNavigation() {
    $$('.nav-link[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = $(link.getAttribute('href'));
            if (target) {
                window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
                $$('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                if (App.state.menuOpen) toggleMenu();
            }
        });
    });
    
    const handleScroll = throttle(() => {
        const scrollY = window.scrollY;
        $('#header').classList.toggle('scrolled', scrollY > 50);
        
        const sections = $$('section[id]');
        for (const section of sections) {
            const top = section.offsetTop - 100;
            const bottom = top + section.offsetHeight;
            if (scrollY >= top && scrollY < bottom) {
                $$('.nav-link').forEach(l => l.classList.remove('active'));
                $(`.nav-link[href="#${section.id}"]`)?.classList.add('active');
                break;
            }
        }
    }, 100);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
}

// ===== MOBILE MENU =====
function toggleMenu() {
    App.state.menuOpen = !App.state.menuOpen;
    $('#navMenu').classList.toggle('active', App.state.menuOpen);
    $('#menuToggle').classList.toggle('active', App.state.menuOpen);
    $('#menuToggle').setAttribute('aria-expanded', App.state.menuOpen);
}

// ===== LOADER =====
function initLoader() {
    const loader = $('#loader');
    const loaderPercent = $('#loaderPercent');
    let progress = 0;
    
    const interval = setInterval(() => {
        progress += Math.random() * 25 + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('hidden');
                App.state.loaded = true;
                initAnimations();
                loadGames();
                loadProjects();
                loadPages();
                setLanguage(App.state.lang);
            }, 200);
        }
        loaderPercent.textContent = Math.floor(progress) + '%';
    }, 80);
}

// ===== ANIMATIONS =====
function initAnimations() {
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const item = entry.target;
                const percent = parseInt(item.dataset.percent) || 0;
                const bar = item.querySelector('.skill-progress');
                const text = item.querySelector('.skill-percent');
                
                requestAnimationFrame(() => {
                    bar.style.width = percent + '%';
                    animateNumber(text, 0, percent, 1500);
                });
                
                skillObserver.unobserve(item);
            }
        });
    }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });
    
    $$('.skill-item').forEach(item => skillObserver.observe(item));
    
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const target = parseInt(stat.dataset.count) || 0;
                animateNumber(stat, 0, target, 1500);
                statObserver.unobserve(stat);
            }
        });
    }, { threshold: 0.5 });
    
    $$('.stat-number').forEach(stat => statObserver.observe(stat));
}

function animateNumber(el, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * easeProgress);
        el.textContent = current + (el.classList.contains('skill-percent') ? '%' : '');
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ===== GAMES =====
function loadGames() {
    const grid = $('#games-grid');
    if (!grid) return;
    
    const gameBase = 'https://williamsham90.github.io/Portfolio/Games/';
    const fragment = document.createDocumentFragment();
    
    App.games.forEach((game, index) => {
        const card = document.createElement('article');
        card.className = 'game-card';
        card.innerHTML = `
            <div class="game-preview">
                <div class="game-loader" id="loader-${game.id}">
                    <i class="${game.icon} game-loader-icon" aria-hidden="true"></i>
                    <div class="game-loader-spinner"></div>
                    <span class="game-loader-text" data-text-en="Loading game..." data-text-af="Laai speletjie...">Loading game...</span>
                </div>
                <div class="game-iframe-wrapper">
                    <iframe 
                        class="game-iframe" 
                        data-src="${gameBase}${game.file}"
                        title="${game.title}"
                        loading="lazy"
                        sandbox="allow-scripts allow-same-origin"
                        aria-label="Preview of ${game.title}"
                    ></iframe>
                </div>
                <div class="game-overlay">
                    <a href="${gameBase}${game.file}" target="_blank" rel="noopener noreferrer" class="game-play-btn">
                        <i class="fas fa-play" aria-hidden="true"></i>
                        <span data-text-en="Play Game" data-text-af="Speel Speletjie">Play Game</span>
                    </a>
                </div>
            </div>
            <div class="game-content">
                <h3 class="game-title"><i class="${game.icon}" aria-hidden="true"></i>${game.title}</h3>
                <p class="game-description" data-text-en="${game.descEn}" data-text-af="${game.descAf}">${App.state.lang === 'en' ? game.descEn : game.descAf}</p>
                <div class="game-tags">${game.tags.map(t => `<span class="game-tag">${t}</span>`).join('')}</div>
            </div>
        `;
        fragment.appendChild(card);
    });
    
    grid.appendChild(fragment);
    initGameIframeLazyLoad();
}

function initGameIframeLazyLoad() {
    const gameObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const iframe = card.querySelector('.game-iframe');
                const loader = card.querySelector('.game-loader');
                const src = iframe.getAttribute('data-src');
                
                if (src && !iframe.src) {
                    iframe.src = src;
                    
                    iframe.addEventListener('load', () => {
                        setTimeout(() => {
                            loader.classList.add('hidden');
                        }, 500);
                    });
                    
                    setTimeout(() => {
                        loader.classList.add('hidden');
                    }, 5000);
                }
                
                gameObserver.unobserve(card);
            }
        });
    }, { threshold: 0.1, rootMargin: '100px 0px' });
    
    $$('.game-card').forEach(card => gameObserver.observe(card));
}

// ===== PROJECTS =====
function loadProjects() {
    const grid = $('#projects-grid');
    if (!grid) return;
    
    const imgBase = 'https://raw.githubusercontent.com/WilliamSham90/Portfolio/main/Images/';
    const fragment = document.createDocumentFragment();
    
    App.projects.forEach(project => {
        const card = document.createElement('article');
        card.className = 'project-card';
        card.innerHTML = `
            <div class="project-image">
                <img src="${imgBase}${project.img}" alt="${project.title}" loading="lazy" decoding="async">
                <div class="project-overlay">
                    <a href="${project.url}" ${project.url !== '#' ? 'target="_blank" rel="noopener noreferrer"' : ''} class="project-link" aria-label="View ${project.title}">
                        <i class="${project.icon || 'fas fa-external-link-alt'}"></i>
                    </a>
                </div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description" data-text-en="${project.descEn}" data-text-af="${project.descAf}">${App.state.lang === 'en' ? project.descEn : project.descAf}</p>
                <div class="project-tags">${project.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
            </div>
        `;
        fragment.appendChild(card);
    });
    
    grid.appendChild(fragment);
}

// ===== PAGES (like Games with iframe previews) =====
function loadPages() {
    const grid = $('#pages-grid');
    if (!grid) return;
    
    const pageBase = 'https://williamsham90.github.io/Portfolio/Pages/';
    const fragment = document.createDocumentFragment();
    
    App.pages.forEach((page) => {
        const card = document.createElement('article');
        card.className = 'game-card';
        card.innerHTML = `
            <div class="game-preview">
                <div class="game-loader" id="loader-page-${page.id}">
                    <i class="${page.icon} game-loader-icon" aria-hidden="true"></i>
                    <div class="game-loader-spinner"></div>
                    <span class="game-loader-text" data-text-en="Loading page..." data-text-af="Laai bladsy...">Loading page...</span>
                </div>
                <div class="game-iframe-wrapper">
                    <iframe 
                        class="game-iframe page-iframe" 
                        data-src="${pageBase}${page.file}"
                        title="${page.title}"
                        loading="lazy"
                        sandbox="allow-scripts allow-same-origin"
                        aria-label="Preview of ${page.title}"
                    ></iframe>
                </div>
                <div class="game-overlay">
                    <a href="${pageBase}${page.file}" target="_blank" rel="noopener noreferrer" class="game-play-btn">
                        <i class="fas fa-external-link-alt" aria-hidden="true"></i>
                        <span data-text-en="View Page" data-text-af="Bekyk Bladsy">View Page</span>
                    </a>
                </div>
            </div>
            <div class="game-content">
                <h3 class="game-title"><i class="${page.icon}" aria-hidden="true"></i>${page.title}</h3>
                <p class="game-description" data-text-en="${page.descEn}" data-text-af="${page.descAf}">${App.state.lang === 'en' ? page.descEn : page.descAf}</p>
                <div class="game-tags">${page.tags.map(t => `<span class="game-tag">${t}</span>`).join('')}</div>
            </div>
        `;
        fragment.appendChild(card);
    });
    
    grid.appendChild(fragment);
    initPageIframeLazyLoad();
}

function initPageIframeLazyLoad() {
    const pageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const iframe = card.querySelector('.page-iframe');
                const loader = card.querySelector('.game-loader');
                const src = iframe.getAttribute('data-src');
                
                if (src && !iframe.src) {
                    iframe.src = src;
                    
                    iframe.addEventListener('load', () => {
                        setTimeout(() => {
                            loader.classList.add('hidden');
                        }, 500);
                    });
                    
                    setTimeout(() => {
                        loader.classList.add('hidden');
                    }, 5000);
                }
                
                pageObserver.unobserve(card);
            }
        });
    }, { threshold: 0.1, rootMargin: '100px 0px' });
    
    $$('#pages-grid .game-card').forEach(card => pageObserver.observe(card));
}

// ===== PARTICLES =====
function generateParticles() {
    const container = $('#particles');
    if (!container || window.innerWidth < 768) return;
    
    const symbols = ['{', '}', '[', ']', '<', '>', '/', '=', ';'];
    const fragment = document.createDocumentFragment();
    const count = window.innerWidth > 1024 ? 12 : 6;
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        particle.style.cssText = `left:${Math.random() * 100}%;animation-delay:${Math.random() * 20}s;animation-duration:${15 + Math.random() * 10}s`;
        fragment.appendChild(particle);
    }
    
    container.appendChild(fragment);
}

// ===== CONTACT FORM =====
function initContactForm() {
    const form = $('#contactForm');
    if (!form) return;
    
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = form.querySelector('.btn-submit');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;
        
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                form.reset();
                btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
                setTimeout(() => btn.innerHTML = originalText, 3000);
            } else {
                throw new Error('Failed');
            }
        } catch {
            btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
            setTimeout(() => btn.innerHTML = originalText, 3000);
        } finally {
            btn.disabled = false;
        }
    });
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(App.state.lang);
    setTheme(App.state.theme);
    
    initNavigation();
    initContactForm();
    generateParticles();
    
    $('#langToggle').addEventListener('click', () => {
        setLanguage(App.state.lang === 'en' ? 'af' : 'en');
    });
    
    $('#themeToggle').addEventListener('click', () => {
        setTheme(App.state.theme === 'dark' ? 'light' : 'dark');
    });
    
    $('#menuToggle').addEventListener('click', toggleMenu);
    
    initLoader();
});
