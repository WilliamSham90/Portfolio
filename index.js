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
    "nav.portfolio":"Portefeulje","nav.about":"Oor My","nav.projects":"Projekte","nav.play":"Speelgrond","nav.contact":"Kontak",
    "drawer.title":"Kieslys",
    "hero.status":"Oop vir vryskutwerk",
    "hero.sub":"Full-stack ontwikkelaar. Ek bou vinnige, versigtige webwerwe — skema tot laaste pixel.",
    "hero.tag":"Senior Webontwikkelaar · LKDA, Pretoria",
    "doodle.hint":"Sleep hier agter om te teken","doodle.clear":"Vee uit","doodle.touch":"Tekenmodus: af",
    "portrait.hint":"klik om agtergrond te verander",
    "cta.work":"Sien die werk","cta.touch":"Kom ons gesels","cta.allProjects":"Al 35 projekte",
    "cta.startChat":"Begin 'n gesprek →","cta.cv":"Vra vir my CV","cta.ask":"Vra my →",
    "cta.hire":"Huur my →","cta.idea":"Vertel my die idee →",
    "stat.years":"Jaar wat ek vir die web bou","stat.projects":"Projekte voltooi",
    "stat.live":"Lewendige werwe in hierdie portefeulje","stat.tech":"Tegnologieë in omloop",
    "home.workEyebrow":"Uitgesoekte werk","home.workTitle":"Werk wat lewendig gegaan het",
    "home.statement":"Ek neem produkte van 'n halfgetekende idee op 'n oproep tot iets lewendig, vinnig en onderhoubaar — getikte API's, sinvolle databasisse, en koppelvlakke wat mense werklik geniet om te gebruik.",
    "home.processEyebrow":"Hoe ek werk","home.processTitle":"Kort, vervelig, betroubaar",
    "step.1n":"01 / OMVANG","step.1t":"Verstaan voordat jy bou",
    "step.1p":"Eers vrae, dan 'n klikbare skets en 'n geskrewe omvang. Jy keur die vorm van die ding goed voordat enigiemand 'n migrasie skryf.",
    "step.2n":"02 / BOU","step.2t":"Lewer in snye",
    "step.2p":"Twee weke per sny, elkeen ontplooibaar. Jy kry vroeg 'n staging-skakel en wonder nooit waarmee ek besig was nie.",
    "step.3n":"03 / OORHANDIG","step.3t":"Los dit werkend",
    "step.3p":"Toetse, 'n README wat op 'n nuwe skootrekenaar werk, CI wat by samesmelting ontplooi, en 'n deurloop vir wie ook al dit erf.",
    "band.homeTitle":"Iets halfgebou, of nog nie begin nie?",
    "band.homeText":"Ek neem vryskutwerk aan naas my dagtaak by LKDA. Vertel my wat jy probeer maak.",
    "live.eyebrow":"Lewendige voorskou","live.title":"Williams OS, lewendig hier onder","live.title2":"Williams OS",
    "live.open":"Maak volgrootte oop",
    "live.copy":"Williams OS, wat lewendig in die raam hieronder loop. Dit is die werklike werf, dus pas dit homself aan by watter breedte dit ook al kry — wyd op 'n rekenaar, en sy eie mobiele uitleg wanneer jy hierdie bladsy op 'n foon oopmaak.",
    "live.copy2":"Williams OS, wat lewendig in die raam hieronder loop teen watter breedte dit ook al kry. Maak dit volgrootte oop vir die regte ding.",
    "live.p1":"Laai outomaties wanneer jy daarby scroll",
    "live.p2":"Sandboxed",
    "live.p3":"Responsief, nie geskaal nie",
    "about.eyebrow":"Oor My","about.title":"Kreatiwiteit en kode, in daardie volgorde",
    "about.p1":"Hallo, ek is William — 'n passievolle full-stack ontwikkelaar wat floreer by die kruispunt van kreatiwiteit en kode. Met ervaring oor verskeie industrieë het ek geleer dat die beste oplossings kom van die verstaan van beide die tegniese vereistes en die menslike ervaring.",
    "about.p2":"My reis in tegnologie het my toegerus met 'n veelsydige vaardigheidstel: van die skep van pixel-perfekte frontends met moderne JavaScript-raamwerke tot die ontwerp van robuuste backend-stelsels. Wanneer ek nie kodeer nie, sal jy my vind wat 3D-modellering en spelontwikkeling verken.",
    "about.p3":"Ek is in Krugersdorp, Gauteng, en tans Senior Webontwikkelaar by LKDA in Pretoria.",
    "about.toolbox":"Die gereedskapkis",
    "skills.eyebrow":"Vaardighede","skills.title":"Waarvoor ek gryp",
    "exp.eyebrow":"Ervaring","exp.title":"Waar ek was",
    "band.aboutTitle":"Wil jy die detail agter enige hiervan hê?",
    "band.aboutText":"Argitektuur, afwegings en die dele wat skeefgeloop het — ek loop dit graag met jou deur.",
    "proj.eyebrow":"Projekte · 2021—2026","proj.title":"Vyf-en-dertig werwe, nou lewendig",
    "proj.sub":"Korporatiewe platforms, multi-mark motorwerwe, e-handelswinkels, Laravel-stelsels en speletjie-mods.",
    "proj.all":"Alles anders","proj.none":"Niks in daardie kategorie nie — probeer 'n ander filter.",
    "band.projTitle":"Drie Nissan-markte en tel nog",
    "band.projText":"Korporatiewe WordPress op skaal, Laravel-platforms, Perfex CRM-modules en heelwat Radiant. Joune kan volgende wees.",
    "play.eyebrow":"Speelgrond","play.title":"Dinge wat ek op 'n Sondag gebou het",
    "play.intro":"Eksperimente, widgets en speletjies, almal selfstandig en loop op hul eie bladsye.",
    "play.pages":"Bladsye","play.games":"Speletjies",
    "band.playTitle":"Die meeste hiervan het as 'n fout begin",
    "band.playText":"As jy enige van hulle behoorlik gebou wil hê, of 'n vreemder idee het, luister ek.",
    "contact.eyebrow":"Kontak","contact.title":"Kom ons kyk of dit 'n pas is",
    "contact.status":"Oop vir vryskutwerk","contact.direct":"Direkte lyne",
    "contact.email":"E-pos","contact.phone":"Telefoon","contact.loc":"Ligging",
    "contact.locVal":"Krugersdorp, Gauteng, Suid-Afrika","contact.tz":"Tydsone","contact.faq":"Voordat jy skryf",
    "form.name":"Jou naam","form.email":"E-pos","form.subject":"Onderwerp",
    "form.msg":"Wat probeer jy bou?","form.send":"Stuur boodskap →",
    "form.note":"Stuur na jou FormSubmit-eindpunt sodra dit op jou eie gasheer is.",
    "faq.q1":"Is jy nou beskikbaar?",
    "faq.a1":"Ek is voltyds by LKDA, so vryskutwerk gebeur saans en naweke. Dit beteken ek neem minder projekte aan maar voltooi dié wat ek begin.",
    "faq.q2":"Waaraan werk jy die meeste?",
    "faq.a2":"WordPress- en Laravel-bouwerk, Umbraco en Perfex CRM, Azure-hosting en werkverrigting-reddings. Enigiets van 'n landingsblad tot 'n multi-mark korporatiewe platform.",
    "faq.q3":"Doen jy ook 3D- en speletjiewerk?",
    "faq.a3":"Ja — Blender, Maya, Unreal en Radiant. Ek het pasgemaakte Call of Duty zombie-kaarte en mod-gereedskap na die Steam Workshop gestuur.",
    "foot.built":"Met die hand gebou · GSAP"
  };

  let LANG = store("ws-lang") === "af" ? "af" : "en";
  const T = (key, en) => (LANG === "af" && AF[key]) ? AF[key] : en;

  function applyLang(){
    $$("[data-i18n]").forEach(el => {
      if (el.dataset.en === undefined) el.dataset.en = el.textContent;
      el.textContent = (LANG === "af" && AF[el.dataset.i18n]) ? AF[el.dataset.i18n] : el.dataset.en;
      delete el.dataset.raw;
    });
    $("#lang").textContent = LANG === "af" ? "AF" : "EN";
    document.documentElement.lang = LANG;
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
      'loading="eager" decoding="async" onerror="this.remove()">';
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
      tb.textContent = (LANG === "af" ? "Tekenmodus: " : "Draw mode: ") + (touchDraw ? "on" : "off");
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
          '<iframe data-src="' + esc(src) + '" title="' + esc(label) + ' — live preview" ' +
            'sandbox="allow-scripts allow-same-origin allow-popups allow-forms" ' +
            'referrerpolicy="no-referrer-when-downgrade"></iframe>' +
        '</div>' +
      '</div>' +
      '<p class="embed-caption">' + esc(label) + ' · ' + esc(host) + '</p>';

    const frame = $(".embed-stage iframe", el);
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

  const RAW = [
    ["LKDA — Strategic Creative Advertising","lara","Lkda.png","https://www.lkda.co.za/",["Laravel","Umbraco","CMS"],"Creative advertising agency website","Kreatiewe advertensie-agentskap webwerf"],
    ["ATP","corp","ATPsite.png","https://amplifytradepartners.co.za/",["WordPress","PHP","SEO"],"Amplify Trade Partners website","Amplify Trade Partners webwerf"],
    ["3D Lazer Monkey","corp","3D%20lasermonkey.png","https://3dlasermonkey.co.za/",["WordPress","3D"],"3D printing and laser cutting services","3D-druk en lasersnydienste"],
    ["Nissan South Africa","auto","NissanSA.png","https://www.nissan.co.za/",["WordPress","PHP","SEO"],"Official Nissan South Africa website","Amptelike Nissan Suid-Afrika webwerf"],
    ["Nissan Angola","auto","NissanAngola.png","https://www.nissan.co.ao/",["WordPress","PHP"],"Official Nissan Angola website","Amptelike Nissan Angola webwerf"],
    ["Nissan Uganda","auto","NissanUganda.png","https://www.nissan.co.ug/",["WordPress","PHP"],"Official Nissan Uganda website","Amptelike Nissan Uganda webwerf"],
    ["Chery South Africa","auto","cherry%20South%20africa.png","https://www.chery.co.za/",["WordPress","PHP"],"Official Chery South Africa website","Amptelike Chery Suid-Afrika webwerf"],
    ["Afrit","corp","afrit.png","https://afrit.co.za/",["WordPress","PHP"],"Trailer manufacturing company website","Sleepwa-vervaardigingsmaatskappy webwerf"],
    ["Safal Steel","corp","Safalsteel.png","https://www.safalsteel.com/",["WordPress","PHP"],"Steel manufacturing company website","Staalvervaardigingsmaatskappy webwerf"],
    ["Mega Master SA","shop","Megamaster.png","https://megamaster.co.za/",["WordPress","E-commerce"],"BBQ and outdoor products e-commerce","Braai en buite-produkte e-handel"],
    ["First 4 Men","corp","First4Men.png","https://first4men.co.za/",["WordPress","PHP"],"Men's health and wellness website","Mans gesondheid en welstand webwerf"],
    ["Gridcontrol","energy","Gridcontroll.png","https://www.gridcontrol.co.za/",["WordPress","PHP"],"Power solutions company website","Kragoplossings maatskappy webwerf"],
    ["Blueasset Group","corp","Blueasset.png","https://blueassetgroup.com/za",["WordPress","PHP"],"Asset management company website","Batebestuur maatskappy webwerf"],
    ["Pinaroch","lara","Pinaroch.png","https://pinaroch.co.za/",["Laravel","PHP","Middleware"],"Construction company website","Konstruksiemaatskappy webwerf"],
    ["MyBuildings Africa","lara","My%20buildings%20africa.png","https://mybuildingsafrica.com/",["Laravel","CMS"],"Property management platform","Eiendomsbestuur platform"],
    ["myBuildings EMEA","lara","My%20buildings%20emea.png","https://mybuildingsemea.com/",["Laravel","CMS"],"Property management platform, EMEA","Eiendomsbestuur platform EMEA"],
    ["Goscor Group","corp","Goscor%20group.png","https://goscor.co.za/",["WordPress","Multi-site"],"Industrial equipment group website","Industriële toerusting groep webwerf"],
    ["Goscor Earth Moving","corp","Goscor%20earth%20moving.png","https://www.goscorearthmoving.co.za/",["WordPress","PHP"],"Earth moving equipment website","Grondverskuiwingstoerusting webwerf"],
    ["Goscor Lift Trucks","corp","Goscor%20lift%20trucks.png","https://goscorlifttrucks.co.za/",["WordPress","PHP"],"Forklift solutions website","Vurkhyser oplossings webwerf"],
    ["Goscor Compressed Air","corp","Goscor%20compressed%20air.png","https://www.goscorcompressedair.co.za/",["WordPress","PHP"],"Compressed air solutions website","Saamgeperste lug oplossings webwerf"],
    ["Goscor Cleaning","corp","Goscor%20cleaning.png","https://goscorcleaning.co.za/",["WordPress","PHP"],"Industrial cleaning equipment website","Industriële skoonmaaktoerusting webwerf"],
    ["CTU Training","corp","CTU%20training.png","https://ctutraining.ac.za/",["WordPress","Education"],"IT training institution website","IT-opleidingsinstelling webwerf"],
    ["HEX","corp","Hex.png","https://hexintegratedsolutions.com/",["WordPress","PHP"],"Integrated solutions company website","Geïntegreerde oplossings maatskappy webwerf"],
    ["Real Box","corp","Realbox.png","https://realbox.co.za/",["WordPress","PHP"],"Container solutions website","Houer oplossings webwerf"],
    ["Commercial PV","energy","CommercialPV.png","https://commercialpv.co.za/",["WordPress","Solar"],"Commercial solar solutions website","Kommersiële sonkrag oplossings webwerf"],
    ["Battery Distributors","shop","batterydis.png","https://batterydistributors.co.za/",["WordPress","E-commerce"],"Battery products e-commerce store","Battery produkte e-handel winkel"],
    ["Rectifier","energy","rectifier.png","https://rectifier.co.za/",["WordPress","PHP"],"Power electronics company website","Krag-elektronika maatskappy webwerf"],
    ["Go4Green","energy","go4green.png","https://go4greenenergy.co.za/",["WordPress","Green Energy"],"Green energy solutions website","Groen energie oplossings webwerf"],
    ["Current Automation","shop","Current%20automation.png","https://currentautomation.ca/",["WordPress","E-commerce"],"Industrial automation e-commerce","Industriële outomatisering e-handel"],
    ["CA's Meanwell","shop","CA%20meanwell.png","https://meanwell.co.za/",["WordPress","E-commerce"],"Power supply products e-commerce","Kragtoevoer produkte e-handel"],
    ["Solar-Solution","energy","Solar%20solutions.png","https://solar-solution.co.za/",["WordPress","Solar"],"Solar energy solutions website","Sonkrag oplossings webwerf"],
    ["Victron Products","shop","Victron.png","https://victronproducts.co.za/",["WordPress","E-commerce"],"Victron energy products e-commerce","Victron energie produkte e-handel"],
    ["COD BO3 Crash Bandicoot","game","Crash%20bandicoot.png","https://steamcommunity.com/sharedfiles/filedetails/?id=3234555216",["Radiant","Game Dev"],"Custom zombie map on Steam Workshop","Pasgemaakte zombie kaart op Steam Workshop"],
    ["Forgotten Room 115","game","forgotten%20room%20115.png","https://steamcommunity.com/sharedfiles/filedetails/?id=3326520485",["Radiant","3D Modeling"],"Custom COD BO3 zombie map with unique mechanics","Pasgemaakte COD BO3 zombie kaart met unieke meganika"],
    ["COD BO3 Mod Tools Super","game","discorcod.png","#",["Mods","3D Models","Scripts"],"Custom COD BO3 zombie mods, scripts and 3D models","Pasgemaakte COD BO3 zombie Mods, Skrifte, 3D modelle"]
  ];

  const PROJECTS = RAW.map((p, i) => ({ i, t:p[0], cat:p[1], img:p[2], url:p[3], tech:p[4], en:p[5], af:p[6] }));

  const FEATURED = [
    { key:"Mega Master SA", note:{ en:"BBQ & outdoor products, built on WordPress", af:"Braai- en buiteprodukte, gebou op WordPress" } },
    { key:"3D Lazer Monkey", note:{ en:"3D printing and laser cutting, start to finish", af:"3D-druk en lasersny, van begin tot einde" } },
    { key:"Current Automation", metric:{ n:1500, unit:"+", en:"products loaded into the store", af:"produkte in die winkel gelaai" } },
    { key:"Afrit", note:{ en:"Trailer manufacturer's full corporate site", af:"Sleepwa-vervaardiger se volledige korporatiewe werf" } }
  ];

  const PAGES = [
    ["buddy terminal","buddyterminal.html",["Tamagotchi","commands","Interactive"],"Hatch your own pet, interact and see how it creates code and so much more.","Hou jou eie troeteldier, interaksie en kyk hoe dit kode skep en soveel meer."],
    ["Hacklab","Hacklab.html",["HackLab","Hacking","Beginners"],"Learn to hack web apps through 10 fun mini challenges built for beginners.","Leer om webapps te hack deur 10 pret mini-uitdagings vir beginners."],
    ["Pattern Assessment","patternassesment.html",["Secure","Patterns","Live"],"A secure way to pass data between windows using only HTML and JavaScript.","'n Veilige manier om data tussen vensters oor te dra deur slegs HTML en JavaScript te gebruik."],
    ["CSS Filter Showcase","Filterlab.html",["CSS","Filters","Interactive"],"Every CSS filter function — visualised. Click any card to copy the code.","Elke CSS-filterfunksie — gevisualiseer. Klik enige kaart om die kode te kopieer."],
    ["Particle Generator Showcase","ParticleGen.html",["Particle","Themes","Interactive"],"Create your own particles and copy them for your project.","Skep jou eie deeltjies en kopieer dit vir jou projek."],
    ["Text Motion Showcase","TextMotion.html",["Text","CSS","Animation"],"Hover cards to preview · click copy to grab the CSS and JS.","Beweeg kaarte om 'n voorskou te kry · klik op kopieer om CSS + JS te kry."],
    ["Demo Dashboard","demodash.html",["HTML","Visual","Dashboard"],"Just for show: a fun and modern-looking dashboard.","Net vir vertoon: 'n prettige en modern-uitziende dashboard."]
  ];

  const GAMES = [
    ["2048","2048-master/index.html",["Puzzle","Classic","GitHub"],"The original sliding tile puzzle — join the numbers to reach 2048. Sourced from gabrielecirulli's open-source repo on GitHub.","Die oorspronklike skuif-teël-legkaart — voeg die getalle saam om by 2048 uit te kom. Kom van gabrielecirulli se oopbron-bewaarplek op GitHub."],
    ["Minesweeper","minesweeper.html",["Puzzle","Classic","JavaScript"],"Classic minesweeper game with multiple difficulty levels.","Klassieke mynveer-speletjie met verskeie moeilikheidsgrade."],
    ["Platformer","platformer.html",["Action","Platform","Canvas"],"Side-scrolling platformer with challenging obstacles.","Sy-rollende platform met uitdagende hindernisse."],
    ["Pong","pong.html",["Arcade","Classic","Multiplayer"],"The classic arcade game — play against AI or a friend.","Die klassieke arcade-speletjie — speel teen KI of 'n vriend."],
    ["Snake Game","snake_game.html",["Arcade","Classic","JavaScript"],"Guide the snake to eat and grow without hitting walls.","Lei die slang om te eet en te groei sonder om mure te tref."],
    ["Tower Blocks","tower_blocks.html",["Puzzle","Stacking","Skill"],"Stack blocks as high as you can — precision required.","Stapel blokke so hoog as moontlik — presisie vereis."],
    ["Word Guess","word_guess.html",["Word","Puzzle","Brain"],"Guess the hidden word before running out of attempts.","Raai die verborge woord voordat pogings opraak."],
    ["Slots","slots.html",["Luck","Skill","Fun"],"Play a custom slot machine created by me.","Speel 'n unieke slotmasjien speletjie gemaak deur my."]
  ];

  const SKILLS = [
    { cat:{ en:"Frontend", af:"Voorkant" }, accent:"var(--pink)", items:[
      ["JavaScript",90],["HTML / CSS",95],["React.js",85],["WordPress / Shopify",90]] },
    { cat:{ en:"Backend", af:"Agterkant" }, accent:"var(--blue)", items:[
      ["PHP / Laravel",90],["Umbraco CMS",85],["SQL / Databases",85],["C# / ASP.NET",80],
      ["ASP.NET Hybrid & Windows Apps",80],["Java / C++",75]] },
    { cat:{ en:"Cloud & DevOps", af:"Wolk & DevOps" }, accent:"var(--mint)", items:[
      ["Git Version Control",90],["Microsoft Azure",85],["Azure DevOps",80],["Google Cloud",75]] },
    { cat:{ en:"Design & Tools", af:"Ontwerp & Gereedskap" }, accent:"var(--yellow)", items:[
      ["Figma / UI Design",85],["Adobe Photoshop",80],["Unreal / Unity",75],["Blender / Maya",70]] }
  ];

  const JOBS = [
    { when:{ en:"Sept 2024 — Present", af:"Sept 2024 — Huidig" }, now:true, accent:"var(--pink)",
      role:{ en:"Senior Web Developer", af:"Senior Web Ontwikkelaar" },
      where:"LKDA — Strategic Creative Advertising, Pretoria",
      d:{ en:"Lead full-stack website development and maintenance, server infrastructure management, and UI/UX development.",
          af:"Lei full-stack webwerfontwikkeling en -instandhouding, bedienerinfrastruktuurbestuur, en UI/UX-ontwikkeling." },
      wins:{ en:["Led transformation of LKDA's global digital library application",
                 "Optimized the Nissan SA website, reducing load time by 5 seconds",
                 "Created a multi-database connector plugin"],
             af:["Gelei transformasie van LKDA se wêreldwye digitale biblioteektoepassing",
                 "Nissan SA-webwerf geoptimaliseer, laaityd met 5 sekondes verminder",
                 "Multi-databasis-koppelaar-inprop geskep"] },
      tech:["PHP","Laravel","JavaScript","WordPress","Shopify","Azure"] },
    { when:{ en:"Mar 2023 — Aug 2024", af:"Mrt 2023 — Aug 2024" }, accent:"var(--blue)",
      role:{ en:"Web Developer", af:"Web Ontwikkelaar" },
      where:"Silverstone Group, Centurion",
      d:{ en:"Full-stack web development, Perfex CRM modules, business solutions development, and e-commerce platform creation.",
          af:"Full-stack webontwikkeling, Perfex CRM-modules, besigheidsoplossings-ontwikkeling, en e-handelsplatform-skepping." },
      wins:{ en:["Developed 15+ custom Perfex CRM modules","Built a WhatsApp chatbot integration"],
             af:["15+ pasgemaakte Perfex CRM-modules ontwikkel","WhatsApp-kletsbotintegrasie gebou"] },
      tech:["PHP","JavaScript","Perfex CRM","MySQL"] },
    { when:{ en:"2021 — 2022", af:"2021 — 2022" }, accent:"var(--mint)",
      role:{ en:"Freelance Developer", af:"Vryskut Ontwikkelaar" },
      where:{ en:"Self-Employed", af:"Selfstandig" },
      d:{ en:"Built custom websites and web applications for various clients. Focused on WordPress development, custom themes, and e-commerce solutions.",
          af:"Pasgemaakte webwerwe en webtoepassings vir verskeie kliënte gebou. Gefokus op WordPress-ontwikkeling, pasgemaakte temas, en e-handelsoplossings." },
      wins:{ en:[], af:[] },
      tech:["WordPress","WooCommerce","PHP","JavaScript"] }
  ];

  const STACK = ["JavaScript","React","Vue.js","PHP","Laravel","C#","ASP.NET","Blazor Hybrid","Java","C++","SQL",
    "Microsoft Azure","Azure DevOps","Git","Unreal Engine 4","Unity","Radiant","WordPress","Shopify","Wix","Webflow",
    "Perfex CRM","Umbraco","Photoshop","Figma","Blender","Maya","SEO","Search Console","Canva","Spline"];
  $("#marquee").innerHTML = STACK.concat(STACK).map(s => "<span>" + s + "</span>").join("");
  $("#cloud").innerHTML = STACK.map(s => "<span>" + esc(s) + "</span>").join("");

  /* =================================================================
     RENDERERS
     ================================================================= */
  function shotHTML(imgFile, parallax){
    return '<div class="shot">' +
      '<div class="art"' + (parallax ? '' : ' style="height:100%;margin-top:0"') + '>' + loadingArt(400, 250) + '</div>' +
      (imgFile ? '<img src="' + IMG_BASE + imgFile + '" alt="" loading="lazy" decoding="async" onerror="this.remove()">' : '') +
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
        '<span>' + (LANG === "af" ? "Besoek werf" : "Visit site") + '</span><span>↗</span></a>' +
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
            (LANG === "af" ? "Besoek werf" : "Visit site") + '</span><span>↗</span></a>'
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
    frameObserver = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const f = en.target, src = f.dataset.src;
        if (src && !f.src){ revealWhenEmbedded(f); f.src = src; }
        frameObserver.unobserve(f);
      });
    }, { rootMargin: "150px 0px", threshold: .05 });
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
      liveCardHTML(p, i, PAGE_BASE, "Page", LANG === "af" ? "Bekyk bladsy" : "View page")).join("");
    $("#games-grid").innerHTML = GAMES.map((g, i) =>
      liveCardHTML(g, i + 9, GAME_BASE, "Game", LANG === "af" ? "Speel speletjie" : "Play game")).join("");

    $("#skills").innerHTML = SKILLS.map(g =>
      '<div class="skillgroup" style="--accent: ' + g.accent + '">' +
      '<span class="label"><b>◆</b> ' + esc(g.cat[LANG]) + '</span>' +
      '<div class="skill-chips">' + g.items.map(it => {
        const level = Math.round(it[1] / 20);
        const dots = Array.from({ length: 5 }, (_, i) => '<i class="' + (i < level ? "on" : "") + '"></i>').join("");
        return '<span class="skill-chip"><b>' + esc(it[0]) + '</b><span class="skill-lvl">' + dots + '</span></span>';
      }).join("") + '</div>' +
      '</div>').join("");

    $("#timeline").innerHTML = JOBS.map(j => {
      const where = typeof j.where === "string" ? j.where : j.where[LANG];
      const wins = j.wins[LANG];
      return '<article class="job" style="--accent: ' + j.accent + '" data-anim="up">' +
        '<div class="job-top"><span class="job-when">' + esc(j.when[LANG]) + '</span>' +
        (j.now ? '<span class="now">' + (LANG === "af" ? "Huidig" : "Current") + '</span>' : '') + '</div>' +
        '<h3>' + esc(j.role[LANG]) + '</h3>' +
        '<div class="where">' + esc(where) + '</div>' +
        '<p>' + esc(j.d[LANG]) + '</p>' +
        (wins.length ? '<ul class="wins">' + wins.map(w => '<li>' + esc(w) + '</li>').join("") + '</ul>' : '') +
        '<div class="tags">' + j.tech.map(x => '<span class="tag">' + esc(x) + '</span>').join("") + '</div>' +
        '</article>';
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
        gsap.from(el, { y: 32, opacity: 0, duration: .75, ease: EASE,
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
          { scale: 1, opacity: 1, rotate: 0, duration: .6, ease: "back.out(2.2)",
            stagger: { each: .025, from: "random" },
            scrollTrigger: { trigger: "#skills", start: "top 85%", once: true } });
      }

      const spine = $(".tl-line", scope);
      if (spine){
        gsap.fromTo(spine, { scaleY: 0 }, { scaleY: 1, ease: "none",
          scrollTrigger: { trigger: spine.parentElement, start: "top 80%", end: "bottom 70%", scrub: true } });
      }

      /* Time scroll: each job dot dims/lights/settles as the spine's
         progress reaches, sits on, then passes it — a playhead moving
         down the timeline rather than a one-shot fade-in. */
      $$(".job", scope).forEach(job => {
        ScrollTrigger.create({
          trigger: job, start: "top 55%", end: "bottom 45%",
          onEnter: () => job.classList.add("tl-active"),
          onEnterBack: () => { job.classList.add("tl-active"); job.classList.remove("tl-done"); },
          onLeave: () => { job.classList.remove("tl-active"); job.classList.add("tl-done"); },
          onLeaveBack: () => job.classList.remove("tl-active", "tl-done")
        });
      });
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
      $("#e-email").textContent = LANG === "af" ? "Daardie adres lyk nie reg nie." : "That address doesn't look right."; ok = false;
    }
    if (msg.value.trim().length < 12){
      $("#e-msg").textContent = LANG === "af" ? "'n Paar woorde meer sal help." : "A few more words would help."; ok = false;
    }
    if (!ok){ toast(LANG === "af" ? "Drie velde kort aandag" : "Three fields need a look"); return; }

    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = LANG === "af" ? "Stuur…" : "Sending…";
    btn.disabled = true;

    let delivered = false;
    try{
      const res = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      delivered = res.ok;
    } catch (err){ delivered = false; }

    const first = esc(name.value.trim().split(" ")[0]);
    $("#form-card").innerHTML =
      '<div class="sent"><div class="sent-mark" aria-hidden="true">✓</div>' +
      '<h3 style="font-size:clamp(1.5rem,1.25rem + 1.2vw,2.2rem)">' + (LANG === "af" ? "Dankie, " : "Thanks, ") + first + '</h3>' +
      '<p class="prose">' + (delivered
        ? (LANG === "af" ? "Jou boodskap is gestuur — ek antwoord gewoonlik binne een werksdag."
                         : "Your message is on its way. I usually reply within one working day.")
        : (LANG === "af" ? "Die vorm kon nie die eindpunt van hierdie voorskou af bereik nie — dit sal werk sodra die werf op jou eie gasheer loop."
                         : "The form couldn't reach the endpoint from this preview sandbox — it will post normally once the site is on your own host.")) +
      '</p><a class="btn btn-line btn-sm" href="#portfolio">' + (LANG === "af" ? "Terug na tuis" : "Back to the start") + '</a></div>';
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
    drawer.classList.toggle("open", open);
    scrim.classList.toggle("open", open);
    drawer.setAttribute("aria-hidden", String(!open));
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
     ROUTING
     ================================================================= */
  const ROUTES = ["portfolio","about","projects","play","contact"];
  const TITLES = {
    portfolio:"William Sham Portfolio", about:"About · William Sham",
    projects:"Projects · William Sham", play:"Playground · William Sham", contact:"Contact · William Sham"
  };
  let current = "portfolio";

  function applyRoute(route){
    current = route;
    ROUTES.forEach(r => { $("#page-" + r).hidden = (r !== route); });
    $$("[data-route]").forEach(a => {
      if (a.dataset.route === route) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    document.title = TITLES[route];
    if (route === "portfolio") requestAnimationFrame(sizeDoodle);
    lazyFrames();
    initEmbeds();
    animatePage(route);
  }
  function go(route, scroll){
    if (ROUTES.indexOf(route) === -1) route = "portfolio";
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
  initShapeFx($("#work-fx"), $("#work-live"));

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (GS) ScrollTrigger.refresh(); });
  addEventListener("load", () => { sizeDoodle(); initEmbeds(); if (GS) ScrollTrigger.refresh(); });
})();
