(function(){
  "use strict";

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse  = matchMedia("(pointer: coarse)").matches;

  const GS = !!(window.gsap && window.ScrollTrigger);
  if (GS){ gsap.registerPlugin(ScrollTrigger); ScrollTrigger.config({ ignoreMobileResize: true }); }

  /* Where the real assets live. Relative to this deployment, not an
     external host — same repo, same GitHub Pages deploy, so no extra
     DNS/TLS round trip and no raw.githubusercontent.com rate limits. */
  const IMG_BASE  = "Images/";
  const GAME_BASE = "Games/";
  const PAGE_BASE = "Codelab/";

  let toastTimer;
  function toast(msg){
    const t = $("#toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2300);
  }
  function store(k, v){
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); }
    catch (e) { return null; }
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" })[c]);
  const clamp = (a, b, v) => v < a ? a : v > b ? b : v;

  /* An iframe fires `load` even when the embed was refused, leaving a blank
     frame on top of the fallback — but every source this site embeds
     (Portfolio-2, the Codelab/Games pages) is our own and never sends a
     blocking X-Frame-Options/CSP, so load firing is proof enough. A
     same-origin-unreadable check was tried here instead, but GitHub
     Pages serves Portfolio-2 and this site from the same origin
     (different paths, same williamsham90.github.io host) — so that
     check never saw "unreadable" and the frame stayed invisible. */
  function revealWhenEmbedded(frame){
    frame.addEventListener("load", () => frame.classList.add("ready"), { once: true });
  }

  /* =================================================================
     LANGUAGE
     ================================================================= */
  const AF = {
    "nav.portfolio":"Portefeulje","nav.about":"Oor my","nav.projects":"Projekte","nav.play":"Speelgrond","nav.contact":"Kontak",
    "drawer.title":"Kieslys","menu.open":"Maak die kieslys oop","menu.close":"Maak die kieslys toe",
    "skip":"Spring na die inhoud","foot.tag":"Senior webontwikkelaar",
    "hero.status":"'n Volgeling van JESUS",
    "hero.sub":"Full-stack developer. Ek maak die internet mooi.","hero.sub2":"Plesier",
    "hero.tag":"Senior webontwikkelaar",
    "hero.hint":"Swaai my kaartjie, klik daarop om die agterkant te sien, en slaan die kolletjie rond.",
    "hero.hintTouch":"Swaai my kaartjie, tik daarop om die agterkant te sien, of tik enige plek vir nog 'n kolletjie.",
    "hero.hintStill":"Klik op my kaartjie om die agterkant te sien.",
    "hero.bop":"bons","hero.bops":"bonse",
    "badge.pass":"Volle toegang","badge.back":"#1 Spider-Man-fan","badge.note":"WS-0036 · geldig oral waar daar Wi-Fi is","badge.flip":"Draai om ↻",
    "cta.work":"Eregalery","cta.touch":"Klik & Vind Uit","cta.allProjects":"Al 36 projekte",
    "cta.startChat":"GEE MY DAARDIE KOFFIE →","cta.cv":"Vra my CV aan","cta.ask":"Okay, EK sal jou vra →",
    "cta.hire":"Help My →","cta.idea":"Die Knoppie →",
    "stat.years":"Jaar ervaring in webontwikkeling","stat.projects":"Voltooide projekte",
    "stat.live":"Werwe tans aanlyn","stat.tech":"Tegnologieë wat ek gereeld gebruik",
    "home.workEyebrow":"Uitgesoekte werk","home.workTitle":"Werk wat nou aanlyn is",
    "home.statement":"Vasgeval op 'n gebroke webwerf? Van uitleg wat heeltemal op mobiele toestelle in duie stort tot mysterieuse prestasiedalings, ek het dit alles gesien. Laat my die kode ontrafel en jou platform laat presteer presies soos dit behoort.",
    "home.processEyebrow":"Hoe ek werk","home.processTitle":"Vervelige proses. Uitstekende webwerf.",
    "step.1n":"01 / OMVANG","step.1t":"Eers verstaan, dan bou",
    "step.1p":"Eers vrae, dan 'n klikbare skets en 'n geskrewe omvang. Jy keur die plan goed voordat ek 'n enkele reël kode skryf.",
    "step.2n":"02 / BOU","step.2t":"Lewer stuk vir stuk",
    "step.2p":"Elke twee weke is daar iets wat werk. Jy kry vroeg 'n toetsskakel en hoef nooit te wonder waarmee ek besig is nie.",
    "step.3n":"03 / OORHANDIG","step.3t":"Los dit netjies",
    "step.3p":"Toetse, 'n README wat op 'n splinternuwe skootrekenaar werk, CI wat met elke merge ontplooi, en 'n deurloop vir wie dit ook al oorneem.",
    "band.homeTitle":"Mooi so, jy het die onderkant gehaal.",
    "band.homeText":"Om dankie te sê, wat van ek jou uitneem vir 'n koffie? Klik net op die swart knoppie (definitief nie my kontakbladsy of iets nie).",
    "live.eyebrow":"Regstreekse voorskou","live.title":"Williams OS, reg hier voor jou","live.title2":"Williams OS",
    "live.open":"Maak volskerm oop",
    "live.copy":"Dis die regte werf, nie 'n skermskoot nie. Dit pas by enige breedte aan, so jy sien die rekenaaruitleg hier en die selfoonuitleg op 'n foon.",
    "live.copy2":"Die regte werf, regstreeks in die raam hieronder. Maak dit volskerm oop vir die volle ervaring.",
    "live.p1":"Laai outomaties wanneer jy daarheen blaai",
    "live.p2":"Veilig geïsoleer",
    "live.p3":"Responsief, nie geskaal nie",
    "about.eyebrow":"Oor my","about.title":"Bid Bou Slaap Eet Herhaal",
    "about.p1":"Ek is William, 'n full-stack-ontwikkelaar van Krugersdorp. Ek bou webwerwe wat vinnig laai, lekker lees en maklik is om te onderhou.",
    "about.p2":"Elke projek wat ek aanpak, is 'n geleentheid om te groei, te leer en my vaardighede as ontwikkelaar te verfyn. Ek gee al die eer aan God.",
    "about.cJob":"'Senior webontwikkelaar'","about.cEn":"'Engels'",
    "about.cP1":"'webwerwe'","about.cP2":"'digitale kuns'","about.cP3":"'3D-modelle'","about.cP4":"'speletjie-ontwerp'",
    "about.snap1":"Hallo, dis ek, mooi aangetrek","about.snap2":"Die beste sitplek by die kermis","about.snap3":"Vars lug, geen skerms nie",
    "about.shuffle":"Skommel die foto's",
    "skills.eyebrow":"Vaardighede","skills.title":"Waarmee ek werk",
    "exp.eyebrow":"Ervaring","exp.title":"Waar ek al gewerk het",
    "ride.title":"Die Loopbaan-tuimeltrein","ride.sub":"Hou jou arms binne die waentjie · blaai om te ry ↓",
    "ride.stop":"Halte","ride.admit":"Toegang vir een","ride.next":"Word vervolg…","ride.credit":"Pixel-effekte",
    "lb.title":"Foto's","lb.open":"Bekyk foto","lb.prev":"Vorige foto","lb.next":"Volgende foto","lb.close":"Maak toe",
    "after.eyebrow":"Ná werk","after.title":"Wat ek vir die pret maak",
    "band.aboutTitle":"Nuuskierig oor die kode?",
    "band.aboutText":"Vra my daaroor... Nee, doen dit regtig net. Ek belowe ek sal nie byt nie ;)",
    "proj.eyebrow":"Projekte · 2021—2026","proj.title":"Ses-en-dertig werwe, almal nou aanlyn",
    "sc.prev":"Vorige projek","sc.next":"Volgende projek","sc.of":"van","sc.visit":"Besoek die werf",
    "proj.all":"Die res","proj.none":"Niks in dié kategorie nie — probeer 'n ander filter.",
    "band.projTitle":"Moet Nie Uitmis Nie",
    "band.projText":"Pasop! Jy het FOMO. Kliek die knoppie om ontslae te raak van FOMO",
    "play.eyebrow":"Speelgrond","play.title":"Dinge wat ek op 'n Sondag gebou het",
    "play.intro":"Eksperimente, widgets en speletjies, elkeen selfstandig op sy eie bladsy.",
    "play.pages":"Bladsye","play.games":"Speletjies",
    "band.playTitle":"Moenie die knoppie druk nie",
    "band.playText":"Nee, regtig, moenie die knoppie in swart druk nie. Dit mag jou na 'n lekker plek neem, soos my kontakbladsy. Ooh, so scary.",
    "contact.eyebrow":"Kontak","contact.title":"Kom ons kyk of ons 'n goeie pas is",
    "contact.status":"Beskikbaar vir vryskutwerk","contact.direct":"Direkte kontak",
    "contact.email":"E-pos","contact.loc":"Ligging",
    "contact.locVal":"Krugersdorp, Gauteng, Suid-Afrika","contact.tz":"Tydsone","contact.faq":"Voordat jy skryf",
    "form.name":"Jou naam","form.email":"E-pos","form.subject":"Onderwerp",
    "form.msg":"Wat wil jy bou?","form.send":"Stuur boodskap →",
    "form.note":"Ek antwoord gewoonlik binne een werksdag.",
    "form.phEmail":"jy@maatskappy.co.za","form.phSubject":"Nuwe webwerf vir…",
    "form.phMsg":"Een sin of tien. Sperdatums, beperkings en enige bestaande kode help alles.",
    "faq.q1":"Is jy nou beskikbaar?",
    "faq.a1":"Ek is 'n voltydse sagteware-ontwikkelaar, so vryskutwerk doen ek saans en oor naweke. Ek neem dus minder projekte aan, maar ek maak klaar wat ek begin.",
    "faq.q2":"Waaraan werk jy die meeste?",
    "faq.a2":"WordPress- en Laravel-werwe, Umbraco en Perfex CRM, Azure-hosting en stadige werwe vinniger maak. Enigiets van 'n enkele landingsbladsy tot 'n korporatiewe platform vir verskeie markte.",
    "faq.q3":"Doen jy ook 3D- en speletjiewerk?",
    "faq.a3":"Ja. Blender, Maya, Unreal en Radiant. Ek het al pasgemaakte Call of Duty-zombiekaarte en mod-gereedskap op die Steam Workshop gepubliseer.",
    "foot.built":"Alle eer aan GOD · Psalm 115",
    "live.hint":"Dis lewendig · klik, sleep en verken","live.hintTouch":"Dis lewendig · tik, sleep en verken"
  };

  let LANG = store("ws-lang") === "af" ? "af" : "en";
  const T = (key, en) => (LANG === "af" && AF[key]) ? AF[key] : en;

  function applyLang(){
    $$("[data-i18n]").forEach(el => {
      if (el.dataset.en === undefined) el.dataset.en = el.textContent;
      el.textContent = (LANG === "af" && AF[el.dataset.i18n]) ? AF[el.dataset.i18n] : el.dataset.en;
      delete el.dataset.raw;
    });
    $$("[data-i18n-ph]").forEach(el => {
      if (el.dataset.enPh === undefined) el.dataset.enPh = el.placeholder;
      el.placeholder = T(el.dataset.i18nPh, el.dataset.enPh);
    });
    // accessible names (the ☰ and ✕, the drawer)
    $$("[data-i18n-label]").forEach(el => {
      if (el.dataset.enLabel === undefined) el.dataset.enLabel = el.getAttribute("aria-label");
      el.setAttribute("aria-label", T(el.dataset.i18nLabel, el.dataset.enLabel));
    });
    $("#lang").textContent = LANG === "af" ? "AF" : "EN";
    $("#lang").setAttribute("aria-label", LANG === "af" ? "AF, verander na Engels" : "EN, switch to Afrikaans");
    document.documentElement.lang = LANG;
    setTitle();
    renderAll();
    HERO.text();
    /* strings inside JS-built markup are repainted by hand, because they
       are created after this pass has already walked the document */
    $$(".embed-host[data-built]").forEach(el => {
      el.dataset.built = "";
      el.innerHTML = "";
      buildEmbed(el);
    });
  }
  $("#lang").addEventListener("click", () => {
    LANG = LANG === "en" ? "af" : "en";
    store("ws-lang", LANG);
    applyLang();
    animatePage(current, true);
    toast(LANG === "af" ? "Afrikaans aan" : "English on");
  });

  /* =================================================================
     RISO ART
     ================================================================= */
  const ACCENTS = ["var(--pink)", "var(--blue)", "var(--yellow)", "var(--mint)"];


  /* Organised loading placeholder (every card's screenshot, the live
     embed) — three evenly spaced dots, not scattered riso shapes, so it
     reads as "loading" rather than as another card's cover art. HTML,
     not SVG: a CSS animation of transform and opacity on an HTML element
     runs on the compositor, but on SVG shapes it relayouts and repaints
     the layer it's in every frame. Here that layer was the whole home
     page (15.6 megapixels): measured, hundreds of invalidations a second
     while scrolling, and frames of up to 1.5s in "How I work". */
  function loadingArt(){
    return '<span class="loading" role="img" aria-label="Loading preview">' + ACCENTS.slice(0, 3).map((c, i) =>
      '<i class="pulse-dot" style="--c: ' + c + '; animation-delay: ' + (i * .16) + 's"></i>').join("") + '</span>';
  }

  /* =================================================================
     LIVE EMBED
     Auto-loads once scrolled near — still never fetched on page load
     (no request, no layout shift, for a visitor who never reaches it),
     but no click required either. The iframe fills its container at
     natural width, so the embedded site chooses its own responsive
     layout rather than being scaled or squashed.
     ================================================================= */
  function buildEmbed(el){
    if (el.dataset.built) return;
    el.dataset.built = "1";
    const src = el.dataset.embed;
    const label = el.dataset.label || "Live preview";
    let host = src;
    try { host = new URL(src).host + new URL(src).pathname; } catch (e) {}

    el.innerHTML =
      '<div class="embed">' +
        '<div class="embed-bar">' +
          '<span class="embed-dots" aria-hidden="true"><i></i><i></i><i></i></span>' +
          '<span class="embed-url">' + esc(host) + '</span>' +
          '<a class="embed-open" href="' + esc(src) + '" target="_blank" rel="noopener">' +
            T("live.open", "Open full size") + ' ↗</a>' +
        '</div>' +
        '<div class="embed-stage">' +
          '<div class="embed-fallback" aria-hidden="true">' + loadingArt() + '</div>' +
          '<button class="embed-hint" type="button"><span>' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 2v18l5-5 3.5 7 3-1.4-3.4-6.9H20z"/></svg>' +
            (coarse ? T("live.hintTouch", "It's live · tap, drag & explore")
                    : T("live.hint", "It's live · click, drag & explore")) +
          '</span></button>' +
          // no sandbox: the embed is this site's own origin (github.io), where allow-scripts +
          // allow-same-origin isolates nothing and only earns a console warning per load
          '<iframe data-src="' + esc(src) + '" title="' + esc(label) + ' — live preview" ' +
            'referrerpolicy="no-referrer-when-downgrade"></iframe>' +
        '</div>' +
      '</div>' +
      '<p class="embed-caption">' + esc(label) + ' · ' + esc(host) + '</p>';

    const frame = $(".embed-stage iframe", el);
    $(".embed-hint", el).addEventListener("click", () => {
      frame.parentElement.classList.add("used");
      frame.focus();
    });
    /* It starts once it's within a screen AND the reader has paused (no
       scrolling for 300ms, then an idle moment): a whole site starting up
       in a frame cost the page frames of 200ms+ (measured), a visible
       hitch mid-scroll; while reading, nobody sees it. On GitHub Pages
       the embed is this site's own origin, so it even shares this page's
       main thread. Up to a screen ahead, it's usually ready on arrival. */
    let started = false, wait = 0;
    const start = () => {
      if (started) return;
      started = true;
      removeEventListener("scroll", later);
      revealWhenEmbedded(frame);
      frame.src = frame.dataset.src;
    };
    function later(){
      clearTimeout(wait);
      wait = setTimeout(() => "requestIdleCallback" in window ? requestIdleCallback(start, { timeout: 1000 }) : start(), 300);
    }
    const io = new IntersectionObserver(entries => {
      if (!entries.some(e => e.isIntersecting)) return;
      io.disconnect();
      addEventListener("scroll", later, { passive: true });
      later();
    }, { rootMargin: "100% 0px" });
    io.observe($(".embed-stage", el));
  }

  function initEmbeds(){
    if (booting) return;   // live previews wait for the loader to lift (it starts them), not compete with the first screen
    $$(".embed-host[data-embed]").forEach(buildEmbed);
  }
  /* Clicking into an iframe moves focus out of this window. That blur is
     the only signal a cross-origin frame gives, and it's enough to retire
     the "it's live" hint once the visitor has found it. */
  addEventListener("blur", () => setTimeout(() => {
    const f = document.activeElement;
    if (f && f.matches(".embed-stage iframe")) f.parentElement.classList.add("used");
  }));

  /* =================================================================
     DATA — straight from index.js
     ================================================================= */
  const CATS = {
    auto:  { en:"Automotive",    af:"Motorbedryf" },
    corp:  { en:"Corporate",     af:"Korporatief" },
    shop:  { en:"E-commerce",    af:"E-handel" },
    lara:  { en:"Laravel & CMS", af:"Laravel & CMS" },
    energy:{ en:"Energy",        af:"Energie" },
    game:  { en:"Games & mods",  af:"Speletjies & mods" }
  };

  /* Order here is the order of the "Everything else" grid on the
     Projects page (featured ones are pulled out and shown above it).
     Screenshots of the live sites are in Images/Projects/ (see shotHTML). */
  const RAW = [
    ["Butterfly Neck Pillow","shop","Projects/butterfly-neck-pillow.webp","https://butterflyneckpillow.co.za/",["GSAP","WordPress","WooCommerce"],"Online store for the Butterfly Travel Pillow","Aanlyn winkel vir die Butterfly-reiskussing"],
    ["Zoom DJs","corp","Projects/zoom-djs.webp","https://www.zoomdjs.co.za/",["WordPress","Bookings"],"Website for a local DJ","Webwerf vir 'n plaaslike DJ"],
    ["LKDA — Strategic Creative Advertising","lara","Projects/lkda.webp","https://www.lkda.co.za/",["Laravel","Umbraco","CMS"],"Creative advertising agency website","Webwerf vir 'n kreatiewe advertensie-agentskap"],
    ["ATP","corp","Projects/atp.webp","https://amplifytradepartners.co.za/",["WordPress","PHP","SEO"],"Amplify Trade Partners website","Webwerf vir Amplify Trade Partners"],
    ["3D Lazer Monkey","corp","Projects/3d-lazer-monkey.webp","https://3dlasermonkey.co.za/",["WordPress","3D"],"3D printing and laser cutting services","3D-druk en lasersnydienste"],
    ["Nissan South Africa","auto","Projects/nissan-south-africa.webp","https://www.nissan.co.za/",["WordPress","PHP","SEO"],"Official Nissan South Africa website","Nissan Suid-Afrika se amptelike webwerf"],
    ["Nissan Angola","auto","Projects/nissan-angola.webp","https://www.nissan.co.ao/",["WordPress","PHP"],"Official Nissan Angola website","Nissan Angola se amptelike webwerf"],
    ["Nissan Uganda","auto","Projects/nissan-uganda.webp","https://www.nissan.co.ug/",["WordPress","PHP"],"Official Nissan Uganda website","Nissan Uganda se amptelike webwerf"],
    ["Chery South Africa","auto","Projects/chery-south-africa.webp","https://www.chery.co.za/",["WordPress","PHP"],"Official Chery South Africa website","Chery Suid-Afrika se amptelike webwerf"],
    ["Afrit","corp","Projects/afrit.webp","https://afrit.co.za/",["WordPress","PHP"],"Trailer manufacturer's website","Webwerf vir 'n sleepwavervaardiger"],
    ["Safal Steel","corp","Projects/safal-steel.webp","https://www.safalsteel.com/",["WordPress","PHP"],"Steel manufacturer's website","Webwerf vir 'n staalvervaardiger"],
    ["Mega Master SA","shop","Projects/mega-master-sa.webp","https://megamaster.co.za/",["WordPress","E-commerce"],"Online store for BBQ and outdoor gear","Aanlyn winkel vir braai- en buitetoerusting"],
    ["First 4 Men","corp","Projects/first-4-men.webp","https://first4men.co.za/",["WordPress","PHP"],"Men's health and wellness website","Webwerf oor mansgesondheid en -welstand"],
    ["Gridcontrol","energy","Projects/gridcontrol.webp","https://www.gridcontrol.co.za/",["WordPress","PHP"],"Power solutions company website","Webwerf vir 'n kragoplossingsmaatskappy"],
    ["Blueasset Group","corp","Projects/blueasset-group.webp","https://blueassetgroup.com/za",["WordPress","PHP"],"Asset management company website","Webwerf vir 'n batebestuursmaatskappy"],
    ["Pinaroch","lara","Projects/pinaroch.webp","https://pinaroch.co.za/",["Laravel","PHP","Middleware"],"Construction company website","Webwerf vir 'n konstruksiemaatskappy"],
    ["MyBuildings Africa","lara","Projects/mybuildings-africa.webp","https://mybuildingsafrica.com/",["Laravel","CMS"],"Property management platform","Eiendomsbestuursplatform"],
    ["myBuildings EMEA","lara","Projects/mybuildings-emea.webp","https://mybuildingsemea.com/",["Laravel","CMS"],"Property management platform for EMEA","Eiendomsbestuursplatform vir EMEA"],
    ["CTU Training","corp","Projects/ctu-training.webp","https://ctutraining.ac.za/",["WordPress","Education"],"IT training institution website","Webwerf vir 'n IT-opleidingsinstelling"],
    ["HEX","corp","Projects/hex.webp","https://hexintegratedsolutions.com/",["WordPress","PHP"],"Integrated solutions company website","Webwerf vir 'n maatskappy in geïntegreerde oplossings"],
    ["Real Box","corp","Projects/real-box.webp","https://realbox.co.za/",["WordPress","PHP"],"Container solutions website","Webwerf vir houeroplossings"],
    ["Commercial PV","energy","Projects/commercial-pv.webp","https://commercialpv.co.za/",["WordPress","Solar"],"Commercial solar solutions website","Webwerf vir kommersiële sonkragoplossings"],
    ["Battery Distributors","shop","Projects/battery-distributors.webp","https://batterydistributors.co.za/",["WordPress","E-commerce"],"Online store for batteries","Aanlyn winkel vir batterye"],
    ["Rectifier","energy","Projects/rectifier.webp","https://rectifier.co.za/",["WordPress","PHP"],"Power electronics company website","Webwerf vir 'n kragelektronikamaatskappy"],
    ["Go4Green","energy","Projects/go4green.webp","https://go4greenenergy.co.za/",["WordPress","Green Energy"],"Green energy solutions website","Webwerf vir groenenergie-oplossings"],
    ["Current Automation","shop","Projects/current-automation.webp","https://currentautomation.ca/",["WordPress","E-commerce"],"Online store for industrial automation","Aanlyn winkel vir industriële outomatisering"],
    ["CA's Meanwell","shop","Projects/ca-meanwell.webp","https://meanwell.co.za/",["WordPress","E-commerce"],"Online store for power supplies","Aanlyn winkel vir kragbronne"],
    ["Solar-Solution","energy","Projects/solar-solution.webp","https://solar-solution.co.za/",["WordPress","Solar"],"Solar energy solutions website","Webwerf vir sonkragoplossings"],
    ["Victron Products","shop","Projects/victron-products.webp","https://victronproducts.co.za/",["WordPress","E-commerce"],"Online store for Victron energy products","Aanlyn winkel vir Victron-energieprodukte"],
    // the Goscor group's sites together, last of the websites
    ["Goscor Group","corp","Projects/goscor-group.webp","https://goscor.co.za/",["WordPress","Multi-site"],"Industrial equipment group website","Webwerf vir 'n groep in industriële toerusting"],
    ["Goscor Earth Moving","corp","Projects/goscor-earth-moving.webp","https://www.goscorearthmoving.co.za/",["WordPress","PHP"],"Earth-moving equipment website","Webwerf vir grondverskuiwingstoerusting"],
    ["Goscor Lift Trucks","corp","Projects/goscor-lift-trucks.webp","https://goscorlifttrucks.co.za/",["WordPress","PHP"],"Forklift solutions website","Webwerf vir vurkhyseroplossings"],
    ["Goscor Compressed Air","corp","Projects/goscor-compressed-air.webp","https://www.goscorcompressedair.co.za/",["WordPress","PHP"],"Compressed air solutions website","Webwerf vir perslugoplossings"],
    ["Goscor Cleaning","corp","Projects/goscor-cleaning.webp","https://goscorcleaning.co.za/",["WordPress","PHP"],"Industrial cleaning equipment website","Webwerf vir industriële skoonmaaktoerusting"],
    ["COD BO3 Crash Bandicoot","game","Games/crash-bandicoot.webp","https://steamcommunity.com/sharedfiles/filedetails/?id=3234555216",["Radiant","Game Dev"],"Custom zombie map on the Steam Workshop","Pasgemaakte zombiekaart op die Steam Workshop"],
    ["Forgotten Room 115","game","Games/forgotten-room-115.webp","https://steamcommunity.com/sharedfiles/filedetails/?id=3326520485",["Radiant","3D Modeling"],"Custom COD BO3 zombie map with its own mechanics","Pasgemaakte COD BO3-zombiekaart met sy eie meganika"],
    ["COD BO3 Mod Tools Super","game","Games/cod-mod-tools.webp","#",["Mods","3D Models","Scripts"],"Custom COD BO3 zombie mods, scripts and 3D models","Pasgemaakte COD BO3-zombiemods, skripte en 3D-modelle"]
  ];

  const PROJECTS = RAW.map((p, i) => ({ i, t:p[0], cat:p[1], img:p[2], url:p[3], tech:p[4], en:p[5], af:p[6] }));

  /* The showcase's slides (SHOWCASE). A featured project is left out of
     the "Everything else" grid, unless grid:true keeps it there too. */
  const FEATURED = [
    { key:"Butterfly Neck Pillow", grid:true, note:{ en:"My latest: a GSAP-animated WooCommerce store on WordPress", af:"My nuutste: 'n WooCommerce-winkel op WordPress, geanimeer met GSAP" } },
    { key:"Mega Master SA", note:{ en:"BBQ & outdoor products, built on WordPress", af:"Braai- en buiteprodukte, gebou op WordPress" } },
    { key:"3D Lazer Monkey", note:{ en:"3D printing and laser cutting, start to finish", af:"3D-druk en lasersny, van begin tot einde" } },
    { key:"Current Automation", metric:{ n:1500, unit:"+", en:"products loaded into the store", af:"produkte in die winkel gelaai" } },
    { key:"Afrit", note:{ en:"Trailer manufacturer's full corporate site", af:"Die volledige korporatiewe werf van 'n sleepwavervaardiger" } }
  ];

  const PAGES = [
    ["buddy terminal","buddyterminal.html",["Tamagotchi","commands","Interactive"],"Hatch your own pet, play with it and watch it write code — and plenty more.","Broei jou eie troeteldier uit, speel daarmee en kyk hoe dit kode skryf — en nog baie meer."],
    ["Hacklab","Hacklab.html",["HackLab","Hacking","Beginners"],"Learn to hack web apps through ten fun mini challenges for beginners.","Leer om webtoepassings te hack met tien prettige mini-uitdagings vir beginners."],
    ["Pattern Assessment","patternassesment.html",["Secure","Patterns","Live"],"A secure way to pass data between windows using only HTML and JavaScript.","'n Veilige manier om data tussen vensters oor te dra met net HTML en JavaScript."],
    ["CSS Filter Showcase","Filterlab.html",["CSS","Filters","Interactive"],"Every CSS filter function, visualised. Click any card to copy the code.","Elke CSS-filterfunksie, visueel gewys. Klik op enige kaart om die kode te kopieer."],
    ["Particle Generator Showcase","ParticleGen.html",["Particle","Themes","Interactive"],"Design your own particle effects and copy them into your project.","Ontwerp jou eie deeltjie-effekte en kopieer dit na jou projek."],
    ["Text Motion Showcase","TextMotion.html",["Text","CSS","Animation"],"Hover a card to preview it · click copy to grab the CSS and JS.","Beweeg oor 'n kaart vir 'n voorskou · klik op kopieer vir die CSS en JS."],
    ["Demo Dashboard","demodash.html",["HTML","Visual","Dashboard"],"Just for show: a fun, modern-looking dashboard.","Net vir die pret: 'n moderne, speelse paneelbord."]
  ];

  const GAMES = [
    ["2048","2048-master/index.html",["Puzzle","Classic","GitHub"],"The original sliding tile puzzle — merge the numbers until you reach 2048. From gabrielecirulli's open-source repo on GitHub.","Die oorspronklike skuifteël-legkaart — voeg die getalle saam tot jy 2048 bereik. Van gabrielecirulli se oopbronprojek op GitHub."],
    ["Minesweeper","minesweeper.html",["Puzzle","Classic","JavaScript"],"Classic Minesweeper with several difficulty levels.","Die klassieke Minesweeper met verskeie moeilikheidsvlakke."],
    ["Platformer","platformer.html",["Action","Platform","Canvas"],"A side-scrolling platformer with tricky obstacles.","'n Sy-rollende platformspeletjie met uitdagende hindernisse."],
    ["Pong","pong.html",["Arcade","Classic","Multiplayer"],"The classic arcade game — play against the computer or a friend.","Die klassieke arcade-speletjie — speel teen die rekenaar of 'n vriend."],
    ["Snake Game","snake_game.html",["Arcade","Classic","JavaScript"],"Guide the snake to eat and grow without hitting the walls.","Lei die slang om te eet en te groei sonder om teen die mure vas te loop."],
    ["Tower Blocks","tower_blocks.html",["Puzzle","Stacking","Skill"],"Stack the blocks as high as you can — precision required.","Stapel die blokke so hoog as wat jy kan — dit vra presisie."],
    ["Word Guess","word_guess.html",["Word","Puzzle","Brain"],"Guess the hidden word before you run out of tries.","Raai die versteekte woord voordat jou kanse opraak."],
    ["Slots","slots.html",["Luck","Skill","Fun"],"A slot machine I made myself. Give it a spin.","'n Slotmasjien wat ek self gemaak het. Gee dit 'n draai."]
  ];

  const SKILLS = [
    { cat:{ en:"Frontend", af:"Frontend" }, accent:"var(--pink)", items:[
      ["JavaScript",90],["HTML / CSS",95],["React.js",85],["WordPress / Shopify",90]] },
    { cat:{ en:"Backend", af:"Backend" }, accent:"var(--blue)", items:[
      ["PHP / Laravel",90],["Umbraco CMS",85],["SQL / Databases",85],["C# / ASP.NET",80],
      ["ASP.NET Hybrid & Windows Apps",80],["Java / C++",75]] },
    { cat:{ en:"Cloud & DevOps", af:"Wolk & DevOps" }, accent:"var(--mint)", items:[
      ["Git Version Control",90],["Microsoft Azure",85],["Azure DevOps",80],["Google Cloud",75]] },
    { cat:{ en:"Design & Tools", af:"Ontwerp & Gereedskap" }, accent:"var(--yellow)", items:[
      ["Figma / UI Design",85],["Adobe Photoshop",80],["Unreal / Unity",75],["Blender / Maya",70]] }
  ];

  /* Each job is a stop on the Career Coaster (COASTER below), ridden in
     this order: oldest first, so the ride ends on the current job.
     pics: up to three photos for the stop's board, { src, en, af } with
     en/af describing the photo (screen readers and the lightbox caption);
     an empty slot shows the riso placeholder. Each photo is two files:
     src (the lightbox, ≤1400px) and src with "-sm" (the polaroid, ~560px):
       magick in.jpg -auto-orient -strip -resize "1400x1400>" -quality 72 -define webp:method=6 name.webp
       magick in.jpg -auto-orient -strip -resize "560x560^>" -quality 70 -define webp:method=6 name-sm.webp */
  const JOB_PICS = IMG_BASE + "About_us/";
  const JOBS = [
    { when:{ en:"2021 — 2022", af:"2021 — 2022" }, accent:"var(--mint)",
      pics:[
        { src:JOB_PICS + "freelance-1.webp", en:"My home setup", af:"My tuisopstelling" },
        { src:JOB_PICS + "freelance-2.webp", en:"The 3D LaserMonkey online store on screen, with a 3D-printed dragon on the stand",
          af:"Die 3D LaserMonkey-aanlyn winkel op die skerm, met 'n 3D-gedrukte draak op die staander" },
        { src:JOB_PICS + "freelance-3.webp", en:"A game menu UI design in Figma",
          af:"'n Speletjie-kieslysontwerp in Figma" }],
      role:{ en:"Freelance Developer", af:"Vryskutontwikkelaar" },
      where:{ en:"Self-employed", af:"Selfstandig" },
      d:{ en:"Custom websites and web apps for a range of clients, mostly WordPress, custom themes and online stores.",
          af:"Pasgemaakte webwerwe en webtoepassings vir verskeie kliënte, meestal WordPress, eie temas en aanlyn winkels." },
      wins:{ en:[], af:[] } },
    { when:{ en:"Mar 2023 — Aug 2024", af:"Mrt. 2023 — Aug. 2024" }, accent:"var(--blue)",
      pics:[
        { src:JOB_PICS + "current-automation-1.webp", en:"A solar power install: Victron inverters on a wall board",
          af:"'n Sonkraginstallasie: Victron-omsetters op 'n muurpaneel" },
        // a Street View capture: Google asks for the credit wherever it's shown
        { src:JOB_PICS + "current-automation-2.webp", en:"The Current Automation offices from the street (Street View image © Google)",
          af:"Die Current Automation-kantore van die straat af (Street View-beeld © Google)" },
        { src:JOB_PICS + "current-automation-3.webp", en:"My desk at Current Automation: two monitors and 3D-printed dragons",
          af:"My lessenaar by Current Automation: twee skerms en 3D-gedrukte drake" }],
      role:{ en:"Web Developer", af:"Webontwikkelaar" },
      where:"Current Automation",
      d:{ en:"Full-stack web work: Laravel and WordPress projects, Perfex CRM modules, business tools and online stores.",
          af:"Full-stack-webwerk: Laravel- en WordPress-projekte, Perfex CRM-modules, besigheidstoepassings en aanlyn winkels." },
      wins:{ en:["Built a WooCommerce store with 3,000+ products","Developed 15+ custom Perfex CRM modules","Built a WhatsApp chatbot integration"],
             af:["'n WooCommerce-winkel met meer as 3 000 produkte gebou","Meer as 15 pasgemaakte Perfex CRM-modules ontwikkel","'n WhatsApp-kletsbot geïntegreer"] } },
    { when:{ en:"Sept 2024 — Present", af:"Sept. 2024 — Nou" }, now:true, accent:"var(--pink)",
      pics:[
        { src:JOB_PICS + "lkda-1.webp", en:"The LKDA team reviewing packaging designs on the studio wall",
          af:"Die LKDA-span bekyk verpakkingsontwerpe op die ateljeemuur" },
        { src:JOB_PICS + "lkda-2.webp", en:"LKDA, the Brave® agency", af:"LKDA, die Brave®-agentskap" },
        { src:JOB_PICS + "lkda-3.webp", en:"Behind the scenes on a kitchen video shoot",
          af:"Agter die skerms by 'n kombuis-videoskiet" }],
      role:{ en:"Senior Web Developer", af:"Senior webontwikkelaar" },
      where:"LKDA — Strategic Creative Advertising, Pretoria",
      d:{ en:"Full-stack builds and maintenance, server infrastructure and UI/UX.",
          af:"Full-stack-ontwikkeling en -onderhoud, bedienerinfrastruktuur en UI/UX." },
      wins:{ en:["Led the rebuild of LKDA's global digital library app",
                 "Made the Nissan SA website load 5 seconds faster",
                 "Built a plugin that connects to multiple databases"],
             af:["Die herbou van LKDA se wêreldwye digitale biblioteek-app gelei",
                 "Nissan SA se webwerf 5 sekondes vinniger laat laai",
                 "'n Inprop gebou wat aan verskeie databasisse koppel"] } }
  ];

  /* About page, "After hours". If an img is missing, the tile shows a
     riso placeholder instead. dl = file in Images/ offered as a download. */
  const AFTER = [
    { img:"Games/crash-bandicoot.webp", url:"https://steamcommunity.com/sharedfiles/filedetails/?id=3234555216",
      en:["Zombie maps","Crash Bandicoot and Forgotten Room 115, two custom Call of Duty maps on the Steam Workshop."],
      af:["Zombiekaarte","Crash Bandicoot en Forgotten Room 115, twee pasgemaakte Call of Duty-kaarte op die Steam Workshop."] },
    { img:"After_hours/3d-models.png", dl:"After_hours/PlayStation%202%20-%20Crash%20Twinsanity%20-%20Playable%20Characters%20-%20Crash%20Bandicoot.zip",
      en:["3D models","Blender and Maya, for maps, mods and the odd experiment."],
      af:["3D-modelle","Blender en Maya, vir kaarte, mods en af en toe 'n eksperiment."] },
    { img:"After_hours/digital-art-niko.webp",
      en:["Digital art","Textures, sketches and anything else that needs drawing."],
      af:["Digitale kuns","Teksture, sketse en enigiets anders wat geteken moet word."] },
    { img:"Games/cod-mod-tools.webp",
      en:["Mod tools","Scripts, models and a Discord server for fellow Black Ops III modders."],
      af:["Mod-gereedskap","Skripte, modelle en 'n Discord-bediener vir ander Black Ops III-modders."] }
  ];

  const STACK = ["JavaScript","React","Vue.js","PHP","Laravel","C#","ASP.NET","Blazor Hybrid","Java","C++","SQL",
    "Microsoft Azure","Azure DevOps","Git","Unreal Engine 4","Unity","Radiant","WordPress","Shopify","Wix","Webflow",
    "Perfex CRM","Umbraco","Photoshop","Figma","Blender","Maya","SEO","Search Console","Canva","Spline",
    "GSAP","Locomotive","Without Code","Contentful","Plex","Jellyfin"];

  /* =================================================================
     WAVE — the springy edge into the shell colour: the hero's floor
     (the split into "Selected work") and the footer's top. A row of
     springs, each pulled towards its neighbours and back to its rest on
     a gentle wave, so a poke runs along it as a ripple and dies away; a
     fling of the page jiggles all of it, unevenly, so it reads as a wave.
     Once it's still it sleeps: nothing computed or drawn. Its owner
     sizes it, steps it (fixed steps of dt) and draws it; with reduced
     motion or no GSAP it just rests. Its <svg> is filled below the line.
     ================================================================= */
  function makeWave(svg){
    const path = $("path", svg), FK = 26, FD = 3.4;   // pull back to rest, damping (per second)
    const still = !GS || reduced;
    let W = 1, F = 80, N = 1, S = 20, T = 1000, u = new Float32Array(2), v = new Float32Array(2);
    let base = 34, amp = 9, len = 600, awake = false, dirty = true;
    const rest = x => base + Math.sin(x / len * Math.PI * 2 + .8) * amp;
    return {
      get awake(){ return awake; },
      get height(){ return F; },
      // laid out again for a new size, at rest
      size(width){
        W = width; F = svg.clientHeight || 80;
        N = Math.round(clamp(24, 72, W / 22)); S = W / N;
        T = (720 / S) ** 2;   // ripples run ~720px a second, whatever the width
        u = new Float32Array(N + 1); v = new Float32Array(N + 1);
        base = F * .45; amp = Math.min(15, F * .17); len = W / (W < 760 ? 1.1 : 1.8);
        svg.setAttribute("viewBox", "0 0 " + W + " " + F);
        awake = false; dirty = true;
      },
      // the surface at x, down from the top of the wave's box
      surface(x){
        const f = clamp(0, N, x / S), i = Math.min(N - 1, Math.floor(f)), k = f - i;
        return rest(x) + u[i] * (1 - k) + u[i + 1] * k;
      },
      // a push (px/s, down is positive) spread over a few points either side of x
      poke(x, imp){
        if (still) return;
        const f = x / S;
        for (let i = Math.max(0, Math.floor(f - 4)); i <= Math.min(N, Math.ceil(f + 4)); i++) v[i] += imp * Math.exp(-((i - f) ** 2) / 2.9);
        awake = true;
      },
      // a fling of the page (dy: how far it just scrolled)
      jiggle(dy){
        if (still) return;
        const k = clamp(-70, 70, dy * 1.6), ph = performance.now() / 250;
        for (let i = 0; i <= N; i++) v[i] += k * (.45 + .55 * Math.sin(i * .45 + ph));
        awake = true;
      },
      step(dt){
        const cap = F * .4;
        let mu = 0, mv = 0;
        for (let i = 0; i <= N; i++){
          const l = u[i ? i - 1 : 1], r = u[i < N ? i + 1 : N - 1];   // free ends: mirrored neighbours
          v[i] += (T * (l + r - 2 * u[i]) - FK * u[i] - FD * v[i]) * dt;
        }
        for (let i = 0; i <= N; i++){
          u[i] = clamp(-cap, cap, u[i] + v[i] * dt);
          mu = Math.max(mu, Math.abs(u[i])); mv = Math.max(mv, Math.abs(v[i]));
        }
        if (mu < .03 && mv < .6){ u.fill(0); v.fill(0); awake = false; }
        dirty = true;
      },
      draw(){
        if (!dirty) return;
        const y = i => rest(i * S) + u[i];
        let d = "M-2 " + y(0).toFixed(1);
        for (let i = 1; i < N; i++) d += "Q" + (i * S).toFixed(1) + " " + y(i).toFixed(1) + " " + ((i + .5) * S).toFixed(1) + " " + ((y(i) + y(i + 1)) / 2).toFixed(1);
        d += "L" + (W + 2) + " " + y(N).toFixed(1) + "V" + (F + 2) + "H-2Z";
        path.setAttribute("d", d);
        dirty = false;
      }
    };
  }

  /* =================================================================
     HERO — the badge (index.html #ly-hero, index.css HERO)
     William's ID badge hangs from a strap printed with STACK on a little
     rope simulation: grab it and throw it, scroll and it bounces, click it
     to turn it over to the stats. The pink dot is the full stop after
     "Sham": on each visit (enter, from animatePage), once the name has
     stamped in and "You're welcome." has been underlined (once), it jumps
     off and bounces round the hero. Letters and words it hits hop, the
     buttons are bumpers, it knocks the badge swinging (the badge, in your
     hand, makes a fine bat), and it lands on the floor: the wave at the
     hero's foot, the split into "Selected work", which ripples. Each hit
     turns it into the logo's next shape and ink (.morph).
     It all runs on GSAP's ticker, only while the hero is on screen; the
     layout is read when the hero gets a size or a new one, never per
     frame. Measured in Chrome (1440×900, 390×844): 60fps, as before; on a
     phone slowed 4×, ~40–50fps (the old hero: ~48–57). A device that can't
     keep up drops into a lighter mode by itself (tick).
     Reduced motion, or no GSAP: the badge hangs still, the dot stays a
     full stop and the wave stays still. Gives the rest of this file
     enter() (animatePage), text() (applyLang) and photo (the loader).
     ================================================================= */
  const HERO = (function(){
    const hero = $("#ly-hero");
    if (!hero) return { enter(){}, text(){}, photo: null };
    const copy = $("#ly-copy"), name = $("#ly-name"), sub = $("#ly-sub"), punch = $("#ly-punch");
    const badge = $("#ly-badge"), turn = $("#ly-turn"), path = $("#ly-path"), tp = $("#ly-tp"), probe = $("#ly-measure");
    const field = $("#ly-field"), floor = makeWave($("#ly-floor"));
    const hint = $("#ly-hint"), bopsWrap = $("#ly-bops-wrap"), bopsEl = $("#ly-bops"), bopsWord = $("#ly-bops-word");
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const motion = GS && !reduced;
    let W = 0, H = 0, visible = false, ready = false;
    /* the bops counter waits invisible but in its place (visibility, not [hidden]), so it never moves
       the page when it shows: the pins below (How I work) were measured before it did, and on a
       phone, where it takes a line of its own, the section jumped 24px as it pinned */
    if (motion){ bopsWrap.hidden = false; bopsWrap.style.visibility = "hidden"; }

    /* ---- the words the dot can hit: the sub and the punchline, a span a word. Redone by
            text() after every applyLang, which rewrites their text. ---- */
    function words(el, underline){
      const html = el.textContent.trim().split(/\s+/).map(w => '<span class="ly-w">' + esc(w) + "</span>").join(" ");
      el.innerHTML = underline ? '<span class="ly-ul">' + html + "</span>" : html;
    }

    /* ---- the strap's print. Text on a path is laid out again whenever the path or the
            offset changes (every frame), at a cost per glyph: so the strap carries only what
            it can show, and steps along the stack an item at a time (all of it is ~900
            glyphs, the strap shows ~50; with all of it on, it cost ~2ms a frame). ---- */
    const ITEMS = STACK.map(s => s + "  ✦  ");
    let itemW = ITEMS.map(s => s.length * 8.4), first = 0, strapLen = 400, offset = 0, lastO = "";
    function measurePrint(){
      const w = ITEMS.map(s => { probe.textContent = s; return probe.getComputedTextLength(); });
      probe.textContent = "";
      if (w.every(x => x > 0)) itemW = w;   // (all 0 if the font isn't drawn yet: keep the estimate)
    }
    function printWindow(){
      let s = "", w = 0, i = first;
      while (w < strapLen + itemW[first % ITEMS.length] && i < first + ITEMS.length * 2){ s += ITEMS[i % ITEMS.length]; w += itemW[i % ITEMS.length]; i++; }
      tp.textContent = s;
    }

    /* ---- the rope: Verlet points from a fixed anchor to the badge's clip, then one heavier
            point at the badge's centre. Each step moves every point by its own momentum plus
            gravity, then pulls each pair back to its length a few times. The badge's angle is
            the line from the clip to its centre, so it swings like a real one. ---- */
    const SEG = 12, G = 1900, DT = 1 / 120, DAMP = .986, CLIP = 30;
    const ITER = 14;   // passes: the strap stretches ~5% on a hard throw (22 passes: ~4%), for 40% less work
    let pts = [], links = [], bw = 0, bh = 0, held = false, grab = null, t = 0, tilt = 0, ang = 0, lite = false;
    function build(){
      W = hero.clientWidth; H = hero.clientHeight;
      bw = badge.offsetWidth; bh = badge.offsetHeight;
      const narrow = W < 760;
      const ax = narrow ? W / 2 : W * .72;
      const rope = narrow ? 70 : Math.max(120, H * .26 - 40);
      strapLen = rope + 60;   // a little spare, for the stretch of a swing
      // phones: the copy starts under the badge (index.css has the same sum as a fallback)
      if (narrow){ copy.style.setProperty("--top", (rope + CLIP + bh + 44) + "px"); H = hero.clientHeight; }
      else copy.style.removeProperty("--top");
      pts = []; links = [];
      for (let i = 0; i <= SEG; i++) pts.push({ x: ax, y: -40 + rope * i / SEG, px: ax, py: -40 + rope * i / SEG, w: i ? 1 : 0 });
      const end = pts[SEG];
      pts.push({ x: ax, y: end.y + CLIP + bh / 2, px: ax, py: end.y + CLIP + bh / 2, w: .35 });   // the badge: heavier
      for (let i = 0; i < SEG; i++) links.push([pts[i], pts[i + 1], rope / SEG]);
      links.push([pts[SEG], pts[SEG + 1], CLIP + bh / 2]);
    }
    function step(){
      t += DT;
      const g = G * DT * DT, m = pts[SEG + 1];
      for (const p of pts){
        if (!p.w || (held && p === m)) continue;
        const vx = (p.x - p.px) * DAMP, vy = (p.y - p.py) * DAMP;
        p.px = p.x; p.py = p.y;
        p.x += vx; p.y += vy + g;
      }
      // a little breeze, so it never hangs dead still
      if (motion && !held && !lite) m.x += (Math.sin(t * .9) * 14 + Math.sin(t * 2.3) * 6) * DT * DT;
      for (let k = 0; k < ITER; k++){
        for (const [a, b, len] of links){
          const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1e-6, diff = (d - len) / d;
          const wa = held && a === m ? 0 : a.w, wb = held && b === m ? 0 : b.w, ws = wa + wb;
          if (!ws) continue;
          a.x += dx * diff * wa / ws; a.y += dy * diff * wa / ws;
          b.x -= dx * diff * wb / ws; b.y -= dy * diff * wb / ws;
        }
        // a soft ceiling: however hard it is thrown, the badge never leaves the hero
        if (!held && m.y < bh * .55){ m.y += (bh * .55 - m.y) * .5; m.py = m.y; }
      }
    }
    // nothing is written unless it moved (at the precision it's written at): a badge at rest costs nothing
    let lastD = "", lastT = "";
    function render(){
      let moved = false;
      for (const p of pts) if (Math.abs(p.x - (p.rx || 0)) > .05 || Math.abs(p.y - (p.ry || 0)) > .05){ moved = true; break; }
      if (!moved) return;
      for (const p of pts){ p.rx = p.x; p.ry = p.y; }
      // pulled longer than the print (the badge dragged down), the print grows to cover it
      let len = 0;
      for (let i = 1; i <= SEG; i++) len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
      if (len > strapLen){ strapLen = len + 60; printWindow(); }
      // the strap: a smooth curve through the rope points
      let d = "M" + pts[0].x.toFixed(1) + " " + pts[0].y.toFixed(1);
      for (let i = 1; i < SEG; i++){
        const a = pts[i], b = pts[i + 1];
        d += "Q" + a.x.toFixed(1) + " " + a.y.toFixed(1) + " " + ((a.x + b.x) / 2).toFixed(1) + " " + ((a.y + b.y) / 2).toFixed(1);
      }
      d += "L" + pts[SEG].x.toFixed(1) + " " + pts[SEG].y.toFixed(1);
      if (d !== lastD){ path.setAttribute("d", d); lastD = d; }
      // the badge hangs off its clip, turned along the clip-to-centre line; a sideways swing turns it in depth too
      const c = pts[SEG], m = pts[SEG + 1];
      ang = Math.atan2(-(m.x - c.x), m.y - c.y);
      tilt += (clamp(-28, 28, (m.x - m.px) * 3.2) - tilt) * .15;
      const tf = "translate3d(" + (m.x - bw / 2).toFixed(1) + "px," + (m.y - bh / 2).toFixed(1) + "px,0) rotate(" + ang.toFixed(3) + "rad) perspective(900px) rotateY(" + (motion ? tilt : 0).toFixed(1) + "deg)";
      if (tf !== lastT){ badge.style.transform = tf; lastT = tf; }
    }

    /* ---- the dot. Every letter and word is a box (the name's letters by their ink, measured
            on a canvas); so are the buttons; so is the badge, a box turned by its swing and
            moving, which the dot bounces off relative to its motion and knocks back. It
            cruises at one speed (anything faster eases back), and off a wall it usually aims
            at a word, so the name keeps getting hit. The cursor is a bat; a click adds a dot. ---- */
    const SHAPES = [   // .morph's five outlines (index.css): 24 points each, so clip-path morphs between them
      "polygon(50% 0%,62.9% 1.7%,75% 6.7%,85.4% 14.6%,93.3% 25%,98.3% 37.1%,100% 50%,98.3% 62.9%,93.3% 75%,85.4% 85.4%,75% 93.3%,62.9% 98.3%,50% 100%,37.1% 98.3%,25% 93.3%,14.6% 85.4%,6.7% 75%,1.7% 62.9%,0% 50%,1.7% 37.1%,6.7% 25%,14.6% 14.6%,25% 6.7%,37.1% 1.7%)",
      "polygon(50% 10%,60.7% 10%,73.1% 10%,90% 10%,90% 26.9%,90% 39.3%,90% 50%,90% 60.7%,90% 73.1%,90% 90%,73.1% 90%,60.7% 90%,50% 90%,39.3% 90%,26.9% 90%,10% 90%,10% 73.1%,10% 60.7%,10% 50%,10% 39.3%,10% 26.9%,10% 10%,26.9% 10%,39.3% 10%)",
      "polygon(50% 3%,59.9% 20.1%,65.6% 30%,69.8% 37.2%,73.4% 43.5%,77% 49.8%,81.2% 57%,86.9% 66.9%,96.8% 84%,77% 84%,65.6% 84%,57.2% 84%,50% 84%,42.8% 84%,34.4% 84%,23% 84%,3.2% 84%,13.1% 66.9%,18.8% 57%,23% 49.8%,26.6% 43.5%,30.2% 37.2%,34.4% 30%,40.1% 20.1%)",
      "polygon(50% 0%,61.6% 6.7%,71.7% 12.5%,81.7% 18.3%,93.3% 25%,93.3% 38.4%,93.3% 50%,93.3% 61.6%,93.3% 75%,81.7% 81.7%,71.7% 87.5%,61.6% 93.3%,50% 100%,38.4% 93.3%,28.3% 87.5%,18.3% 81.7%,6.7% 75%,6.7% 61.6%,6.7% 50%,6.7% 38.4%,6.7% 25%,18.3% 18.3%,28.3% 12.5%,38.4% 6.7%)",
      "polygon(50% 0%,60.6% 10.6%,68.3% 18.3%,75% 25%,81.7% 31.7%,89.4% 39.4%,100% 50%,89.4% 60.6%,81.7% 68.3%,75% 75%,68.3% 81.7%,60.6% 89.4%,50% 100%,39.4% 89.4%,31.7% 81.7%,25% 75%,18.3% 68.3%,10.6% 60.6%,0% 50%,10.6% 39.4%,18.3% 31.7%,25% 25%,31.7% 18.3%,39.4% 10.6%)"
    ];
    const INKS = ["#E0206A", "#2B4BFF", "#E09200", "#00967F"];   // pink, blue, yellow, mint (as hex: WAAPI animates them)
    const MAX_SPEED = 1100;
    let maxBalls = fine ? 5 : 3;   // a phone gets three at most
    let R = 14, speed = 300, boxes = [], targets = [], stopAt = { x: 0, y: 0 }, bops = 0, live = false;
    const balls = [], measureCtx = document.createElement("canvas").getContext("2d");

    function measure(){
      const hr = hero.getBoundingClientRect(), fs = parseFloat(getComputedStyle(name).fontSize);
      measureCtx.font = "800 " + fs + "px 'Bricolage Grotesque'";
      boxes = [];
      // the name: each letter's ink, from its origin and the line's baseline
      $$(".nm-w", name).forEach(word => {
        let base = $(".ly-base", word);
        if (!base){ base = document.createElement("i"); base.className = "ly-base"; base.style.cssText = "display:inline-block;width:0;height:0"; word.appendChild(base); }
        const y = base.getBoundingClientRect().top - hr.top;
        $$(":scope > span", word).forEach(el => {
          const r = el.getBoundingClientRect(), mt = measureCtx.measureText(el.textContent), x = r.left - hr.left;
          boxes.push({ el, kind: "text", base: "#13111A", x0: x - mt.actualBoundingBoxLeft, x1: x + mt.actualBoundingBoxRight, y0: y - mt.actualBoundingBoxAscent, y1: y + mt.actualBoundingBoxDescent, cool: 0 });
        });
      });
      // the words under it (their line boxes, trimmed top and bottom to the letters)
      $$(".ly-w", copy).forEach(el => {
        const r = el.getBoundingClientRect(), trim = r.height * .14;
        boxes.push({ el, kind: "text", base: getComputedStyle(el).color, x0: r.left - hr.left, x1: r.right - hr.left, y0: r.top - hr.top + trim, y1: r.bottom - hr.top - trim, cool: 0 });
      });
      // the bumpers
      $$(".ly-cta .btn, .soc", copy).forEach(el => {
        const r = el.getBoundingClientRect();
        boxes.push({ el, kind: "bump", x0: r.left - hr.left, x1: r.right - hr.left, y0: r.top - hr.top, y1: r.bottom - hr.top, cool: 0 });
      });
      targets = boxes.filter(b => b.kind === "text");
      // the dot is a full stop at the name's size
      R = clamp(9, 16, fs * .095);
      field.style.setProperty("--d", R * 2 + "px");
      balls.forEach(b => { b.r = R; });
      const s = $("#ly-stop").getBoundingClientRect();
      stopAt = { x: s.left - hr.left + fs * .1, y: s.top - hr.top - R };
      speed = clamp(240, 400, W * .26);
    }

    function shape(b, n){ b.n = n; b.face.style.setProperty("--shape", SHAPES[n % SHAPES.length]); b.face.style.setProperty("--c", INKS[n % INKS.length]); }
    function place(b){ b.el.style.transform = "translate3d(" + b.x.toFixed(1) + "px," + b.y.toFixed(1) + "px,0)"; }
    function trim(){
      while (balls.length > maxBalls){ const old = balls.shift(); gsap.to(old.face, { scale: 0, duration: .25, onComplete: () => old.el.remove() }); }
    }
    function makeBall(x, y, vx, vy){
      const el = document.createElement("i");
      el.className = "ly-ball";
      el.innerHTML = "<b></b>";
      field.appendChild(el);
      const b = { el, face: el.firstChild, x, y, vx, vy, r: R, n: 0, fCool: 0 };
      shape(b, balls.length);
      balls.push(b);
      place(b);
      trim();
      return b;
    }
    // the dot sat on its full stop (made if it isn't there yet)
    function park(){
      if (!balls.length) makeBall(stopAt.x, stopAt.y, 0, 0);
      const b = balls[0];
      b.x = stopAt.x; b.y = stopAt.y; b.vx = b.vy = 0;
      place(b);
    }

    // sparks where it hits: a small pool, animated with WAAPI on transform and opacity only, so the
    // compositor runs them and the main thread pays nothing per frame (GSAP would write their styles)
    const bits = [];
    for (let i = 0; i < 20; i++){ const e = document.createElement("i"); e.className = "ly-bit"; field.appendChild(e); bits.push(e); }
    let bitAt = 0;
    function spray(x, y, c){
      for (let i = 0; i < 4; i++){
        const e = bits[bitAt++ % bits.length], a = Math.random() * Math.PI * 2, d = 14 + Math.random() * 22;
        e.style.background = c;
        e.animate([{ transform: "translate(" + x + "px," + y + "px) scale(1)", opacity: 1 },
                   { transform: "translate(" + (x + Math.cos(a) * d) + "px," + (y + Math.sin(a) * d) + "px) scale(.3)", opacity: 0 }],
                  { duration: 500, easing: "cubic-bezier(.22,1,.36,1)" });
      }
    }
    function bopsText(){ bopsWord.textContent = bops === 1 ? T("hero.bop", "bop") : T("hero.bops", "bops"); }
    function hit(b, box, x, y){
      if (box.cool > 0) return;
      box.cool = .18;
      const c = INKS[b.n % INKS.length];
      shape(b, b.n + 1);
      spray(x, y, c);
      if (box.kind === "text"){
        box.el.animate([{ translate: "0 0", color: c }, { translate: "0 -16%", color: c, offset: .35 }, { translate: "0 0", color: box.base }], { duration: 520, easing: "cubic-bezier(.22,1,.36,1)" });
        bopsEl.textContent = ++bops;
        bopsText();
      } else box.el.animate([{ rotate: "0deg" }, { rotate: "-4deg" }, { rotate: "3deg" }, { rotate: "0deg" }], { duration: 360, easing: "ease-out" });
    }

    // reflect off a face with normal (nx, ny), if it's heading into it
    function reflect(b, nx, ny){
      const vn = b.vx * nx + b.vy * ny;
      if (vn >= 0) return false;
      b.vx -= 2 * vn * nx; b.vy -= 2 * vn * ny;
      return true;
    }
    // circle against a box: push it out, bounce off the face it hit
    function againstBox(b, box){
      if (b.x + b.r < box.x0 || b.x - b.r > box.x1 || b.y + b.r < box.y0 || b.y - b.r > box.y1) return;
      const cx = clamp(box.x0, box.x1, b.x), cy = clamp(box.y0, box.y1, b.y);
      let nx = b.x - cx, ny = b.y - cy;
      const d2 = nx * nx + ny * ny;
      if (d2 > b.r * b.r) return;
      if (d2 > 1e-6){ const d = Math.sqrt(d2); nx /= d; ny /= d; b.x = cx + nx * b.r; b.y = cy + ny * b.r; }
      else {   // the centre got inside: out of the nearest side
        const s = [[b.x - box.x0, -1, 0], [box.x1 - b.x, 1, 0], [b.y - box.y0, 0, -1], [box.y1 - b.y, 0, 1]].sort((p, q) => p[0] - q[0])[0];
        nx = s[1]; ny = s[2];
        if (nx) b.x = (nx < 0 ? box.x0 : box.x1) + nx * b.r; else b.y = (ny < 0 ? box.y0 : box.y1) + ny * b.r;
      }
      if (reflect(b, nx, ny)) hit(b, box, b.x - nx * b.r, b.y - ny * b.r);
    }
    // circle against the badge: the same, in the badge's own turned frame, relative to its motion
    const badgeBox = { cool: 0 };
    function againstBadge(b){
      const m = pts[SEG + 1], cos = Math.cos(ang), sin = Math.sin(ang);
      const dx = b.x - m.x, dy = b.y - m.y, hx = bw / 2, hy = bh / 2;
      if (Math.abs(dx) > hx + hy + b.r || Math.abs(dy) > hx + hy + b.r) return;   // nowhere near
      let lx = dx * cos + dy * sin, ly = -dx * sin + dy * cos;
      const cx = clamp(-hx, hx, lx), cy = clamp(-hy, hy, ly);
      let nx = lx - cx, ny = ly - cy;
      const d2 = nx * nx + ny * ny;
      if (d2 > b.r * b.r) return;
      if (d2 > 1e-6){ const d = Math.sqrt(d2); nx /= d; ny /= d; lx = cx + nx * b.r; ly = cy + ny * b.r; }
      else {
        const s = [[hx - lx, 1, 0], [lx + hx, -1, 0], [hy - ly, 0, 1], [ly + hy, 0, -1]].sort((p, q) => p[0] - q[0])[0];
        nx = s[1]; ny = s[2];
        if (nx) lx = nx * (hx + b.r); else ly = ny * (hy + b.r);
      }
      // back to the page
      b.x = m.x + lx * cos - ly * sin; b.y = m.y + lx * sin + ly * cos;
      const wx = nx * cos - ny * sin, wy = nx * sin + ny * cos;
      // the badge's own speed (px/s): bounce relative to it, then knock it back
      const bvx = (m.x - m.px) / DT, bvy = (m.y - m.py) / DT;
      const rvx = b.vx - bvx, rvy = b.vy - bvy, vn = rvx * wx + rvy * wy;
      if (vn >= 0) return;
      b.vx -= 2 * vn * wx; b.vy -= 2 * vn * wy;
      const v = Math.hypot(b.vx, b.vy);
      if (v > MAX_SPEED){ b.vx *= MAX_SPEED / v; b.vy *= MAX_SPEED / v; }
      // a knock for the badge, away from the dot: Verlet velocity is x - px, so moving px towards
      // the dot (the normal points at it) speeds the badge up away from it
      if (!held){ const k = -vn * .35 * DT; m.px += wx * k; m.py += wy * k; }
      if (badgeBox.cool <= 0){
        badgeBox.cool = .15; shape(b, b.n + 1); spray(b.x - wx * b.r, b.y - wy * b.r, INKS[(b.n + 3) % INKS.length]);
        // the badge usually sends it back at the words (the right of the hero is mostly open space)
        if (!held && Math.random() < .7) seek(b, true);
      }
    }
    // off a wall, it usually goes looking for a word (now and then, the badge); `words`: a word, always
    function seek(b, words){
      const v = Math.hypot(b.vx, b.vy), heading = Math.atan2(b.vy, b.vx);
      let a = heading + (Math.random() - .5) * .36;
      const r = words ? .5 : Math.random();
      let tx = null, ty = null;
      if (r < .18){ tx = pts[SEG + 1].x; ty = pts[SEG + 1].y; }
      else if (r < .82 && targets.length){ const L = targets[Math.floor(Math.random() * targets.length)]; tx = (L.x0 + L.x1) / 2; ty = (L.y0 + L.y1) / 2; }
      if (tx !== null){
        const to = Math.atan2(ty - b.y, tx - b.x) + (Math.random() - .5) * .3;
        if (Math.cos(to - heading) > -.2) a = to;   // only if it doesn't mean turning back into the wall
      }
      b.vx = Math.cos(a) * v; b.vy = Math.sin(a) * v;
    }

    /* ---- the floor: the split into "Selected work" (WAVE). The dot lands on it, the cursor
            skimming it splashes it, a fling of the page jiggles it. ---- */
    const surfaceAt = x => H - floor.height + floor.surface(x);   // in the hero's coordinates

    // the cursor is a bat: it bounces the dot and lends it its speed; skimming the floor splashes it
    const bat = { x: -999, y: -999, vx: 0, vy: 0, t: 0, r: 40 };
    function local(e){ const r = hero.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
    if (fine) hero.addEventListener("pointermove", e => {
      if (!ready) return;
      const [x, y] = local(e), now = performance.now(), dt = Math.max(8, now - bat.t) / 1000;
      const fresh = bat.x > -999;
      bat.vx = (x - bat.x) / dt; bat.vy = (y - bat.y) / dt;
      bat.x = x; bat.y = y; bat.t = now;
      if (fresh && !held && y > surfaceAt(x) - 24) floor.poke(x, clamp(-700, 700, bat.vy) * .18 + Math.min(900, Math.abs(bat.vx)) * .09);
    });
    hero.addEventListener("pointerleave", () => { bat.x = bat.y = -999; });

    function moveBalls(dt){
      for (const box of boxes) box.cool -= dt;
      badgeBox.cool -= dt;
      const batting = fine && !held && performance.now() - bat.t < 120;
      for (const b of balls){
        b.fCool -= dt;
        // back towards cruising speed
        const v = Math.hypot(b.vx, b.vy) || 1, to = v + (speed - v) * Math.min(1, dt * 1.6);
        b.vx *= to / v; b.vy *= to / v;
        const n = Math.min(12, Math.ceil(to * dt / 4));
        for (let i = 0; i < n; i++){
          b.x += b.vx * dt / n; b.y += b.vy * dt / n;
          for (const box of boxes) againstBox(b, box);
          againstBadge(b);
          if (batting){
            const dx = b.x - bat.x, dy = b.y - bat.y, d = Math.hypot(dx, dy) || 1;
            if (d < b.r + bat.r){
              const nx = dx / d, ny = dy / d;
              reflect(b, nx, ny);
              b.vx += bat.vx * .35; b.vy += bat.vy * .35;
              const s = Math.hypot(b.vx, b.vy);
              if (s > MAX_SPEED){ b.vx *= MAX_SPEED / s; b.vy *= MAX_SPEED / s; }
              b.x = bat.x + nx * (b.r + bat.r); b.y = bat.y + ny * (b.r + bat.r);
            }
          }
          // the walls last, so it always ends up inside
          let wall = false;
          if (b.x < b.r){ b.x = b.r; b.vx = Math.abs(b.vx); wall = true; }
          if (b.x > W - b.r){ b.x = W - b.r; b.vx = -Math.abs(b.vx); wall = true; }
          if (b.y < b.r){ b.y = b.r; b.vy = Math.abs(b.vy); wall = true; }
          // the floor: it lands on the wave, dents it (a ripple runs off both ways) and bounces
          const fy = surfaceAt(b.x) - b.r;
          if (b.y > fy){
            b.y = fy;
            if (b.vy > 0){
              if (b.fCool <= 0){ floor.poke(b.x, Math.min(b.vy, 700) * 1.1); spray(b.x, fy + b.r, INKS[b.n % INKS.length]); b.fCool = .12; }
              b.vy = -Math.abs(b.vy); wall = true;
            }
          }
          if (wall) seek(b);
        }
        // a nudge off the straight line now and then, so it never settles into a loop
        if (Math.random() < dt * .3){ const a = (Math.random() - .5) * .24, c = Math.cos(a), s = Math.sin(a); [b.vx, b.vy] = [b.vx * c - b.vy * s, b.vx * s + b.vy * c]; }
        place(b);
      }
    }

    /* ---- one loop: the rope and the floor in fixed steps, then the dots, then the print.
            If the device can't keep up (most frames over 22ms for about a second, once the dot
            is off), it goes easy from then on: the breeze drops (a badge at rest costs nothing
            to draw) and there's room for two dots. The print always runs: a scroll or a drag on
            a phone can be enough to tip it into this. ---- */
    let acc = 0, slow = 0;
    function tick(time, dtMs){
      // (paused with every other animation while the loader lifts: see BOOT)
      if (!visible || !ready || gsap.globalTimeline.paused()) return;
      const dt = Math.min(dtMs, 50) / 1000;
      if (live && !lite){
        slow = slow * .95 + (dtMs > 22 ? .05 : 0);
        if (slow > .6){ lite = true; maxBalls = 2; trim(); }
      }
      acc = Math.min(acc + dt, DT * 5);
      while (acc >= DT){ step(); if (floor.awake) floor.step(DT); acc -= DT; }
      render();
      floor.draw();
      if (live) moveBalls(dt);
      // the print runs up the strap; once the first item has gone, the window moves on by one
      offset += dt * 26;
      const w0 = itemW[first % ITEMS.length];
      if (offset >= w0){ offset -= w0; first++; printWindow(); }
      const o = (-offset).toFixed(1);
      if (o !== lastO){ tp.setAttribute("startOffset", o); lastO = o; }
    }
    if (motion) gsap.ticker.add(tick);

    /* ---- hands on: grab and throw the badge; a click (or Flip) turns it over ---- */
    badge.addEventListener("pointerdown", e => {
      if (e.button || !ready || e.target.closest("#ly-turn")) return;
      const [x, y] = local(e), m = pts[SEG + 1];
      held = true;
      grab = { dx: m.x - x, dy: m.y - y, sx: x, sy: y, moved: 0, track: [[x, y, performance.now()]] };
      badge.setPointerCapture(e.pointerId);
      badge.classList.add("is-held");
    });
    badge.addEventListener("pointermove", e => {
      if (!held) return;
      const [x, y] = local(e), now = performance.now(), m = pts[SEG + 1];
      grab.track.push([x, y, now]);
      while (grab.track.length > 2 && now - grab.track[0][2] > 90) grab.track.shift();
      grab.moved = Math.max(grab.moved, Math.hypot(x - grab.sx, y - grab.sy));
      if (!motion) return;   // still: it can be clicked over, not dragged
      m.px = m.x; m.py = m.y;
      m.x = x + grab.dx; m.y = y + grab.dy;
    });
    function letGo(e){
      if (!held) return;
      held = false;
      badge.classList.remove("is-held");
      const m = pts[SEG + 1], [hx, hy, ht] = grab.track[0], [x, y] = local(e), dt = Math.max(.016, (performance.now() - ht) / 1000);
      if (grab.moved < 5){ flip(); m.px = m.x; m.py = m.y; return; }
      const MAX = 1800;
      m.px = m.x - clamp(-MAX, MAX, (x - hx) / dt) * DT;
      m.py = m.y - clamp(-MAX, MAX, (y - hy) / dt) * DT;
    }
    badge.addEventListener("pointerup", letGo);
    badge.addEventListener("pointercancel", letGo);
    function flip(){
      const on = badge.classList.toggle("is-flipped");
      turn.setAttribute("aria-pressed", String(on));
      if (motion){ const m = pts[SEG + 1]; m.px = m.x + (Math.random() - .5) * 12; }   // turning over gives it a little kick
    }
    turn.addEventListener("click", flip);
    /* a scroll knocks it once, as a dot cruising into it does (againstBadge) but a little harder: a small
       hop on its strap and a sway (scrolling down knocks it up and to the left). Only the start of a
       scroll knocks it, however long it goes on; the floor jiggles all along (unevenly, so it reads as a wave) */
    let lastY = scrollY, lastScroll = 0;
    addEventListener("scroll", () => {
      const dy = scrollY - lastY, now = performance.now(), fresh = now - lastScroll > 400;
      lastY = scrollY; lastScroll = now;
      if (!motion || !visible || !ready) return;
      if (dy && fresh && !held){
        const m = pts[SEG + 1], kick = speed * .35 * DT * 1.2 * Math.sign(dy);   // (Verlet: velocity is x - px)
        m.py += kick; m.px += kick;
      }
      floor.jiggle(dy);
    }, { passive: true });
    // a click (or a tap) anywhere else adds another dot
    hero.addEventListener("click", e => {
      if (!live || e.target.closest("a, button, .ly-badge")) return;
      const [x, y] = local(e), a = -Math.PI * (.15 + Math.random() * .7);
      const b = makeBall(x, y, Math.cos(a) * speed, Math.sin(a) * speed);
      shape(b, Math.floor(Math.random() * 20));
      gsap.from(b.face, { scale: 0, duration: .4, ease: "back.out(3)" });
    });

    /* ---- layout: when the hero first has a size (it has none while another page is open),
            and again when it changes: a new width rebuilds the rope; any new size re-measures
            what the dot bounces off and redraws the floor. Run a frame after ResizeObserver
            reports, since it changes the hero's height itself (phones, --top). ---- */
    let builtW = 0, builtH = 0;
    function layout(){
      const w = hero.clientWidth;
      if (!w) return false;
      const wide = Math.abs(w - builtW) >= 2;
      if (wide){
        builtW = w;
        build(); measurePrint(); printWindow();
        if (!motion) for (let i = 0; i < 400; i++) step();   // still: it just hangs
        render();
        hero.classList.add("is-rigged");
      }
      H = hero.clientHeight;
      if (wide || H !== builtH){ builtH = H; measure(); floor.size(W); floor.draw(); if (!live) park(); }
      ready = true;
      return true;
    }
    new ResizeObserver(() => requestAnimationFrame(layout)).observe(hero);
    // the fonts change what's measured (the letters, the print): once they're in, measure again
    if (document.fonts) document.fonts.ready.then(() => { builtW = 0; layout(); });
    // the loop only runs while the hero is on screen (and, through the ticker, while the tab is)
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(hero);

    /* ---- the entrance, on each visit: the name rises in (stampIn), the badge falls in
            swinging, the full stop lands, "You're welcome." is underlined once, and then the
            dot jumps off, back up into "Sham". A language switch (immediate) only re-measures. ---- */
    let entered = false;
    function enter(immediate){
      if (!motion || !layout()) return;
      if (immediate && entered){ measure(); return; }
      entered = true;
      live = false;
      while (balls.length > 1) balls.shift().el.remove();
      park(); shape(balls[0], 0);
      const dot = balls[0], m = pts[SEG + 1], ax = pts[0].x;
      bopsWrap.style.visibility = "hidden";
      // the badge starts high and off to the side, so it falls in swinging
      m.x = m.px = ax + W * .08; m.y = m.py = bh * .6;
      for (let i = 1; i < SEG; i++){ pts[i].x = pts[i].px = ax + (m.x - ax) * i / SEG; pts[i].y = pts[i].py = -40; }
      const ul = $(".ly-ul", punch);
      if (ul) ul.classList.remove("is-drawn");
      gsap.timeline()
        .add(stampIn(name), .15)
        .from([sub, punch, $(".ly-cta", copy), $(".socials", copy), $(".ly-hint", copy)], { y: 18, opacity: 0, duration: .7, stagger: .07, ease: "power3.out" }, .5)
        .fromTo(dot.face, { scale: 0 }, { scale: 1, duration: .45, ease: "back.out(3)" }, 1)
        .add(() => { const u = $(".ly-ul", punch); if (u) u.classList.add("is-drawn"); }, 1.3)
        .to(dot.face, { scaleX: 1.35, scaleY: .65, transformOrigin: "50% 100%", duration: .14, ease: "power2.in" }, 2)
        .to(dot.face, { scaleX: 1, scaleY: 1, duration: .3, ease: "back.out(3)" }, 2.14)
        .add(() => {
          measure();
          dot.x = stopAt.x; dot.y = stopAt.y; dot.vx = -speed * .55; dot.vy = -speed * .84;
          live = true;
          bopsWrap.style.visibility = "";
        }, 2.14);
    }

    /* ---- words, after applyLang has (re)written them: split the sub and the punchline
            again, the hint for this device, and the read-out of the strap ---- */
    function text(){
      words(sub); words(punch, true);
      hint.textContent = !motion ? T("hero.hintStill", "Click my badge to see the back.")
        : fine ? T("hero.hint", "Swing my badge, click it to see the back, and bat the dot about.")
        : T("hero.hintTouch", "Swing my badge, tap it to see the back, or tap anywhere for another dot.");
      bopsText();
      $("#ly-stack-sr").textContent = T("stat.tech", "Technologies in rotation") + ": " + STACK.join(", ") + ".";
      if (ready) measure();
    }

    return { enter, text, photo: $(".ly-photo", hero) };
  })();

  /* =================================================================
     CAREER COASTER — About → Experience
     The jobs are stops on a roller coaster. Scrolling pins the stage and
     rides the cart along the track (slow over the tops, fast down the
     drops) while the ridden track fills in; at each stop the job's board
     opens out of the cart like an iris, then closes as the ride carries
     on. After the last stop the cart rolls on to "To be continued…" and
     the pin lets go; the track runs on past the edge of any screen.
     The world is in ride units, 1000 = the stage's height, so it scales
     with the screen instead of being rebuilt on resize. y grows down;
     0 is the rail at station height, GROUND is where the posts stand.
     ================================================================= */
  const GROUND = 170;
  /* Track pieces, [kind, width, height]: run = flat, hill = a climb then
     a steeper drop, loop = loop-the-loop (width = its size). LEAD_IN runs
     from the gate to stop 1; RIDES are cycled between stops, so a job
     added to JOBS just lays more track. Keep a run of 170+ at both ends
     of each stretch: the camera eases in and out of the stops along it. */
  const LEAD_IN = [["run", 380], ["hill", 520, 130], ["run", 320]];
  const RIDES = [
    [["run", 170], ["hill", 720, 330], ["run", 110], ["loop", 230], ["run", 130], ["hill", 420, 150], ["run", 260]],
    [["run", 170], ["hill", 640, 300], ["run", 70], ["hill", 380, 190], ["run", 50], ["hill", 320, 110],
     ["run", 90], ["loop", 200], ["run", 260]]
  ];
  // After the last stop: one more hill, then the cart parks under "To be continued…"
  const OUTRO = [["run", 170], ["hill", 480, 180], ["run", 420]];
  const TAIL = 4000;   // track, ground and park carried on this far past both ends, beyond the widest screen
  /* The park along the ride, cycled left to right. pic = a photo on a
     post, balloons = a photo floating on balloons. */
  const PARK = ["pic", "wheel", "pic", "balloons", "tent", "pic", "flags", "pic", "balloons"];
  const PARK_W = { pic: 180, wheel: 330, tent: 270, balloons: 150, flags: 320 };
  const TENTS = ["pink", "blue", "yellow", "mint"];
  /* Pictures for the park's frames, cycled left to right so every frame
     along the ride gets one: coding-joke warning signs, drawn for this
     site (Images/Coaster/signs/, 200 × 200; the frames crop them, so
     keep anything readable inside the middle 28–172 square). Photos work
     too, e.g. "Images/park-1.webp". An empty list leaves the riso
     placeholders. */
  const RIDE_PICS = ["caution-legacy", "works-on-my-machine", "no-friday-deploys", "senior-to-ride", "bug-crossing",
    "days-without-a-bug", "todo-fix-later", "danger-force-push", "not-a-bug", "semicolons-required",
    "coffee-in-code-out", "sign-not-found"].map(s => IMG_BASE + "Coaster/signs/" + s + ".svg");
  /* The drawings (cart, big wheel, tents, bunting, balloons) are SVG
     files in Images/Coaster/, palette colours baked in. To use your own
     cart, replace cart.svg or point this elsewhere: 140 × 116 in shape,
     facing right, wheels touching the bottom edge. */
  const ART = IMG_BASE + "Coaster/";
  const CART_IMG = ART + "cart.svg";

  const f1 = n => +n.toFixed(1);
  const pad2 = n => String(n).padStart(2, "0");
  const pieceW = p => p[0] === "loop" ? p[1] * 1.4 : p[1];
  function trackPiece(p, x){
    const w = p[1], h = p[2];
    if (p[0] === "run") return "L" + f1(x + w) + ",0";
    if (p[0] === "hill"){
      const a = f1(x + w * .3), m = f1(x + w * .6), b = f1(x + w * .8);
      return "C" + a + ",0 " + a + "," + -h + " " + m + "," + -h + "C" + b + "," + -h + " " + b + ",0 " + f1(x + w) + ",0";
    }
    // up the far side, over the top, down the near side, out underneath
    const q = (px, py) => f1(x + px * w) + "," + f1(-py * w);
    return "C" + q(.7, 0) + " " + q(1.1, .6) + " " + q(.8, 1.1) + "C" + q(.55, 1.5) + " " + q(-.1, 1.4) + " " + q(-.1, .9) +
      "C" + q(-.1, .4) + " " + q(.6, 0) + " " + q(1.4, 0);
  }

  /* Points every STEP units along a stretch of track (M/L/C as built
     above) and when the cart gets to each: speed comes from how far it
     has dropped below the stretch's highest point, so it crawls over the
     tops and races through the dips. cam is where the camera looks: the
     furthest the cart has got, smoothed, so it holds still for a loop. */
  const STEP = 4;
  function sampleTrack(d){
    const tok = d.match(/[MLC]|-?[\d.]+/g), line = [];
    let cmd = "M", x = 0, y = 0;
    for (let i = 0; i < tok.length;){
      if (/[MLC]/.test(tok[i])) cmd = tok[i++];
      if (cmd === "C"){
        const c = tok.slice(i, i += 6).map(Number);
        for (let s = 1; s <= 24; s++){
          const t = s / 24, u = 1 - t, a = u * u * u, b = 3 * u * u * t, e = 3 * u * t * t, g = t * t * t;
          line.push(a * x + b * c[0] + e * c[2] + g * c[4], a * y + b * c[1] + e * c[3] + g * c[5]);
        }
        x = c[4]; y = c[5];
      } else {
        x = +tok[i]; y = +tok[i + 1]; i += 2;
        line.push(x, y);
      }
    }
    const along = [0];
    for (let j = 2; j < line.length; j += 2) along.push(along[along.length - 1] + Math.hypot(line[j] - line[j - 2], line[j + 1] - line[j - 1]));
    const len = along[along.length - 1], n = Math.ceil(len / STEP) + 1, step = len / (n - 1);
    const xs = new Float32Array(n), ys = new Float32Array(n), time = new Float32Array(n), cam = new Float32Array(n);
    for (let j = 0, s = 0; j < n; j++){
      const want = step * j;
      while (s < along.length - 2 && along[s + 1] < want) s++;
      const t = along[s + 1] > along[s] ? (want - along[s]) / (along[s + 1] - along[s]) : 0;
      xs[j] = line[s * 2] + (line[s * 2 + 2] - line[s * 2]) * t;
      ys[j] = line[s * 2 + 1] + (line[s * 2 + 3] - line[s * 2 + 1]) * t;
    }
    const top = Math.min(...ys), depth = Math.max(120, Math.max(...ys) - top);
    for (let j = 1; j < n; j++) time[j] = time[j - 1] + 1 / Math.sqrt(1 + 8 * (ys[j] - top) / depth);
    const total = time[n - 1];
    time.forEach((t, j) => { time[j] = t / total; });
    // running max of x, averaged over ±R points (carried straight on past both ends, which are flat runs)
    const R = 40, far = new Float32Array(n), sum = new Float64Array(n + 2 * R + 1);
    for (let j = 0, m = -Infinity; j < n; j++) far[j] = m = Math.max(m, xs[j]);
    const farAt = j => j < 0 ? far[0] + j * step : j >= n ? far[n - 1] + (j - n + 1) * step : far[j];
    for (let j = -R; j < n + R; j++) sum[j + R + 1] = sum[j + R] + farAt(j);
    for (let j = 0; j < n; j++) cam[j] = (sum[j + 2 * R + 1] - sum[j]) / (2 * R + 1);
    return { xs, ys, time, cam, n, len };
  }
  // The cart u (0–1, in ride time) along a stretch; f = how much of the stretch's length that is
  function rideAt(seg, u){
    const time = seg.time, n = seg.n;
    let lo = 0, hi = n - 1;
    while (hi - lo > 1){ const mid = (lo + hi) >> 1; if (time[mid] <= u) lo = mid; else hi = mid; }
    const t = Math.min(1, Math.max(0, (u - time[lo]) / (time[hi] - time[lo] || 1)));
    const mix = arr => arr[lo] + (arr[hi] - arr[lo]) * t;
    const a = Math.max(0, lo - 2), b = Math.min(n - 1, hi + 2);
    return { x: mix(seg.xs), y: mix(seg.ys), cam: mix(seg.cam), f: (lo + t) / (n - 1),
      angle: Math.atan2(seg.ys[b] - seg.ys[a], seg.xs[b] - seg.xs[a]) };
  }

  /* One stretch of track per job (parts[i] ends at stops[i]) and the outro to `end`, measured once.
     A stretch is drawn as its pieces (each run, hill and loop a path of its own), so the browser
     only strokes the pieces near what it's painting, and drawing the fill in redraws one piece. */
  const TRACK = (() => {
    const parts = [], stops = [];
    let x = 0;
    JOBS.concat(null).forEach((_, i) => {
      const pieces = [];
      (i === JOBS.length ? OUTRO : i ? RIDES[(i - 1) % RIDES.length] : LEAD_IN).forEach(p => {
        pieces.push("M" + f1(x) + ",0" + trackPiece(p, x));
        x += pieceW(p);
      });
      parts.push(pieces);
      stops.push(f1(x));
    });
    const segs = parts.map(pieces => sampleTrack(pieces.join(""))), end = stops.pop();
    /* The ties and the trestle are drawn in chunks CHUNK units wide, one path each, so painting a
       bit of the screen only touches the track near it: one path the length of the ride (worse, a
       dashed one) gets worked through in full for every tile the browser paints. */
    const CHUNK = 1000, chunks = {};
    const put = (key, x, d) => {
      const c = chunks[Math.floor(x / CHUNK)] || (chunks[Math.floor(x / CHUNK)] = { ties: "", supports: "" });
      c[key] += d;
    };
    // a tie across the rails every 16 units (every 4th point), square to the track
    segs.forEach(s => {
      for (let j = 0; j < s.n; j += 4){
        const a = Math.max(0, j - 1), b = Math.min(s.n - 1, j + 1), tx = s.xs[b] - s.xs[a], ty = s.ys[b] - s.ys[a];
        const l = Math.hypot(tx, ty) || 1, nx = -ty / l * 12, ny = tx / l * 12;
        put("ties", s.xs[j], "M" + f1(s.xs[j] - nx) + "," + f1(s.ys[j] - ny) + "L" + f1(s.xs[j] + nx) + "," + f1(s.ys[j] + ny));
      }
    });
    for (let px = -TAIL; px < 0; px += 16) put("ties", px, "M" + px + ",-12V12");
    for (let px = end + 16; px <= end + TAIL; px += 16) put("ties", px, "M" + f1(px) + ",-12V12");
    // the trestle: a post every 48 units from the lowest rail above it to the ground, cross-braced under the hills
    const low = {};
    const mark = (px, py) => { const b = Math.round(px / 48); low[b] = b in low ? Math.max(low[b], py) : py; };
    segs.forEach(s => s.xs.forEach((px, j) => mark(px, s.ys[j])));
    for (let px = -TAIL; px < 0; px += 48) mark(px, 0);
    for (let px = end; px <= end + TAIL; px += 48) mark(px, 0);
    Object.keys(low).map(Number).sort((a, b) => a - b).forEach(b => {
      const top = f1(low[b] + 10), x = b * 48;
      put("supports", x, "M" + x + "," + top + "V" + GROUND);
      if (top < -40 && (b + 1) in low) put("supports", x, b % 2
        ? "M" + x + "," + top + "L" + (x + 48) + "," + GROUND
        : "M" + x + "," + GROUND + "L" + (x + 48) + "," + f1(low[b + 1] + 10));
    });
    // the rails: one path per stretch, plus the straight run off past each end
    const rails = ["M" + -TAIL + ",0L0,0", "M" + end + ",0L" + f1(end + TAIL) + ",0"].concat(...parts);
    return { parts, stops, segs, end, chunks: Object.keys(chunks).map(k => chunks[k]), rails };
  })();

  /* ---- the park, the cart, the boards */
  const photo = (src, alt) => '<span class="ph">' + (src ? '<img src="' + esc(src) + '" alt="' + esc(alt || "") + '" loading="lazy" decoding="async" onerror="this.remove()">' : '') + '</span>';
  const inks = i => "--accent:" + ACCENTS[i % 4] + ";--accent-2:" + ACCENTS[(i + 1) % 4];
  const art = (src, cls, style) => '<img src="' + src + '" alt="" loading="lazy" decoding="async"' +
    (cls ? ' class="' + cls + '"' : '') + (style ? ' style="' + style + '"' : '') + '>';

  /* Is a box in the world (x0–x1 across, y0–y1 down) clear of the track? The rails and ties
     reach about 12 units either side of the line, so a bit more than that is kept free. Past
     both ends the rail runs straight on at 0. The track is drawn over the park, so anything
     that has to be read (the frames' signs) must sit in a clear box. */
  function offTrack(x0, x1, y0, y1){
    const m = 18;
    x0 -= m; x1 += m; y0 -= m; y1 += m;
    if ((x0 < 0 || x1 > TRACK.end) && y0 < 0 && y1 > 0) return false;
    return TRACK.segs.every(s => {
      for (let j = 0; j < s.n; j++) if (s.xs[j] >= x0 && s.xs[j] <= x1 && s.ys[j] >= y0 && s.ys[j] <= y1) return false;
      return true;
    });
  }

  function parkHTML(){
    let html = "", x = -TAIL + 400, pics = 0, tents = 0, hit;
    // nothing behind the gate, a stop's sign or "To be continued…"
    const clear = [[-150, 250], [TRACK.end - 150, TRACK.end + 260]].concat(TRACK.stops.map(s => [s - 165, s + 165]));
    for (let i = 0; x < TRACK.end + TAIL - 400; i++){
      const kind = PARK[i % PARK.length];
      while ((hit = clear.find(c => x < c[1] && x + PARK_W[kind] > c[0]))) x = hit[1] + 40;
      if (kind === "pic"){
        /* its own post height if that keeps the frame off the track, else the first that does
           (22 tucks a wide frame in under a flat run), else it moves along and tries again */
        const tall = i % 3 === 0, w = tall ? 130 : 168, h = tall ? 162 : 126;
        const post = [[70, 210, 130, 250][i % 4], 70, 130, 210, 250, 300, 22].find(p => offTrack(x, x + w, GROUND - p - h, GROUND - p));
        if (post === undefined){ x += 40; i--; continue; }
        html += '<figure class="cz-pic" style="left:' + x + 'px;top:' + (GROUND - post - h) + 'px;width:' + w + 'px;height:' + h +
          'px;--post:' + post + 'px;--tilt:' + (i % 2 ? 3 : -2) + 'deg;' + inks(i) + '">' + photo(RIDE_PICS[pics++ % RIDE_PICS.length]) + '</figure>';
      } else if (kind === "balloons"){
        // likewise for the frame the balloons carry: it hangs 197–293 under the float's top, bobbing up to 16 higher
        const top = [590, 530, 650, 470].map(t => GROUND - t).find(t => offTrack(x + 15, x + 135, t + 181, t + 293));
        if (top === undefined){ x += 40; i--; continue; }
        html += '<div class="cz-float" style="left:' + x + 'px;top:' + top + 'px;--d:' + -(i % 3) + 's">' + art(ART + "balloons.svg") +
          '<figure class="cz-pic" style="' + inks(i + 1) + '">' + photo(RIDE_PICS[pics++ % RIDE_PICS.length]) + '</figure></div>';
      } else if (kind === "wheel"){
        html += '<div class="cz-wheel" style="left:' + x + 'px;top:' + (GROUND - 360) + 'px">' + art(ART + "wheel-stand.svg") +
          '<div class="cz-spin">' + art(ART + "wheel.svg") + '</div></div>';
      } else html += kind === "tent"
        ? art(ART + "tent-" + TENTS[tents++ % TENTS.length] + ".svg", "cz-tent", "left:" + x + "px;top:" + (GROUND - 220) + "px")
        : art(ART + "flags.svg", "cz-flags", "left:" + x + "px;top:" + (GROUND - 260) + "px");
      x += PARK_W[kind] + 70;
    }
    return html;
  }

  /* The sky: clouds along the whole ride, high up but clear of the sticky
     header over the top of the stage (−425…−485 stays below it on screens
     600px tall and up), behind everything else. Each drifts
     on the wind (index.css, cz-drift: its own distance, speed and phase);
     the layer as a whole lags the camera for parallax (initCoaster, SKY). */
  function skyHTML(){
    const r = (a, b) => a + Math.random() * (b - a);
    let html = "";
    for (let x = -TAIL + r(0, 400), i = 0; x < TRACK.end + TAIL; x += r(480, 820), i++){
      const w = Math.round(r(110, 200)), t = Math.round(r(45, 80));
      html += art(ART + (i % 3 ? "cloud-a.svg" : "cloud-b.svg"), "cz-cloud",
        "left:" + Math.round(x) + "px;top:" + Math.round(r(-485, -425)) + "px;width:" + w + "px;--t:" + t + "s;--d:" + -Math.round(r(0, t)) +
        "s;--dx:" + Math.round(r(90, 220)) + "px" + (i % 2 ? ";scale:-1 1" : ""));
    }
    return '<div class="cz-sky">' + html + '</div>';
  }

  function coasterWorldHTML(){
    const t = TRACK;
    return '<div class="cz-ground" style="left:' + (-TAIL - 400) + 'px;width:' + (t.end + 2 * TAIL + 800) + 'px;top:' + GROUND + 'px"></div>' +
      skyHTML() + '<div class="cz-fx cz-fx--back"></div>' + parkHTML() +
      '<div class="cz-gate" style="height:' + (345 + GROUND) + 'px"><div class="cz-gate-sign"><b>' + esc(T("ride.title", "The Career Coaster")) +
        '</b><span>' + esc(T("ride.sub", "Keep your arms inside the cart · scroll to ride ↓")) + '</span></div></div>' +
      t.stops.map((x, i) => '<div class="cz-stop" style="left:' + x + 'px;--accent:' + JOBS[i].accent + '"><i class="cz-roof"></i><i class="cz-deck"></i>' +
        '<div class="cz-sign"><span>' + esc(T("ride.stop", "Stop")) + ' ' + pad2(i + 1) + ' · ' + esc(JOBS[i].when[LANG]) + '</span>' +
        '<b>' + esc(JOBS[i].role[LANG]) + '</b></div></div>').join("") +
      '<div class="cz-end" style="left:' + (t.end + 60) + 'px"><div class="cz-gate-sign"><b>' + esc(T("ride.next", "To be continued…")) + '</b></div></div>' +
      '<svg class="cz-track" width="1" height="1">' +
        t.chunks.map(c => '<path class="cz-supports" d="' + c.supports + '"/>').join("") +
        t.chunks.map(c => '<path class="cz-ties" d="' + c.ties + '"/>').join("") +
        t.rails.map(d => '<path class="cz-rails" d="' + d + '"/>').join("") + '</svg>' +
      // the ridden track fills in on a layer of its own (a group per stretch, in its stop's ink), so
      // drawing it repaints nothing else; the paper-coloured gap that splits the rail stroke into two
      // rails goes on top, on its own still layer
      '<svg class="cz-track cz-track--fill" width="1" height="1"><g class="cz-fill">' +
        t.parts.map((pieces, i) => '<g style="stroke:' + (JOBS[i] ? JOBS[i].accent : "var(--yellow)") + '">' +
          pieces.map(d => '<path d="' + d + '"/>').join("") + '</g>').join("") + '</g></svg>' +
      '<svg class="cz-track" width="1" height="1">' + t.rails.map(d => '<path class="cz-gap" d="' + d + '"/>').join("") + '</svg>' +
      '<div class="cz-cart" id="cz-cart">' + art(CART_IMG) + '</div><div class="cz-fx cz-fx--front"></div>';
  }

  // Each job on a ride ticket, with three taped-on photos
  function coasterBoardsHTML(){
    return JOBS.map((j, i) => {
      const where = typeof j.where === "string" ? j.where : j.where[LANG], wins = j.wins[LANG];
      const a = ACCENTS.indexOf(j.accent), pics = j.pics || [];
      return '<article class="cz-board" style="--accent: ' + j.accent + '" aria-labelledby="job-' + i + '"><div class="cz-board-in">' +
        '<div class="cz-ticket"><div class="cz-stub" aria-hidden="true"><span>' + esc(T("ride.admit", "Admit one")) + '</span><b>' + pad2(i + 1) + '</b></div>' +
        '<div class="job"><div class="job-top"><span class="job-when">' + esc(j.when[LANG]) + '</span>' +
        (j.now ? '<span class="now">' + (LANG === "af" ? "Huidige pos" : "Current") + '</span>' : '') + '</div>' +
        '<h3 id="job-' + i + '">' + esc(j.role[LANG]) + '</h3>' +
        '<div class="where">' + esc(where) + '</div>' +
        '<p>' + esc(j.d[LANG]) + '</p>' +
        (wins.length ? '<ul class="wins">' + wins.map(w => '<li>' + esc(w) + '</li>').join("") + '</ul>' : '') +
        '</div></div>' +
        // a slot places and tilts each photo (CSS); GSAP drops the photo inside it, so the two never share a transform
        // each photo opens the lightbox, which browses this job's photos (data-lb: the group): the polaroid
        // loads the small file, the lightbox the full one (data-lb-src)
        '<div class="cz-pics">' + [0, 1, 2].map(k => {
          const p = pics[k], about = p ? p[LANG] : String(k + 1);
          return '<div class="cz-slot"><button type="button" class="cz-polaroid" data-lb="job-' + i + '"' +
            (p ? ' data-lb-src="' + esc(p.src) + '"' : '') +
            // the caption is just the photo's own words; the board beside it already names the job
            ' data-lb-cap="' + esc(p ? p[LANG] : j.role[LANG] + " · " + where) + '"' +
            ' aria-label="' + esc(T("lb.open", "View photo") + ": " + about + " · " + j.role[LANG]) + '"' +
            ' style="--accent-2: ' + ACCENTS[(a + k + 1) % 4] + '">' +
            photo(p && p.src.replace(/\.webp$/, "-sm.webp"), p && p[LANG]) + '</button></div>';
        }).join("") + '</div>' +
        '</div></article>';
    }).join("");
  }

  /* ---- pixel effects */
  const FX = {
    party:     { w: 128, h: 128, n: 34, sw: 4352, sh: 128, anchor: "b" },
    hearts:    { w: 128, h: 128, n: 23, sw: 2944, sh: 128, anchor: "b" },
    coins:     { w: 128, h: 128, n: 31, sw: 3968, sh: 128, anchor: "b" },
    notes:     { w: 128, h: 128, n: 21, sw: 2688, sh: 128, anchor: "b" },
    fireworks: { w: 96,  h: 96,  n: 27, sw: 1024, sh: 512, anchor: "c" },
    sparkle:   { w: 96,  h: 96,  n: 15, sw: 512,  sh: 512, anchor: "c" },
    bubbles:   { w: 64,  h: 64,  n: 40, sw: 2560, sh: 64,  anchor: "b" }
  };
  // A click throws a burst (or two, in different colours) from these: the pack's colours nearest the site's inks
  const FX_CLICK = { red: ["party", "hearts", "fireworks"], blue: ["party", "notes"], green: ["party", "notes"],
                     orange: ["hearts"], yellow: ["coins", "fireworks"] };
  // Idle: fireworks over the park and bubbles off the ground, behind the ride; now and then the riders cheer
  const FX_BACK = [["sparkle", "pink"], ["sparkle", "blue"], ["fireworks", "blue"], ["fireworks", "yellow"], ["bubbles", "blue"], ["bubbles", "green"]];
  const FX_CART = [["hearts", "red"], ["notes", "blue"]];
  const fxURL = (name, color) => "effects/" + name + "-" + color + ".webp";   // lossless: pixel for pixel the original PNGs
  const FX_SHEETS = Array.from(new Set(Object.keys(FX_CLICK).flatMap(c => FX_CLICK[c].map(n => fxURL(n, c)))
    .concat(FX_BACK.concat(FX_CART).map(p => fxURL(p[0], p[1])))));   // 15 sheets, 96 KB

  const sheets = {};   // url → promise of the decoded sheet, shared by every sprite that uses it
  function sheet(url){
    if (!sheets[url]){ const img = new Image(); img.src = url; sheets[url] = img.decode().then(() => img); }
    return sheets[url];
  }
  function fxPool(layer, count){
    return Array.from({ length: count }, () => ({ el: layer.appendChild(document.createElement("i")), on: false, t0: 0, f: -1 }));
  }
  // x, y: where it bursts from, in the layer's px. recycle: take the oldest sprite when none is free.
  function fxPlay(pool, name, color, x, y, scale, delay, recycle){
    let s = pool.find(p => !p.on);
    if (!s){ if (!recycle) return; s = pool.reduce((a, b) => (a.t0 < b.t0 ? a : b)); }
    const fx = FX[name], url = fxURL(name, color), w = fx.w * scale, h = fx.h * scale, st = s.el.style, token = {};
    Object.assign(s, { on: true, f: -1, fx, scale, t0: Infinity, token });
    st.display = "none";
    st.left = (x - w / 2).toFixed(1) + "px";
    st.top = (y - (fx.anchor === "b" ? h : h / 2)).toFixed(1) + "px";
    st.width = w + "px"; st.height = h + "px";
    st.backgroundImage = "url(" + url + ")";
    st.backgroundSize = fx.sw * scale + "px " + fx.sh * scale + "px";
    // starts once its sheet is decoded (at once if it already is); a recycled sprite ignores a sheet arriving late
    sheet(url).then(() => { if (s.token === token) s.t0 = gsap.ticker.time + delay; }, () => { if (s.token === token) s.on = false; });
  }
  function fxStep(pool, time){
    for (const s of pool){
      if (!s.on || time < s.t0) continue;
      const fx = s.fx, f = Math.floor((time - s.t0) * 15);
      if (f >= fx.n){ s.on = false; s.el.style.display = "none"; continue; }
      if (f === s.f) continue;
      const cols = Math.floor(fx.sw / fx.w);
      s.el.style.backgroundPosition = -(f % cols) * fx.w * s.scale + "px " + -Math.floor(f / cols) * fx.h * s.scale + "px";
      if (s.f < 0) s.el.style.display = "block";
      s.f = f;
    }
  }

  /* The ride (GSAP only). animatePage calls this inside its context, which
     reverts the pin and the tweens and then runs the cleanup returned here. */
  function initCoaster(scope){
    const root = $("#coaster", scope);
    if (!root) return;
    root.classList.add("is-ride");
    const stage = $(".coaster-stage", root), world = $("#cz-world", root), cart = $("#cz-cart", root), sky = $(".cz-sky", world);
    // the sky moves this much less than the park as the camera rides along, so the clouds read as far off
    const SKY = .3;
    // the ride's drawings all at once (a handful of small files), so nothing pops in mid-ride; park photos stay lazy
    $$('img[src^="' + ART + '"]', world).forEach(img => { img.loading = "eager"; });
    const boards = $$(".cz-board", root), signs = $$(".cz-sign", root);
    const segs = TRACK.segs, last = segs.length - 1;
    // the fill: per stretch, its pieces, each with where it starts along the stretch (all hidden to start)
    const fills = $$(".cz-fill > g", root).map(g => {
      let at = 0;
      return Array.from(g.children, el => {
        const len = el.getTotalLength(), piece = { el, len, from: at, drawn: len };
        at += len;
        el.style.strokeDasharray = len + " " + (len + 2);
        el.style.strokeDashoffset = len;
        return piece;
      });
    });
    const fillLen = fills.map(pieces => pieces.reduce((a, q) => a + q.len, 0));
    const state = { pos: 0, push: 0 }, open = boards.map(() => ({ v: 0, drawn: 0 }));
    let W, H, k, ax, ay, iris = "", irisR = 0, shown = -1, covered = false;
    const view = { x0: 0, x1: 0 }, rider = { x: 0, y: 0, angle: 0 };   // for the effects: what's on screen, where the cart is

    // Where the camera keeps the cart on screen (further in on phones, so a stop's sign fits on its
    // left), and the circle each board opens out of (the cart)
    function measure(){
      W = stage.clientWidth; H = stage.clientHeight; k = H / 1000;
      ax = W * (W < 760 ? .42 : .34); ay = H * .6;
      const cy = ay - 60 * k;
      iris = "px at " + ax.toFixed(1) + "px " + cy.toFixed(1) + "px)";
      irisR = Math.ceil(Math.hypot(Math.max(ax, W - ax), Math.max(cy, H - cy))) + 2;
      open.forEach(o => { o.drawn = -1; });   // a new size: redraw the circles
    }
    function render(){
      const i = Math.min(Math.floor(state.pos), last), p = rideAt(segs[i], state.pos - i);
      // only the piece under the cart changes, frame to frame
      fills.forEach((pieces, s) => {
        const along = s < i ? Infinity : s > i ? 0 : p.f * fillLen[s];
        pieces.forEach(q => {
          const off = q.len - Math.min(q.len, Math.max(0, along - q.from));
          if (off !== q.drawn) q.el.style.strokeDashoffset = q.drawn = off;
        });
      });
      cart.style.transform = "translate(" + p.x.toFixed(1) + "px," + p.y.toFixed(1) + "px) rotate(" + p.angle.toFixed(3) + "rad)";
      // The camera holds still while the cart loops back, but never lets it leave the screen: the further
      // behind it the cart gets, the more it follows, easing (tanh) to at most D units behind
      const z = k * (1 + state.push * .3), D = Math.max(40, ax / z - 80), back = p.cam - p.x;
      const cam = back > 0 ? p.x + D * Math.tanh(back / D) : p.cam;
      world.style.transform = "translate(" + (ax - cam * z).toFixed(1) + "px," + ay.toFixed(1) + "px) scale(" + z.toFixed(4) + ")";
      sky.style.transform = "translateX(" + (cam * SKY).toFixed(1) + "px)";
      view.x0 = cam - ax / z; view.x1 = cam + (W - ax) / z;
      rider.x = p.x; rider.y = p.y; rider.angle = p.angle;
      let showing = -1;
      open.forEach((o, j) => {
        if (o.v > 0) showing = j;
        // The circle the board opens through. Set directly (a custom property would restyle everything on
        // the board each frame); none once it's fully open, so a full board needs no mask at all.
        if (o.v !== o.drawn) boards[j].style.clipPath = (o.drawn = o.v) >= 1 ? "none" : o.v > 0 ? "circle(" + (o.v * irisR).toFixed(1) + iris : "";
      });
      // (the world stays visible under a full board: hiding it would throw its painted tiles away, and
      // repainting the whole screen of it when the board closes was the worst frame of the ride)
      covered = showing > -1 && open[showing].v >= 1;
      if (showing !== shown){
        if (shown > -1) boards[shown].classList.remove("is-open");
        if (showing > -1) boards[showing].classList.add("is-open");
        shown = showing;
      }
    }

    // Per stop, in screens of scrolling: ride there; arrive (the sign pops, the camera pushes in, the
    // board opens out of the cart); the ticket and photos land; hold; close and ride on. Then the
    // outro to "To be continued…".
    const S = { ride: 1.1, arrive: .5, note: .3, drop: .3, hold: .35, leave: .45 };
    const tl = gsap.timeline({ paused: true, defaults: { ease: "none" }, onUpdate: render });
    const irises = [];   // [from, to] of every board opening or closing
    boards.forEach((board, i) => {
      tl.to(state, { pos: i + 1, duration: S.ride * Math.max(.5, segs[i].len / 2000), ease: "sine.inOut" });
      const at = tl.duration(), t0 = at + S.arrive;
      tl.to(signs[i], { scale: 1.18, duration: S.arrive * .3, ease: "power2.out", yoyo: true, repeat: 1 }, at)
        .to(state, { push: 1, duration: S.arrive, ease: "power2.in" }, at)
        .to(open[i], { v: 1, duration: S.arrive * .8, ease: "power2.in" }, at + S.arrive * .2)
        .fromTo($(".cz-ticket", board), { opacity: 0, scale: 1.08, rotation: 3 },
          { opacity: 1, scale: 1, rotation: 0, duration: S.note, ease: "back.out(1.7)" }, t0)
        .fromTo($$(".cz-polaroid", board), { opacity: 0, y: -90, rotation: n => n % 2 ? 12 : -12 },
          { opacity: 1, y: 0, rotation: 0, duration: S.drop, ease: "back.out(1.5)", stagger: .07 }, t0 + S.note * .6);
      const leave = tl.duration() + S.hold;
      tl.to(open[i], { v: 0, duration: S.leave, ease: "power2.inOut" }, leave)
        .to(state, { push: 0, duration: S.leave, ease: "power2.inOut" }, leave);
      irises.push([at + S.arrive * .2, t0], [leave, leave + S.leave]);
    });
    tl.to(state, { pos: last + 1, duration: S.ride * Math.max(.5, segs[last].len / 2000), ease: "sine.inOut" })
      .fromTo($(".cz-end .cz-gate-sign", root), { opacity: 0, scale: .4 },
        { opacity: 1, scale: 1, duration: S.note, ease: "back.out(1.7)" }, "-=" + S.note * .6)
      .to({}, { duration: S.hold });

    measure();
    render();
    ScrollTrigger.create({
      trigger: stage, start: "top top", end: () => "+=" + Math.round(tl.duration() * stage.clientHeight),
      pin: true, anticipatePin: 1, scrub: .8, animation: tl,
      refreshPriority: 1,   // a pin moves everything below it down, so it measures before the triggers further down
      onRefresh(){ measure(); render(); },
      // never come to rest with a board half open: finish opening or closing it, the way you were going.
      // Judged from where the scroll stopped (self.progress), not the flung-to `p`, so elsewhere it stays put.
      snap: {
        snapTo: (p, self) => {
          const t = self.progress * tl.duration(), span = irises.find(s => t > s[0] + .01 && t < s[1] - .01);
          return span ? span[self.direction < 0 ? 0 : 1] / tl.duration() : self.progress;
        },
        delay: .1, duration: { min: .2, max: .6 }, ease: "power1.inOut"
      }
    });

    /* Effects. Idle ones play while the ride is on screen and not under a board, and only while frames
       come in time (avg: a running mean of the frame time, ms): most behind the park, the riders'
       cheers in front of the cart. A click on the ride bursts in front of it. */
    const fxBack = fxPool($(".cz-fx--back", world), 6), fxCart = fxPool($(".cz-fx--front", world), 2);
    const fxClick = fxPool($(".cz-fx--click", root), 6);
    const lite = !!(navigator.connection && navigator.connection.saveData);   // saving data: no idle effects, sheets load on click
    const pick = list => list[Math.floor(Math.random() * list.length)];
    let onScreen = false, nextBack = 0, nextCart = 0, avg = 16.7;
    function tick(time, dt){
      avg += (Math.min(dt, 100) - avg) * .05;
      if (onScreen && !covered && !lite && avg < 24){
        if (time > nextBack){
          nextBack = time + gsap.utils.random(.6, 1.3);
          const b = pick(FX_BACK), x = gsap.utils.random(view.x0 + 60, view.x1 - 60);
          if (b[0] === "bubbles") fxPlay(fxBack, b[0], b[1], x, GROUND - 4, 2.5, 0);
          else fxPlay(fxBack, b[0], b[1], x, gsap.utils.random(-470, -320), 2.4, 0);
        }
        if (time > nextCart){
          nextCart = time + gsap.utils.random(2.6, 4.6);
          const c = pick(FX_CART);
          if (Math.abs(rider.angle) < .5) fxPlay(fxCart, c[0], c[1], rider.x + gsap.utils.random(-20, 20), rider.y - 92, 1.15, 0);
        }
      }
      fxStep(fxBack, time); fxStep(fxCart, time); fxStep(fxClick, time);
    }
    gsap.ticker.add(tick);
    // One burst, sometimes two in different colours, and only over the ride itself: never while a
    // job's board is showing (its photos open the lightbox instead)
    const onClick = e => {
      if (shown > -1 || e.target.closest(".cz-boards")) return;
      const r = stage.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      const n = Math.random() < .5 && avg < 20 ? 2 : 1, scale = W < 760 ? 1 : 2;
      const colors = gsap.utils.shuffle(Object.keys(FX_CLICK));
      for (let i = 0; i < n; i++){
        fxPlay(fxClick, pick(FX_CLICK[colors[i]]), colors[i], x + (n > 1 ? gsap.utils.random(-50, 50) : 0), y + 20, scale, i * .08, true);
      }
    };
    stage.addEventListener("click", onClick);
    const io = new IntersectionObserver(entries => { onScreen = entries[0].isIntersecting; });
    io.observe(stage);
    // the park's wheels, balloons and clouds only turn, bob and drift near the screen (index.css)
    const near = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle("is-near", e.isIntersecting)), { rootMargin: "0px 300px" });
    $$(".cz-spin, .cz-float, .cz-end, .cz-cloud", world).forEach(el => near.observe(el));
    // fetch and decode the sheets ahead of time, once the browser has a quiet moment
    const warm = setTimeout(() => { if (!lite) (window.requestIdleCallback || (f => f()))(() => FX_SHEETS.forEach(sheet)); }, 1200);

    return () => {
      gsap.ticker.remove(tick);
      stage.removeEventListener("click", onClick);
      io.disconnect();
      near.disconnect();
      clearTimeout(warm);
      $$(".cz-fx", root).forEach(l => { l.textContent = ""; });
      root.classList.remove("is-ride");
      world.style.transform = sky.style.transform = "";
      boards.forEach(b => { b.style.clipPath = ""; b.classList.remove("is-open"); });
    };
  }

  /* =================================================================
     RENDERERS
     ================================================================= */
  /* A project's screenshot. Those in Images/Projects/ come as four files:
     name.webp (1440 × 900, the desktop view), name-720.webp, name-360.webp
     and name-m.webp (a phone's first screen, 600 × 750). srcset + sizes let
     the browser fetch just the size the card needs; phone (the showcase's
     portrait cards) swaps in the phone shot on small screens. */
  function shotHTML(imgFile, sizes, phone){
    const src = imgFile ? IMG_BASE + imgFile : "", set = /^Projects\//.test(imgFile || "");
    const img = '<img src="' + src + '"' +
      (set ? ' srcset="' + src.replace(/\.webp$/, "-360.webp") + ' 360w, ' + src.replace(/\.webp$/, "-720.webp") + ' 720w, ' + src + ' 1440w" sizes="' + sizes + '"' : '') +
      ' alt="" loading="lazy" decoding="async" onload="this.classList.add(\'ready\')" onerror="this.remove()">';
    return '<div class="shot">' +
      '<div class="art">' + loadingArt() + '</div>' +
      (!imgFile ? '' : set && phone
        ? '<picture><source media="(max-width: 760px)" srcset="' + src.replace(/\.webp$/, "-m.webp") + '">' + img + '</picture>'
        : img) +
      '</div>';
  }

  function cardHTML(p, i){
    const accent = ACCENTS[i % 4];
    const live = p.url && p.url !== "#";
    // no data-anim: animatePage staggers these in with ScrollTrigger.batch
    return '<article class="card" data-cat="' + esc(p.cat) + '" style="--accent: ' + accent + '">' +
      shotHTML(p.img, "(max-width: 760px) 46vw, 400px") +
      '<div class="card-body">' +
        '<span class="label">' + esc(CATS[p.cat][LANG]) + '</span>' +
        '<h4>' + esc(p.t) + '</h4>' +
        '<p>' + esc(p[LANG]) + '</p>' +
        '<div class="tags">' + p.tech.map(x => '<span class="tag">' + esc(x) + '</span>').join("") + '</div>' +
        (live
          ? '<a class="arrow-link" href="' + esc(p.url) + '" target="_blank" rel="noopener"><span>' +
            (LANG === "af" ? "Besoek die werf" : "Visit site") + '</span><span>↗</span></a>'
          : '<span class="label">' + (LANG === "af" ? "Privaat skakel" : "Private link") + '</span>') +
      '</div></article>';
  }

  function liveCardHTML(item, i, base, kind, cta){
    const accent = ACCENTS[(i + 2) % 4];
    const url = base + item[1];
    return '<article class="card" style="--accent: ' + accent + '" data-anim="up">' +
      '<div class="shot">' +
        '<div class="art">' + loadingArt() + '</div>' +
        '<iframe data-src="' + esc(url) + '" title="' + esc(item[0]) + '" loading="lazy" ' +
        'tabindex="-1" scrolling="no"></iframe>' +
        '<span class="poster">' + kind + '</span>' +
      '</div>' +
      '<div class="card-body">' +
        '<h4>' + esc(item[0]) + '</h4>' +
        '<p>' + esc(item[LANG === "af" ? 4 : 3]) + '</p>' +
        '<div class="tags">' + item[2].map(x => '<span class="tag">' + esc(x) + '</span>').join("") + '</div>' +
        '<a class="arrow-link" href="' + esc(url) + '" target="_blank" rel="noopener"><span>' + cta + '</span><span>↗</span></a>' +
      '</div></article>';
  }

  /* =================================================================
     SHOWCASE — "Selected work" (home) and the Projects page's hero, after
     gsap.com/showcase: the FEATURED projects in a strip, the current one
     big in the middle and its neighbours peeking in at the sides. It loops:
     one number (pos, counted in slides) is tweened and every slide is
     placed from it, so the slide that wraps round does so off screen. On a
     change the old title's words drop out and the new title's rise in; the
     line under it swaps the other way. The buttons, ← →, a swipe or a click
     on a neighbour move it; the big card and the title open the site. Its
     first sight wipes the cards in (animatePage). No autoplay; with reduced
     motion it just jumps.
     ================================================================= */
  const SC = new WeakMap();   // per carousel: { pos, at, tl } — at: the slide it's heading for (unbounded)
  const wrap = (a, n) => ((a % n) + n) % n;
  const scMotion = () => GS && !reduced;
  const ARROW = d => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + (d < 0 ? "M19 12H5M11 6l-6 6 6 6" : "M5 12h14M13 6l6 6-6 6") + '"/></svg>';
  const scWords = s => s.split(/\s+/).map(w => '<span class="w"><span>' + esc(w) + '</span></span>').join(" ");

  function showcaseHTML(){
    const items = FEATURED.map(f => ({ f, p: PROJECTS.find(x => x.t === f.key) })).filter(x => x.p), n = items.length;
    const ink = i => ' style="--accent: ' + ACCENTS[i % 4] + '"';
    const about = ({ f, p }) => CATS[p.cat][LANG] + " · " +
      (f.metric ? f.metric.n.toLocaleString("en") + f.metric.unit + " " + f.metric[LANG] : f.note ? f.note[LANG] : p[LANG]);
    // the card is a mouse/touch shortcut to the site: the title link is the one for keyboards and screen readers
    return '<div class="sc-stage">' + items.map(({ p }, i) =>
        '<div class="sc-slide" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + " " + T("sc.of", "of") + " " + n + '"' + ink(i) + '>' +
        '<a class="sc-media" href="' + esc(p.url) + '" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true" draggable="false">' +
        shotHTML(p.img, "(max-width: 760px) 76vw, 64vw", true) + '<i class="sc-wipe"></i></a></div>').join("") + '</div>' +
      '<div class="shell sc-foot">' +
        '<div class="sc-text">' +
          '<div class="sc-titles">' + items.map(({ p }, i) => '<h3 class="sc-title"' + ink(i) + '><a href="' + esc(p.url) + '" target="_blank" rel="noopener">' +
            scWords(p.t) + ' <span class="w sc-arrow" aria-hidden="true"><span>↗</span></span></a></h3>').join("") + '</div>' +
          '<div class="sc-lines">' + items.map((x, i) => '<p class="sc-line"' + ink(i) + '>' + esc(about(x)) + '</p>').join("") + '</div>' +
        '</div>' +
        '<div class="sc-controls">' +
          '<span class="sc-count" aria-hidden="true"></span>' +
          '<button class="sc-btn" type="button" data-step="-1" aria-label="' + esc(T("sc.prev", "Previous project")) + '">' + ARROW(-1) + '</button>' +
          '<button class="sc-btn sc-btn--next" type="button" data-step="1" aria-label="' + esc(T("sc.next", "Next project")) + '">' + ARROW(1) + '</button>' +
        '</div>' +
        '<p class="sr-only sc-live" aria-live="polite" aria-atomic="true"></p>' +
      '</div>';
  }

  // every slide from pos: offset d slides from the middle (−n/2 ≤ d < n/2), smaller and fainter the further out
  function scPlace(root){
    const st = SC.get(root), slides = $$(".sc-slide", root), n = slides.length;
    if (!n || !slides[0].offsetWidth) return;   // hidden page: placed once it shows (ResizeObserver)
    const step = slides[0].offsetWidth * .98;   // centre to centre: the neighbours (at .8) peek in at the sides
    slides.forEach((el, i) => {
      let d = wrap(i - st.pos, n);
      if (d >= n / 2) d -= n;
      const a = Math.min(1, Math.abs(d));
      el.style.transform = "translate(-50%,-50%) translateX(" + (d * step).toFixed(1) + "px) scale(" + (1 - .2 * a).toFixed(4) + ")";
      el.style.opacity = (1 - .35 * a).toFixed(3);
      el.style.zIndex = 9 - Math.round(Math.abs(d) * 2);
    });
  }

  // which slide is current: classes, what's focusable and read out, the counter
  function scState(root){
    const st = SC.get(root), slides = $$(".sc-slide", root), n = slides.length, at = wrap(st.at, n);
    slides.forEach((el, i) => { el.classList.toggle("is-active", i === at); el.setAttribute("aria-hidden", String(i !== at)); });
    $$(".sc-title", root).forEach((el, i) => {
      el.classList.toggle("is-active", i === at);
      el.setAttribute("aria-hidden", String(i !== at));
      $("a", el).tabIndex = i === at ? 0 : -1;
    });
    $$(".sc-line", root).forEach((el, i) => el.classList.toggle("is-active", i === at));
    $(".sc-count", root).textContent = pad2(at + 1) + " / " + pad2(n);
  }

  // old title's words drop out, the new ones rise in; the line under it goes the other way
  function scText(root, from, to){
    const st = SC.get(root), t = $$(".sc-title", root), l = $$(".sc-line", root);
    if (st.tl) st.tl.progress(1);
    const leave = [t[from], l[from]];
    leave.forEach(el => el.classList.add("is-leaving"));
    st.tl = gsap.timeline({ onComplete: () => leave.forEach(el => el.classList.remove("is-leaving")) })
      .to($$(".w > span", t[from]), { yPercent: 110, duration: .3, ease: "power2.in", stagger: .02 })
      .to(l[from], { yPercent: -110, duration: .3, ease: "power2.in" }, 0)
      .fromTo($$(".w > span", t[to]), { yPercent: 110 }, { yPercent: 0, duration: .6, ease: "power3.out", stagger: .04 }, .25)
      .fromTo(l[to], { yPercent: -110 }, { yPercent: 0, duration: .5, ease: "power3.out" }, .32);
  }

  function scGo(root, k){
    const st = SC.get(root), n = $$(".sc-slide", root).length, from = wrap(st.at, n), to = wrap(k, n);
    if (to === from) return;
    st.at = k;
    scState(root);
    $(".sc-live", root).textContent = $$(".sc-title", root)[to].textContent.replace("↗", "").trim() + ", " + (to + 1) + " " + T("sc.of", "of") + " " + n;
    if (!scMotion()){ st.pos = k; scPlace(root); return; }
    gsap.to(st, { pos: k, duration: .9, ease: "power3.inOut", overwrite: true, onUpdate: () => scPlace(root) });
    scText(root, from, to);
  }

  function initShowcase(root){
    SC.set(root, { pos: 0, at: 0, tl: null });
    let downX = null, swiped = false;
    const step = d => scGo(root, SC.get(root).at + d);
    root.addEventListener("click", e => {
      const btn = e.target.closest(".sc-btn");
      if (btn) return step(+btn.dataset.step);
      const slide = e.target.closest(".sc-slide");
      if (!slide) return;
      // a swipe ends in a click: it moved the carousel, it doesn't open the site
      if (swiped){ e.preventDefault(); swiped = false; return; }
      const slides = $$(".sc-slide", root), n = slides.length, st = SC.get(root);
      let d = wrap(slides.indexOf(slide) - wrap(st.at, n), n);
      if (d > n / 2) d -= n;
      if (d){ e.preventDefault(); step(d); }   // a neighbour comes to the middle; the middle one opens its site
    });
    root.addEventListener("keydown", e => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      step(e.key === "ArrowRight" ? 1 : -1);
    });
    // swipe (touch, pen or a mouse drag): sideways past 50px moves it; .sc-stage lets vertical scrolling through
    root.addEventListener("pointerdown", e => { swiped = false; if (e.target.closest(".sc-stage")) downX = e.clientX; });
    root.addEventListener("dragstart", e => e.preventDefault());   // a mouse drag swipes; it doesn't drag the picture
    root.addEventListener("pointerup", e => {
      if (downX === null) return;
      const dx = e.clientX - downX;
      downX = null;
      if (Math.abs(dx) > 50){ swiped = true; step(dx < 0 ? 1 : -1); }
    });
    root.addEventListener("pointercancel", () => { downX = null; });
    // the flair: each button's fill grows from (and shrinks back to) where the pointer crossed its edge
    const flair = e => {
      const b = e.target.closest(".sc-btn");
      if (!b || b.contains(e.relatedTarget)) return;
      const r = b.getBoundingClientRect();
      b.style.setProperty("--fx", (e.clientX - r.left) + "px");
      b.style.setProperty("--fy", (e.clientY - r.top) + "px");
    };
    root.addEventListener("pointerover", flair);
    root.addEventListener("pointerout", flair);
    // sizes itself from the slide width: again on resize, and when its page goes from hidden to shown
    new ResizeObserver(() => scPlace(root)).observe(root);
  }

  // (re)build every carousel — at boot and on a language switch — keeping the slide each one was on
  function showcaseRender(){
    $$("[data-showcase]").forEach(root => {
      if (!SC.has(root)) initShowcase(root);
      const st = SC.get(root);
      if (GS){ gsap.killTweensOf(st); if (st.tl) st.tl.kill(); }
      st.tl = null;
      st.pos = st.at;
      root.innerHTML = showcaseHTML();
      scState(root);
      scPlace(root);
    });
  }

  let frameObserver = null;
  function lazyFrames(){
    if (booting) return;   // as initEmbeds: the loader starts them as it lifts
    if (frameObserver) frameObserver.disconnect();
    /* Previews load as they near the viewport and are unloaded again once
       scrolled away. They're same-origin, so the browser doesn't throttle
       them off-screen: without this, every game and demo scrolled past
       (three.js, tsParticles, canvas loops) keeps running in the background. */
    frameObserver = new IntersectionObserver(entries => {
      entries.forEach(en => {
        const f = en.target;
        if (en.isIntersecting && !f.dataset.live){
          f.dataset.live = "1";
          f.addEventListener("load", () => f.classList.toggle("ready", !!f.dataset.live), { once: true });
          f.src = f.dataset.src;
        } else if (!en.isIntersecting && f.dataset.live){
          delete f.dataset.live;
          f.classList.remove("ready");
          f.src = "about:blank";
        }
      });
    }, { rootMargin: "150px 0px" });
    $$(".shot iframe[data-src]").forEach(f => frameObserver.observe(f));
  }

  function renderAll(){
    showcaseRender();
    $$("[data-letters]").forEach(splitLetters);

    const featuredKeys = FEATURED.filter(f => !f.grid).map(f => f.key);
    const rest = PROJECTS.filter(p => featuredKeys.indexOf(p.t) === -1);
    $("#all-cards").innerHTML = rest.map(cardHTML).join("");
    $("#proj-count").textContent = rest.length + (LANG === "af" ? " werwe" : " sites");

    const used = Array.from(new Set(rest.map(p => p.cat)));
    $("#filters").innerHTML =
      '<button class="chip" type="button" aria-pressed="true" data-cat="all">' +
      (LANG === "af" ? "Alles" : "All") + '</button>' +
      used.map(c => '<button class="chip" type="button" aria-pressed="false" data-cat="' + c + '">' +
        esc(CATS[c][LANG]) + '</button>').join("");

    $("#pages-grid").innerHTML = PAGES.map((p, i) =>
      liveCardHTML(p, i, PAGE_BASE, LANG === "af" ? "Bladsy" : "Page", LANG === "af" ? "Bekyk die bladsy" : "View page")).join("");
    $("#games-grid").innerHTML = GAMES.map((g, i) =>
      liveCardHTML(g, i + 9, GAME_BASE, LANG === "af" ? "Speletjie" : "Game", LANG === "af" ? "Speel nou" : "Play game")).join("");

    $("#skills").innerHTML =
      '<div class="sk-tabs" role="tablist" aria-label="' + (LANG === "af" ? "Vaardigheidskategorieë" : "Skill categories") + '">' +
      SKILLS.map((g, i) => '<button class="sk-tab" type="button" role="tab" id="sk-tab-' + i + '" aria-controls="sk-panel-' + i +
        '" aria-selected="' + (i === skillTab) + '" tabindex="' + (i === skillTab ? 0 : -1) + '" data-i="' + i + '" style="--accent: ' + g.accent + '">' +
        '<span class="sk-n" aria-hidden="true"><b>◆</b> 0' + (i + 1) + '</span><span class="sk-t">' + esc(g.cat[LANG]) + '</span></button>').join("") +
      '</div><div class="sk-stage">' +
      SKILLS.map((g, i) => {
        const avg = Math.round(g.items.reduce((s, it) => s + it[1], 0) / g.items.length);
        return '<div class="sk-panel' + (i === skillTab ? ' is-on' : '') + '" role="tabpanel" id="sk-panel-' + i + '" aria-labelledby="sk-tab-' + i +
          '" tabindex="0" style="--accent: ' + g.accent + '; --accent-2: ' + ACCENTS[(ACCENTS.indexOf(g.accent) + 1) % 4] + '">' +
          '<div class="sk-card"><span class="label"><b>◆</b> ' + g.items.length + (LANG === "af" ? " vaardighede" : " skills") + '</span>' +
          '<h3 class="sk-title">' + esc(g.cat[LANG]) + '</h3>' +
          '<p class="sk-avg"><b>' + avg + '</b><span class="label">' + (LANG === "af" ? "Gem. vlak" : "Avg. level") + '</span></p></div>' +
          '<ul class="sk-stats">' + g.items.map((it, k) =>
            '<li class="sk-stat" style="--n: ' + k + '"><span class="sk-name">' + esc(it[0]) + '</span>' +
            '<span class="sk-val">' + it[1] + '<small>/100</small></span>' +
            '<span class="sk-bar" aria-hidden="true" style="--v: ' + it[1] + '%; --s: ' + Math.max(1, Math.round(it[1] / 5)) + '"><i></i></span></li>').join("") +
          '</ul></div>';
      }).join("") + '</div>';

    $("#cz-world").style.setProperty("--ground", GROUND + "px");
    $("#cz-world").innerHTML = coasterWorldHTML();
    $("#cz-boards").innerHTML = coasterBoardsHTML();

    $("#after").innerHTML = AFTER.map((a, i) => {
      const t = a[LANG];
      return '<article class="tile" style="--accent: ' + ACCENTS[i % 4] + '; --accent-2: ' + ACCENTS[(i + 1) % 4] + '" data-anim="up">' +
        '<div class="ph"><img src="' + IMG_BASE + a.img + '" alt="" loading="lazy" decoding="async" onerror="this.remove()"></div>' +
        '<div class="tile-cap"><h3>' + esc(t[0]) + '</h3><p>' + esc(t[1]) + '</p>' +
        (a.url ? '<a class="arrow-link tile-link" href="' + esc(a.url) + '" target="_blank" rel="noopener"><span>' +
          (LANG === "af" ? "Op Steam" : "On Steam") + '</span><span>↗</span></a>' : '') +
        (a.dl ? '<a class="arrow-link tile-link" href="' + IMG_BASE + esc(a.dl) + '" download><span>' +
          (LANG === "af" ? "Laai af" : "Download") + '</span><span>↓</span></a>' : '') +
        '</div></article>';
    }).join("");

    lazyFrames();
  }

  $("#filters").addEventListener("click", function(e){
    const b = e.target.closest(".chip");
    if (!b) return;
    $$("#filters .chip").forEach(c => c.setAttribute("aria-pressed", String(c === b)));
    const cat = b.dataset.cat;
    let shown = 0;
    $$("#all-cards .card").forEach(card => {
      const ok = cat === "all" || card.dataset.cat === cat;
      card.hidden = !ok;
      if (ok) shown++;
    });
    $("#no-results").hidden = shown > 0;
    if (GS) ScrollTrigger.refresh();
  });

  /* Skills tabs (WAI-ARIA tabs, automatic activation). The panels share
     one grid cell, so the section never changes height and the pinned
     coaster below keeps its ScrollTrigger positions. Moving .is-on
     restarts the panel's CSS animations (bars, flash, misregistration);
     the camera shake is a one-off WAAPI run on the whole widget. */
  let skillTab = 0;
  const SHAKE = [
    { transform: "none" },
    { transform: "scale(1.012) translate(-7px, 3px) rotate(-.5deg)" },
    { transform: "scale(1.008) translate(6px, -4px) rotate(.45deg)" },
    { transform: "translate(-4px, 2px) rotate(-.25deg)" },
    { transform: "translate(3px, -1px) rotate(.15deg)" },
    { transform: "translate(-1px, 1px)" },
    { transform: "none" }
  ];
  function selectSkill(i, focus){
    const sk = $("#skills"), tabs = $$('[role="tab"]', sk);
    if (focus) tabs[i].focus();
    if (i === skillTab) return;
    skillTab = i;
    tabs.forEach((t, k) => { t.setAttribute("aria-selected", String(k === i)); t.tabIndex = k === i ? 0 : -1; });
    $$(".sk-panel", sk).forEach((p, k) => p.classList.toggle("is-on", k === i));
    if (reduced) return;
    sk.classList.add("is-live");
    sk.animate(SHAKE, { duration: 460, easing: "ease-out" });
  }
  $("#skills").addEventListener("click", e => {
    const tab = e.target.closest('[role="tab"]');
    if (tab) selectSkill(+tab.dataset.i);
  });
  $("#skills").addEventListener("keydown", e => {
    const tab = e.target.closest('[role="tab"]');
    if (!tab) return;
    const n = SKILLS.length, i = +tab.dataset.i;
    const to = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: n - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    selectSkill((to + n) % n, true);
  });

  /* =================================================================
     SPLIT TEXT
     ================================================================= */
  /* A [data-letters] heading in letters, in the hero name's markup (.nm >
     .nm-w words > letters with --i, a gap of one between words) for its hop,
     underline and stamp-in (index.css). Words stay unbroken; screen readers
     get the plain text. renderAll runs it, so it's redone after applyLang
     rewrites the heading's text. */
  function splitLetters(el){
    const text = el.textContent.trim();
    let i = 0;
    el.innerHTML = '<span class="sr-only">' + esc(text) + '</span><span class="nm" aria-hidden="true">' +
      text.split(/\s+/).map(w => {
        const html = '<span class="nm-w">' + Array.from(w, c => '<span style="--i:' + i++ + '">' + esc(c) + '</span>').join("") + '</span>';
        i++;
        return html;
      }).join(" ") + '</span>';
  }

  /* The hero name's entrance, for any .stamp heading: the letters rise
     into place one after another and settle with a little give; then
     .is-idle starts its idle (index.css: the hop and the underline).
     Returns the tween. */
  function stampIn(el){
    el.classList.remove("is-idle");
    return gsap.fromTo($$(".nm-w > span", el), { yPercent: 40, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: .6, ease: "back.out(1.6)", stagger: .035,
        clearProps: "transform,opacity", onComplete: () => el.classList.add("is-idle") });
  }

  function splitWords(el){
    const raw = el.dataset.raw !== undefined ? el.dataset.raw : (el.dataset.raw = el.textContent);
    const parts = raw.split(/(\s+)/);
    el.textContent = "";
    const frag = document.createDocumentFragment();
    const spans = [];
    parts.forEach(w => {
      if (!w.trim()){ frag.appendChild(document.createTextNode(w)); return; }
      const outer = document.createElement("span"); outer.className = "w";
      const inner = document.createElement("span"); inner.textContent = w;
      outer.appendChild(inner); frag.appendChild(outer); spans.push(inner);
    });
    el.appendChild(frag);
    return spans;
  }

  /* =================================================================
     GSAP — one context per route
     ================================================================= */
  /* Rebuilding the page you're on (the loader lifting, a language switch)
     keeps your place: reverting takes the pins' scroll room away for a
     moment, which pulls the scroll up (a refresh on About landed hundreds of
     pixels higher), so the position is put back once the new pins are in. */
  let pageCtx = null, pageRoute = null;
  function animatePage(route, immediate){
    const keep = pageCtx && pageRoute === route ? scrollY : -1;
    if (pageCtx){ pageCtx.revert(); pageCtx = null; }
    pageRoute = route;
    if (!GS || reduced) return;
    const scope = document.getElementById("page-" + route);
    if (!scope) return;

    pageCtx = gsap.context(() => {
      const EASE = "power3.out";

      // the hero's entrance (HERO): the name stamps in, the badge drops in on its strap, the dot's off
      if (route === "portfolio") HERO.enter(immediate);

      $$("[data-split]", scope).forEach((el, idx) => {
        const spans = splitWords(el);
        if (!spans.length) return;
        const aboveFold = el.getBoundingClientRect().top < innerHeight * .9;
        const base = { yPercent: 0, opacity: 1, duration: .9, ease: EASE, stagger: { each: .035 } };
        gsap.set(spans, { yPercent: 115, opacity: 0 });
        if (aboveFold && idx < 2) gsap.to(spans, Object.assign({ delay: immediate ? 0 : .08 }, base));
        else gsap.to(spans, Object.assign({ scrollTrigger: { trigger: el, start: "top 88%", once: true } }, base));
      });

      $$('[data-anim="up"]', scope).forEach(el => {
        /* clearProps hands transform back to CSS, so :hover lifts
           (cards, tiles) aren't overridden by a leftover inline style */
        gsap.from(el, { y: 32, opacity: 0, duration: .75, ease: EASE, clearProps: "transform",
          scrollTrigger: { trigger: el, start: "top 92%", once: true } });
      });

      $$(".embed-host", scope).forEach(el => {
        gsap.from(el, { y: 40, opacity: 0, duration: .9, ease: EASE,
          scrollTrigger: { trigger: el, start: "top 92%", once: true } });
      });

      /* How I work (index.html #process): a pinned scroll story, scrubbed
         (scrub: 1 eases it after the scroll, so it glides rather than jerks).
         The statement fills in word by word in the middle of the screen; the
         kicker under it rises in as it comes into view, as the hero name does
         (stampIn), and then hops. Step 01 opens out of a frame in the
         centre to the full screen while its photo settles; 02 and 03 wipe in
         from the right as the one before drifts left. As each step opens its
         words rise in, its number comes up, its bar fills and its title
         starts to hop (.is-on). It never stands still: while a step is up its
         photo slowly zooms and pans and its words ease upward, and the next
         step comes in as soon as they've settled. About seven screens of
         scrolling. refreshPriority: it pins, so it's measured before the
         triggers further down the page.
         Every tween is a fromTo (immediateRender off: gsap.set gives the
         starting state), so where it starts is fixed in code. A plain to()
         reads its start off the page, and a refresh mid-section (re-measured
         with the steps already open) recorded "open" as where they start:
         all three stayed open and the last one covered the others. */
      const proc = $("#process", scope);
      let undoProcess = null;
      if (proc){
        proc.classList.add("is-pinned");
        const steps = $$(".pr-step", proc), intro = $(".pr-intro-in", proc), bars = $$(".pr-bars b", proc);
        const words = splitWords($(".pr-statement", proc)), kicker = $(".pr-kicker", proc), kLetters = $$(".nm-w > span", kicker);
        const copy = s => $$(".pr-copy > *", s), bg = s => $(".pr-bg", s), num = s => $(".pr-num", s);
        gsap.set(words, { opacity: .18 });
        /* the kicker rises in (stampIn) as it comes into view, with the heading and the statement;
           scrolled back out of view below, it's hidden again to rise next time */
        let stamp = null;
        kicker.classList.remove("is-idle");
        gsap.set(kLetters, { opacity: 0 });
        ScrollTrigger.create({ trigger: kicker, pinnedContainer: proc, start: "top 92%", end: "max",
          onEnter: () => { stamp = stampIn(kicker); },
          onLeaveBack: () => {
            if (stamp) stamp.kill();
            stamp = null;
            kicker.classList.remove("is-idle");
            gsap.set(kLetters, { clearProps: "transform" });
            gsap.set(kLetters, { opacity: 0 });
          } });
        // each step's clip: index.css builds it from these (centre frame for 01, a wipe from the right for 02 and 03)
        steps.forEach((s, i) => {
          gsap.set(s, i ? { "--cy": "0%", "--cx": "0%", "--cw": "100%", "--cr": "0px" } : { "--cy": "50%", "--cx": "50%", "--cw": "0%", "--cr": "24px" });
          gsap.set(bg(s), { scale: i ? 1.12 : 1.3, xPercent: i ? 12 : 0 });
          gsap.set(copy(s), { x: 0, y: 30, opacity: 0 });   // rising from 30px: from further, a phone's low text would brush the back-to-top button
          gsap.set(num(s), { yPercent: 30, opacity: 0 });
          gsap.set(bars[i], { scaleX: 0 });
        });
        /* the schedule, in timeline seconds: FILL the statement, a short BEAT on it (about a third of
           a screen of scrolling: any longer and, once it's full, the page feels stuck), then each step:
           in, its words settle (+.7), DWELL while it drifts, the next one comes in */
        const FILL = 1, BEAT = .3, DWELL = .5, at = [];
        const tl = gsap.timeline({ paused: true, defaults: { ease: "none", immediateRender: false },
          onUpdate(){
            const t = this.time();
            steps.forEach((s, i) => s.classList.toggle("is-on", t >= at[i] && !(t >= at[i + 1])));
          } });
        tl.fromTo(words, { opacity: .18 }, { opacity: 1, duration: .1, stagger: { amount: FILL - .1 } }, 0);
        let t0 = FILL + BEAT;
        steps.forEach((s, i) => {
          const prev = steps[i - 1];
          const settle = t0 + (i ? 1 : 1.15);           // its photo has settled in
          at[i] = t0 + (i ? .6 : .8);                    // its words start to come in
          const next = at[i] + .7 + DWELL;               // the next step comes in (or, for the last, the pin ends)
          if (!i){
            tl.fromTo(s, { "--cy": "50%", "--cx": "50%" }, { "--cy": "26%", "--cx": "24%", duration: .45, ease: "power2.out" }, t0)
              .fromTo(s, { "--cy": "26%", "--cx": "24%", "--cr": "24px" }, { "--cy": "0%", "--cx": "0%", "--cr": "0px", duration: .7, ease: "power2.inOut" }, t0 + .45)
              .fromTo(intro, { scale: 1, opacity: 1 }, { scale: .9, opacity: 0, duration: .8, ease: "power1.in" }, t0 + .25)
              .fromTo(bg(s), { scale: 1.3, xPercent: 0 }, { scale: 1, xPercent: 0, duration: settle - t0, ease: "power2.out" }, t0);
          } else {
            tl.fromTo(s, { "--cw": "100%" }, { "--cw": "0%", duration: .9, ease: "power2.inOut" }, t0)
              .fromTo(bg(s), { scale: 1.12, xPercent: 12 }, { scale: 1, xPercent: 0, duration: settle - t0, ease: "power2.out" }, t0)
              // the one before slides away left under the wipe, its words going with it
              .fromTo(bg(prev), { xPercent: -3 }, { xPercent: -13, duration: .9, ease: "power2.inOut" }, t0)
              .fromTo(copy(prev), { x: 0, opacity: 1 }, { x: -80, opacity: 0, duration: .5, ease: "power2.in", stagger: .04 }, t0);
          }
          // its words, number and bar come in; then everything drifts until the next step takes over
          tl.fromTo(copy(s), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .5, stagger: .1, ease: "power2.out" }, at[i])
            .fromTo(num(s), { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .6, ease: "power2.out" }, at[i])
            .fromTo(bars[i], { scaleX: 0 }, { scaleX: 1, duration: .5 }, at[i])
            .fromTo(bg(s), { scale: 1, xPercent: 0 }, { scale: 1.06, xPercent: -3, duration: next - settle }, settle)
            .fromTo(copy(s), { y: 0 }, { y: -24, duration: next - at[i] - .7 }, at[i] + .7)
            .fromTo(num(s), { yPercent: 0 }, { yPercent: -10, duration: next - at[i] - .6 }, at[i] + .6);
          t0 = next;
        });
        // pinSpacing spelled out: .page is a flex column, and for a pin in a flex parent GSAP leaves it off
        ScrollTrigger.create({ trigger: proc, animation: tl, start: "top top", end: () => "+=" + Math.round(innerHeight * tl.duration() * .95),
          pin: true, pinSpacing: true, scrub: 1, anticipatePin: 1, refreshPriority: 1 });
        // the stamp runs outside this context: stop it when the context reverts
        undoProcess = () => { if (stamp) stamp.kill(); };
      }

      /* Showcase (SHOWCASE): its first sight pulls each card's accent cover
         off towards its slanted edge, the middle card first, then the
         title rises in and the controls follow. Reverting the context puts
         everything back, so each visit replays it. */
      $$("[data-showcase]", scope).forEach(root => {
        const n = $$(".sc-slide", root).length, at = wrap(SC.get(root).at, n);
        const wipes = $$(".sc-wipe", root).map((el, i) => [el, Math.min(wrap(i - at, n), wrap(at - i, n))])
          .sort((a, b) => a[1] - b[1]).map(x => x[0]);
        const words = $$(".sc-title.is-active .w > span", root), line = $(".sc-line.is-active", root), ctrls = $(".sc-controls", root);
        gsap.set(wipes, { scaleX: 1 });
        gsap.set(words, { yPercent: 110 });
        gsap.set(line, { yPercent: -110 });
        gsap.set(ctrls, { opacity: 0, y: 16 });
        gsap.timeline({ scrollTrigger: { trigger: root, start: "top 70%", once: true }, defaults: { ease: "power3.out" } })
          .to(wipes, { scaleX: 0, duration: .9, ease: "power3.inOut", stagger: .12 })
          .to(words, { yPercent: 0, duration: .7, stagger: .05 }, .35)
          .to(line, { yPercent: 0, duration: .6 }, .5)
          .to(ctrls, { opacity: 1, y: 0, duration: .6 }, .55);
      });

      /* Projects → "Everything else": GSAP's "stagger items in on scroll"
         (ScrollTrigger.batch). Cards that reach the screen together rise
         in together, 0.15s apart; scrolling back up they drop in from
         above; off screen they hide again, so it replays both ways. Each
         entrance clears its transform, so the CSS hover lift still works,
         and nothing is left offset when ScrollTrigger re-measures. Cards
         shown by a filter come in the same way (the filter refreshes).
         A fast jump (scrollbar drag, End, a link) sweeps many cards into
         one batch, most of them already gone past: only those still on
         screen animate, and the stagger shrinks so it never runs past .6s. */
      const projCards = $$("#all-cards .card", scope);
      if (projCards.length){
        const show = (els, trigs, from) => {
          const on = els.filter((_, i) => trigs[i].isActive);
          if (on.length) gsap.fromTo(on, { opacity: 0, y: from }, { opacity: 1, y: 0, duration: .6, ease: "power3.out",
            stagger: Math.min(.15, .6 / on.length), overwrite: true, clearProps: "transform" });
        };
        const hide = els => gsap.set(els, { opacity: 0, clearProps: "transform", overwrite: true });
        gsap.set(projCards, { opacity: 0 });
        ScrollTrigger.batch(projCards, {
          onEnter: (els, trigs) => show(els, trigs, 100), onEnterBack: (els, trigs) => show(els, trigs, -100),
          onLeave: hide, onLeaveBack: hide
        });
      }

      /* skills bars stay still until scrolled to (.is-live gates their
         CSS animations); cleared first so every visit replays the fill */
      const skills = $("#skills", scope);
      if (skills){
        skills.classList.remove("is-live");
        ScrollTrigger.create({ trigger: skills, start: "top 85%", once: true, onEnter: () => skills.classList.add("is-live") });
      }

      // the Career Coaster (About only); both cleanups run when this context reverts
      const undoCoaster = initCoaster(scope);
      return () => { if (undoProcess) undoProcess(); if (undoCoaster) undoCoaster(); };
    }, scope);

    ScrollTrigger.refresh();
    if (keep > -1) scrollTo(0, keep);
  }

  function startProgress(){
    if (!GS) return;
    gsap.to("#progress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: .3 } });
  }

  /* =================================================================
     FOOTER WAVE — the footer's top is the hero's wave (WAVE), without
     the dots: a fling of the page jiggles it, and on a mouse or a
     trackpad the cursor skimming it splashes it, as in the hero. It's
     stepped on GSAP's ticker, only while it's on screen and moving.
     ================================================================= */
  function startFooterWave(){
    const svg = $("#foot-wave");
    if (!svg) return;
    const wave = makeWave(svg), DT = 1 / 120;
    let visible = false, acc = 0;
    // sized as it arrives and on every resize (its height follows the screen's: --floor)
    new ResizeObserver(() => { wave.size(svg.clientWidth); wave.draw(); }).observe(svg);
    if (!GS || reduced) return;   // still: it rests
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(svg);
    gsap.ticker.add((time, dtMs) => {
      if (!visible || !wave.awake) return;
      acc = Math.min(acc + Math.min(dtMs, 50) / 1000, DT * 5);
      while (acc >= DT && wave.awake){ wave.step(DT); acc -= DT; }
      wave.draw();
    });
    let lastY = scrollY;
    addEventListener("scroll", () => { const dy = scrollY - lastY; lastY = scrollY; if (visible) wave.jiggle(dy); }, { passive: true });
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let px = 0, py = 0, pt = 0;
    addEventListener("pointermove", e => {
      if (!visible) return;
      const r = svg.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      const now = performance.now(), dt = Math.max(8, now - pt) / 1000;
      // the hero's splash (HERO, the bat): down the wave's slope with the cursor's speed
      if (now - pt < 120 && x >= 0 && x <= r.width && y > wave.surface(x) - 24 && y < r.height)
        wave.poke(x, clamp(-700, 700, (y - py) / dt) * .18 + Math.min(900, Math.abs(x - px) / dt) * .09);
      px = x; py = y; pt = now;
    }, { passive: true });
  }

  /* =================================================================
     CONTACT FORM
     ================================================================= */
  $("#contact-form").addEventListener("submit", async function(e){
    e.preventDefault();
    const form = e.currentTarget;
    const name = $("#c-name"), email = $("#c-email"), msg = $("#c-msg");
    let ok = true;
    $("#e-name").textContent = ""; $("#e-email").textContent = ""; $("#e-msg").textContent = "";
    if (!name.value.trim()){ $("#e-name").textContent = LANG === "af" ? "Sê my wat om jou te noem." : "Tell me what to call you."; ok = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())){
      $("#e-email").textContent = LANG === "af" ? "Dié e-posadres lyk nie reg nie." : "That address doesn't look right."; ok = false;
    }
    if (msg.value.trim().length < 12){
      $("#e-msg").textContent = LANG === "af" ? "'n Paar woorde meer sal help." : "A few more words would help."; ok = false;
    }
    if (!ok){ toast(LANG === "af" ? "Kyk asseblief weer na die vorm" : "Please check the form"); return; }

    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = LANG === "af" ? "Stuur tans…" : "Sending…";
    btn.disabled = true;

    let delivered = false;
    try{
      const res = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      delivered = res.ok;
    } catch (err){ delivered = false; }

    const first = esc(name.value.trim().split(" ")[0]);
    const af = LANG === "af";
    /* on failure the form is gone, so hand the visitor's text to their
       mail client rather than losing it */
    const mail = "mailto:williamsham90@gmail.com?subject=" + encodeURIComponent($("#c-subject").value.trim() || "Portfolio") +
      "&body=" + encodeURIComponent(msg.value.trim());
    $("#form-card").innerHTML =
      '<div class="sent"><div class="sent-mark" aria-hidden="true"' + (delivered ? '>✓' : ' style="border-color:var(--pink);color:var(--pink)">!') + '</div>' +
      '<h3 style="font-size:clamp(1.5rem,1.25rem + 1.2vw,2.2rem)">' +
        (delivered ? (af ? "Dankie, " : "Thanks, ") : (af ? "Jammer, " : "Sorry, ")) + first + '</h3>' +
      '<p class="prose">' + (delivered
        ? (af ? "Jou boodskap is gestuur. Ek antwoord gewoonlik binne een werksdag."
              : "Your message is on its way. I usually reply within one working day.")
        : (af ? "Dit het nie deurgegaan nie, maar jou boodskap is nie verlore nie. Stuur dit eerder per e-pos."
              : "That didn't go through, but your message isn't lost. Send it by email instead.")) + '</p>' +
      (delivered
        ? '<a class="btn btn-line btn-sm" href="#portfolio">' + (af ? "Terug na die begin" : "Back to the start") + '</a>'
        : '<a class="btn btn-accent btn-sm" href="' + esc(mail) + '">' + (af ? "Stuur per e-pos →" : "Send by email →") + '</a>') +
      '</div>';
    if (GS && !reduced) gsap.from("#form-card .sent > *", { y: 20, opacity: 0, duration: .6, stagger: .08, ease: "power3.out" });
  });

  /* =================================================================
     CONTACT PAGE — hover-to-scatter background shapes
     https://gsap.com/pricing/ — a small pool of reused nodes rather
     than create/destroy per event; killTweensOf + a fresh gsap.set
     reset a shape cleanly before replaying it on the next reuse, the
     same idiom GSAP's own cursor-trail demo uses. Hover rather than
     drag — coarse pointers are excluded since there's no hover there.
     Shared by the contact page background and the Skills section.
     ================================================================= */
  function initShapeFx(host, page){
    if (!host || !page || !GS || reduced || coarse) return;

    const SHAPES = ["fx-circle", "fx-square", "fx-triangle", "fx-diamond"];
    const POOL_SIZE = 10;
    const pool = [];
    for (let i = 0; i < POOL_SIZE; i++){
      const el = document.createElement("span");
      el.className = "fx-shape";
      host.appendChild(el);
      pool.push(el);
    }
    let cursor = 0, lastX = -999, lastY = -999;

    const isInteractive = t => !!t.closest("input, textarea, button, a, select, details, summary, label");

    function burst(clientX, clientY){
      const el = pool[cursor % pool.length]; cursor++;
      const rect = host.getBoundingClientRect();
      const size = gsap.utils.random(10, 20);
      gsap.killTweensOf(el);
      el.className = "fx-shape " + SHAPES[Math.floor(gsap.utils.random(0, SHAPES.length))];
      el.style.background = ACCENTS[Math.floor(gsap.utils.random(0, ACCENTS.length))];
      /* clearProps runs as post-tween cleanup, so it must land in its own
         call — bundled into the same .set() as the new x/y, it wipes the
         values that call just applied. */
      gsap.set(el, { clearProps: "transform,opacity" });
      gsap.set(el, {
        x: clientX - rect.left + gsap.utils.random(-10, 10),
        y: clientY - rect.top + gsap.utils.random(-10, 10),
        width: size, height: size, opacity: 0, scale: 0,
        rotate: gsap.utils.random(-40, 40)
      });
      gsap.timeline()
        .to(el, { opacity: 1, scale: 1, duration: .35, ease: "back.out(2.5)" })
        .to(el, { y: "+=" + gsap.utils.random(40, 80), opacity: 0, duration: .7, ease: "power1.in" }, .15);
    }

    page.addEventListener("pointermove", e => {
      if (e.pointerType !== "mouse") return;
      if (isInteractive(e.target)) return;
      if (Math.hypot(e.clientX - lastX, e.clientY - lastY) < 26) return;
      lastX = e.clientX; lastY = e.clientY;
      burst(e.clientX, e.clientY);
    });
  }

  /* =================================================================
     DRAWER
     ================================================================= */
  const drawer = $("#drawer"), scrim = $("#scrim");
  function setDrawer(open){
    if (open === drawer.classList.contains("open")) return;
    drawer.classList.toggle("open", open);
    scrim.classList.toggle("open", open);
    /* inert, not aria-hidden: the closed drawer is only slid off-screen,
       so without it Tab still walked into its links */
    const hadFocus = drawer.contains(document.activeElement);
    drawer.inert = !open;
    if (open) $("#close-drawer").focus();
    else if (hadFocus) $("#burger").focus();
    $("#burger").setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open && GS && !reduced) gsap.from("#drawer a[data-route]", { x: 26, opacity: 0, duration: .5, stagger: .05, ease: "power3.out", delay: .12 });
  }
  $("#burger").addEventListener("click", () => setDrawer(true));
  $("#close-drawer").addEventListener("click", () => setDrawer(false));
  scrim.addEventListener("click", () => setDrawer(false));
  drawer.addEventListener("click", e => { if (e.target.closest("a[data-route]")) setDrawer(false); });
  addEventListener("keydown", e => { if (e.key === "Escape") setDrawer(false); });
  // widened past the phone layout with it open (a rotated tablet): close it, or the page stays locked
  matchMedia("(max-width: 1040px)").addEventListener("change", e => { if (!e.matches) setDrawer(false); });

  /* the skip link: focus moves to the page without the address changing (the router would
     read "#main" as an unknown page and go home) */
  $("#skip").addEventListener("click", e => { e.preventDefault(); $("#main").focus(); });

  /* =================================================================
     ABOUT — PHOTO STACK
     Positions live in CSS (data-pos 0 = front). A shuffle tosses the
     front photo out and tucks it in at the back; .toss runs that
     keyframe and is dropped once it ends.
     ================================================================= */
  const snaps = $$("#stack .snap");
  function shuffleStack(){
    snaps.forEach(s => {
      const pos = (Number(s.dataset.pos) + snaps.length - 1) % snaps.length;
      if (pos === snaps.length - 1){
        s.classList.add("toss");
        s.addEventListener("animationend", () => s.classList.remove("toss"), { once: true });
      }
      s.dataset.pos = pos;
    });
  }
  $("#stack").addEventListener("click", shuffleStack);
  $("#shuffle").addEventListener("click", shuffleStack);

  /* =================================================================
     LIGHTBOX — one for the whole site (#lightbox, a native <dialog>:
     Esc closes, focus stays inside, the page behind is inert). Anything
     with data-lb="group" opens it; ← → (keys, buttons or a swipe) browse
     the rest of that group in page order. The photo is data-lb-src or
     the element's own <img>; without one, its riso placeholder (.ph) is
     shown big in the same inks. Caption: data-lb-cap, else the alt text.
     ================================================================= */
  const lb = $("#lightbox"), lbCard = $(".lb-card", lb), lbMedia = $(".lb-media", lb);
  let lbItems = [], lbAt = 0, lbFrom = null, swipeX = null, swiped = false;
  function lbShow(i, dir){
    lbAt = (i + lbItems.length) % lbItems.length;
    const el = lbItems[lbAt], img = $("img", el), src = el.dataset.lbSrc || (img && img.currentSrc) || "";
    const inks = getComputedStyle($(".ph", el) || el);
    ["--accent", "--accent-2"].forEach(v => lbCard.style.setProperty(v, inks.getPropertyValue(v)));
    lbMedia.innerHTML = src ? '<img src="' + esc(src) + '" alt="' + esc(img ? img.alt : "") + '">' : '<div class="ph"></div>';
    $(".lb-cap", lb).textContent = el.dataset.lbCap || (img && img.alt) || "";
    $(".lb-count", lb).textContent = pad2(lbAt + 1) + " / " + pad2(lbItems.length);
    lbCard.style.rotate = (lbAt % 2 ? 1.5 : -1.5) + "deg";
    if (dir && !reduced) lbCard.animate([{ opacity: 0, transform: "translateX(" + dir * 48 + "px)" }, { opacity: 1, transform: "none" }],
      { duration: 300, easing: "cubic-bezier(.22,1,.36,1)" });
  }
  const lbStep = dir => { if (lbItems.length > 1) lbShow(lbAt + dir, dir); };
  document.addEventListener("click", e => {
    const el = e.target.closest("[data-lb]");
    if (!el || lb.open) return;
    lbItems = $$('[data-lb="' + CSS.escape(el.dataset.lb) + '"]');
    lbFrom = el;
    lb.setAttribute("aria-label", T("lb.title", "Photos"));
    [["prev", "Previous photo"], ["next", "Next photo"], ["close", "Close"]].forEach(b => $(".lb-" + b[0], lb).setAttribute("aria-label", T("lb." + b[0], b[1])));
    lb.classList.toggle("lb-single", lbItems.length < 2);
    lbShow(lbItems.indexOf(el));
    lb.showModal();
  });
  $(".lb-prev", lb).addEventListener("click", () => lbStep(-1));
  $(".lb-next", lb).addEventListener("click", () => lbStep(1));
  $(".lb-close", lb).addEventListener("click", () => lb.close());
  // The page behind stays put: no wheel, no scrolling keys (touch: touch-action in index.css). Blocked
  // here rather than with overflow: hidden, which would take the scrollbar away and shift the page.
  lb.addEventListener("wheel", e => e.preventDefault(), { passive: false });
  lb.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight"){ e.preventDefault(); lbStep(e.key === "ArrowRight" ? 1 : -1); }
    else if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].indexOf(e.key) > -1) e.preventDefault();
  });
  // a sideways swipe browses; a tap on the dark around the photo closes (but not the end of a swipe)
  lb.addEventListener("pointerdown", e => { swipeX = e.clientX; swiped = false; });
  lb.addEventListener("pointerup", e => {
    const dx = swipeX === null ? 0 : e.clientX - swipeX;
    swipeX = null;
    if (Math.abs(dx) > 50){ swiped = true; lbStep(dx < 0 ? 1 : -1); }
  });
  lb.addEventListener("click", e => { if (e.target === lb && !swiped) lb.close(); });
  lb.addEventListener("close", () => { if (lbFrom) lbFrom.focus({ preventScroll: true }); });

  /* =================================================================
     BACK TO TOP
     ================================================================= */
  const toTop = $("#to-top");
  addEventListener("scroll", () => {
    toTop.classList.toggle("show", scrollY > innerHeight * .6);
  }, { passive: true });
  toTop.addEventListener("click", () => {
    scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  });

  /* =================================================================
     BRAND — "WILLIAM SHAM, IS <word>" and the Batman button
     The word list rotates on a GSAP delayedCall loop. A click spins the
     comic icons slot-machine style (fast, then slowing) until it lands on
     Batman: bat confetti, an "I'm Batman" bubble, and the word list says
     BATMAN for a few seconds before it carries on. Reduced motion keeps
     the joke (Batman, bubble, word) but drops the spin, slide and confetti.
     ================================================================= */
  const WORDS = {
    en: ["A Programmer","Poster Sexy","A Bug Slayer","Always Hungry","An Unpaid Comedian","A Follower Of JESUS"],
    af: ["'n Programmeerder","Poster Sexy","'n Foutjagter","Altyd Honger","'n Onbetaalde Komediant","'n Volgeling Van Christus"]
  };
  // 0 is the resting pink dot, 1–5 the comic icons, last Batman
  const brandWord = $("#brand-word"), brandIcons = $$(".brand-icon > *"), bubble = $("#bat-bubble");
  const BATMAN = brandIcons.length - 1;
  const SPIN = [2, 3, 4, 5, 1, 2, 3, 4, 5, BATMAN];
  const BAT = '<svg viewBox="0 0 100 50"><path d="M50 15 47 5 44 14C36 7 19 4 3 9c10 4 12 12 8 21 8-5 17-3 21 5 5-6 13-5 18 7 5-12 13-13 18-7 4-8 13-10 21-5-4-9-2-17 8-21C81 4 64 7 56 14L53 5z"/></svg>';
  const animate = GS && !reduced;
  let wordIdx = 0, wordLoop = null, batBusy = false;

  function setWord(text){
    if (!animate){ brandWord.textContent = text; return; }
    gsap.timeline()
      .to(brandWord, { yPercent: -110, opacity: 0, duration: .3, ease: "power2.in" })
      .add(() => { brandWord.textContent = text; })
      .fromTo(brandWord, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .45, ease: "power3.out" });
  }
  function rotateWords(){
    wordLoop = gsap.delayedCall(2.4, () => {
      wordIdx = (wordIdx + 1) % WORDS.en.length;
      setWord(WORDS[LANG][wordIdx]);
      rotateWords();
    });
  }
  brandWord.textContent = WORDS[LANG][0];
  if (animate) rotateWords();

  function showIcon(n, pop){
    brandIcons.forEach((img, i) => img.classList.toggle("on", i === n));
    if (pop) gsap.fromTo(".brand-icon", { scale: .65, rotation: gsap.utils.random(-14, 14) },
      { scale: 1, rotation: 0, duration: .2, ease: "back.out(3)" });
  }
  function batConfetti(){
    const r = $(".brand-icon").getBoundingClientRect();
    const box = document.createElement("div");
    box.className = "bat-confetti";
    box.style.left = r.left + r.width / 2 + "px";
    box.style.top = r.top + r.height / 2 + "px";
    box.innerHTML = Array.from({ length: 24 }, (_, i) =>
      '<i style="color:' + (i % 3 ? "#13111A" : "#F5B800") + '">' + BAT + '</i>').join("");
    document.body.appendChild(box);
    /* the icon sits in the top-left corner, so the burst sprays down and right */
    gsap.timeline({ onComplete: () => box.remove() })
      .fromTo(box.children, { x: 0, y: 0, scale: 0, rotation: 0 }, {
        x: () => gsap.utils.random(-50, 260), y: () => gsap.utils.random(-25, 170),
        scale: () => gsap.utils.random(.55, 1.35), rotation: () => gsap.utils.random(-180, 180),
        duration: .75, ease: "power3.out", stagger: .008 })
      .to(box.children, { y: () => "+=" + gsap.utils.random(40, 110), opacity: 0,
        duration: .9, ease: "power1.in", stagger: .008 }, "-=.2");
  }
  function batman(){
    if (wordLoop) wordLoop.kill();
    bubble.textContent = "I'm Batman";
    setWord("Batman");
    if (animate){
      gsap.fromTo(".brand-icon", { scale: 1.9, rotation: -16 }, { scale: 1, rotation: 0, duration: .8, ease: "elastic.out(1, .45)" });
      gsap.fromTo(bubble, { autoAlpha: 0, scale: 0, rotation: -10 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: .55, ease: "back.out(2.2)" });
      batConfetti();
    } else bubble.style.visibility = "visible";
  }
  function unBatman(){
    batBusy = false;
    setWord(WORDS[LANG][wordIdx]);
    if (animate){
      gsap.to(bubble, { autoAlpha: 0, scale: 0, duration: .25, ease: "power2.in", onComplete: () => { bubble.textContent = ""; } });
      showIcon(0, true);
      rotateWords();
    } else {
      bubble.style.visibility = ""; bubble.textContent = "";
      showIcon(0);
    }
  }
  $("#brand").addEventListener("click", () => {
    if (batBusy) return;
    batBusy = true;
    if (!animate){ showIcon(BATMAN); batman(); setTimeout(unBatman, 2800); return; }
    const tl = gsap.timeline();
    /* gaps grow from 0.05s to ~0.25s: a spin that slows onto Batman */
    SPIN.forEach((n, i) => tl.add(() => showIcon(n, n !== BATMAN), i ? "+=" + (.05 + .2 * (i / SPIN.length) ** 2) : 0));
    tl.add(batman).add(unBatman, "+=2.8");
  });

  /* =================================================================
     ROUTING
     ================================================================= */
  const ROUTES = ["portfolio","about","projects","play","contact"];
  const TITLES = {
    portfolio:["William Sham Portfolio","William Sham se portefeulje"], about:["About · William Sham","Oor my · William Sham"],
    projects:["Projects · William Sham","Projekte · William Sham"], play:["Playground · William Sham","Speelgrond · William Sham"],
    contact:["Contact · William Sham","Kontak · William Sham"]
  };
  let current = "portfolio";
  // until the loader lifts, routes are shown without building their animations (the lift builds them, once)
  let booting = !!$("#loader");
  /* A refresh keeps your place, but restored by us (the end of this file), after the page's pins
     have made their scroll room: the browser's own restore runs before they exist and lands short. */
  history.scrollRestoration = "manual";
  addEventListener("pagehide", () => { try { sessionStorage.setItem("ws-scroll", location.hash + "|" + Math.round(scrollY)); } catch (e) {} });
  function setTitle(){ document.title = TITLES[current][LANG === "af" ? 1 : 0]; }

  function applyRoute(route){
    current = route;
    ROUTES.forEach(r => { $("#page-" + r).hidden = (r !== route); });
    document.documentElement.classList.remove("boot-away");   // [hidden] has it from here (index.html head)
    // the page's lead photo (its LCP) loads now rather than waiting on the lazy-load check
    $$('.sc-slide.is-active img, .snap[data-pos="0"] img', $("#page-" + route)).forEach(img => { img.loading = "eager"; img.fetchPriority = "high"; });
    $$("[data-route]").forEach(a => {
      if (a.dataset.route === route) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    setTitle();
    lazyFrames();
    initEmbeds();
    if (!booting) animatePage(route);   // at boot the loader builds it as it lifts (see the end of this file)
  }
  /* Page wipe (#wipe in index.css): direction follows the nav order, and
     the route swaps (and the page jumps to the top) only while the panel
     fully covers the screen. A new click mid-wipe finishes the old one. */
  const wipe = $("#wipe"), wipeLayers = $$("#wipe i");
  let wiping = null;
  function wipeTo(route, scroll){
    if (wiping) wiping.progress(1);
    pickWipe();
    wipe.classList.toggle("rev", ROUTES.indexOf(route) < ROUTES.indexOf(current));
    wiping = gsap.timeline({ onComplete(){ wiping = null; } })
      .set(wipe, { visibility: "visible" })
      .fromTo(wipeLayers, { xPercent: -100 }, { xPercent: 0, duration: .45, ease: "power2.inOut", stagger: .035 })
      .add(() => {
        if (scroll) scrollTo({ top: 0, behavior: "auto" });
        applyRoute(route);
      })
      .to(wipeLayers, { xPercent: 100, duration: .5, ease: "power2.inOut", stagger: { each: .035, from: "end" } })
      .set(wipe, { visibility: "hidden" });
  }

  /* The route in the address bar: "#About", "#contact?x=1", an old or
     mistyped link — anything that isn't a page is the home page, and the
     address bar is corrected (replaceState: no new history entry, no
     hashchange) so a refresh or a shared link lands where you are. */
  function routeFromHash(){
    const r = location.hash.slice(1).split(/[?&/]/)[0].toLowerCase(), route = ROUTES.indexOf(r) > -1 ? r : "portfolio";
    if (location.hash && location.hash !== "#" + route) history.replaceState(history.state, "", location.pathname + location.search + "#" + route);
    return route;
  }

  function go(route, scroll){
    if (GS && !reduced && route !== current) return wipeTo(route, scroll);
    if (scroll) scrollTo({ top: 0, behavior: "auto" });
    if (document.startViewTransition && !reduced) document.startViewTransition(() => applyRoute(route));
    else applyRoute(route);
  }
  addEventListener("hashchange", () => go(routeFromHash(), true));

  /* =================================================================
     BOOT
     ================================================================= */
  applyLang();
  applyRoute(routeFromHash());
  startProgress();
  startFooterWave();
  $("#year").textContent = new Date().getFullYear();
  initShapeFx($("#contact-fx"), $("#page-contact"));
  initShapeFx($("#skills-fx"), $("#skills-tinted"));
  $$(".band-fx").forEach(fx => initShapeFx(fx, fx.closest(".band")));

  /* Loader: lift once the fonts are in (and on the home page the hero
     photo, its LCP) and the window has loaded, but not before 0.7s from
     navigation (a beat, not a flicker) and never after 2.5s (one slow
     asset shouldn't hold the page hostage). A refresh (or a return with
     Back) is put back where it was.
     It lifts in two beats, so the first frames anyone sees are smooth.
     First, still under the panel (opaque, its ring spinning on the
     compositor): the page is shown and its animations built (animatePage:
     the hero's entrance, the pins, ScrollTrigger measuring it all) with
     GSAP's clock paused, and the browser paints it all once, unseen.
     Then, once that's on screen, the panel slides away and the clock
     runs, so the intro plays from its first frame. (Done in one go, as
     it was, the main thread was busy for ~0.5s as the panel started to
     move and the first paint took another ~0.5s frame: the intro froze
     and jumped. A paused global timeline resumes where it stopped; a
     sleeping ticker would skip ahead on waking.) */
  const loader = $("#loader");
  // .lifted: the page is in view, and the bar's name draws its stroke (index.css)
  if (!loader){
    document.documentElement.classList.remove("booting");
    document.documentElement.classList.add("lifted");
  } else {
    let lifted = false;
    const lift = () => {
      if (lifted) return;
      lifted = true;
      booting = false;
      document.documentElement.classList.remove("booting");
      lazyFrames();
      initEmbeds();
      animatePage(current);
      /* the clock stops only now: under a stopped clock gsap.set() holds its values back until
         it runs again, so the pins measured (ScrollTrigger plays them to the end and back) before
         their starting states had landed, and took How I work's closed steps for open ones:
         scrolling back through it threw the steps open, 03 over the words. Nothing ticks in
         between, so the intro still starts from its first frame. */
      if (GS) gsap.globalTimeline.pause();
      const nav = performance.getEntriesByType("navigation")[0];
      let saved = null;
      try { saved = sessionStorage.getItem("ws-scroll"); sessionStorage.removeItem("ws-scroll"); } catch (e) {}
      if (saved && nav && (nav.type === "reload" || nav.type === "back_forward")){
        const i = saved.lastIndexOf("|");
        if (saved.slice(0, i) === location.hash) scrollTo(0, +saved.slice(i + 1));
      }
      /* Then wait, unseen, until frames flow again: three in a row under 25ms, or 1.5s at
         most, and only then start the clock and slide the panel away (measured: without
         this wait, the first paint of the page, ~0.4s, landed on the intro every time). */
      let prev = 0, calm = 0, waited = 0;
      const settle = t => {
        if (prev){ calm = t - prev < 25 ? calm + 1 : 0; waited += t - prev; }
        prev = t;
        if (calm < 3 && waited < 1500) return requestAnimationFrame(settle);
        if (GS) gsap.globalTimeline.resume();
        loader.classList.add("out");
        document.documentElement.classList.add("lifted");
        setTimeout(() => loader.remove(), 900);
      };
      /* Before that, the showcase's photos (just below the hero, or the page's hero on Projects)
         are fetched and decoded, under the panel: they're lazy, so they only set off as the page
         was shown, and arrived, to be decoded, just as the intro began (measured: that froze it
         for ~0.4s in 5 runs out of 6; held back, in none). 0.8s at most, for a slow connection. */
      const soon = $$(".sc-slide img", $("#page-" + current));
      soon.forEach(img => { img.loading = "eager"; });
      Promise.race([Promise.all(soon.map(img => img.decode().catch(() => {}))), new Promise(r => setTimeout(r, 800))])
        .then(() => requestAnimationFrame(settle));
    };
    const lcp = current === "portfolio" && HERO.photo;
    Promise.all([
      document.fonts ? document.fonts.ready : null,
      lcp && !lcp.complete ? new Promise(r => { lcp.addEventListener("load", r); lcp.addEventListener("error", r); }) : null,
      // and the window's load: ScrollTrigger re-measures the page on it (a forced layout of ~90ms),
      // which landed just as the panel started to move
      document.readyState === "complete" ? null : new Promise(r => addEventListener("load", r, { once: true }))
    ]).then(() => setTimeout(lift, Math.max(0, 700 - performance.now())));
    setTimeout(lift, 2500);
  }

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (GS) ScrollTrigger.refresh(); });
  addEventListener("load", () => { initEmbeds(); if (GS) ScrollTrigger.refresh(); });
})();
