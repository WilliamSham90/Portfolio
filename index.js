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
    "drawer.title":"Kieslys",
    "hero.status":"Beskikbaar vir vryskutwerk",
    "hero.sub":"Full-stack developer. Ek maak die internet mooi.","hero.sub2":"Plesier",
    "hero.tag":"Senior webontwikkelaar · Krugersdorp",
    "doodle.hint":"Klik en sleep enige plek hier om te teken","doodle.clear":"Vee uit","doodle.touch":"Tekenmodus: af",
    "portrait.hint":"klik om die agtergrond te verander",
    "cta.work":"Eregalery","cta.touch":"Klik & Vind Uit","cta.allProjects":"Al 35 projekte",
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
    "ride.stop":"Halte","ride.admit":"Toegang vir een",
    "after.eyebrow":"Ná werk","after.title":"Wat ek vir die pret maak",
    "band.aboutTitle":"Nuuskierig oor die kode?",
    "band.aboutText":"Vra my daaroor... Nee, doen dit regtig net. Ek belowe ek sal nie byt nie ;)",
    "proj.eyebrow":"Projekte · 2021—2026","proj.title":"Vyf-en-dertig werwe, almal nou aanlyn",
    "proj.sub":"Korporatiewe platforms, motorwerwe vir verskeie markte, aanlyn winkels, Laravel-stelsels, speletjiemods, Umbraco-werwe, GSAP-webwerwe en meer.",
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
    $("#lang").textContent = LANG === "af" ? "AF" : "EN";
    $("#lang").setAttribute("aria-label", LANG === "af" ? "AF, verander na Engels" : "EN, switch to Afrikaans");
    document.documentElement.lang = LANG;
    setTitle();
    renderAll();
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


  /* Organised loading placeholder for the live embed — three evenly
     spaced dots, not scattered riso shapes, so it reads as "loading"
     rather than as another card's cover art. */
  function loadingArt(w, h){
    const r = h * .053, gap = w * .09, cy = h / 2, cx0 = w / 2 - gap;
    const dots = ACCENTS.slice(0, 3).map((c, i) =>
      '<circle class="pulse-dot" style="animation-delay:' + (i * .16) + 's" cx="' + (cx0 + i * gap).toFixed(1) +
      '" cy="' + cy.toFixed(1) + '" r="' + r.toFixed(1) + '" fill="' + c + '"/>').join("");
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Loading preview">' +
      '<rect width="' + w + '" height="' + h + '" fill="var(--card)"/>' + dots + '</svg>';
  }

  /* ---- interactive portrait plate ---------------------------------- */
  const PLATES = [
    { bg:"var(--mint)",   ghost:"var(--pink)",   body:"var(--blue)",  face:"var(--yellow)", hair:"var(--pink)" },
    { bg:"var(--yellow)", ghost:"var(--blue)",   body:"var(--pink)",  face:"var(--mint)",   hair:"var(--blue)" },
    { bg:"var(--blue)",   ghost:"var(--yellow)", body:"var(--mint)",  face:"var(--pink)",   hair:"var(--yellow)" },
    { bg:"var(--pink)",   ghost:"var(--mint)",   body:"var(--yellow)",face:"var(--blue)",   hair:"var(--mint)" }
  ];
  let plate = 0;

  function paintPortrait(){
    const c = PLATES[plate % PLATES.length];
    $("#portrait-art").innerHTML =
      '<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Stylised riso-print portrait plate">' +
      '<defs><pattern id="pDots" width="9" height="9" patternUnits="userSpaceOnUse">' +
      '<circle cx="4.5" cy="4.5" r="1.8" fill="var(--ink)" opacity=".16"/></pattern></defs>' +
      '<rect width="400" height="500" fill="var(--card)"/>' +
      '<g style="mix-blend-mode: multiply"><circle cx="200" cy="236" r="210" fill="' + c.bg + '" opacity=".9"/></g>' +
      '<g style="mix-blend-mode: multiply" transform="translate(12,10)" opacity=".75">' +
        '<path d="M46 500 q0-116 154-140 154 24 154 140 z" fill="' + c.ghost + '"/>' +
        '<circle cx="200" cy="210" r="82" fill="' + c.ghost + '"/></g>' +
      '<g><path d="M46 500 q0-116 154-140 154 24 154 140 z" fill="' + c.body + '"/>' +
        '<rect x="178" y="262" width="44" height="56" rx="18" fill="' + c.face + '"/>' +
        '<circle cx="200" cy="210" r="82" fill="' + c.face + '"/>' +
        '<path d="M118 210 q2-88 82-88 80 0 82 88 q-16-48-82-48-66 0-82 48z" fill="' + c.hair + '"/>' +
        '<g id="eyes"><circle cx="175" cy="212" r="7" fill="#13111A"/><circle cx="227" cy="212" r="7" fill="#13111A"/></g>' +
        '<path d="M178 244 q22 18 46 0" stroke="#13111A" stroke-width="6" fill="none" stroke-linecap="round"/>' +
        '<path d="M200 350 l0 150" stroke="var(--card)" stroke-width="3" opacity=".5"/></g>' +
      '<rect width="400" height="500" fill="url(#pDots)"/></svg>' +
      '<img class="photo" src="' + IMG_BASE + 'williampp.jpg" alt="William Sham" ' +
      'fetchpriority="high" onerror="this.remove()">';
  }

  const portrait = $("#portrait");
  portrait.insertAdjacentHTML("afterbegin", '<div id="portrait-art" style="position:absolute;inset:0"></div>');
  paintPortrait();

  let tiltRaf = null;
  function onPortraitMove(e){
    const r = portrait.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width  - .5;
    const py = (e.clientY - r.top)  / r.height - .5;
    if (tiltRaf) cancelAnimationFrame(tiltRaf);
    tiltRaf = requestAnimationFrame(() => {
      portrait.style.transform = "rotateY(" + (px * 11).toFixed(2) + "deg) rotateX(" + (-py * 11).toFixed(2) + "deg)";
      const eyes = $("#eyes");
      if (eyes) eyes.setAttribute("transform", "translate(" + (px * 13).toFixed(1) + "," + (py * 9).toFixed(1) + ")");
    });
  }
  function resetPortrait(){
    portrait.style.transform = "";
    const eyes = $("#eyes");
    if (eyes) eyes.setAttribute("transform", "translate(0,0)");
  }
  if (!coarse && !reduced){
    portrait.addEventListener("pointermove", onPortraitMove);
    portrait.addEventListener("pointerleave", resetPortrait);
  }
  /* The click used to re-ink the SVG plate — dead weight now that a real
     photo sits on top of it. Reused for a hero-background cycle instead. */
  const hero = $(".hero");
  const HERO_TINTS = 3;
  let heroTint = 0;
  portrait.addEventListener("click", () => {
    heroTint = (heroTint + 1) % (HERO_TINTS + 1);
    if (heroTint) hero.dataset.tint = heroTint; else delete hero.dataset.tint;
  });

  /* =================================================================
     HERO DOODLE CANVAS
     ================================================================= */
  const doodle = $("#doodle"), dctx = doodle.getContext("2d");
  const INKS = ["#E8266F", "#2B4BFF", "#E09200", "#00967F", "#13111A"];
  let ink = INKS[0], drawing = false, last = null, touchDraw = false;

  $("#swatches").innerHTML = INKS.map((c, i) =>
    '<button class="sw" type="button" style="background:' + c + '" data-ink="' + c + '" ' +
    'aria-pressed="' + (i === 0) + '" aria-label="Ink colour ' + (i + 1) + '"></button>').join("");
  $("#swatches").addEventListener("click", e => {
    const b = e.target.closest("[data-ink]");
    if (!b) return;
    ink = b.dataset.ink;
    $$("#swatches .sw").forEach(s => s.setAttribute("aria-pressed", String(s === b)));
  });

  function sizeDoodle(){
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const r = doodle.getBoundingClientRect();
    if (!r.width) return;
    doodle.width = r.width * dpr; doodle.height = r.height * dpr;
    dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dctx.lineCap = "round"; dctx.lineJoin = "round";
  }
  function point(e){
    const r = doodle.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  doodle.addEventListener("pointerdown", e => {
    if (e.pointerType === "touch" && !touchDraw) return;
    e.preventDefault();
    drawing = true; last = point(e);
    doodle.setPointerCapture(e.pointerId);
    document.body.style.userSelect = "none";
  });
  doodle.addEventListener("pointermove", e => {
    if (!drawing) return;
    const p = point(e);
    const d = Math.hypot(p.x - last.x, p.y - last.y);
    dctx.strokeStyle = ink;
    dctx.globalAlpha = .82;
    dctx.lineWidth = Math.max(2.5, 16 - d * .5);
    dctx.beginPath(); dctx.moveTo(last.x, last.y); dctx.lineTo(p.x, p.y); dctx.stroke();
    last = p;
  });
  ["pointerup","pointercancel","pointerleave"].forEach(ev =>
    doodle.addEventListener(ev, () => {
      if (!drawing) return;
      drawing = false;
      document.body.style.userSelect = "";
    }));
  $("#doodle-clear").addEventListener("click", () => dctx.clearRect(0, 0, doodle.width, doodle.height));
  if (coarse){
    const tb = $("#doodle-touch");
    tb.hidden = false;
    tb.addEventListener("click", () => {
      touchDraw = !touchDraw;
      doodle.style.touchAction = touchDraw ? "none" : "pan-y";
      tb.textContent = LANG === "af" ? "Tekenmodus: " + (touchDraw ? "aan" : "af")
                                     : "Draw mode: " + (touchDraw ? "on" : "off");
    });
  }
  addEventListener("resize", sizeDoodle);

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
          '<div class="embed-fallback" aria-hidden="true">' + loadingArt(1200, 760) + '</div>' +
          '<button class="embed-hint" type="button"><span>' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 2v18l5-5 3.5 7 3-1.4-3.4-6.9H20z"/></svg>' +
            (coarse ? T("live.hintTouch", "It's live · tap, drag & explore")
                    : T("live.hint", "It's live · click, drag & explore")) +
          '</span></button>' +
          '<iframe data-src="' + esc(src) + '" title="' + esc(label) + ' — live preview" ' +
            'sandbox="allow-scripts allow-same-origin allow-popups allow-forms" ' +
            'referrerpolicy="no-referrer-when-downgrade"></iframe>' +
        '</div>' +
      '</div>' +
      '<p class="embed-caption">' + esc(label) + ' · ' + esc(host) + '</p>';

    const frame = $(".embed-stage iframe", el);
    $(".embed-hint", el).addEventListener("click", () => {
      frame.parentElement.classList.add("used");
      frame.focus();
    });
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        revealWhenEmbedded(frame);
        frame.src = frame.dataset.src;
      });
    }, { rootMargin: "200px 0px" });
    io.observe($(".embed-stage", el));
  }

  function initEmbeds(){
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
     Projects page (featured ones are pulled out and shown above it). */
  const RAW = [
    ["Zoom DJs","corp","Zoomdj.webp","https://www.zoomdjs.co.za/",["WordPress","Bookings"],"Website for a local DJ","Webwerf vir 'n plaaslike DJ"],
    ["LKDA — Strategic Creative Advertising","lara","Lkda.webp","https://www.lkda.co.za/",["Laravel","Umbraco","CMS"],"Creative advertising agency website","Webwerf vir 'n kreatiewe advertensie-agentskap"],
    ["ATP","corp","ATPsite.webp","https://amplifytradepartners.co.za/",["WordPress","PHP","SEO"],"Amplify Trade Partners website","Webwerf vir Amplify Trade Partners"],
    ["3D Lazer Monkey","corp","3D%20lasermonkey.webp","https://3dlasermonkey.co.za/",["WordPress","3D"],"3D printing and laser cutting services","3D-druk en lasersnydienste"],
    ["Nissan South Africa","auto","NissanSA.webp","https://www.nissan.co.za/",["WordPress","PHP","SEO"],"Official Nissan South Africa website","Nissan Suid-Afrika se amptelike webwerf"],
    ["Nissan Angola","auto","NissanAngola.webp","https://www.nissan.co.ao/",["WordPress","PHP"],"Official Nissan Angola website","Nissan Angola se amptelike webwerf"],
    ["Nissan Uganda","auto","NissanUganda.webp","https://www.nissan.co.ug/",["WordPress","PHP"],"Official Nissan Uganda website","Nissan Uganda se amptelike webwerf"],
    ["Chery South Africa","auto","cherry%20South%20africa.webp","https://www.chery.co.za/",["WordPress","PHP"],"Official Chery South Africa website","Chery Suid-Afrika se amptelike webwerf"],
    ["Afrit","corp","afrit.webp","https://afrit.co.za/",["WordPress","PHP"],"Trailer manufacturer's website","Webwerf vir 'n sleepwavervaardiger"],
    ["Safal Steel","corp","Safalsteel.webp","https://www.safalsteel.com/",["WordPress","PHP"],"Steel manufacturer's website","Webwerf vir 'n staalvervaardiger"],
    ["Mega Master SA","shop","Megamaster.webp","https://megamaster.co.za/",["WordPress","E-commerce"],"Online store for BBQ and outdoor gear","Aanlyn winkel vir braai- en buitetoerusting"],
    ["First 4 Men","corp","First4Men.webp","https://first4men.co.za/",["WordPress","PHP"],"Men's health and wellness website","Webwerf oor mansgesondheid en -welstand"],
    ["Gridcontrol","energy","Gridcontroll.webp","https://www.gridcontrol.co.za/",["WordPress","PHP"],"Power solutions company website","Webwerf vir 'n kragoplossingsmaatskappy"],
    ["Blueasset Group","corp","Blueasset.webp","https://blueassetgroup.com/za",["WordPress","PHP"],"Asset management company website","Webwerf vir 'n batebestuursmaatskappy"],
    ["Pinaroch","lara","Pinaroch.webp","https://pinaroch.co.za/",["Laravel","PHP","Middleware"],"Construction company website","Webwerf vir 'n konstruksiemaatskappy"],
    ["MyBuildings Africa","lara","My%20buildings%20africa.webp","https://mybuildingsafrica.com/",["Laravel","CMS"],"Property management platform","Eiendomsbestuursplatform"],
    ["myBuildings EMEA","lara","My%20buildings%20emea.webp","https://mybuildingsemea.com/",["Laravel","CMS"],"Property management platform for EMEA","Eiendomsbestuursplatform vir EMEA"],
    ["Goscor Group","corp","Goscor%20group.webp","https://goscor.co.za/",["WordPress","Multi-site"],"Industrial equipment group website","Webwerf vir 'n groep in industriële toerusting"],
    ["Goscor Earth Moving","corp","Goscor%20earth%20moving.webp","https://www.goscorearthmoving.co.za/",["WordPress","PHP"],"Earth-moving equipment website","Webwerf vir grondverskuiwingstoerusting"],
    ["Goscor Lift Trucks","corp","Goscor%20lift%20trucks.webp","https://goscorlifttrucks.co.za/",["WordPress","PHP"],"Forklift solutions website","Webwerf vir vurkhyseroplossings"],
    ["Goscor Compressed Air","corp","Goscor%20compressed%20air.webp","https://www.goscorcompressedair.co.za/",["WordPress","PHP"],"Compressed air solutions website","Webwerf vir perslugoplossings"],
    ["Goscor Cleaning","corp","Goscor%20cleaning.webp","https://goscorcleaning.co.za/",["WordPress","PHP"],"Industrial cleaning equipment website","Webwerf vir industriële skoonmaaktoerusting"],
    ["CTU Training","corp","CTU%20training.webp","https://ctutraining.ac.za/",["WordPress","Education"],"IT training institution website","Webwerf vir 'n IT-opleidingsinstelling"],
    ["HEX","corp","Hex.webp","https://hexintegratedsolutions.com/",["WordPress","PHP"],"Integrated solutions company website","Webwerf vir 'n maatskappy in geïntegreerde oplossings"],
    ["Real Box","corp","Realbox.webp","https://realbox.co.za/",["WordPress","PHP"],"Container solutions website","Webwerf vir houeroplossings"],
    ["Commercial PV","energy","CommercialPV.webp","https://commercialpv.co.za/",["WordPress","Solar"],"Commercial solar solutions website","Webwerf vir kommersiële sonkragoplossings"],
    ["Battery Distributors","shop","batterydis.webp","https://batterydistributors.co.za/",["WordPress","E-commerce"],"Online store for batteries","Aanlyn winkel vir batterye"],
    ["Rectifier","energy","rectifier.webp","https://rectifier.co.za/",["WordPress","PHP"],"Power electronics company website","Webwerf vir 'n kragelektronikamaatskappy"],
    ["Go4Green","energy","go4green.webp","https://go4greenenergy.co.za/",["WordPress","Green Energy"],"Green energy solutions website","Webwerf vir groenenergie-oplossings"],
    ["Current Automation","shop","Current%20automation.webp","https://currentautomation.ca/",["WordPress","E-commerce"],"Online store for industrial automation","Aanlyn winkel vir industriële outomatisering"],
    ["CA's Meanwell","shop","CA%20meanwell.webp","https://meanwell.co.za/",["WordPress","E-commerce"],"Online store for power supplies","Aanlyn winkel vir kragbronne"],
    ["Solar-Solution","energy","Solar%20solutions.webp","https://solar-solution.co.za/",["WordPress","Solar"],"Solar energy solutions website","Webwerf vir sonkragoplossings"],
    ["Victron Products","shop","Victron.webp","https://victronproducts.co.za/",["WordPress","E-commerce"],"Online store for Victron energy products","Aanlyn winkel vir Victron-energieprodukte"],
    ["COD BO3 Crash Bandicoot","game","Crash%20bandicoot.webp","https://steamcommunity.com/sharedfiles/filedetails/?id=3234555216",["Radiant","Game Dev"],"Custom zombie map on the Steam Workshop","Pasgemaakte zombiekaart op die Steam Workshop"],
    ["Forgotten Room 115","game","forgotten%20room%20115.webp","https://steamcommunity.com/sharedfiles/filedetails/?id=3326520485",["Radiant","3D Modeling"],"Custom COD BO3 zombie map with its own mechanics","Pasgemaakte COD BO3-zombiekaart met sy eie meganika"],
    ["COD BO3 Mod Tools Super","game","discorcod.webp","#",["Mods","3D Models","Scripts"],"Custom COD BO3 zombie mods, scripts and 3D models","Pasgemaakte COD BO3-zombiemods, skripte en 3D-modelle"]
  ];

  const PROJECTS = RAW.map((p, i) => ({ i, t:p[0], cat:p[1], img:p[2], url:p[3], tech:p[4], en:p[5], af:p[6] }));

  const FEATURED = [
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

  /* Each job is a stop on the Career Coaster (COASTER below), in this
     order. pics: up to three photos for the stop's board, e.g.
     "Images/lkda-1.webp"; an empty slot shows the riso placeholder. */
  const JOBS = [
    { when:{ en:"Sept 2024 — Present", af:"Sept. 2024 — Nou" }, now:true, accent:"var(--pink)", pics:[],
      role:{ en:"Senior Web Developer", af:"Senior webontwikkelaar" },
      where:"LKDA — Strategic Creative Advertising, Pretoria",
      d:{ en:"Full-stack builds and maintenance, server infrastructure and UI/UX.",
          af:"Full-stack-ontwikkeling en -onderhoud, bedienerinfrastruktuur en UI/UX." },
      wins:{ en:["Led the rebuild of LKDA's global digital library app",
                 "Made the Nissan SA website load 5 seconds faster",
                 "Built a plugin that connects to multiple databases"],
             af:["Die herbou van LKDA se wêreldwye digitale biblioteek-app gelei",
                 "Nissan SA se webwerf 5 sekondes vinniger laat laai",
                 "'n Inprop gebou wat aan verskeie databasisse koppel"] } },
    { when:{ en:"Mar 2023 — Aug 2024", af:"Mrt. 2023 — Aug. 2024" }, accent:"var(--blue)", pics:[],
      role:{ en:"Web Developer", af:"Webontwikkelaar" },
      where:"Silverstone Group, Centurion",
      d:{ en:"Full-stack web work, Perfex CRM modules, business tools and online stores.",
          af:"Full-stack-webwerk, Perfex CRM-modules, besigheidstoepassings en aanlyn winkels." },
      wins:{ en:["Developed 15+ custom Perfex CRM modules","Built a WhatsApp chatbot integration"],
             af:["Meer as 15 pasgemaakte Perfex CRM-modules ontwikkel","'n WhatsApp-kletsbot geïntegreer"] } },
    { when:{ en:"2021 — 2022", af:"2021 — 2022" }, accent:"var(--mint)", pics:[],
      role:{ en:"Freelance Developer", af:"Vryskutontwikkelaar" },
      where:{ en:"Self-employed", af:"Selfstandig" },
      d:{ en:"Custom websites and web apps for a range of clients, mostly WordPress, custom themes and online stores.",
          af:"Pasgemaakte webwerwe en webtoepassings vir verskeie kliënte, meestal WordPress, eie temas en aanlyn winkels." },
      wins:{ en:[], af:[] } }
  ];

  /* About page, "After hours". If an img is missing, the tile shows a
     riso placeholder instead. dl = file in Images/ offered as a download. */
  const AFTER = [
    { img:"Crash%20bandicoot.webp", url:"https://steamcommunity.com/sharedfiles/filedetails/?id=3234555216",
      en:["Zombie maps","Crash Bandicoot and Forgotten Room 115, two custom Call of Duty maps on the Steam Workshop."],
      af:["Zombiekaarte","Crash Bandicoot en Forgotten Room 115, twee pasgemaakte Call of Duty-kaarte op die Steam Workshop."] },
    { img:"3d%20models.png", dl:"PlayStation%202%20-%20Crash%20Twinsanity%20-%20Playable%20Characters%20-%20Crash%20Bandicoot.zip",
      en:["3D models","Blender and Maya, for maps, mods and the odd experiment."],
      af:["3D-modelle","Blender en Maya, vir kaarte, mods en af en toe 'n eksperiment."] },
    { img:"DigitalartNiko.gif",
      en:["Digital art","Textures, sketches and anything else that needs drawing."],
      af:["Digitale kuns","Teksture, sketse en enigiets anders wat geteken moet word."] },
    { img:"discorcod.webp",
      en:["Mod tools","Scripts, models and a Discord server for fellow Black Ops III modders."],
      af:["Mod-gereedskap","Skripte, modelle en 'n Discord-bediener vir ander Black Ops III-modders."] }
  ];

  const STACK = ["JavaScript","React","Vue.js","PHP","Laravel","C#","ASP.NET","Blazor Hybrid","Java","C++","SQL",
    "Microsoft Azure","Azure DevOps","Git","Unreal Engine 4","Unity","Radiant","WordPress","Shopify","Wix","Webflow",
    "Perfex CRM","Umbraco","Photoshop","Figma","Blender","Maya","SEO","Search Console","Canva","Spline",
    "GSAP","Locomotive","Without Code","Contentful","Plex","Jellyfin"];
  $("#marquee").innerHTML = STACK.concat(STACK).map(s => "<span>" + s + "</span>").join("");

  /* =================================================================
     CAREER COASTER — About → Experience
     The jobs are stops on a roller coaster. Scrolling pins the stage and
     rides the cart along the track (slow over the tops, fast down the
     drops) while the ridden track fills in; at each stop the job's board
     opens out of the cart like an iris, then closes as the ride carries
     on. The last board stays open and the pin lets go.
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
  /* The park along the ride, cycled left to right. pic = a photo on a
     post, balloons = a photo floating on balloons. */
  const PARK = ["pic", "wheel", "pic", "balloons", "tent", "pic", "flags", "pic", "balloons"];
  const PARK_W = { pic: 180, wheel: 330, tent: 270, balloons: 150, flags: 320 };
  /* Photos for the park's frames, in order, e.g. "Images/park-1.webp".
     A frame without one shows the riso placeholder. */
  const RIDE_PICS = [];
  /* A picture to use instead of the drawn cart, e.g. "Images/coaster-cart.webp":
     140 × 116 in shape, facing right, wheels touching the bottom edge. */
  const CART_IMG = "";

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

  // One stretch of track per job (parts[i] ends at stops[i]), measured once
  const TRACK = (() => {
    const parts = [], stops = [];
    let x = 0;
    JOBS.forEach((_, i) => {
      let d = "M" + f1(x) + ",0";
      (i ? RIDES[(i - 1) % RIDES.length] : LEAD_IN).forEach(p => { d += trackPiece(p, x); x += pieceW(p); });
      parts.push(d);
      stops.push(f1(x));
    });
    const segs = parts.map(sampleTrack), end = f1(x);
    // the trestle: a post every 48 units from the lowest rail above it to the ground, cross-braced under the hills
    const low = {};
    const mark = (px, py) => { const b = Math.round(px / 48); low[b] = b in low ? Math.max(low[b], py) : py; };
    segs.forEach(s => s.xs.forEach((px, j) => mark(px, s.ys[j])));
    for (let px = -1200; px < 0; px += 48) mark(px, 0);
    for (let px = end; px <= end + 1200; px += 48) mark(px, 0);
    let supports = "";
    Object.keys(low).map(Number).sort((a, b) => a - b).forEach(b => {
      const top = f1(low[b] + 10);
      supports += "M" + b * 48 + "," + top + "V" + GROUND;
      if (top < -40 && (b + 1) in low) supports += b % 2
        ? "M" + b * 48 + "," + top + "L" + (b + 1) * 48 + "," + GROUND
        : "M" + b * 48 + "," + GROUND + "L" + (b + 1) * 48 + "," + f1(low[b + 1] + 10);
    });
    return { parts, stops, segs, end, supports, all: "M-1200,0L0,0" + parts.join("") + "L" + f1(end + 1200) + ",0" };
  })();

  /* ---- the park, the cart, the boards (riso: flat inks, ink outlines) */
  const INK = 'stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"';
  const photo = src => '<div class="ph">' + (src ? '<img src="' + esc(src) + '" alt="" loading="lazy" decoding="async" onerror="this.remove()">' : '') + '</div>';
  const inks = i => "--accent:" + ACCENTS[i % 4] + ";--accent-2:" + ACCENTS[(i + 1) % 4];

  const WHEEL = (() => {
    let spokes = "", cars = "";
    for (let a = 0; a < 8; a++){
      const x = f1(Math.cos(a * Math.PI / 4) * 150), y = f1(Math.sin(a * Math.PI / 4) * 150);
      spokes += "M0,0L" + x + "," + y;
      cars += '<circle cx="' + x + '" cy="' + y + '" r="17" fill="' + ACCENTS[a % 4] + '"/>';
    }
    return '<svg viewBox="0 0 330 360" fill="none" ' + INK + '><path d="M165 165L55 360M165 165L275 360M90 300H240" stroke-width="7"/></svg>' +
      '<div class="cz-spin"><svg viewBox="-170 -170 340 340" fill="none" ' + INK + '><circle r="150"/><circle r="116" stroke-width="2"/>' +
      '<path d="' + spokes + '" stroke-width="2"/>' + cars + '<circle r="15" fill="var(--ink)"/></svg></div>';
  })();
  function tentSVG(x, c){
    let roof = "";
    for (let s = 0; s < 6; s++) roof += '<path d="M135 24L' + f1(8 + s * 42.33) + ' 112H' + f1(8 + (s + 1) * 42.33) + 'Z" fill="' + (s % 2 ? "var(--card)" : c) + '" stroke="none"/>';
    return '<svg class="cz-tent" style="left:' + x + 'px;top:' + (GROUND - 220) + 'px" viewBox="0 0 270 220" ' + INK + '>' +
      '<path d="M26 112H244V220H26Z" fill="var(--card)"/>' +
      '<path d="M62 114V218M106 114V218M164 114V218M208 114V218" stroke="' + c + '" stroke-width="12" opacity=".45"/>' +
      '<path d="M108 220V170Q135 140 162 170V220Z" fill="var(--ink)"/>' + roof +
      '<path d="M135 24L262 112H8Z" fill="none"/><path d="M135 24V2L162 10L135 18" fill="' + c + '"/></svg>';
  }
  function flagsSVG(x, i){
    let flags = "";
    for (let s = 1; s <= 8; s++){
      const t = s / 9, u = 1 - t, px = u * u * 10 + 2 * u * t * 160 + t * t * 310, py = u * u * 30 + 2 * u * t * 110 + t * t * 30;
      flags += '<path d="M' + f1(px - 13) + ' ' + f1(py) + 'H' + f1(px + 13) + 'L' + f1(px) + ' ' + f1(py + 32) + 'Z" fill="' + ACCENTS[(s + i) % 4] + '"/>';
    }
    return '<svg class="cz-flags" style="left:' + x + 'px;top:' + (GROUND - 260) + 'px" viewBox="0 0 320 260" ' + INK + '>' +
      '<path d="M10 260V18M310 260V18" stroke-width="6"/><path d="M10 30Q160 110 310 30" fill="none" stroke-width="2"/>' + flags + '</svg>';
  }
  function balloonsSVG(i){
    return '<svg viewBox="0 0 150 200" ' + INK + '><path d="M40 92L75 200M76 70L75 200M112 96L75 200" fill="none" stroke-width="1.5"/>' +
      [[40, 56], [76, 34], [112, 60]].map((b, k) =>
        '<ellipse cx="' + b[0] + '" cy="' + b[1] + '" rx="28" ry="34" fill="' + ACCENTS[(i + k) % 4] + '"/>').join("") + '</svg>';
  }
  function parkHTML(){
    let html = "", x = -1100, pics = 0, hit;
    const clear = [[-150, 250]].concat(TRACK.stops.map(s => [s - 165, s + 165]));   // nothing behind the gate or a stop's sign
    for (let i = 0; x < TRACK.end + 900; i++){
      const kind = PARK[i % PARK.length];
      while ((hit = clear.find(c => x < c[1] && x + PARK_W[kind] > c[0]))) x = hit[1] + 40;
      if (kind === "pic"){
        const tall = i % 3 === 0, w = tall ? 130 : 168, h = tall ? 162 : 126, post = [70, 210, 130, 250][i % 4];
        html += '<figure class="cz-pic" style="left:' + x + 'px;top:' + (GROUND - post - h) + 'px;width:' + w + 'px;height:' + h +
          'px;--post:' + post + 'px;--tilt:' + (i % 2 ? 3 : -2) + 'deg;' + inks(i) + '">' + photo(RIDE_PICS[pics++]) + '</figure>';
      } else if (kind === "balloons"){
        html += '<div class="cz-float" style="left:' + x + 'px;top:' + (GROUND - 590) + 'px;--d:' + -(i % 3) + 's">' + balloonsSVG(i) +
          '<figure class="cz-pic" style="' + inks(i + 1) + '">' + photo(RIDE_PICS[pics++]) + '</figure></div>';
      } else if (kind === "wheel") html += '<div class="cz-wheel" style="left:' + x + 'px;top:' + (GROUND - 360) + 'px">' + WHEEL + '</div>';
      else if (kind === "tent") html += tentSVG(x, ACCENTS[i % 4]);
      else html += flagsSVG(x, i);
      x += PARK_W[kind] + 70;
    }
    return html;
  }

  /* Three riders, arms up (they wave: .cz-arms in index.css), in a pink
     cart misprinted in blue. 140 × 116, wheels on the bottom edge. */
  const CART_SVG = (() => {
    const riders = [[30, "var(--blue)", "var(--yellow)", "var(--ink)"], [68, "var(--mint)", "var(--yellow)", "var(--pink)"],
                    [104, "var(--yellow)", "var(--mint)", "var(--blue)"]].map(r => {
      const x = r[0];
      return '<g class="cz-rider"><path class="cz-arms" d="M' + (x - 8) + ' 56L' + (x - 17) + ' 22M' + (x + 8) + ' 56L' + (x + 17) + ' 22"/>' +
        '<rect x="' + (x - 12) + '" y="44" width="24" height="26" rx="9" fill="' + r[1] + '"/>' +
        '<circle cx="' + x + '" cy="34" r="11" fill="' + r[2] + '"/>' +
        '<path d="M' + (x - 11) + ' 32a11 11 0 0 1 22 0q-11-6-22 0z" fill="' + r[3] + '"/>' +
        '<g class="cz-ink"><circle cx="' + (x - 4) + '" cy="34" r="1.7"/><circle cx="' + (x + 4) + '" cy="34" r="1.7"/>' +
        '<ellipse cx="' + x + '" cy="40.5" rx="2.6" ry="3.2"/></g></g>';
    }).join("");
    const body = "M8 62H110Q134 60 134 84Q134 100 118 100H20Q8 100 8 88Z";
    return '<svg viewBox="0 0 140 116">' + riders +
      '<path d="' + body + '" fill="var(--blue)" opacity=".6" transform="translate(4 4)" style="mix-blend-mode:multiply"/>' +
      '<path d="' + body + '" fill="var(--pink)" ' + INK + '/>' +
      '<path d="M15 80H126" stroke="var(--card)" stroke-width="4" stroke-linecap="round"/>' +
      '<g class="cz-ink"><circle cx="32" cy="106" r="9"/><circle cx="108" cy="106" r="9"/></g>' +
      '<g fill="var(--card)"><circle cx="32" cy="106" r="3"/><circle cx="108" cy="106" r="3"/></g></svg>';
  })();

  function coasterWorldHTML(){
    const t = TRACK;
    return '<div class="cz-ground" style="left:-2400px;width:' + (t.end + 4800) + 'px;top:' + GROUND + 'px"></div>' + parkHTML() +
      '<div class="cz-gate" style="height:' + (345 + GROUND) + 'px"><div class="cz-gate-sign"><b>' + esc(T("ride.title", "The Career Coaster")) +
        '</b><span>' + esc(T("ride.sub", "Keep your arms inside the cart · scroll to ride ↓")) + '</span></div></div>' +
      t.stops.map((x, i) => '<div class="cz-stop" style="left:' + x + 'px;--accent:' + JOBS[i].accent + '"><i class="cz-roof"></i><i class="cz-deck"></i>' +
        '<div class="cz-sign"><span>' + esc(T("ride.stop", "Stop")) + ' ' + pad2(i + 1) + ' · ' + esc(JOBS[i].when[LANG]) + '</span>' +
        '<b>' + esc(JOBS[i].role[LANG]) + '</b></div></div>').join("") +
      '<svg class="cz-track" width="1" height="1"><path class="cz-supports" d="' + t.supports + '"/>' +
        '<path class="cz-ties" d="' + t.all + '"/><path class="cz-rails" d="' + t.all + '"/>' +
        '<g class="cz-fill">' + t.parts.map((d, i) => '<path d="' + d + '" style="stroke:' + JOBS[i].accent + '"/>').join("") + '</g>' +
        '<path class="cz-gap" d="' + t.all + '"/></svg>' +
      '<div class="cz-cart" id="cz-cart">' + (CART_IMG ? '<img src="' + esc(CART_IMG) + '" alt="">' : CART_SVG) + '</div>';
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
        '<div class="cz-pics">' + [0, 1, 2].map(k => '<figure class="cz-polaroid" style="--accent-2: ' + ACCENTS[(a + k + 1) % 4] + '">' +
          photo(pics[k]) + '</figure>').join("") + '</div>' +
        '</div></article>';
    }).join("");
  }

  /* The ride (GSAP only). animatePage calls this inside its context, which
     reverts the pin and the tweens and then runs the cleanup returned here. */
  function initCoaster(scope){
    const root = $("#coaster", scope);
    if (!root) return;
    root.classList.add("is-ride");
    const stage = $(".coaster-stage", root), world = $("#cz-world", root), cart = $("#cz-cart", root);
    const fills = $$(".cz-fill path", root), boards = $$(".cz-board", root), signs = $$(".cz-sign", root);
    const segs = TRACK.segs, last = segs.length - 1;
    const lens = fills.map(p => p.getTotalLength()), drawn = lens.slice();
    fills.forEach((p, k) => { p.style.strokeDasharray = lens[k] + " " + (lens[k] + 2); p.style.strokeDashoffset = lens[k]; });
    const state = { pos: 0, push: 0 }, open = boards.map(() => ({ v: 0, drawn: 0 }));
    let W, H, k, ax, ay, shown = -1;

    // Where the camera keeps the cart on screen, and the circle each board opens out of (the cart)
    function measure(){
      W = stage.clientWidth; H = stage.clientHeight; k = H / 1000;
      ax = W * (W < 760 ? .26 : .34); ay = H * .6;
      const cy = ay - 60 * k;
      stage.style.setProperty("--iris-x", ax + "px");
      stage.style.setProperty("--iris-y", cy + "px");
      stage.style.setProperty("--iris-r", Math.ceil(Math.hypot(Math.max(ax, W - ax), Math.max(cy, H - cy))) + 2 + "px");
    }
    function render(){
      const i = Math.min(Math.floor(state.pos), last), p = rideAt(segs[i], state.pos - i);
      fills.forEach((el, s) => {
        const off = s < i ? 0 : s > i ? lens[s] : lens[s] * (1 - p.f);
        if (off !== drawn[s]) el.style.strokeDashoffset = drawn[s] = off;
      });
      cart.style.transform = "translate(" + p.x.toFixed(1) + "px," + p.y.toFixed(1) + "px) rotate(" + p.angle.toFixed(3) + "rad)";
      const z = k * (1 + state.push * .3);
      world.style.transform = "translate(" + (ax - p.cam * z).toFixed(1) + "px," + ay.toFixed(1) + "px) scale(" + z.toFixed(4) + ")";
      let showing = -1;
      open.forEach((o, j) => {
        if (o.v > 0) showing = j;
        if (o.v !== o.drawn) boards[j].style.setProperty("--iris", o.drawn = o.v);
      });
      world.style.visibility = showing > -1 && open[showing].v >= 1 ? "hidden" : "";   // nothing to paint under a full board
      if (showing !== shown){
        if (shown > -1) boards[shown].classList.remove("is-open");
        if (showing > -1) boards[showing].classList.add("is-open");
        shown = showing;
      }
    }

    // Per stop, in screens of scrolling: ride there; arrive (the sign pops, the camera pushes in, the
    // board opens out of the cart); the ticket and photos land; hold; close and ride on
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
      irises.push([at + S.arrive * .2, t0]);
      if (i < last){
        const leave = tl.duration() + S.hold;
        tl.to(open[i], { v: 0, duration: S.leave, ease: "power2.inOut" }, leave)
          .to(state, { push: 0, duration: S.leave, ease: "power2.inOut" }, leave);
        irises.push([leave, leave + S.leave]);
      } else tl.to({}, { duration: S.hold });
    });

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

    return () => {
      root.classList.remove("is-ride");
      world.style.transform = world.style.visibility = "";
      ["--iris-x", "--iris-y", "--iris-r"].forEach(n => stage.style.removeProperty(n));
      boards.forEach(b => { b.style.removeProperty("--iris"); b.classList.remove("is-open"); });
    };
  }

  /* =================================================================
     RENDERERS
     ================================================================= */
  function shotHTML(imgFile, parallax){
    return '<div class="shot">' +
      '<div class="art"' + (parallax ? '' : ' style="height:100%;margin-top:0"') + '>' + loadingArt(400, 250) + '</div>' +
      (imgFile ? '<img src="' + IMG_BASE + imgFile + '" alt="" loading="lazy" decoding="async" ' +
        'onload="this.classList.add(\'ready\')" onerror="this.remove()">' : '') +
      '</div>';
  }

  function rowHTML(f, idx){
    const p = PROJECTS.find(x => x.t === f.key);
    if (!p) return "";
    const accent = ACCENTS[idx % 4];
    const num = String(idx + 1).padStart(2, "0");
    let hi = "";
    if (f.metric){
      hi = '<div class="metric"><b data-count="' + f.metric.n + '" data-suffix="' + f.metric.unit + '">' +
        f.metric.n + f.metric.unit + '</b><span>' + esc(f.metric[LANG]) + '</span></div>';
    } else if (f.note){
      hi = '<p class="note">' + esc(f.note[LANG]) + '</p>';
    }
    return '<article class="row" style="--accent: ' + accent + '">' +
      '<div class="row-num">[' + num + ']</div>' +
      '<div class="row-media">' + shotHTML(p.img, true) + '</div>' +
      '<div class="row-body">' +
        '<div class="row-cat">' + esc(CATS[p.cat][LANG]) + '</div>' +
        '<h3>' + esc(p.t) + '</h3>' +
        '<p>' + esc(p[LANG]) + '</p>' + hi +
        '<div class="tags">' + p.tech.map(x => '<span class="tag">' + esc(x) + '</span>').join("") + '</div>' +
        '<a class="arrow-link" href="' + esc(p.url) + '" target="_blank" rel="noopener">' +
        '<span>' + (LANG === "af" ? "Besoek die werf" : "Visit site") + '</span><span>↗</span></a>' +
      '</div></article>';
  }

  function cardHTML(p, i){
    const accent = ACCENTS[i % 4];
    const live = p.url && p.url !== "#";
    return '<article class="card" data-cat="' + esc(p.cat) + '" style="--accent: ' + accent + '" data-anim="up">' +
      shotHTML(p.img, false) +
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
        '<div class="art" style="height:100%;margin-top:0">' + loadingArt(400, 250) + '</div>' +
        '<iframe data-src="' + esc(url) + '" title="' + esc(item[0]) + '" loading="lazy" ' +
        'sandbox="allow-scripts allow-same-origin" tabindex="-1" scrolling="no"></iframe>' +
        '<span class="poster">' + kind + '</span>' +
      '</div>' +
      '<div class="card-body">' +
        '<h4>' + esc(item[0]) + '</h4>' +
        '<p>' + esc(item[LANG === "af" ? 4 : 3]) + '</p>' +
        '<div class="tags">' + item[2].map(x => '<span class="tag">' + esc(x) + '</span>').join("") + '</div>' +
        '<a class="arrow-link" href="' + esc(url) + '" target="_blank" rel="noopener"><span>' + cta + '</span><span>↗</span></a>' +
      '</div></article>';
  }

  let frameObserver = null;
  function lazyFrames(){
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
    $("#featured-rows").innerHTML   = FEATURED.map(rowHTML).join("");
    $("#featured-rows-2").innerHTML = FEATURED.map(rowHTML).join("");

    const featuredKeys = FEATURED.map(f => f.key);
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

    $("#skills").innerHTML = SKILLS.map(g =>
      '<div class="skillgroup" style="--accent: ' + g.accent + '">' +
      '<span class="label"><b>◆</b> ' + esc(g.cat[LANG]) + '</span>' +
      '<div class="skill-chips">' + g.items.map(it => {
        const level = Math.round(it[1] / 20);
        const dots = Array.from({ length: 5 }, (_, i) => '<i class="' + (i < level ? "on" : "") + '"></i>').join("");
        return '<span class="skill-chip"><b>' + esc(it[0]) + '</b><span class="skill-lvl" role="img" aria-label="' + level + '/5">' + dots + '</span></span>';
      }).join("") + '</div>' +
      '</div>').join("");

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

  /* =================================================================
     SPLIT TEXT
     ================================================================= */
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
  let pageCtx = null;
  function animatePage(route, immediate){
    if (pageCtx){ pageCtx.revert(); pageCtx = null; }
    if (!GS || reduced) return;
    const scope = document.getElementById("page-" + route);
    if (!scope) return;

    pageCtx = gsap.context(() => {
      const EASE = "power3.out";

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

      $$('[data-anim="fade"]', scope).forEach((el, i) => {
        gsap.from(el, { y: 18, opacity: 0, duration: .7, delay: .35 + i * .08, ease: EASE });
      });

      const pw = $('[data-anim="portrait"]', scope);
      if (pw) gsap.from(pw, { scale: .94, opacity: 0, duration: 1.1, ease: EASE, delay: .1 });

      $$(".row-media .art", scope).forEach(inner => {
        gsap.fromTo(inner, { yPercent: -7 }, { yPercent: 7, ease: "none",
          scrollTrigger: { trigger: inner.parentElement, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true } });
      });

      $$(".embed-host", scope).forEach(el => {
        gsap.from(el, { y: 40, opacity: 0, duration: .9, ease: EASE,
          scrollTrigger: { trigger: el, start: "top 92%", once: true } });
      });

      $$("[data-statement]", scope).forEach(el => {
        const spans = splitWords(el);
        gsap.set(spans, { opacity: .22 });
        gsap.to(spans, { opacity: 1, ease: "none", stagger: 1,
          scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 58%", scrub: true } });
      });

      $$("[data-count]", scope).forEach(el => {
        const end = Number(el.dataset.count), suffix = el.dataset.suffix || "";
        const obj = { v: 0 };
        el.textContent = "0" + suffix;
        gsap.to(obj, { v: end, duration: 1.4, ease: "power2.out",
          onUpdate(){ el.textContent = Math.round(obj.v) + suffix; },
          scrollTrigger: { trigger: el, start: "top 94%", once: true } });
      });

      const skillChips = $$(".skill-chip", scope);
      if (skillChips.length){
        /* fromTo with explicit "to" values — a plain .from() left scale
           and rotate stuck at their start values here (opacity settled
           fine, transform never resolved), so spell out both ends. */
        gsap.fromTo(skillChips,
          { scale: .4, opacity: 0, rotate: () => gsap.utils.random(-8, 8) },
          { scale: 1, opacity: 1, rotate: 0, duration: .6, ease: "back.out(2.2)", clearProps: "transform",
            stagger: { each: .025, from: "random" },
            scrollTrigger: { trigger: "#skills", start: "top 85%", once: true } });
      }

      // the Career Coaster (About only); its cleanup runs when this context reverts
      return initCoaster(scope);
    }, scope);

    ScrollTrigger.refresh();
  }

  let marqueeTween = null;
  function startMarquee(){
    if (!GS || reduced || marqueeTween) return;
    marqueeTween = gsap.to("#marquee", { xPercent: -50, duration: 78, ease: "none", repeat: -1 });
    ScrollTrigger.create({
      onUpdate(self){
        const v = self.getVelocity(), dir = v < 0 ? -1 : 1;
        gsap.to(marqueeTween, { timeScale: dir * gsap.utils.clamp(1, 2.4, 1 + Math.abs(v) / 1500), duration: .4, overwrite: true });
      }
    });
  }
  function startProgress(){
    if (!GS) return;
    gsap.to("#progress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: .3 } });
  }

  /* =================================================================
     FOOTER BOUNCE
     https://demos.gsap.com/demo/footer-bounce/ — a wavy divider that
     kicks based on scroll velocity, same getVelocity()/clamp/overwrite
     idiom as startMarquee() above. The two path states share identical
     command structure (M C C C C L L Z), so a plain attr tween
     interpolates the numbers directly — no MorphSVGPlugin needed.
     ================================================================= */
  function startFooterBounce(){
    if (!GS || reduced) return;
    const path = $("#footer-wave-path");
    if (!path) return;
    const BASE = 30;
    const wave = (m1, m2, m3, m4) => {
      const y = (m) => gsap.utils.clamp(6, BASE, BASE - m).toFixed(1);
      return "M0," + BASE +
        " C150," + y(m1) + " 150," + y(m1) + " 300," + BASE +
        " C450," + y(m2) + " 450," + y(m2) + " 600," + BASE +
        " C750," + y(m3) + " 750," + y(m3) + " 900," + BASE +
        " C1050," + y(m4) + " 1050," + y(m4) + " 1200," + BASE +
        " L1200," + BASE + " L0," + BASE + " Z";
    };
    const flat = wave(0, 0, 0, 0);
    let settleTimer;
    ScrollTrigger.create({
      trigger: "footer", start: "top bottom", end: "bottom top",
      onUpdate(self){
        const amp = gsap.utils.clamp(0, 20, Math.abs(self.getVelocity()) / 100);
        gsap.to(path, {
          attr: { d: wave(amp, amp * .7, amp * .9, amp * .6) },
          duration: .5, ease: "elastic.out(1, 0.3)", overwrite: true
        });
        /* onUpdate only fires while the scroll position is still moving,
           so without this the wave freezes mid-bounce once scrolling stops. */
        clearTimeout(settleTimer);
        settleTimer = setTimeout(() => {
          gsap.to(path, { attr: { d: flat }, duration: .6, ease: "elastic.out(1, 0.35)", overwrite: true });
        }, 120);
      }
    });
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
  /* fullBleed: host already spans the full viewport width (.fx-bleed in
     index.css), so listening on `page` — still only as wide as the
     1280px .shell — would miss pointer moves out in the margins. Listen
     on the document instead and gate bursts by the host's own vertical
     bounds, which still track the section correctly since only its
     width broke out of the shell, not its height. */
  function initShapeFx(host, page, fullBleed){
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

    (fullBleed ? document : page).addEventListener("pointermove", e => {
      if (e.pointerType !== "mouse") return;
      if (fullBleed){
        const b = host.getBoundingClientRect();
        if (e.clientY < b.top || e.clientY > b.bottom) return;
      }
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
    en: ["A Programmer","Poster Sexy","A Bug Slayer","Always Hungry","An Unpaid Comedian","A Follower Of Christ"],
    af: ["'n Programmeerder","Poster Sexy","'n Foutjagter","Altyd Honger","'n Onbetaalde Komediant","'n Volgeling Van Christus"]
  };
  const brandWord = $("#brand-word"), brandIcons = $$(".brand-icon img"), bubble = $("#bat-bubble");
  const BATMAN = brandIcons.length - 1;
  const SPIN = [1, 2, 3, 4, 0, 1, 2, 3, 4, BATMAN];
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
  function setTitle(){ document.title = TITLES[current][LANG === "af" ? 1 : 0]; }

  function applyRoute(route){
    current = route;
    ROUTES.forEach(r => { $("#page-" + r).hidden = (r !== route); });
    $$("[data-route]").forEach(a => {
      if (a.dataset.route === route) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    setTitle();
    if (route === "portfolio") requestAnimationFrame(sizeDoodle);
    lazyFrames();
    initEmbeds();
    animatePage(route);
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

  function go(route, scroll){
    if (ROUTES.indexOf(route) === -1) route = "portfolio";
    if (GS && !reduced && route !== current) return wipeTo(route, scroll);
    if (scroll) scrollTo({ top: 0, behavior: "auto" });
    if (document.startViewTransition && !reduced) document.startViewTransition(() => applyRoute(route));
    else applyRoute(route);
  }
  addEventListener("hashchange", () => go((location.hash || "#portfolio").replace("#",""), true));

  /* =================================================================
     BOOT
     ================================================================= */
  applyLang();
  applyRoute((location.hash || "#portfolio").replace("#",""));
  sizeDoodle();
  startMarquee();
  startProgress();
  startFooterBounce();
  initShapeFx($("#contact-fx"), $("#page-contact"));
  initShapeFx($("#skills-fx"), $("#skills-tinted"));
  initShapeFx($("#work-fx"), $("#work-live"), true);
  initShapeFx($("#proj-live-fx"), $("#proj-live"), true);
  $$(".band-fx").forEach(fx => initShapeFx(fx, fx.closest(".band")));

  /* Loader: lift once the page has loaded, but not before 0.7s from
     navigation (a beat, not a flicker) and never after 2.5s (one slow
     asset shouldn't hold the page hostage). The intro replays as it
     lifts, so it isn't spent behind the panel. */
  const loader = $("#loader");
  if (loader){
    let lifted = false;
    const lift = () => {
      if (lifted) return;
      lifted = true;
      loader.classList.add("out");
      animatePage(current);
      setTimeout(() => loader.remove(), 900);
    };
    addEventListener("load", () => setTimeout(lift, Math.max(0, 700 - performance.now())));
    setTimeout(lift, 2500);
  }

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (GS) ScrollTrigger.refresh(); });
  addEventListener("load", () => { sizeDoodle(); initEmbeds(); if (GS) ScrollTrigger.refresh(); });
})();
