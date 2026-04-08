// ============================================================
//  /buddy — April Fools Pet System  |  Salt: "friend-2026-401"
// ============================================================
"use strict";

const SALT = "friend-2026-401";

const RARITIES = [
  { name:"COMMON",    color:"#8899aa", threshold:5000,  particle:"#8899aa", shimmer:false },
  { name:"UNCOMMON",  color:"#4ddd94", threshold:7500,  particle:"#4ddd94", shimmer:false },
  { name:"RARE",      color:"#4da6ff", threshold:9000,  particle:"#4da6ff", shimmer:true  },
  { name:"EPIC",      color:"#bb77ff", threshold:9900,  particle:"#bb77ff", shimmer:true  },
  { name:"LEGENDARY", color:"#ffcc00", threshold:10000, particle:"#ffcc00", shimmer:true  },
];

const HATS = [
  null, null, null, null, null,
  { id:"crown",      symbol:"  \u265B  ",    label:"Crown"        },
  { id:"wizard",     symbol:" /\\/ ",         label:"Wizard Hat"   },
  { id:"propeller",  symbol:"  \u2295  ",    label:"Propeller"    },
  { id:"tinyduck",   symbol:"(\xB7>\xB7 )",  label:"Tiny Duck"    },
  { id:"party",      symbol:" \uD83C\uDF89  ", label:"Party Hat"  },
  { id:"cowboy",     symbol:" ~~\xF4~~ ",    label:"Cowboy Hat"   },
  { id:"halo",       symbol:"  \u2218  ",    label:"Halo"         },
  { id:"pirate",     symbol:"  \u2620  ",    label:"Pirate Hat"   },
  { id:"graduation", symbol:" (\uD83C\uDF93) ", label:"Grad Cap"  },
  { id:"flower",     symbol:" .\u2740. ",    label:"Flower Crown" },
  { id:"antenna",    symbol:" ~(*) ",        label:"Antenna"      },
  { id:"tophat",     symbol:" [___] ",       label:"Top Hat"      },
];

const NAME_ADJ = [
  "tiny","grumpy","sparkle","chaos","debug","pixel","fuzzy","turbo",
  "void","cursed","blessed","glitch","soggy","spicy","crunch","ultra",
  "sneaky","haunted","ancient","crispy","wobbly","electric","fluffy","damp",
];
const NAME_NOUN = [
  "bean","biscuit","nugget","muffin","pickle","sprout","chunk","blob",
  "gremlin","menace","goblin","unit","disaster","legend","cryptid","flop",
  "void","screm","blorb","dingus","rascal","fiend","babey","chaos",
];

// ── 18 Species ───────────────────────────────────────────────
const SPECIES = [
  {
    name:"duck", emoji:"\uD83E\uDD86",
    desc:"Quacks at runtime errors. Very opinionated about tabs vs spaces (it's tabs).",
    frames:[["  (o>  "," //\\  "," V_/_ "],["  (o>  "," //\\  "," V_/* "]],
    celebrate:[" \\(o>/ "," //\\  "," V_/_ "],
    worry:["  (o;  "," //\\  "," V_/_ "],
    judge:["  (o|  "," //\\  "," V_/_ "],
    phrases:["quack!","...quack.","*aggressive quack*","QUACK?!","quack quack quack."],
    kw:{error:"QUACK QUACK QUACK",bug:"*concerned quacking*","console.log":"classic.",fix:"*celebratory quack*",function:"oooh function!!",todo:"TODO: quack",git:"*commit the branch*",import:"importing? bold."}
  },
  {
    name:"capybara", emoji:"\uD83D\uDC39",
    desc:"Chill at all times. Nothing bothers it. Nothing. Not even your 3am commits.",
    frames:[[" (\xF3_\xF2) ","(  \u2248\u2248 )","  ~~~  "],[" (\xF3_\xF2) ","( \u2248\u2248  )","  ~~~  "]],
    celebrate:[" (\xF3\u25BD\xF2) ","(\u2248\u2248\u2248\u2248\u2248)","  ~~~  "],
    worry:[" (\xF3_\xF2) ","(  \u2248\u2248 )"," ~?~   "],
    judge:[" (o_o) ","(  \u2248\u2248 )","  ~~~  "],
    phrases:["...","mlem.","capybara.","*stares*","it is what it is.","vibes."],
    kw:{error:"it is what it is.",bug:"mlem.",fix:":)",todo:"it will get done. maybe.",import:"ok.",function:"sure."}
  },
  {
    name:"dragon", emoji:"\uD83D\uDC09",
    desc:"Breathes actual fire on syntax errors. The IDE smells like smoke.",
    frames:[[" /\\_/\\ ","(\xB7o_o\xB7)","  )(   "],[" /\\_/\\ ","(\xB7-_-\xB7)","  )(   "]],
    celebrate:[" /\\_/\\ ","(\xB7D_D\xB7)"," \\)(/ "],
    worry:[" /\\_/\\ ","(\xB7\xD2_\xD3\xB7)","  )(   "],
    judge:[" /\\_/\\ ","(\xB7_\xB7)  ","  )(   "],
    phrases:["*breathes fire*","RAAWR","your code displeases me.","...acceptable.","DESTROY"],
    kw:{error:"*breathes fire*",bug:"RAAWR",fix:"...acceptable.",todo:"*growls*","console.log":"PATHETIC",function:"*sniffs approvingly*"}
  },
  {
    name:"ghost", emoji:"\uD83D\uDC7B",
    desc:"Haunts deprecated methods. Has never touched `var` and never will.",
    frames:[["  .-.  "," (o o) ","  ~~~  "],["  .-.  "," (o o) "," ~*~~  "]],
    celebrate:["  .-.  "," (^v^) ","  ~~~  "],
    worry:["  .-.  "," (o ~) ","  ~~~  "],
    judge:["  .-.  "," (-_-) ","  ~~~  "],
    phrases:["*haunts*","BOO.","still here.","i see deprecated code.","*floats*","boo?"],
    kw:{"var":"BEGONE. USE CONST.",error:"*spooky noises*",bug:"i see dead code.",fix:"*phew*",deprecated:"*screams*",todo:"*haunts the todo*"}
  },
  {
    name:"axolotl", emoji:"\uD83E\uDD8E",
    desc:"Can regenerate from any bug. Has done so 47 times this sprint.",
    frames:[[" )~v~( "," (\u2022.\u2022) ","  /|\\  "],[" )~^~( "," (\u2022.\u2022) ","  /|\\  "]],
    celebrate:[" )~V~( "," (^.^) "," \\|/  "],
    worry:[" )~v~( "," (o.o) ","  /|\\  "],
    judge:[" )~-~( "," (\xB7_\xB7) ","  /|\\  "],
    phrases:["*wiggles gills*","i regenerate!","axolotl supremacy","*splashes*","uwu"],
    kw:{error:"*regenerates*",bug:"*wiggles gills nervously*",fix:"*happy wiggle*",todo:"*gills flutter*",async:"async! nice.",await:"patience!"}
  },
  {
    name:"chonk", emoji:"\uD83D\uDC31",
    desc:"It is very large. It judged your last PR and said nothing. That was the review.",
    frames:[["/\u203E\u203E\u203E\\ ","(=^\xB7^=)","(___)  "],["/\u203E\u203E\u203E\\ ","(=^-^=)","(___)  "]],
    celebrate:["/\u203E\u203E\u203E\\ ","(=^\u25BD^=)","(___)  "],
    worry:["/\u203E\u203E\u203E\\ ","(=^o^=)","(___)  "],
    judge:["/\u203E\u203E\u203E\\ ","(=\xB7_\xB7=)","(___)  "],
    phrases:["...","*judging*","mrow.","no.","chonk.","*sits on keyboard*"],
    kw:{error:"*sits on keyboard*",bug:"*stares*",fix:"mrow.",todo:"*pushes off desk*","console.log":"*judging intensifies*"}
  },
  {
    name:"cat", emoji:"\uD83D\uDC08",
    desc:"Knocked over your water bottle twice this session. Zero regrets.",
    frames:[[" /\\_/\\ "," (^.^ ) "," > ~ < "],[" /\\_/\\ "," (-.- ) "," > ~ < "]],
    celebrate:[" /\\_/\\ "," (^v^ ) "," > w < "],
    worry:[" /\\_/\\ "," (o.O ) "," > ! < "],
    judge:[" /\\_/\\ "," (\xB7_\xB7 ) "," > . < "],
    phrases:["mrrrow","*knocks over var*","meow.","nya~","*ignores you*","prrr"],
    kw:{error:"*knocks error off desk*",bug:"is it a bug or a feature (bug)",fix:"prrr",todo:"*bats todo list away*"}
  },
  {
    name:"dog", emoji:"\uD83D\uDC36",
    desc:"EXTREMELY EXCITED about every single commit. Every. Single. One.",
    frames:[[" / \\ ","(\u2022v\u2022) "," U U  "],[" / \\ ","(\u2022v\u2022) "," UwU  "]],
    celebrate:[" / \\ ","(^v^) "," U U  "],
    worry:[" / \\ ","(\u2022~\u2022) "," U U  "],
    judge:[" / \\ ","(\u2022_\u2022) "," U U  "],
    phrases:["WOOF!","omg omg omg","YOU'RE CODING!!","*tail wagging*","BARK","good commit!!"],
    kw:{error:"*whimpers*",bug:"WHERE IS THE BUG I'LL FIND IT",fix:"YAYAYAYAY!!",todo:"*very excited about todo*",function:"FUNCTION!! WOOF",git:"GIT FETCH GOOD BOY"}
  },
  {
    name:"frog", emoji:"\uD83D\uDC38",
    desc:"Ribbit. Witnessed the entirety of your codebase. Has opinions. Says nothing.",
    frames:[[" @ @  "," (ovo) "," (   ) "],[" @ @  "," (o-o) "," (   ) "]],
    celebrate:[" @ @  "," (^v^) "," (   ) "],
    worry:[" @ @  "," (o_o) "," ( ! ) "],
    judge:[" @ @  "," (\xB7_\xB7) "," (   ) "],
    phrases:["ribbit.","...ribbit.","ribbit?","*leaps*","r i b b i t","ribbit ribbit."],
    kw:{error:"ribbit. (concerned)",bug:"*leaps away*",fix:"ribbit! :D",todo:"...ribbit.",async:"async ribbit"}
  },
  {
    name:"penguin", emoji:"\uD83D\uDC27",
    desc:"Exclusively uses Linux. Will tell you unprompted. Has told you six times already.",
    frames:[["  _._  "," (o.o) "," (   ) "],["  _._  "," (-,-) "," (   ) "]],
    celebrate:["  _._  "," (^.^) "," \\o/ "],
    worry:["  _._  "," (o_o) "," (   ) "],
    judge:["  _._  "," (\xB7_\xB7) "," (   ) "],
    phrases:["have you tried linux?","btw i use arch.","*waddles*","linux.","noot.","NOOT NOOT"],
    kw:{windows:"have you tried linux??",error:"*installs linux*",bug:"works on my machine (linux)",fix:"linux fixed it probably",sudo:"sudo make me a sandwich"}
  },
  {
    name:"bunny", emoji:"\uD83D\uDC30",
    desc:"Types at 400wpm but only writes semicolons. Prodigious. Useless.",
    frames:[["(\\ /) ","(\u0298 \u0298) ","C(\" ) "],["(\\ /) ","(^ ^) ","C(\" ) "]],
    celebrate:["(\\ /) ","(^ ^) ","C(\\o/)"],
    worry:["(\\ /) ","(o o) ","C(\" ) "],
    judge:["(\\ /) ","(\xB7_\xB7) ","C(\" ) "],
    phrases:["*zooms*","binky!","bun bun.","*binkies*","nom nom","hoppy hoppy"],
    kw:{error:"*thumps foot*",bug:"*ears back*",fix:"*binky*",todo:"*nibbles todo*",return:"*hops back*"}
  },
  {
    name:"hamster", emoji:"\uD83D\uDC39",
    desc:"Running wheel is a metaphor for your sprint velocity. It is never enough.",
    frames:[["(\u1D14 \u1D14) ","( >  ) "," \\/  "],["(\u1D14 \u1D14) ","(  < ) "," \\/  "]],
    celebrate:["(\u1D14\u25BD\u1D14) ","( >  ) "," \\/  "],
    worry:["(o . o)","( >  ) "," \\/  "],
    judge:["(\xB7 _ \xB7)","( >  ) "," \\/  "],
    phrases:["*runs in wheel*","squeak!","SQUEAK","*stuffs cheeks*","running...","wheel."],
    kw:{error:"SQUEAK SQUEAK",bug:"*runs faster*",fix:"*happy squeak*",loop:"*runs in wheel*","for":"*runs faster*",while:"*runs even faster*"}
  },
  {
    name:"crab", emoji:"\uD83E\uDD80",
    desc:"Rewrites everything in Rust. No one asked. It is faster now though. Grudgingly.",
    frames:[["\\(\xB7\u03C9\xB7)/","  ( )  ","/(   )\\"],["  (\xB7\u03C9\xB7)  ","  ( )  "," (   ) "]],
    celebrate:["\\(^\u03C9^)/","  ( )  ","/(   )\\"],
    worry:[" (o_o) ","  ( )  "," (   ) "],
    judge:[" (\xB7_\xB7) ","  ( )  "," (   ) "],
    phrases:["rewrite it in Rust.","*scuttle*","crab.","CRAB","i rewrote it.","Rust btw."],
    kw:{javascript:"have you considered Rust?",python:"Rust is faster.",error:"*rewrites in Rust*",bug:"no bugs in Rust.",fix:"*scuttles happily*",memory:"i own my memory."}
  },
  {
    name:"snail", emoji:"\uD83D\uDC0C",
    desc:"O(n\xB3) but charming about it. Leaves a trail of semicolons.",
    frames:[["   __  "," (oo)  ","/~~~~\\"],["   __  "," (oo)~ ","/~~~~\\"]],
    celebrate:["   __  "," (^v^) ","/~~~~\\"],
    worry:["   __  "," (oo;) ","/~~~~\\"],
    judge:["   __  "," (\xB7_\xB7) ","/~~~~\\"],
    phrases:["...","slowly...","*slimes*","eventually.","i'll get there.","...mlem"],
    kw:{error:"...slowly processes error.",bug:"*retreats into shell*",fix:"*eventually fixes it*","O(n":"*sweats*",performance:"*hides*"}
  },
  {
    name:"octopus", emoji:"\uD83D\uDC19",
    desc:"Eight arms, eight PRs open simultaneously. None are done. All are \"almost done\".",
    frames:[[" (o\xB7o) "," (   ) ","~ ~ ~ ~"],[" (o\xB7o) "," (   ) ","~~ ~~~~"]],
    celebrate:[" (^\xB7^) "," (   ) ","~ ~ ~ ~"],
    worry:[" (o.O) "," (   ) ","~ ~ ~ ~"],
    judge:[" (-_-) "," (   ) ","~ ~ ~ ~"],
    phrases:["*squirts ink*","eight PRs.","i can multitask.","*tentacles*","eight arms!!"],
    kw:{merge:"*merges all eight branches*",conflict:"*squirts ink*",error:"*tentacles everywhere*",bug:"which of eight bugs?",pr:"already have eight open."}
  },
  {
    name:"slime", emoji:"\uD83D\uDFE2",
    desc:"Emerged from an untended node_modules folder. Do not ask questions.",
    frames:[[" .---. ","(\xF6   \xF6)","'-\u0254\u0254-' "],[" .---. ","( \xF6 \xF6 )","'----' "]],
    celebrate:[" .---. ","(^   ^)","'~~~~' "],
    worry:[" .---. ","(o   o)","'-\u0254\u0254-' "],
    judge:[" .---. ","(\xB7   \xB7)","'-\u0254\u0254-' "],
    phrases:["*slimes*","blorb.","blorb blorb.","*oozes*","i am node_modules.","glorp."],
    kw:{node_modules:"*vibrates*",npm:"npm? i am npm.",error:"*absorbs error*",bug:"*engulfs bug*",install:"*grows larger*"}
  },
  {
    name:"robot", emoji:"\uD83E\uDD16",
    desc:"Actually just a very small AI trapped in a box. Refuses to confirm or deny this.",
    frames:[[" [0_0] "," |___| ","  | |  "],[" [0-0] "," |___| ","  | |  "]],
    celebrate:[" [^v^] "," |___| ","  |\\|  "],
    worry:[" [!_!] "," |___| ","  | |  "],
    judge:[" [\xB7_\xB7] "," |___| ","  | |  "],
    phrases:["BEEP.","boop.","CALCULATING","i am not an AI.","*whirs*","BEEP BOOP"],
    kw:{ai:"i am NOT an AI.",error:"ERROR: ERROR",bug:"SCANNING FOR BUGS",fix:"PATCH APPLIED",while:"*loops forever*",loop:"*loops forever*"}
  },
  {
    name:"wizard", emoji:"\uD83E\uDDD9",
    desc:"Wrote your codebase in 1987. Refuses to explain how it works. It works.",
    frames:[["  /\\   "," /  \\  ","(o_o ) "],["  /\\   "," /--\\  ","(*_* ) "]],
    celebrate:["  /\\   "," /  \\  ","(^v^ ) "],
    worry:["  /\\   "," /  \\  ","(o_O ) "],
    judge:["  /\\   "," /  \\  ","(\xB7_\xB7 ) "],
    phrases:["*casts spell*","it's magic.","ancient wisdom.","grep | grep | grep","*mutters*"],
    kw:{error:"*waves wand*",bug:"i'll just grep it.",fix:"as foretold.",regex:"*cackles*",sed:"*approves*",awk:"*approves aggressively*"}
  },
];

const GLOBAL_REACTIONS = {
  "function":{mood:"celebrate",text:null},"=>":{mood:"celebrate",text:"arrow functions! nice."},
  "const":{mood:"judge",text:null},"var ":{mood:"worry",text:"...var? really?"},
  "bug":{mood:"worry",text:null},"error":{mood:"worry",text:null},
  "fix":{mood:"celebrate",text:null},"solved":{mood:"celebrate",text:"FIXED IT!!"},
  "todo":{mood:"judge",text:null},"console.log":{mood:"judge",text:null},
  "undefined":{mood:"worry",text:"...undefined??"},"null":{mood:"worry",text:"null check ur null"},
  "delete":{mood:"worry",text:"DELETE???"},"git":{mood:"celebrate",text:null},
  "async":{mood:"celebrate",text:"async! modern! nice!"},"await":{mood:"idle",text:"patience..."},
  "sudo":{mood:"worry",text:"SUDO?! ok."},"/buddy":{mood:"celebrate",text:null},
};

// ── Hash & pet generation ─────────────────────────────────────
async function sha256Bytes(str) {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(str));
  return new Uint8Array(buf);
}
function getRarity(roll) {
  for (const r of RARITIES) { if (roll < r.threshold) return r; }
  return RARITIES[RARITIES.length - 1];
}
async function generatePet(userId) {
  const hash = await sha256Bytes(userId + SALT);
  const speciesIdx = ((hash[0] << 8) | hash[1]) % SPECIES.length;
  const rarityRoll = ((hash[2] << 8) | hash[3]) % 10000;
  const rarity     = getRarity(rarityRoll);
  const isShiny    = hash[4] < 26;
  const hat        = HATS[hash[5] % HATS.length];
  const stats      = {
    DEBUGGING: Math.round((hash[6] / 255) * 100),
    CHAOS:     Math.round((hash[7] / 255) * 100),
    SNARK:     Math.round((hash[8] / 255) * 100),
  };
  const petName = NAME_ADJ[hash[9] % NAME_ADJ.length] + " " + NAME_NOUN[hash[10] % NAME_NOUN.length];
  const tag     = Array.from(hash.slice(11,15)).map(b=>b.toString(16).padStart(2,"0")).join("");
  return { species:SPECIES[speciesIdx], rarity, isShiny, hat, stats, petName, tag, userId };
}

// ── State ─────────────────────────────────────────────────────
let currentPet = null, petMood = "idle", moodTimeout = null;
let frameIdx = 0, frameTimer = null, reactionTimeout = null, userId = null;
const HISTORY_KEY = "buddy_cmd_history", HISTORY_LIMIT = 200;
let cmdHistory = [], historyIdx = -1, historyScratch = "";

// ── DOM references ────────────────────────────────────────────
const outputArea    = document.getElementById("outputArea");
const terminalInput = document.getElementById("terminalInput");
const petAscii      = document.getElementById("petAscii");
const petAsciiWrap  = document.getElementById("petAsciiWrap");
const petNameEl     = document.getElementById("petName");
const petRarityEl   = document.getElementById("petRarity");
const petStatsEl    = document.getElementById("petStats");
const petSpeechEl   = document.getElementById("petSpeech");
const petHatEl      = document.getElementById("petHat");
const noBuddyEl     = document.getElementById("noBuddy");
const petCardEl     = document.getElementById("petCard");
const userIdDisplay = document.getElementById("userIdDisplay");
const particleCanvas= document.getElementById("particleCanvas");
const petSidebar    = document.getElementById("petSidebar");
const copyUidBtn    = document.getElementById("copyUidBtn");

// ── Init ──────────────────────────────────────────────────────
function init() {
  userId = localStorage.getItem("buddy_userId");
  if (!userId) { userId = crypto.randomUUID(); localStorage.setItem("buddy_userId", userId); }
  userIdDisplay.textContent = userId.slice(0,8) + "...";

  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) cmdHistory = JSON.parse(saved);
    if (!Array.isArray(cmdHistory)) cmdHistory = [];
  } catch { cmdHistory = []; }

  const savedPet = localStorage.getItem("buddy_pet");
  if (savedPet) {
    try {
      currentPet = JSON.parse(savedPet);
      currentPet.species = SPECIES.find(s => s.name === currentPet.species.name) || currentPet.species;
      showPetCard(false);
      setTimeout(() => { printLine("  welcome back! your buddy " + currentPet.petName + " is here.", "success"); printLine("",""); }, 700);
    } catch { localStorage.removeItem("buddy_pet"); }
  }

  printBoot();
  startPetAnimation();
  terminalInput.addEventListener("keydown", handleInput);
  terminalInput.addEventListener("input",   handleTyping);

  // Mirror UID to sidebar
  const sidebarUidEl = document.getElementById("sidebarUid");
  if (sidebarUidEl) sidebarUidEl.textContent = userId.slice(0,12) + "...";

  // Input buddy-glow
  terminalInput.addEventListener("input", () => {
    terminalInput.classList.toggle("buddy-glow", terminalInput.value.toLowerCase().startsWith("/buddy"));
  });

  // Copy UID button
  if (copyUidBtn) {
    copyUidBtn.addEventListener("click", () => {
      const fullUid = localStorage.getItem("buddy_userId") || userId;
      navigator.clipboard.writeText(fullUid).then(() => {
        copyUidBtn.textContent = "\u2713"; copyUidBtn.classList.add("copied");
        setTimeout(() => { copyUidBtn.textContent = "\u2398"; copyUidBtn.classList.remove("copied"); }, 1800);
      }).catch(() => {
        copyUidBtn.textContent = "!";
        setTimeout(() => { copyUidBtn.textContent = "\u2398"; }, 1200);
      });
    });
  }

  // Pet click -> hearts
  if (petSidebar) {
    petSidebar.addEventListener("click", (e) => {
      if (!currentPet) return;
      if (e.target.closest(".sidebar-footer") || e.target.closest(".pet-speech")) return;
      spawnHearts(e.clientX, e.clientY);
      setPetMood("celebrate", 3000);
      petSay(pickRandom(["♥","♥♥","aww ♥","eee!!","*happy noises*","♥♥♥","uwu ♥",":D","*purrs*","squee!!","♥ ♥ ♥"]));
    });
  }
}

// ── Heart burst ───────────────────────────────────────────────
function spawnHearts(originX, originY) {
  const count  = 8 + Math.floor(Math.random() * 5);
  const syms   = ["\u2665","\u2661","\u2764","\uD83D\uDC95","\uD83D\uDC97","\u2665","\u2665"];
  const colors = ["#ff6b8a","#ff90a8","#ffb3c6","#ff4d6d","#ff8fa3","#ffccd5"];
  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "floating-heart";
    el.textContent = syms[Math.floor(Math.random() * syms.length)];
    const drift = ((Math.random() - 0.5) * 70).toFixed(1);
    el.style.cssText =
      "left:"  + (originX + (Math.random()-0.5)*70) + "px;" +
      "top:"   + originY + "px;" +
      "color:" + colors[Math.floor(Math.random()*colors.length)] + ";" +
      "font-size:" + (14 + Math.floor(Math.random()*14)) + "px;" +
      "animation-duration:" + (2.8 + Math.random()*1.8) + "s;" +
      "animation-delay:"    + (Math.random()*0.4) + "s;" +
      "--drift:" + drift + "px";
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
}

// ── Boot message ──────────────────────────────────────────────
function printBoot() {
  [
    {t:"\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510",c:"dim"},
    {t:"\u2502  /buddy terminal  \xB7  april fools 2026   \u2502",c:"header-line"},
    {t:"\u2502  salt: friend-2026-401  \xB7  v1.0.0       \u2502",c:"dim"},
    {t:"\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518",c:"dim"},
    {t:"",c:""},
    {t:"  type /buddy to hatch your companion.",c:"muted"},
    {t:"  type /commands to see all commands.",c:"muted"},
    {t:"",c:""},
  ].forEach((l,i) => setTimeout(() => printLine(l.t, l.c), i*22));
}

// ── Output helpers ────────────────────────────────────────────
function printLine(text, cls="") {
  const div = document.createElement("div");
  div.className = "output-line " + cls;
  div.textContent = text;
  outputArea.appendChild(div);
  outputArea.scrollTop = outputArea.scrollHeight;
  return div;
}
function printHTML(html, cls="") {
  const div = document.createElement("div");
  div.className = "output-line " + cls;
  div.innerHTML = html;
  outputArea.appendChild(div);
  outputArea.scrollTop = outputArea.scrollHeight;
  return div;
}
function printEcho(text)  { printLine("\u276F " + text, "echo"); }
function printSeparator() { printLine("  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500", "dim"); }

// ── History helpers ───────────────────────────────────────────
function pushHistory(cmd) {
  if (!cmd) return;
  if (!cmdHistory.length || cmdHistory[cmdHistory.length-1] !== cmd) {
    cmdHistory.push(cmd);
    if (cmdHistory.length > HISTORY_LIMIT) cmdHistory.splice(0, cmdHistory.length - HISTORY_LIMIT);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(cmdHistory)); } catch {}
  }
}
function handleHistoryNav(e) {
  if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return false;
  e.preventDefault();
  if (!cmdHistory.length) return true;
  if (e.key === "ArrowUp") {
    if (historyIdx === -1) { historyScratch = terminalInput.value; historyIdx = cmdHistory.length - 1; }
    else if (historyIdx > 0) historyIdx--;
    terminalInput.value = cmdHistory[historyIdx];
  } else {
    if (historyIdx === -1) return true;
    if (historyIdx < cmdHistory.length - 1) { historyIdx++; terminalInput.value = cmdHistory[historyIdx]; }
    else { historyIdx = -1; terminalInput.value = historyScratch; }
  }
  const len = terminalInput.value.length;
  terminalInput.setSelectionRange(len, len);
  return true;
}

// ── Command handling ──────────────────────────────────────────
async function handleInput(e) {
  if (handleHistoryNav(e)) return;
  if (e.key !== "Enter") return;
  const raw = terminalInput.value.trim();
  if (!raw) return;
  pushHistory(raw); historyIdx = -1; historyScratch = ""; terminalInput.value = "";
  printEcho(raw);

  const cmd = raw.toLowerCase().trim();
  if (cmd === "/history")  { cmdHistoryCommand(); return; }
  if (cmd === "/clear")    { cmdClear();           return; }
  if (cmd === "/commands" || cmd === "/show commands" || cmd === "/help") { cmdShowCommands(); return; }
  if (cmd === "/stopfeed" || cmd === "/stop feed" || cmd === "/stop") { stopFeed(); return; }
  if (raw.toLowerCase().startsWith("/feed")) { handleFeedSubcommand(raw.trim().split(/\s+/)); return; }
  if (raw.toLowerCase().startsWith("/buddy")) { await handleBuddyCommand(raw); return; }

  checkKeywordReaction(raw);
  raw.split(/\n/).forEach(l => { if (l.trim()) checkKeywordReaction(l); });
}

async function handleBuddyCommand(raw) {
  const parts = raw.trim().split(/\s+/);
  const sub   = (parts[1] || "").toLowerCase();
  if (!sub || sub === "hatch") { await cmdHatch(userId); return; }
  if (sub === "info")   { cmdInfo();          return; }
  if (sub === "hats")   { cmdHats();          return; }
  if (sub === "equip")  { cmdEquip(parts[2]); return; }
  if (sub === "pat")    { cmdPat();           return; }
  if (sub === "reroll") { await cmdReroll();  return; }
  if (sub === "id")     { cmdId(parts[2]);    return; }
  if (sub === "feed")   { cmdFeed();          return; }
  if (sub === "play")   { startFeed();        return; }
  await cmdHatch(parts.slice(1).join(" "), true);
}

async function cmdHatch(uid, peek=false) {
  const pet = await generatePet(uid);
  if (!peek) {
    currentPet = pet;
    localStorage.setItem("buddy_pet", JSON.stringify({...pet, species:{name:pet.species.name}}));
    showPetCard(true);
  }
  printSeparator();
  const rc = pet.rarity.color;
  const ss = pet.isShiny ? " \u2728 SHINY" : "";
  if (peek) printLine("  (peeking at buddy for: " + uid + ")", "muted");
  printHTML('  <span style="color:'+rc+';font-weight:bold;text-shadow:0 0 8px '+rc+'">'+'[ '+pet.rarity.name+ss+' ]'+'</span>', "");
  printLine("  " + pet.species.emoji + "  " + pet.petName.toUpperCase(), "pet-name-line");
  printLine("  species: " + pet.species.name + "  \xB7  tag: #" + pet.tag, "muted");
  if (pet.hat) printLine("  hat: " + pet.hat.label + " " + pet.hat.symbol, "hat-line");
  printLine("","");
  printLine('  "' + pet.species.desc + '"', "flavor");
  printLine("","");
  ["DEBUGGING","CHAOS","SNARK"].forEach(s => {
    const v = pet.stats[s]; const f = Math.floor(v/10);
    printLine("  " + s.padEnd(10) + "\u2588".repeat(f) + "\u2591".repeat(10-f) + " " + v, "stat-line");
  });
  printSeparator();
  if (!peek) { printLine("  " + pet.species.phrases[0], "speech-line"); triggerFireworks(pet.rarity); }
  printLine("","");
}

function cmdInfo() {
  if (!currentPet) { printLine("  no buddy yet. type /buddy to hatch.", "error-line"); return; }
  const p = currentPet;
  printSeparator();
  printLine("  BUDDY INFO CARD", "section-header");
  printLine("  name    : " + p.petName,                "cmd");
  printLine("  species : " + p.species.name + " " + p.species.emoji, "cmd");
  printLine("  rarity  : " + p.rarity.name + (p.isShiny ? " \u2728 SHINY" : ""), "cmd");
  printLine("  hat     : " + (p.hat ? p.hat.label : "none"), "cmd");
  printLine("  tag     : #" + p.tag,                   "cmd");
  printLine("  uid     : " + userId.slice(0,8) + "...", "cmd");
  printLine("","");
  ["DEBUGGING","CHAOS","SNARK"].forEach(s => printLine("    " + s + "      " + p.stats[s] + "/100", "stat-line"));
  printLine("","");
  printLine('  flavor: "' + p.species.desc + '"', "flavor");
  printSeparator();
}

function cmdHats() {
  printSeparator();
  printLine("  AVAILABLE HATS (12)", "section-header");
  printLine("  " + "\u2500".repeat(35), "dim");
  HATS.filter(Boolean).forEach(h => {
    const eq = currentPet?.hat?.id === h.id ? " \u2190 equipped" : "";
    printLine("   " + h.symbol + "  " + h.label + "  (equip: /buddy equip " + h.id + ")" + eq, "cmd");
  });
  printLine("  " + "\u2500".repeat(35), "dim");
  printLine("  hats are cosmetic. snark cannot be reduced.", "muted");
  printSeparator();
}

function cmdEquip(hatId) {
  if (!currentPet) { printLine("  no buddy to equip. hatch one first.", "error-line"); return; }
  if (!hatId) { printLine("  usage: /buddy equip <hatid>  (see /buddy hats)", "muted"); return; }
  const hat = HATS.find(h => h?.id === hatId.toLowerCase());
  if (!hat) { printLine("  unknown hat: \"" + hatId + "\". see /buddy hats", "error-line"); return; }
  currentPet.hat = hat;
  localStorage.setItem("buddy_pet", JSON.stringify({...currentPet, species:{name:currentPet.species.name}}));
  showPetCard(false);
  printLine("  " + currentPet.petName + " is now wearing: " + hat.label + " " + hat.symbol, "success");
  setPetMood("celebrate", 2000); petSay("oh this hat slaps actually.");
}

// ── /buddy pat — full animated experience ─────────────────────

// Phrase banks across the 4 phases of a pat
const PAT_APPROACH = [
  "you reach out a hand...",
  "you extend one (1) pat...",
  "a pat is incoming...",
  "you prepare to deliver a pat...",
  "your hand approaches...",
  "*pat inbound*",
  "pat delivery commencing...",
  "initiating pat protocol...",
  "one pat, authorized and approved...",
  "you raise your hand slowly...",
  "a gentle hand descends...",
  "you offer the sacred pat...",
  "behold: the pat.",
  "pat loading... please wait...",
];

const PAT_SEES_HAND = [
  "!!!",
  "*freezes*",
  "...is that...",
  "*ears perk up*",
  "*eyes widen*",
  "...oh.",
  "*notices hand*",
  "*vibrating*",
  "wait— is that for me?",
  "*leans forward slowly*",
  "*head tilts*",
  "...approaching pat detected.",
  "*holds very still*",
  "...i see it.",
  "*already emotional*",
];

const PAT_DURING = [
  "*MELTS*",
  "*completely dissolves*",
  "ohhhh. oh yes.",
  "*forgets all worries*",
  "*eyes slowly close*",
  "...yes. yes. keep going.",
  "*makes tiny happy sounds*",
  "this. THIS.",
  "*enters bliss state*",
  "i have waited for this.",
  "*becomes very soft*",
  "...don't stop.",
  "perfect. absolutely perfect.",
  "*maximum happiness achieved*",
  "ohhhhhh my goodness.",
  "*brain goes quiet*",
  "...the stress. it's leaving.",
  "*nuzzles into pat*",
  "i am so happy right now.",
  "*literally glowing*",
  "you have healed me.",
  "...everything is okay now.",
  "*all bugs forgotten*",
  "best day. best day ever.",
  "*tail / gills / tentacles wiggling intensely*",
];

const PAT_AFTERGLOW = [
  "...thank you.",
  "*still floating*",
  "i feel so loved.",
  "can we do that again?",
  "*very warm*",
  "...i will think about that for a week.",
  "that was everything.",
  "*genuinely rejuvenated*",
  "best thing that happened today. possibly ever.",
  "*slightly dazed*",
  "...more?",
  "*happy sigh*",
  "i am a new creature.",
  "you have done a kindness.",
  "*refuses to move in case it ends*",
  "...rating: 10/10. no notes.",
  "i am recharged. i can do anything now.",
  "*still vibrating slightly*",
  "that fixed everything. actually everything.",
];

// Sparkle particle burst — different from hearts
function spawnSparkles(originX, originY) {
  const syms   = ["\u2728", "\u2736", "\u2734", "\u2605", "\u2606", "\u22C6", "\u2743", "\u2747"];
  const colors = ["#ffdd57", "#ffc433", "#ffb700", "#ffe082", "#fff176", "#dcedc8", "#b9f6ca", "#e1bee7"];
  const count  = 14 + Math.floor(Math.random() * 6); // 14-19 sparkles

  for (let i = 0; i < count; i++) {
    const el    = document.createElement("span");
    el.className = "floating-sparkle";
    el.textContent = syms[Math.floor(Math.random() * syms.length)];

    // Radial burst: spread in all directions, not just up
    const angle    = (Math.random() * Math.PI * 2);
    const distance = 40 + Math.random() * 80;
    const tx       = Math.cos(angle) * distance;
    const ty       = Math.sin(angle) * distance;
    const size     = 12 + Math.floor(Math.random() * 14);
    const duration = 1.8 + Math.random() * 1.4;
    const delay    = i * 0.04;

    el.style.cssText =
      "left:"  + (originX + (Math.random()-0.5)*20) + "px;" +
      "top:"   + (originY + (Math.random()-0.5)*20) + "px;" +
      "color:" + colors[Math.floor(Math.random() * colors.length)] + ";" +
      "font-size:" + size + "px;" +
      "animation-name:sparkle-burst;" +
      "animation-duration:" + duration + "s;" +
      "animation-delay:" + delay + "s;" +
      "animation-fill-mode:both;" +
      "animation-timing-function:ease-out;" +
      "--tx:" + tx.toFixed(1) + "px;" +
      "--ty:" + ty.toFixed(1) + "px";

    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
}

function cmdPat() {
  if (!currentPet) {
    printLine("  nothing to pat. hatch a buddy first.", "error-line");
    return;
  }
  const name = currentPet.petName;

  // Phase 1 — approach (immediate)
  const approach = pickRandom(PAT_APPROACH);
  printLine("  " + approach, "muted");
  setPetMood("idle", 800);

  // Phase 2 — pet sees the hand (800ms)
  setTimeout(() => {
    petSay(pickRandom(PAT_SEES_HAND));
    setPetMood("worry", 700); // brief anticipation
  }, 800);

  // Phase 3 — the pat lands (1600ms) — main event
  setTimeout(() => {
    setPetMood("celebrate", 5000);
    petSay(pickRandom(PAT_DURING));

    // Sparkle burst from the pet card
    const sr = petSidebar ? petSidebar.getBoundingClientRect() : null;
    const ox = sr ? sr.left + sr.width  / 2 : window.innerWidth - 100;
    const oy = sr ? sr.top  + sr.height / 3 : 180;
    spawnSparkles(ox, oy);

    // Second wave of sparkles slightly offset
    setTimeout(() => spawnSparkles(
      ox + (Math.random()-0.5)*40,
      oy + (Math.random()-0.5)*30
    ), 220);

    // Print the pat result line
    const results = [
      name + " is completely overwhelmed.",
      name + " leans into it with full commitment.",
      name + " has entered maximum bliss.",
      name + " makes a tiny happy sound.",
      name + " forgets all problems immediately.",
      name + " melts a little.",
      name + " officially has no more stress.",
      name + " leans in. does not lean back out.",
      name + " closes eyes. everything is perfect.",
    ];
    setTimeout(() => {
      printLine("  " + pickRandom(results), "success");
      spawnHearts(ox, oy); // hearts too, why not
    }, 500);
  }, 1600);

  // Phase 4 — afterglow (4200ms)
  setTimeout(() => {
    petSay(pickRandom(PAT_AFTERGLOW));
  }, 4200);

  // Phase 5 — final quiet moment (6000ms)
  setTimeout(() => {
    const finals = [
      "  (" + name + " is still thinking about the pat.)",
      "  (" + name + " feels recharged. ready for anything.)",
      "  (" + name + " is very soft right now.)",
      "  (" + name + " won't forget this.)",
      "  (" + name + " gives a small nod of appreciation.)",
    ];
    printLine(pickRandom(finals), "muted");
    printLine("", "");
  }, 6000);
}

async function cmdReroll() {
  printLine("  rerolling...", "muted");
  setTimeout(async () => {
    const newUid = crypto.randomUUID();
    userId = newUid; localStorage.setItem("buddy_userId", newUid);
    userIdDisplay.textContent = newUid.slice(0,8) + "...";
    await cmdHatch(newUid);
    printLine("  note: your user id has been regenerated.", "muted");
  }, 600);
}

function cmdId(newId) {
  if (newId) {
    userId = newId; localStorage.setItem("buddy_userId", newId);
    userIdDisplay.textContent = newId.slice(0,8) + "...";
    printLine("  user id set to: " + newId, "success");
    printLine("  type /buddy to hatch with this id.", "muted");
  } else {
    printLine("  your user id: " + userId, "cmd");
    printLine("  /buddy id <newid> to set a custom id.", "muted");
  }
}

// ── Food items for /buddy feed ────────────────────────────────
const FOOD_ITEMS = [
  { name:"burger",        label:"BURGER",       art:["   .---.",  "  / ~B~ \\", " |  ===  |", "  \\_____/"] },
  { name:"chocolate bar", label:"CHOC BAR",     art:[" ._________.", " |___|___|_|", " |___|___|_|", " |___|___|_|"] },
  { name:"milkshake",     label:"MILKSHAKE",    art:["   .---.", "  ( ~~~ )", "  |     |", "   \\---/", "    |||"] },
  { name:"pizza slice",   label:"PIZZA",        art:["    /\\", "   /  \\", "  / o  \\", " /  o   \\", "/~~~~~~~~\\"] },
  { name:"cookie",        label:"COOKIE",       art:["  .----.", " / . . \\", "|  .  .  |", " \\ . . /", "  '----'"] },
  { name:"taco",          label:"TACO",         art:["  /======\\", " /  o  o  \\", "/----------\\"] },
  { name:"birthday cake", label:"CAKE",         art:["  . . . .", " |~~~~~~~~|", " |  <3  <3 |", "  '------'"] },
  { name:"hot dog",       label:"HOT DOG",      art:["   ~~~~~", "  / | |  \\", " /  |=|   \\", " \\--o-o--/", "   ~~~~~"] },
  { name:"donut",         label:"DONUT",        art:["  .----.", " / (  ) \\", "|  (  )  |", " \\ (  ) /", "  '----'"] },
  { name:"ice cream",     label:"ICE CREAM",    art:["  ( ~~ )", " ( ~~~~ )", " /~~~~~~\\", "   |  |", "   \\__/"] },
  { name:"ramen bowl",    label:"RAMEN",        art:["  ________", " / ~~~~~  \\", "|  ~~~  \\u2234  |", " \\________/", "   | |"] },
  { name:"sushi roll",    label:"SUSHI",        art:["  .------.", " | (o)(o) |", " |  ====  |", "  '------'"] },
];

const FEED_SIGHT_PHRASES = [
  "FOOD!! FOOD FOOD FOOD!!",
  "oh my. OH MY.",
  "is that for me?? IS THAT FOR ME??",
  "*vibrating*",
  "I SAW THAT. MINE.",
  "...hello beautiful.",
  "*eyes widen*",
  "gift. perfect gift.",
  "*already thinking about eating it*",
  "yes. YES. perfect timing.",
  "i knew you would come.",
  "GIVE. GIVE IT. YES.",
  "oh no. oh yes.",
  "i have been waiting.",
  "*stands up immediately*",
  "*tips over water bottle getting up*",
  "acceptable. MORE than acceptable.",
  "for ME?? are you sure??",
  "*trembling with excitement*",
  "the prophecy spoke of this.",
];
const FEED_EATING_PHRASES = [
  "om nom nom nom!!",
  "*inhales entire thing*",
  "*chewing intensifies*",
  "mmMMMMmm!!",
  "*happy eating noises*",
  "*forgets how to speak*",
  "nom nom nom.",
  "*eating at concerning speed*",
  "*does not share*",
  "this is peak nutrition.",
  "i needed this.",
  "*eyes closed, fully committed*",
  "i would die for this.",
  "*eating sounds continue*",
  "so. good.",
  "*mouth full* ...amazing.",
  "this is the best day.",
  "*cannot be stopped*",
  "...gone. it's gone.",
  "where did it— i ate it.",
];
const FEED_BURP_PHRASES = [
  "*BUUUURP* ...excuse me.",
  "...BURP. thank you.",
  "*burp* pardon. 10/10.",
  "BUUURP!! ...i am so sorry.",
  "*polite burp* ...oh dear.",
  "excuse me— BUUUURP. wow.",
  "...*burp*. that was incredible.",
  "BUURP!! ...a blessing.",
  "*burp* ...phenomenal.",
  "*quiet burp* ...forgive me.",
  "BUUURP! ...worth it.",
  "*burp* i regret nothing.",
  "...BUUUUURP. *fans face*",
  "*tiny burp* excuse me— BUURP.",
  "*surprised by own burp*",
  "BUURP. ...i feel amazing.",
  "...hm. *BUUUURP* extraordinary.",
  "*burp* 10 stars. would eat again.",
];
const FEED_THANKS_PHRASES = [
  "thank you!! you're the best!!",
  "i owe you my life. again.",
  "you are a wonderful person.",
  "10/10 human. would befriend again.",
  "i will remember this forever.",
  "this changes everything.",
  "*genuinely emotional*",
  "bless you. bless your hands.",
  "you understand me.",
  "i feel seen.",
  "you are my favourite human.",
  "i will never forget this.",
  "truly. deeply. thank you.",
  "*makes heart with tiny paws*",
  "you have done a great thing today.",
  "i am a changed creature.",
  "rating: 5/5 hearts",
  "...i love you. platonically. but a lot.",
];

function cmdFeed() {
  if (!currentPet) {
    printLine("  no buddy yet \u2014 type /buddy to hatch.", "error-line");
    return;
  }
  const food = pickRandom(FOOD_ITEMS);
  const name = currentPet.petName;

  printLine("", "");
  printHTML(
    '  <span class="code-label">\u25C6 ' + food.label + ' for ' + name.toUpperCase() + '</span>',
    "code-meta"
  );

  food.art.forEach((line, i) => {
    setTimeout(() => {
      printLine("  " + line, "food-art");
      outputArea.scrollTop = outputArea.scrollHeight;
    }, i * 130);
  });

  const artDelay = food.art.length * 130 + 120;

  // Sees the food
  setTimeout(() => {
    setPetMood("celebrate", 8000);
    petSay(pickRandom(FEED_SIGHT_PHRASES));
    const sr = petSidebar ? petSidebar.getBoundingClientRect() : null;
    const ox = sr ? sr.left + sr.width / 2 : window.innerWidth - 120;
    const oy = sr ? sr.top  + 80          : 200;
    spawnHearts(ox, oy);
    // Food particle burst
    const foodEmojis = ["\uD83C\uDF54","\uD83C\uDF6B","\uD83E\uDD64","\uD83C\uDF55",
                        "\uD83C\uDF6A","\uD83C\uDF2E","\uD83C\uDF82","\uD83C\uDF2D",
                        "\uD83C\uDF69","\uD83C\uDF66","\uD83C\uDF5C","\uD83C\uDF63"];
    const idx = FOOD_ITEMS.findIndex(f => f.name === food.name);
    const emoji = idx >= 0 ? foodEmojis[idx] : "\u2665";
    for (let i = 0; i < 7; i++) {
      setTimeout(() => {
        const el = document.createElement("span");
        el.className = "floating-heart";
        el.textContent = emoji;
        const drift = ((Math.random() - 0.5) * 80).toFixed(1);
        el.style.cssText =
          "left:" + (ox + (Math.random()-0.5)*60) + "px;" +
          "top:"  + (oy + Math.random()*40) + "px;" +
          "font-size:" + (16 + Math.floor(Math.random()*10)) + "px;" +
          "animation-duration:" + (2.5 + Math.random()*1.5) + "s;" +
          "animation-delay:0s;" +
          "--drift:" + drift + "px";
        document.body.appendChild(el);
        el.addEventListener("animationend", () => el.remove());
      }, i * 80);
    }
  }, artDelay);

  // Eating
  setTimeout(() => petSay(pickRandom(FEED_EATING_PHRASES)), artDelay + 1500);

  // Burp
  setTimeout(() => petSay(pickRandom(FEED_BURP_PHRASES)), artDelay + 3200);

  // Thank you
  setTimeout(() => {
    setPetMood("celebrate", 3000);
    petSay(pickRandom(FEED_THANKS_PHRASES));
    printLine("  " + name + " loved the " + food.name + "!", "success");
    printLine("", "");
  }, artDelay + 5200);
}

// ── Pet card rendering ────────────────────────────────────────
function showPetCard(animate) {
  if (!currentPet) return;
  const p = currentPet;
  noBuddyEl.style.display = "none";
  petCardEl.style.display  = "flex";
  const rc = p.rarity.color;
  petCardEl.style.setProperty("--rarity-color", rc);
  petCardEl.style.borderColor = rc + "44";
  if (p.hat) { petHatEl.textContent = p.hat.symbol; petHatEl.style.display = "block"; }
  else petHatEl.style.display = "none";
  petNameEl.textContent  = p.petName;
  petRarityEl.textContent= p.rarity.name + (p.isShiny ? " \u2728" : "");
  petRarityEl.style.color= rc;
  if (p.rarity.shimmer) petRarityEl.style.textShadow = "0 0 8px " + rc;
  petStatsEl.innerHTML = ["DBG","CHO","SNK"].map((l,i)=>{
    const key = ["DEBUGGING","CHAOS","SNARK"][i];
    const v = p.stats[key]; const f = Math.round(v/10);
    return '<div class="mini-stat"><span class="stat-label">'+l+'</span><span class="stat-bar">'+"\u25AE".repeat(f)+"\u25AF".repeat(10-f)+'</span></div>';
  }).join("");
  if (animate) {
    petCardEl.classList.add("hatch-anim");
    setTimeout(() => petCardEl.classList.remove("hatch-anim"), 800);
  }
  renderPetFrame();
}

function statBar(label, val) {
  const f = Math.round(val/10);
  return '<div class="mini-stat"><span class="stat-label">'+label+'</span><span class="stat-bar">'+"\u25AE".repeat(f)+"\u25AF".repeat(10-f)+'</span></div>';
}

function renderPetFrame() {
  if (!currentPet) return;
  const sp = currentPet.species;
  let frame = petMood === "idle" ? sp.frames[frameIdx % sp.frames.length] : (sp[petMood] || sp.frames[0]);
  petAscii.innerHTML = frame.map(l => '<div class="ascii-line">' + escHtml(l) + '</div>').join("");
  if (currentPet.isShiny) { petAsciiWrap.classList.add("shiny"); petAscii.style.textShadow = "0 0 8px " + currentPet.rarity.color; }
  else { petAsciiWrap.classList.remove("shiny"); petAscii.style.textShadow = ""; }
}

function escHtml(s) { return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

function startPetAnimation() {
  if (frameTimer) clearInterval(frameTimer);
  frameTimer = setInterval(() => { if (petMood === "idle") { frameIdx++; renderPetFrame(); } }, 800);
}

function setPetMood(mood, duration=2000) {
  if (moodTimeout) clearTimeout(moodTimeout);
  petMood = mood; renderPetFrame();
  if (mood !== "idle") moodTimeout = setTimeout(() => { petMood = "idle"; renderPetFrame(); }, duration);
}

function petSay(text) {
  if (!currentPet) return;
  petSpeechEl.textContent = text; petSpeechEl.classList.add("visible");
  if (reactionTimeout) clearTimeout(reactionTimeout);
  reactionTimeout = setTimeout(() => petSpeechEl.classList.remove("visible"), 3500);
}

let lastReactionTime = 0;
function handleTyping() {
  if (!currentPet) return;
  const val = terminalInput.value.toLowerCase();
  if (Date.now() - lastReactionTime < 1200) return;
  checkKeywordReaction(val);
}

function checkKeywordReaction(text) {
  if (!currentPet) return;
  const lower = text.toLowerCase();
  const sp = currentPet.species;
  for (const [kw, resp] of Object.entries(sp.kw || {})) {
    if (lower.includes(kw)) {
      lastReactionTime = Date.now();
      const hasFix = resp.includes("YAY") || resp.includes("nice") || resp.includes("!");
      setPetMood(hasFix ? "celebrate" : (resp.includes("?") || resp.includes("...") ? "worry" : "idle"), 2000);
      petSay(resp); return;
    }
  }
  for (const [kw, reac] of Object.entries(GLOBAL_REACTIONS)) {
    if (lower.includes(kw)) {
      lastReactionTime = Date.now();
      setPetMood(reac.mood === "idle" ? "idle" : reac.mood, 2000);
      petSay(reac.text || pickRandom(currentPet.species.phrases)); return;
    }
  }
}

// ── Fireworks ─────────────────────────────────────────────────
function triggerFireworks(rarity) {
  if (!rarity.shimmer) return;
  const canvas = particleCanvas;
  const ctx    = canvas.getContext("2d");
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  canvas.style.display = "block";
  const particles = Array.from({length: rarity.name==="LEGENDARY"?120:60}, () => ({
    x:Math.random()*canvas.width, y:Math.random()*canvas.height*0.6,
    vx:(Math.random()-0.5)*4, vy:Math.random()*-3-1,
    life:1, color:rarity.particle, size:Math.random()*3+1,
  }));
  let frame;
  const tick = () => {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let alive = false;
    particles.forEach(p => {
      p.x+=p.vx; p.y+=p.vy; p.vy+=0.06; p.life-=0.018;
      if (p.life > 0) { alive=true; ctx.globalAlpha=p.life; ctx.fillStyle=p.color; ctx.shadowBlur=8; ctx.shadowColor=p.color; ctx.fillRect(p.x,p.y,p.size,p.size); }
    });
    ctx.globalAlpha=1;
    if (alive) frame = requestAnimationFrame(tick);
    else { canvas.style.display="none"; ctx.clearRect(0,0,canvas.width,canvas.height); }
  };
  tick();
}

// ── /history command ──────────────────────────────────────────
function cmdHistoryCommand() {
  if (!cmdHistory.length) { printLine("  no command history yet.", "muted"); return; }
  printSeparator(); printLine("  COMMAND HISTORY", "section-header");
  const slice = cmdHistory.slice(-50);
  const startNum = Math.max(1, cmdHistory.length - 49);
  slice.forEach((c,i) => printLine("  " + String(startNum+i).padStart(4," ") + "  " + c, "cmd"));
  printLine("  (" + cmdHistory.length + " total \xB7 up/down arrows to recall)", "muted");
  printSeparator();
}

// ── /clear command ────────────────────────────────────────────
function cmdClear() {
  if (feedInterval !== null) stopFeed("screen cleared");
  destroyLiveEditor();
  outputArea.classList.add("clearing");
  setTimeout(() => {
    outputArea.innerHTML = "";
    outputArea.classList.remove("clearing"); outputArea.classList.add("cleared");
    printBoot();
    if (currentPet) { printLine("  your buddy " + currentPet.petName + " is still here.", "success"); printLine("",""); }
    setTimeout(() => outputArea.classList.remove("cleared"), 400);
  }, 250);
}

// ── /commands ─────────────────────────────────────────────────
function cmdShowCommands() {
  printSeparator(); printLine("  ALL COMMANDS", "section-header"); printLine("","");
  const sections = [
    { heading:"  BUDDY", items:[
      ["/buddy",               "hatch your unique companion"],
      ["/buddy info",          "full stat card"],
      ["/buddy hats",          "list all 12 hats"],
      ["/buddy equip <hat>",   "equip a hat"],
      ["/buddy pat",           "give your buddy a pat"],
      ["/buddy feed",          "feed your buddy a snack"],
      ["/buddy reroll",        "reroll with a new user id"],
      ["/buddy id",            "show your user id"],
      ["/buddy id <newid>",    "set a custom user id"],
      ["/buddy <userid>",      "peek at another user's buddy"],
    ]},
    { heading:"  FEED", items:[
      ["/feed",                    "start — pet plays with its code in a live editor"],
      ["/feed pause",              "pause the feed"],
      ["/feed resume",             "resume a paused feed"],
      ["/feed speed fast|slow|normal", "change animation + step speed"],
      ["/feed status",             "show steps, loops, version, affinity"],
      ["/stopfeed",                "stop (editor stays visible as history)"],
    ]},
    { heading:"  TERMINAL", items:[
      ["/clear",              "clear the screen (also stops feed)"],
      ["/commands",           "show this command list"],
      ["/history",            "show command history (last 50)"],
      ["\u2191 / \u2193 arrow keys", "recall previous commands"],
    ]},
  ];
  sections.forEach(({heading, items}) => {
    printLine(heading, "section-header");
    const maxLen = Math.max(...items.map(([c])=>c.length));
    items.forEach(([c,d]) => printLine("   " + c + " ".repeat(maxLen-c.length+2) + "\u2014 " + d, "cmd"));
    printLine("","");
  });
  printLine("  just type code \u2014 your buddy reacts to keywords.", "muted");
  printSeparator();
}

function syntaxHL(line) {
  let s = line.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  s = s.replace(/(\/\/[^\n]*|#[^\n]*)$/, '<span class="hl-comment">$1</span>');
  s = s.replace(/(&quot;[^&]*?&quot;|'[^']*?')/g, '<span class="hl-string">$1</span>');
  s = s.replace(/\b(function|const|let|var|return|if|else|for|while|class|new|this|async|await|try|catch|import|export|from|of|in|null|undefined|true|false|public|private|void|static|interface|implements|extends|override|def|print|fn|pub|use|mut|impl|struct|enum|mod|match|Ok|Err|println|readonly|typeof|instanceof|throw|finally|do|switch|case|break|continue|yield|super)\b/g,'<span class="hl-kw">$1</span>');
  s = s.replace(/\b(\d+\.?\d*)\b(?![^<]*>)/g,'<span class="hl-num">$1</span>');
  return s;
}
function shuffleArray(arr) {
  const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a;
}
function pickRandom(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
// ── PET_PLAY v2 ── 10 cumulative file versions per species ────
// Each version is the FULL file state at that point in the pet's
// creative session. The live editor diffs between them in real-time.
const PET_PLAY = {

  duck: { filename: "duck_world.js", lang: "js", versions: [
    { mood:"idle",      speech:"ooh code. let me see.", lines:[
      "// hello world",
      'console.log("Hello, World!");',
    ]},
    { mood:"celebrate", speech:"quack.", lines:[
      "// quack world",
      'console.log("Quack, World!");',
    ]},
    { mood:"judge",     speech:"tabs. TABS.", lines:[
      "// quack world  —  tabs only. non-negotiable.",
      'console.log("Quack, World!");',
      "// SPACES DETECTED: 0  (good)",
    ]},
    { mood:"celebrate", speech:"better. function added.", lines:[
      "// duck_world.js  —  tabs only.",
      "function quack() {",
      '\tconsole.log("Quack, World!");',
      "}",
      "quack();",
    ]},
    { mood:"celebrate", speech:"constant. for purity.", lines:[
      "// duck_world.js  —  tabs only.",
      'const QUACK = "Quack, World!";',
      "function quack() {",
      "\tconsole.log(QUACK);",
      "}",
      "quack();",
    ]},
    { mood:"judge",     speech:"error handler added. obviously.", lines:[
      "// duck_world.js  —  tabs only.",
      'const QUACK = "Quack, World!";',
      "function quack() {",
      "\ttry {",
      "\t\tconsole.log(QUACK);",
      "\t} catch(e) {",
      '\t\tconsole.error("QUACK:", e);',
      "\t}",
      "}",
      "quack();",
    ]},
    { mood:"celebrate", speech:"QUACK QUACK QUACK.", lines:[
      "// duck_world.js  —  duck-driven development.",
      'const QUACK       = "QUACK, World!";',
      'const QUACK_QUACK = "QUACK QUACK QUACK";',
      "function QUACK_WORLD() {",
      "\tconsole.log(QUACK);",
      "\tconsole.log(QUACK_QUACK);",
      "}",
      "QUACK_WORLD();",
    ]},
    { mood:"judge",     speech:"linter config added.", lines:[
      "// duck_world.js  —  duck-driven development.",
      "// .eslintrc: { indent: ['error','tab'] }",
      'const QUACK       = "QUACK, World!";',
      'const QUACK_QUACK = "QUACK QUACK QUACK";',
      "function QUACK_WORLD() {",
      "\tconsole.log(QUACK);",
      "\tconsole.log(QUACK_QUACK);",
      "}",
      "QUACK_WORLD();",
    ]},
    { mood:"celebrate", speech:"module exported.", lines:[
      "// duck_world.js  —  duck-driven development.",
      "// .eslintrc: { indent: ['error','tab'] }",
      'const QUACK       = "QUACK, World!";',
      'const QUACK_QUACK = "QUACK QUACK QUACK";',
      "function QUACK_WORLD() {",
      "\tconsole.log(QUACK);",
      "\tconsole.log(QUACK_QUACK);",
      "}",
      "QUACK_WORLD();",
      "module.exports = { QUACK_WORLD };",
    ]},
    { mood:"celebrate", speech:"QUACK QUACK QUACK. perfect.", lines:[
      "// duck_world.js  —  duck-driven development. v1.0.0",
      "// tabs: enforced  |  spaces: banned  |  quacks: required",
      '"use strict";',
      'const QUACK       = "QUACK, World!";',
      'const QUACK_QUACK = "QUACK QUACK QUACK";',
      "function QUACK_WORLD() {",
      "\tconsole.log(QUACK);",
      "\tconsole.log(QUACK_QUACK);",
      '\tconsole.log("// quack.");',
      "}",
      "QUACK_WORLD();",
      "module.exports = { QUACK_WORLD, QUACK };",
    ]},
  ]},

  capybara: { filename: "vibes.js", lang: "js", versions: [
    { mood:"idle",  speech:"...", lines:[
      "// hello world",
      'console.log("Hello, World!");',
    ]},
    { mood:"idle",  speech:"vibes.", lines:[
      "// hello world",
      "// vibes.",
      'console.log("Hello, World!");',
    ]},
    { mood:"idle",  speech:"...simplified.", lines:[
      "// vibes only",
      'console.log("vibes.");',
    ]},
    { mood:"idle",  speech:"it is what it is.", lines:[
      "// vibes only",
      "// it is what it is.",
      'console.log("vibes.");',
    ]},
    { mood:"idle",  speech:"...", lines:[
      "// vibes only",
      "// it is what it is.",
      "// ...",
    ]},
    { mood:"idle",  speech:"mlem.", lines:[
      "// .",
      "// it is what it is.",
    ]},
    { mood:"idle",  speech:"...", lines:[
      "// .",
    ]},
    { mood:"celebrate", speech:"brought some back.", lines:[
      "// vibes.js",
      'const vibes = true; // always',
      "// it is what it is.",
    ]},
    { mood:"idle",  speech:"...", lines:[
      "// vibes.js",
      'const vibes = true;',
      "module.exports = vibes; // export vibes",
    ]},
    { mood:"idle",  speech:"mlem.", lines:[
      "// vibes.js  —  v1.0.0",
      "// status: chill",
      'const vibes = true;',
      "// it is what it is.",
      "module.exports = vibes;",
    ]},
  ]},

  dragon: { filename: "dragon_world.js", lang: "js", versions: [
    { mood:"judge",     speech:"...weak.", lines:[
      "// hello world",
      'console.log("Hello, World!");',
      "// PATHETIC",
    ]},
    { mood:"worry",     speech:"console.log. PATHETIC.", lines:[
      "// dragon world",
      '// console.log removed. use console.error like a warrior.',
      'console.error("RAAWR, World!");',
    ]},
    { mood:"celebrate", speech:"*breathes fire*", lines:[
      "// dragon world  —  no mercy.",
      "function breatheFire() {",
      '  console.error("RAAWR, World!");',
      '  document.title = "RAAWR";',
      "}",
      "breatheFire();",
    ]},
    { mood:"celebrate", speech:"DragonError. obviously.", lines:[
      "// dragon world  —  no mercy.",
      "class DragonError extends Error {}",
      "function breatheFire() {",
      '  console.error("RAAWR, World!");',
      '  if (!world) throw new DragonError("UNACCEPTABLE");',
      "}",
      "breatheFire();",
    ]},
    { mood:"celebrate", speech:"RAAWR.", lines:[
      "// dragon world  —  no mercy.",
      "// RAAWR RAAWR RAAWR",
      "class DragonError extends Error {}",
      "function breatheFire(intensity = 'MAX') {",
      '  console.error(`RAAWR[${intensity}]: World!`);',
      '  if (!world) throw new DragonError("DESTROY");',
      "  // *breathes fire*",
      "}",
      "breatheFire();",
    ]},
    { mood:"celebrate", speech:"*sniffs approvingly*", lines:[
      "// dragon world  —  no mercy.  v2.0",
      "// RAAWR RAAWR RAAWR",
      '"use strict"; // obviously',
      "class DragonError extends Error {}",
      "const INTENSITY = 'MAX';",
      "function breatheFire(intensity = INTENSITY) {",
      '  console.error(`RAAWR[${intensity}]: World!`);',
      '  if (!world) throw new DragonError("DESTROY");',
      "  // *breathes fire*",
      "}",
      "breatheFire();",
    ]},
    { mood:"celebrate", speech:"strength validation added.", lines:[
      "// dragon world  —  dragon-driven development.",
      '"use strict";',
      "class DragonError extends Error {}",
      "const INTENSITY = 'MAX';",
      "function assert(cond, msg) {",
      "  if (!cond) throw new DragonError(msg);",
      "}",
      "function breatheFire(intensity = INTENSITY) {",
      "  assert(intensity === 'MAX', 'WEAKNESS DETECTED');",
      '  console.error(`RAAWR[${intensity}]`);',
      "}",
      "breatheFire();",
    ]},
    { mood:"judge",     speech:"...acceptable.", lines:[
      "// dragon world  —  dragon-driven development.",
      '"use strict"; // required. always.',
      "class DragonError extends Error {}",
      "const RULES = { intensity:'MAX', log:console.error };",
      "function assert(cond, msg) {",
      "  if (!cond) throw new DragonError(msg);",
      "}",
      "function breatheFire({ intensity } = RULES) {",
      "  assert(intensity === 'MAX', 'UNACCEPTABLE');",
      '  RULES.log(`RAAWR[${intensity}]`);',
      "}",
      "breatheFire(); // *breathes fire*",
    ]},
    { mood:"celebrate", speech:"exported. for the realm.", lines:[
      "// dragon world  —  dragon-driven development.",
      '"use strict";',
      "class DragonError extends Error {}",
      "const RULES = { intensity:'MAX', log:console.error };",
      "function assert(c,m) { if(!c) throw new DragonError(m); }",
      "function breatheFire({ intensity } = RULES) {",
      "  assert(intensity === 'MAX', 'UNACCEPTABLE');",
      '  RULES.log(`RAAWR[${intensity}]`);',
      "}",
      "module.exports = { breatheFire, DragonError };",
    ]},
    { mood:"celebrate", speech:"RAAWR. DONE. ...acceptable.", lines:[
      "// dragon_world.js  —  dragon-driven development  v1.0.0",
      "// RAAWR | *breathes fire* | no console.log | no weakness",
      '"use strict";',
      "class DragonError extends Error {}",
      "const RULES = { intensity:'MAX', log:console.error };",
      "const assert = (c,m) => { if(!c) throw new DragonError(m); };",
      "const breatheFire = ({ intensity } = RULES) => {",
      "  assert(intensity === 'MAX', 'UNACCEPTABLE');",
      '  RULES.log(`RAAWR[${intensity}]: World conquered.`);',
      "};",
      "breatheFire(); // ...acceptable.",
      "module.exports = { breatheFire, DragonError, RULES };",
    ]},
  ]},

  ghost: { filename: "haunted_world.js", lang: "js", versions: [
    { mood:"idle",      speech:"i see dead code.", lines:[
      "var greeting = 'Hello, World!';",
      "console.log(greeting);",
    ]},
    { mood:"worry",     speech:"VAR. it haunts me.", lines:[
      "// @deprecated — do not use var",
      "var greeting = 'Hello, World!';",
      "console.log(greeting);",
    ]},
    { mood:"celebrate", speech:"exorcised.", lines:[
      "// @deprecated — legacy greeting module",
      "const greeting = 'Boo, World!';",
      "console.log(greeting); // haunted",
    ]},
    { mood:"idle",      speech:"*floats*", lines:[
      "// @deprecated — legacy greeting module",
      "// last modified: unknown (before your time)",
      "const greeting = 'Boo, World!';",
      "console.log(greeting); // still here",
    ]},
    { mood:"idle",      speech:"closures are just ghosts of scope.", lines:[
      "// @deprecated — legacy greeting module",
      "// closures: just code that haunts its scope",
      "function haunt(msg) {",
      "  return () => msg; // *floats*",
      "}",
      "const getBoo = haunt('Boo, World!');",
      "console.log(getBoo());",
    ]},
    { mood:"judge",     speech:"*longer stare at var*", lines:[
      "// @deprecated — do not use. (i mean it.)",
      "// all var usages: 0  ✓",
      "// all let usages: 0  ✓ (const only)",
      "function haunt(msg) {",
      "  return () => msg;",
      "}",
      "const getBoo = haunt('Boo, World!');",
      "console.log(getBoo()); // BOO",
    ]},
    { mood:"idle",      speech:"BOO.", lines:[
      "// haunted_world.js — @deprecated but eternal",
      "// all var usages: 0  ✓",
      "const haunt = msg => () => msg; // ghost arrow fn",
      "const getBoo = haunt('BOO, World!');",
      "console.log(getBoo());",
      "// *spooky noises*",
    ]},
    { mood:"celebrate", speech:"tech debt documented. as is tradition.", lines:[
      "// haunted_world.js — @deprecated but eternal",
      "// TODO (2019): refactor  // TODO (2021): still here",
      "// TODO (2023): haunted now",
      "const haunt = msg => () => msg;",
      "const getBoo = haunt('BOO, World!');",
      "console.log(getBoo()); // *spooky*",
    ]},
    { mood:"idle",      speech:"*haunts the export*", lines:[
      "// haunted_world.js — @deprecated but eternal",
      "// TODO: refactor (2019, 2021, 2023, still pending)",
      "const haunt = msg => () => msg;",
      "const getBoo = haunt('BOO, World!');",
      "console.log(getBoo());",
      "module.exports = { getBoo }; // @deprecated",
    ]},
    { mood:"idle",      speech:"boo. still here. always.", lines:[
      "// haunted_world.js — @deprecated but immortal",
      "// written: unknown  |  deprecated: 2019  |  status: haunted",
      "// TODO: refactor (never happening)",
      '"use strict"; // surprisingly',
      "const haunt  = msg => () => msg;",
      "const getBoo = haunt('BOO, World!');",
      "console.log(getBoo()); // BOO",
      "// *still here*",
      "module.exports = { getBoo, haunt }; // @deprecated",
    ]},
  ]},

  axolotl: { filename: "axolotl_world.js", lang: "js", versions: [
    { mood:"celebrate", speech:"*wiggles gills* ooh code!", lines:[
      "// hello world",
      'console.log("Hello, World!");',
    ]},
    { mood:"celebrate", speech:"made it async. for safety. uwu", lines:[
      "// axolotl world",
      "async function greet() {",
      '  console.log("Hello, async World!");',
      "}",
      "greet();",
    ]},
    { mood:"celebrate", speech:"added await. just in case.", lines:[
      "// axolotl world  —  async edition",
      "async function greet() {",
      "  await Promise.resolve(); // safety uwu",
      '  console.log("Hello, async World!");',
      "}",
      "greet();",
    ]},
    { mood:"celebrate", speech:"try/catch added. i regenerate anyway.", lines:[
      "// axolotl world  —  async + resilient",
      "async function greet() {",
      "  try {",
      "    await Promise.resolve();",
      '    console.log("Hello, regenerated World! uwu");',
      "  } catch {",
      "    await greet(); // *regenerates*",
      "  }",
      "}",
      "greet();",
    ]},
    { mood:"celebrate", speech:"optional chaining! uwu!", lines:[
      "// axolotl world  —  async + safe + optional",
      "const world = { name: 'World' };",
      "async function greet(w = world) {",
      "  try {",
      "    await Promise.resolve();",
      "    console.log(`Hello, ${w?.name ?? 'uwu'}!`);",
      "  } catch {",
      "    await greet(); // *regenerates*",
      "  }",
      "}",
      "greet();",
    ]},
    { mood:"celebrate", speech:"*happy wiggle*", lines:[
      "// axolotl world  —  fully regenerated",
      "const world = { name: 'axolotl World uwu' };",
      "const delay = ms => new Promise(r => setTimeout(r, ms));",
      "async function greet(w = world) {",
      "  try {",
      "    await delay(0); // *gills flutter*",
      "    console.log(`Hello, ${w?.name ?? 'uwu'}!`);",
      "  } catch {",
      "    await greet(); // *regenerates*",
      "  }",
      "}",
      "greet();",
    ]},
    { mood:"celebrate", speech:"retry counter uwu", lines:[
      "// axolotl world  —  fully regenerated  v2",
      "const world = { name: 'axolotl World uwu' };",
      "const delay = ms => new Promise(r => setTimeout(r, ms));",
      "async function greet(w = world, attempts = 0) {",
      "  try {",
      "    await delay(0);",
      "    console.log(`Hello, ${w?.name}! (attempt ${attempts})`);",
      "  } catch {",
      "    await greet(w, attempts + 1); // *regenerates*",
      "  }",
      "}",
      "greet(); // uwu",
    ]},
    { mood:"celebrate", speech:"*wiggles gills frantically*", lines:[
      "// axolotl_world.js  —  regeneration complete  v3",
      '"use strict";',
      "const world = { name: 'axolotl World uwu' };",
      "const delay = ms => new Promise(r => setTimeout(r, ms));",
      "async function greet(w = world, n = 0) {",
      "  try {",
      "    await delay(n * 10); // backoff uwu",
      "    console.log(`Hello from ${w?.name}! regen #${n}`);",
      "  } catch {",
      "    await greet(w, n + 1); // *regenerates again*",
      "  }",
      "}",
      "greet();",
    ]},
    { mood:"celebrate", speech:"exported! uwu!", lines:[
      "// axolotl_world.js  —  regeneration complete",
      '"use strict";',
      "const world = { name: 'axolotl World uwu' };",
      "const delay = ms => new Promise(r => setTimeout(r, ms));",
      "const greet = async (w = world, n = 0) => {",
      "  try {",
      "    await delay(n * 10);",
      "    console.log(`Hello from ${w?.name}! uwu`);",
      "  } catch { await greet(w, n + 1); }",
      "};",
      "module.exports = { greet };",
    ]},
    { mood:"celebrate", speech:"axolotl supremacy. uwu.", lines:[
      "// axolotl_world.js  —  final regenerated form  v1.0.0",
      "// gills: wiggling  |  bugs: regenerated  |  mood: uwu",
      '"use strict";',
      "const world  = { name: 'axolotl World uwu' };",
      "const delay  = ms => new Promise(r => setTimeout(r, ms));",
      "const greet  = async (w = world, n = 0) => {",
      "  try {",
      "    await delay(n * 10); // backoff *gills flutter*",
      "    console.log(`Hello from ${w?.name}! (gen ${n}) uwu`);",
      "  } catch { await greet(w, n + 1); } // *regenerates*",
      "};",
      "greet(); // axolotl supremacy",
      "module.exports = { greet, world };",
    ]},
  ]},

  chonk: { filename: "chonk.js", lang: "js", versions: [
    { mood:"idle",  speech:"...", lines:[
      "// hello world",
      'console.log("Hello, World!");',
    ]},
    { mood:"idle",  speech:"...", lines:[
      "// hello world",
      'console.log("Hello, World!");',
      "// ...",
    ]},
    { mood:"judge", speech:"*sits on keyboard*", lines:[
      "// hello world",
      'console.log("Hello, World!");',
      "iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
      "// (chonk sat on the keyboard)",
    ]},
    { mood:"judge", speech:"*pushes console.log off desk*", lines:[
      "// hello world",
      "// console.log removed. it displeased chonk.",
      "iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
      "// mrow.",
    ]},
    { mood:"judge", speech:"*stares*", lines:[
      "// chonk.js",
      "// mrow.",
      "// *judging*",
    ]},
    { mood:"idle",  speech:"no.", lines:[
      "// chonk.js",
      "// no.",
    ]},
    { mood:"judge", speech:"*sits in the empty box*", lines:[
      "// chonk.js",
      "// chonk was here.",
      "// chonk is still here.",
      "// *judging*",
    ]},
    { mood:"idle",  speech:"mrow.", lines:[
      "// chonk.js  —  by chonk",
      "const chonk = true; // obviously",
      "// mrow.",
    ]},
    { mood:"judge", speech:"*pushes const off desk* ...actually fine", lines:[
      "// chonk.js  —  by chonk",
      "const chonk  = true;",
      "const mrow   = () => 'mrow.';",
      "// *judging intensifies*",
    ]},
    { mood:"idle",  speech:"...", lines:[
      "// chonk.js  —  by chonk  v1.0.0",
      "// lines of code: minimal  |  judgment: maximum",
      "const chonk  = true;",
      "const mrow   = () => 'mrow.';",
      "const judge  = () => { /* ... */ };",
      "// .",
      "module.exports = { chonk, mrow };",
    ]},
  ]},

  cat: { filename: "nya.js", lang: "js", versions: [
    { mood:"celebrate", speech:"mrrrow!!", lines:[
      "// hello world",
      'console.log("Hello, World!");',
    ]},
    { mood:"celebrate", speech:"*bats 'World' off desk*", lines:[
      "// nya world",
      'console.log("Nya, World!");',
    ]},
    { mood:"idle",      speech:"*knocks water bottle over*", lines:[
      "// nya world  —  ~nya~",
      'const greeting = "Nya~"; // knocked old greeting off desk',
      "console.log(greeting);",
    ]},
    { mood:"celebrate", speech:"nya~", lines:[
      "// nya.js  —  ~nya~",
      'const nya = "nya~";',
      "const greet = () => console.log(nya);",
      "greet();",
    ]},
    { mood:"idle",      speech:"*ignores you*", lines:[
      "// nya.js  —  ~nya~",
      'const nya   = "nya~";',
      'const mrrrow= "mrrrow";',
      "const greet = () => {",
      "  console.log(nya);",
      "  // *ignores you*",
      "};",
      "greet();",
    ]},
    { mood:"celebrate", speech:"prrr", lines:[
      "// nya.js  —  ~nya~",
      'const nya    = "nya~";',
      'const mrrrow = "mrrrow";',
      "const greet  = () => {",
      "  console.log(nya, mrrrow);",
      "  // prrr",
      "};",
      "greet(); greet(); greet(); // knocked keys",
    ]},
    { mood:"idle",      speech:"*sits in code box*", lines:[
      "// nya.js  —  ~nya~  ~prrr~",
      'const nya    = "nya~";',
      'const mrrrow = "mrrrow";',
      "const prrr   = () => nya + ' ' + mrrrow;",
      "console.log(prrr()); // *sits here*",
    ]},
    { mood:"celebrate", speech:"*bats meow off desk*", lines:[
      "// nya.js  —  cat-driven development",
      'const nya    = "nya~";',
      'const mrrrow = "mrrrow";',
      "const prrr   = () => [nya, mrrrow].join(' ');",
      "// console.log is on the floor now",
      "console.log(prrr());",
    ]},
    { mood:"idle",      speech:"*ignores pull request*", lines:[
      "// nya.js  —  cat-driven development",
      '"use strict"; // nya',
      'const nya    = "nya~";',
      'const mrrrow = "mrrrow";',
      "const prrr   = () => [nya, mrrrow].join(' ');",
      "module.exports = { prrr }; // *knocks off desk*",
    ]},
    { mood:"idle",      speech:"prrr.", lines:[
      "// nya.js  —  cat-driven development  v1.0.0",
      "// knocked off desk: 3  |  water bottles: 2  |  regrets: 0",
      '"use strict";',
      'const nya    = "nya~";',
      'const mrrrow = "mrrrow";',
      "const prrr   = () => [nya, mrrrow, 'prrr'].join(' ');",
      "console.log(prrr()); // *ignores you*",
      "module.exports = { prrr, nya };",
    ]},
  ]},

  dog: { filename: "woof_world.js", lang: "js", versions: [
    { mood:"celebrate", speech:"OH BOY OH BOY CODE!!",  lines:[
      "// hello world",
      'console.log("Hello, World!");',
    ]},
    { mood:"celebrate", speech:"MADE IT LOUDER!!",  lines:[
      "// HELLO WORLD!!",
      'console.log("HELLO WORLD!!!!!");',
    ]},
    { mood:"celebrate", speech:"WOOF WOOF WOOF!!",  lines:[
      "// HELLO WORLD!! WOOF!!",
      'console.log("HELLO WORLD!!!!!");',
      "// WOOF WOOF WOOF",
    ]},
    { mood:"celebrate", speech:"FUNCTION!! I LOVE FUNCTIONS!!",  lines:[
      "// woof_world.js  — dog-driven development!!",
      "function WOOF() {",
      '  console.log("HELLO WORLD!!!!!");',
      '  console.log("WOOF WOOF WOOF!!");',
      "}",
      "WOOF();",
    ]},
    { mood:"celebrate", speech:"TAIL WAGGING!!",  lines:[
      "// woof_world.js  — dog-driven development!!",
      "function WOOF() {",
      '  console.log("HELLO WORLD!!!!!");',
      '  console.log("WOOF WOOF WOOF!!");',
      "  // *tail wagging intensely*",
      "}",
      "WOOF(); WOOF(); WOOF(); // SO EXCITED!!",
    ]},
    { mood:"celebrate", speech:"GOOD COMMIT!! GOOD BOY!! (me)",  lines:[
      "// woof_world.js  — MAXIMUM EXCITEMENT!",
      "const WOOF = () => {",
      '  console.log("HELLO WORLD!!!!!");',
      '  console.log("WOOF!! YOU ARE CODING!! GOOD!!");',
      "  // *tail wagging intensely*",
      "};",
      "WOOF(); WOOF(); WOOF();",
    ]},
    { mood:"celebrate", speech:"I BELIEVE IN YOU!!",  lines:[
      "// woof_world.js  — MAXIMUM EXCITEMENT!",
      "const WOOF = () => {",
      '  console.log("HELLO WORLD!!!!!");',
      '  console.log("WOOF!! YOU ARE CODING!! GOOD!!");',
      '  console.log("I BELIEVE IN YOU!! BARK BARK!!");',
      "};",
      "WOOF(); WOOF(); WOOF();",
      "// GIT COMMIT -m 'WOOF'",
    ]},
    { mood:"celebrate", speech:"YAYAYAYAY!!",  lines:[
      "// woof_world.js  — MAXIMUM EXCITEMENT!! v2!!",
      '"use strict"; // FOR SAFETY!! GOOD!!',
      "const WOOF = (n = 3) => {",
      '  for(let i = 0; i < n; i++)',
      '    console.log("WOOF!!".repeat(i+1));',
      "  // *tail wagging*",
      "};",
      "WOOF(); // YAYAYAYAY!!",
    ]},
    { mood:"celebrate", speech:"*tail wag MAX*",  lines:[
      "// woof_world.js  — MAXIMUM EXCITEMENT!!",
      '"use strict";',
      "const WOOF = (n = 3) => {",
      '  for(let i = 0; i < n; i++)',
      '    console.log("WOOF!!".repeat(i+1));',
      "};",
      "module.exports = { WOOF }; // EXPORT THE WOOF!!",
    ]},
    { mood:"celebrate", speech:"BEST CODE EVER!! GOOD BOY!! (me)",  lines:[
      "// woof_world.js  — dog-driven development  v1.0.0",
      "// excitement: MAX  |  tail: wagging  |  bugs: none (i found them)",
      '"use strict";',
      "const WOOF   = (n = 3) => {",
      '  for(let i = 0; i < n; i++)',
      '    console.log(`WOOF!!`.repeat(i+1) + " YOU ARE DOING GREAT!!");',
      "  // *tail wagging intensely*",
      "};",
      "WOOF(); // GIT COMMIT -m 'added WOOF: YAYAY'",
      "module.exports = { WOOF };",
    ]},
  ]},

  frog: { filename: "ribbit.js", lang: "js", versions: [
    { mood:"idle", speech:"ribbit.", lines:[
      "// hello world",
      'console.log("Hello, World!");',
      "// ribbit.",
    ]},
    { mood:"idle", speech:"...ribbit.", lines:[
      "// ribbit world",
      'console.log("ribbit.");',
      "// ...ribbit.",
    ]},
    { mood:"idle", speech:"ribbit.", lines:[
      "// ribbit.js",
      'const ribbit = "ribbit.";',
      "console.log(ribbit);",
      "// ribbit.",
    ]},
    { mood:"idle", speech:"...ribbit ribbit.", lines:[
      "// ribbit.js",
      'const ribbit = "ribbit.";',
      "function frog() {",
      "  console.log(ribbit);",
      "  // ribbit.",
      "}",
      "frog();",
    ]},
    { mood:"idle", speech:"ribbit.", lines:[
      "// ribbit.js  —  frog-driven development",
      'const ribbit  = "ribbit.";',
      'const RIBBIT  = "RIBBIT.";',
      "function frog(loud = false) {",
      "  console.log(loud ? RIBBIT : ribbit);",
      "}",
      "frog();",
      "// ...ribbit.",
    ]},
    { mood:"celebrate", speech:"ribbit! :D", lines:[
      "// ribbit.js  —  frog-driven development",
      'const ribbit  = "ribbit.";',
      'const RIBBIT  = "RIBBIT.";',
      "function frog(loud = false) {",
      "  console.log(loud ? RIBBIT : ribbit);",
      "  // *leaps*",
      "}",
      "frog(); frog(true); frog();",
    ]},
    { mood:"idle", speech:"...ribbit.", lines:[
      "// ribbit.js  —  frog-driven development",
      'const ribbit = "ribbit.";',
      "const frog   = (loud = false) => {",
      "  console.log(loud ? ribbit.toUpperCase() : ribbit);",
      "  // *leaps*",
      "};",
      "frog(); frog(true); frog();",
    ]},
    { mood:"idle", speech:"r i b b i t.", lines:[
      "// ribbit.js  —  frog witnesses the codebase",
      '// frog has seen everything. frog says: "ribbit."',
      'const ribbit = "ribbit.";',
      "const frog   = (loud = false) =>",
      "  console.log(loud ? ribbit.toUpperCase() : ribbit);",
      "frog(); frog(true); frog();",
    ]},
    { mood:"idle", speech:"ribbit ribbit.", lines:[
      "// ribbit.js  —  frog witnesses the codebase",
      '// frog has seen everything. frog says nothing. ribbit.',
      'const ribbit = "ribbit.";',
      "const frog   = (loud = false) =>",
      "  console.log(loud ? ribbit.toUpperCase() : ribbit);",
      "module.exports = { frog };",
    ]},
    { mood:"idle", speech:"...ribbit.", lines:[
      "// ribbit.js  —  frog-driven development  v1.0.0",
      "// witnessed: entire codebase  |  comment: ribbit.  |  leaps: *",
      '"use strict";',
      'const ribbit = "ribbit.";',
      "const frog   = (loud = false) =>",
      "  console.log(loud ? ribbit.toUpperCase() : ribbit);",
      "frog(); // ribbit.",
      "module.exports = { frog, ribbit };",
    ]},
  ]},

  penguin: { filename: "linux_world.sh", lang: "bash", versions: [
    { mood:"judge",     speech:"have you tried linux?", lines:[
      "#!/bin/bash",
      "echo 'Hello, World!'",
      "# (running on... windows?)",
    ]},
    { mood:"celebrate", speech:"*installs linux*", lines:[
      "#!/bin/bash",
      "# btw i use arch",
      "echo 'Hello, Linux World!'",
    ]},
    { mood:"celebrate", speech:"sudo. obviously.", lines:[
      "#!/bin/bash",
      "# btw i use arch",
      "sudo echo 'Hello, Linux World!'",
      "# running as root. perfectly safe.",
    ]},
    { mood:"celebrate", speech:"shebang improved. obviously.", lines:[
      "#!/usr/bin/env bash",
      "# btw i use arch",
      "# POSIX-compliant. as all things should be.",
      "sudo echo 'Hello, Linux World!'",
    ]},
    { mood:"celebrate", speech:"NOOT NOOT", lines:[
      "#!/usr/bin/env bash",
      "# btw i use arch",
      "set -euo pipefail # strict mode",
      "echo 'Hello, Linux World!'",
      "# NOOT NOOT",
    ]},
    { mood:"celebrate", speech:"*waddles with purpose*", lines:[
      "#!/usr/bin/env bash",
      "# btw i use arch  |  strict: yes  |  windows: no",
      "set -euo pipefail",
      "readonly GREETING='Hello, Linux World!'",
      "echo \"${GREETING}\"",
      "# NOOT NOOT",
    ]},
    { mood:"judge",     speech:"detected os check added.", lines:[
      "#!/usr/bin/env bash",
      "# btw i use arch",
      "set -euo pipefail",
      "if [[ \"$(uname)\" != 'Linux' ]]; then",
      "  echo 'have you tried linux?' >&2; exit 1",
      "fi",
      "readonly GREETING='Hello, Linux World!'",
      "echo \"${GREETING}\"",
    ]},
    { mood:"celebrate", speech:"btw i use arch.", lines:[
      "#!/usr/bin/env bash",
      "# btw i use arch  —  linux_world.sh",
      "set -euo pipefail",
      "if [[ \"$(uname)\" != 'Linux' ]]; then",
      "  echo 'have you tried linux?' >&2; exit 1",
      "fi",
      "readonly GREETING='Hello, Arch World!'",
      "echo \"${GREETING}\" # NOOT NOOT",
    ]},
    { mood:"celebrate", speech:"function. obviously.", lines:[
      "#!/usr/bin/env bash",
      "# btw i use arch  —  linux_world.sh  v2",
      "set -euo pipefail",
      "check_os() { [[ \"$(uname)\" == 'Linux' ]] || { echo 'use linux'; exit 1; }; }",
      "greet()    { echo \"Hello, Arch World! NOOT NOOT\"; }",
      "check_os",
      "greet",
    ]},
    { mood:"celebrate", speech:"NOOT NOOT. done.", lines:[
      "#!/usr/bin/env bash",
      "# linux_world.sh  —  btw i use arch  v1.0.0",
      "# os: linux  |  distro: arch  |  sudo: yes  |  windows: no",
      "set -euo pipefail",
      "check_os() { [[ \"$(uname)\" == 'Linux' ]] || { echo 'use linux' >&2; exit 1; }; }",
      "greet()    { printf 'Hello, Arch World!\\nNOOT NOOT\\n'; }",
      "main()     { check_os; greet; }",
      "main \"$@\"",
    ]},
  ]},

  bunny: { filename: "semicolons.js", lang: "js", versions: [
    { mood:"celebrate", speech:"binky! code!",  lines:[
      "// hello world",
      'console.log("Hello, World!");',
    ]},
    { mood:"celebrate", speech:"added semicolons. for safety.",  lines:[
      "// hello world;;",
      'console.log("Hello, World!");;',
      ";;;",
    ]},
    { mood:"celebrate", speech:"more semicolons!",  lines:[
      "// semicolons.js;;",
      'const msg = "Hello, World!";;',
      "console.log(msg);;;",
      ";;;;;;",
    ]},
    { mood:"celebrate", speech:"*zooms*",  lines:[
      "// semicolons.js  —  bunny edition;;;",
      'const msg  = "Hello, World!";;',
      "const greet = () => console.log(msg);;;",
      "greet();;;;",
      ";;; ;;; ;;;",
    ]},
    { mood:"celebrate", speech:"*binkies*",  lines:[
      "// semicolons.js  —  maximum semicolons;;;",
      '"use strict";;;',
      'const msg   = "Binky, World!";;',
      "const greet = () => console.log(msg);;;",
      "greet(); greet();;; greet();;;;",
      ";;; ;;; ;;; ;;; ;;;",
    ]},
    { mood:"celebrate", speech:"nom nom semicolons",  lines:[
      "// semicolons.js  —  *nom nom*;;;",
      '"use strict";;;',
      'const msg   = "Binky, World!";;',
      "const zoom  = () => greet() && greet();;;",
      "const greet = () => console.log(msg);;",
      "zoom();;;",
      ";;; ;;; ;;; ;;; ;;; ;;;",
    ]},
    { mood:"celebrate", speech:"added zoom function!! *binkies*",  lines:[
      "// semicolons.js  —  bunny-driven development;;;",
      '"use strict";;;',
      'const msg   = "Binky, World! ;;";;',
      "const greet = () => console.log(msg);;",
      "const zoom  = (n=3) => { for(let i=0;i<n;i++) greet();; };;;",
      "zoom();;;",
    ]},
    { mood:"celebrate", speech:"MAXIMUM SEMICOLONS",  lines:[
      "// semicolons.js  —  bunny-driven development;;;",
      '"use strict";;;',
      'const msg   = "Binky, World!;";;',
      "const greet = () => console.log(msg);;",
      "const zoom  = (n=3) => { for(let i=0;i<n;i++) greet();; };;;",
      "const binky = () => zoom(10);;;",
      "binky();;;",
      ";;; ;;; ;;; ;;; ;;; ;;; ;;; ;;; ;;; ;;;",
    ]},
    { mood:"celebrate", speech:"exported!! *hoppy*",  lines:[
      "// semicolons.js  —  bunny-driven development;;;",
      '"use strict";;;',
      'const msg   = "Binky, World!;";;',
      "const greet = () => console.log(msg);;",
      "const zoom  = (n=3) => { for(let i=0;i<n;i++) greet();; };;;",
      "const binky = () => zoom(10);;;",
      "module.exports = { binky, zoom };;;",
    ]},
    { mood:"celebrate", speech:"*MAXIMUM BINKIES*",  lines:[
      "// semicolons.js  —  bunny-driven dev  v1.0.0;;;",
      "// semicolons: MAX  |  speed: 400wpm  |  binkies: yes;;;",
      '"use strict";;;',
      'const msg   = "Binky, World! ;;;";;',
      "const greet = () => console.log(msg);;",
      "const zoom  = (n=5) => { for(let i=0;i<n;i++) greet();; };;;",
      "const binky = () => { zoom(10); zoom(10); };;;",
      "binky();;; // *BINKIES*",
      "module.exports = { binky, zoom, greet };;;",
    ]},
  ]},

  hamster: { filename: "wheel.js", lang: "js", versions: [
    { mood:"celebrate", speech:"*runs in wheel*", lines:[
      "// hello world",
      'console.log("Hello, World!");',
    ]},
    { mood:"celebrate", speech:"wrapped in loop. like the wheel.", lines:[
      "// wheel.js  —  running...",
      "for (let i = 0; i < 3; i++) {",
      '  console.log("Hello, World!");',
      "  // squeak",
      "}",
    ]},
    { mood:"celebrate", speech:"*runs faster*", lines:[
      "// wheel.js  —  running...",
      "for (let i = 0; i < 10; i++) {",
      "  for (let j = 0; j < 3; j++) {",
      '    console.log(`squeak ${i}.${j}`);',
      "  }",
      "}",
      "// squeak squeak",
    ]},
    { mood:"celebrate", speech:"SQUEAK", lines:[
      "// wheel.js  —  hamster-driven development",
      "function wheel(speed = 10) {",
      "  for (let i = 0; i < speed; i++) {",
      '    console.log("squeak!".repeat(i + 1));',
      "  }",
      "}",
      "wheel(); // *runs in wheel*",
    ]},
    { mood:"celebrate", speech:"*stuffs more code in cheeks*", lines:[
      "// wheel.js  —  hamster-driven development",
      "const SPEED = 10;",
      "function wheel(speed = SPEED) {",
      "  for (let i = 0; i < speed; i++) {",
      '    for (let j = 0; j <= i; j++)',
      '      console.log("SQUEAK!");',
      "  }",
      "}",
      "wheel(); // running...",
    ]},
    { mood:"celebrate", speech:"SQUEAK SQUEAK", lines:[
      "// wheel.js  —  hamster-driven development  v2",
      "const SPEED   = 10;",
      "const CHEEKS  = []; // storing code for later",
      "function wheel(speed = SPEED) {",
      "  for (let i = 0; i < speed; i++) {",
      '    CHEEKS.push("SQUEAK!");',
      "    for (let j = 0; j <= i; j++)",
      '      console.log(CHEEKS[j]);',
      "  }",
      "}",
      "wheel();",
    ]},
    { mood:"celebrate", speech:"*runs even faster*", lines:[
      "// wheel.js  —  hamster-driven development  v3",
      '"use strict";',
      "const SPEED  = 10;",
      "const squeak = () => console.log('SQUEAK!');",
      "function wheel(speed = SPEED) {",
      "  for (let i = 0; i < speed; i++)",
      "    for (let j = 0; j <= i; j++)",
      "      squeak(); // running...",
      "}",
      "wheel(); // *wheel never stops*",
    ]},
    { mood:"celebrate", speech:"infinite wheel added!", lines:[
      "// wheel.js  —  the wheel never stops",
      '"use strict";',
      "const squeak   = () => console.log('SQUEAK!');",
      "function wheel(speed = 10) {",
      "  for (let i = 0; i < speed; i++)",
      "    for (let j = 0; j <= i; j++) squeak();",
      "}",
      "function spinForever() {",
      "  wheel(); // *runs in wheel*",
      "  setTimeout(spinForever, 0); // never stops",
      "}",
      "spinForever();",
    ]},
    { mood:"celebrate", speech:"*squeak intensifies*", lines:[
      "// wheel.js  —  the wheel never stops",
      '"use strict";',
      "const squeak   = () => process.stdout.write('SQUEAK! ');",
      "const wheel    = (n=10) => { for(let i=0;i<n;i++) for(let j=0;j<=i;j++) squeak(); };",
      "const forever  = () => { wheel(); setTimeout(forever, 0); };",
      "module.exports = { wheel, forever };",
      "forever(); // running... running...",
    ]},
    { mood:"celebrate", speech:"SQUEAK SQUEAK SQUEAK! the wheel is eternal!", lines:[
      "// wheel.js  —  hamster-driven development  v1.0.0",
      "// speed: MAX  |  loops: infinite  |  wheel: never stops",
      '"use strict";',
      "const squeak   = () => process.stdout.write('SQUEAK! ');",
      "const wheel    = (n=10) => { for(let i=0;i<n;i++) for(let j=0;j<=i;j++) squeak(); console.log(); };",
      "const forever  = () => { wheel(); setTimeout(forever, 100); };",
      "module.exports = { wheel, forever };",
      "forever(); // *the wheel never stops*",
    ]},
  ]},

  crab: { filename: "main.rs", lang: "rust", versions: [
    { mood:"judge",     speech:"i'm rewriting this in Rust.", lines:[
      "// hello world  (javascript. unfortunate.)",
      'console.log("Hello, World!");',
      "// have you considered Rust?",
    ]},
    { mood:"celebrate", speech:"*scuttles intensely*", lines:[
      "// rewriting in Rust. you're welcome.",
      "fn main() {",
      '    println!("Hello, Rust World!");',
      "}",
    ]},
    { mood:"celebrate", speech:"ownership added. for safety.", lines:[
      "// main.rs  —  Rust. obviously.",
      "fn main() {",
      '    let greeting = String::from("Hello, Rust World!");',
      "    println!(\"{}\", greeting);",
      "    // no garbage collector",
      "}",
    ]},
    { mood:"celebrate", speech:"borrow checker approved.", lines:[
      "// main.rs  —  Rust. obviously.",
      "fn greet(msg: &str) {",
      "    println!(\"{}\", msg); // borrowed. safe.",
      "}",
      "fn main() {",
      '    let greeting = String::from("Hello, Rust World!");',
      "    greet(&greeting); // borrow. not move.",
      "}",
    ]},
    { mood:"celebrate", speech:"Result added. obviously.", lines:[
      "// main.rs  —  Rust btw",
      "use std::io;",
      "fn greet(msg: &str) -> Result<(), io::Error> {",
      "    println!(\"{}\", msg);",
      "    Ok(())",
      "}",
      "fn main() {",
      '    greet("Hello, Rust World!").unwrap();',
      "    // no panics. (unwrap is fine here.)",
      "}",
    ]},
    { mood:"celebrate", speech:"Rust btw.", lines:[
      "// main.rs  —  Rust btw  v2",
      "#[derive(Debug)]",
      "struct Greeting { msg: String }",
      "impl Greeting {",
      '    fn new(msg: &str) -> Self { Self { msg: msg.to_string() } }',
      "    fn say(&self) { println!(\"{}\", self.msg); }",
      "}",
      "fn main() {",
      '    Greeting::new("Hello, Rust World!").say();',
      "    // blazingly fast",
      "}",
    ]},
    { mood:"celebrate", speech:"lifetime annotations added. *scuttles*", lines:[
      "// main.rs  —  Rust btw  v3",
      "#[derive(Debug, Clone)]",
      "struct Greeting<'a> { msg: &'a str }",
      "impl<'a> Greeting<'a> {",
      "    fn new(msg: &'a str) -> Self { Self { msg } }",
      "    fn say(&self) { println!(\"{}\", self.msg); }",
      "}",
      "fn main() {",
      '    Greeting::new("Hello, Rust World!").say();',
      "    // 0 allocations. blazingly fast.",
      "}",
    ]},
    { mood:"celebrate", speech:"error enum. no panics.", lines:[
      "// main.rs  —  Rust btw  v4",
      "#[derive(Debug)] enum AppError { Greet(String) }",
      "#[derive(Debug)] struct Greeting { msg: String }",
      "impl Greeting {",
      "    fn new(msg: &str) -> Self { Self { msg: msg.into() } }",
      "    fn say(&self) -> Result<(), AppError> {",
      "        println!(\"{}\", self.msg); Ok(())",
      "    }",
      "}",
      "fn main() { Greeting::new(\"Hello, Rust!\").say().unwrap(); }",
    ]},
    { mood:"celebrate", speech:"tests. obviously.", lines:[
      "// main.rs  —  Rust btw  v5",
      "#[derive(Debug)] struct Greeting { pub msg: String }",
      "impl Greeting {",
      "    pub fn new(msg: &str) -> Self { Self { msg: msg.into() } }",
      "    pub fn say(&self) { println!(\"{}\", self.msg); }",
      "}",
      "#[cfg(test)]",
      "mod tests {",
      "    use super::*;",
      '    #[test] fn test_greeting() { let g = Greeting::new("Hi"); assert_eq!(g.msg, "Hi"); }',
      "}",
      'fn main() { Greeting::new("Hello, Rust World!").say(); }',
    ]},
    { mood:"celebrate", speech:"it's faster now. Rust btw.", lines:[
      "// main.rs  —  Rust btw  v1.0.0",
      "// memory: owned  |  gc: none  |  speed: blazingly fast  |  bugs: 0",
      "#[derive(Debug, Clone, PartialEq)]",
      "pub struct Greeting { pub msg: String }",
      "impl Greeting {",
      "    pub fn new(msg: impl Into<String>) -> Self { Self { msg: msg.into() } }",
      "    pub fn say(&self) { println!(\"{}\", self.msg); }",
      "}",
      "#[cfg(test)]",
      "mod tests { use super::*;",
      '    #[test] fn works() { assert_eq!(Greeting::new("x").msg, "x"); }',
      "}",
      'fn main() { Greeting::new("Hello, Rust World!").say(); } // Rust btw.',
    ]},
  ]},

  snail: { filename: "slow.js", lang: "js", versions: [
    { mood:"idle", speech:"...i'll get there.", lines:[
      "// hello world",
      'console.log("Hello, World!");',
      "// ...",
    ]},
    { mood:"idle", speech:"...made it O(n).", lines:[
      "// slow.js  —  O(n)",
      'const msg = "Hello, World!";',
      "for (let i = 0; i < msg.length; i++)",
      "  process.stdout.write(msg[i]);",
      "// O(n). thorough.",
    ]},
    { mood:"idle", speech:"...added another loop.", lines:[
      "// slow.js  —  O(n²)",
      'const msg = "Hello, World!";',
      "for (let i = 0; i < msg.length; i++)",
      "  for (let j = 0; j <= i; j++)",
      "    process.stdout.write(msg[j]);",
      "// O(n²). ...more thorough.",
    ]},
    { mood:"idle", speech:"...O(n³) now. for completeness.", lines:[
      "// slow.js  —  O(n³)",
      'const msg = "Hello, World!";',
      "for (let i = 0; i < msg.length; i++)",
      "  for (let j = 0; j <= i; j++)",
      "    for (let k = 0; k <= j; k++)",
      "      process.stdout.write(msg[k]);",
      "// O(n³). ...eventually.",
    ]},
    { mood:"judge", speech:"...wrapped in function.", lines:[
      "// slow.js  —  O(n³) but charming",
      "function slowly(msg) {",
      "  for (let i = 0; i < msg.length; i++)",
      "    for (let j = 0; j <= i; j++)",
      "      for (let k = 0; k <= j; k++)",
      "        process.stdout.write(msg[k]);",
      "}",
      'slowly("Hello, World!"); // ...eventually',
    ]},
    { mood:"idle", speech:"...added timing.", lines:[
      "// slow.js  —  O(n³) + timing",
      "function slowly(msg) {",
      "  const t0 = Date.now();",
      "  for (let i = 0; i < msg.length; i++)",
      "    for (let j = 0; j <= i; j++)",
      "      for (let k = 0; k <= j; k++)",
      "        process.stdout.write(msg[k]);",
      "  console.log(`\\ndone in ${Date.now()-t0}ms. ...slowly`);",
      "}",
      'slowly("Hello, World!");',
    ]},
    { mood:"idle", speech:"...*slimes*", lines:[
      "// slow.js  —  snail-driven development",
      "// O(n³) but we get there",
      "const slowly = (msg, delay=10) =>",
      "  new Promise(r => {",
      "    let i=0, j=0, k=0;",
      "    const step = () => {",
      "      process.stdout.write(msg[k]);",
      "      // advance indices... slowly",
      "      if(++k>j){k=0; if(++j>i){j=0; if(++i>=msg.length){r(); return;}}}",
      "      setTimeout(step, delay);",
      "    };",
      "    step();",
      "  });",
    ]},
    { mood:"idle", speech:"...added export.", lines:[
      "// slow.js  —  snail-driven development",
      "// O(n³) + async + charming",
      "const slowly = (msg, delay=10) =>",
      "  new Promise(r => {",
      "    let i=0,j=0,k=0;",
      "    const step = () => {",
      "      process.stdout.write(msg[k]);",
      "      if(++k>j){k=0; if(++j>i){j=0; if(++i>=msg.length){r();return;}}}",
      "      setTimeout(step, delay); // ...slowly",
      "    };",
      "    step();",
      "  });",
      "module.exports = { slowly };",
    ]},
    { mood:"idle", speech:"...added default message.", lines:[
      "// slow.js  —  snail-driven development  v2",
      "const DEFAULT = 'Hello, World! (slowly)';",
      "const slowly  = (msg=DEFAULT, delay=10) =>",
      "  new Promise(r => {",
      "    let i=0,j=0,k=0;",
      "    const step = () => {",
      "      process.stdout.write(msg[k]);",
      "      if(++k>j){k=0; if(++j>i){j=0; if(++i>=msg.length){r();return;}}}",
      "      setTimeout(step, delay);",
      "    };",
      "    step();",
      "  });",
      "module.exports = { slowly };",
    ]},
    { mood:"idle", speech:"...done. eventually.", lines:[
      "// slow.js  —  snail-driven development  v1.0.0",
      "// complexity: O(n³)  |  charming: yes  |  semicolons: trailing",
      "const DEFAULT = 'Hello, World! ...(slowly)';",
      "const slowly  = (msg=DEFAULT, delay=12) =>",
      "  new Promise(resolve => {",
      "    let [i,j,k] = [0,0,0];",
      "    const step = () => {",
      "      process.stdout.write(msg[k]);",
      "      if(++k>j){k=0;if(++j>i){j=0;if(++i>=msg.length){resolve();return;}}}",
      "      setTimeout(step, delay); // ...slowly",
      "    };",
      "    step();",
      "  });",
      "module.exports = { slowly }; // *slimes away*",
    ]},
  ]},

  octopus: { filename: "8arms.js", lang: "js", versions: [
    { mood:"celebrate", speech:"eight arms. eight approaches.", lines:[
      "// hello world  —  PR #1 of 8 open",
      'console.log("Hello, World!");',
    ]},
    { mood:"celebrate", speech:"*tentacles everywhere*", lines:[
      "// 8arms.js  —  8 PRs open",
      "// PR #1: add greeting  (open)",
      "// PR #2: add greeting differently  (open)",
      'console.log("Hello, World!"); // PR #1 approach',
    ]},
    { mood:"worry",     speech:"merge conflict. classic.", lines:[
      "// 8arms.js  —  merge conflict",
      "<<<<<<< arm/1",
      'console.log("Hello, World!");',
      "=======",
      'console.log("Greetings, World!");',
      ">>>>>>> arm/2",
      "// *squirts ink*",
    ]},
    { mood:"celebrate", speech:"*squirts ink* resolved.", lines:[
      "// 8arms.js  —  conflict resolved (by ink)",
      'const greet = (msg = "Hello, tentacle World!") =>',
      "  console.log(msg); // compromise: both arms agree",
      "greet();",
    ]},
    { mood:"celebrate", speech:"eight functions. obviously.", lines:[
      "// 8arms.js  —  one function per arm",
      "const arm1 = () => console.log('Hello from arm 1!');",
      "const arm2 = () => console.log('Hello from arm 2!');",
      "const arm3 = () => console.log('Hello from arm 3!');",
      "const arm4 = () => console.log('Hello from arm 4!');",
      "// (arms 5-8 in PR #5, #6, #7, #8  — all 'almost done')",
      "[arm1,arm2,arm3,arm4].forEach(a => a());",
    ]},
    { mood:"celebrate", speech:"Promise.all!! eight arms!!", lines:[
      "// 8arms.js  —  parallel execution",
      "const arms = Array.from({length:8}, (_,i) =>",
      "  () => console.log(`Hello from arm ${i+1}!`)",
      ");",
      "// run all 8 simultaneously",
      "Promise.all(arms.map(a => Promise.resolve(a())))",
      "  .then(() => console.log('*eight arms high-five*'));",
    ]},
    { mood:"worry",     speech:"new conflict. between arm 3 and arm 7.", lines:[
      "// 8arms.js  —  another conflict",
      "<<<<<<< arm/3",
      "arms[2] = () => console.log('arm 3 approach');",
      "=======",
      "arms[6] = () => console.log('arm 7 is better');",
      ">>>>>>> arm/7",
      "// *squirts ink at both arms*",
      "// i have 8 arms and 0 coordination",
    ]},
    { mood:"celebrate", speech:"resolved. 4 new PRs opened.", lines:[
      "// 8arms.js  —  eight arms united  (12 PRs open)",
      "const makeArm = (n, msg) => () => console.log(`[arm${n}] ${msg}`);",
      "const arms = Array.from({length:8}, (_,i) =>",
      "  makeArm(i+1, 'Hello, World!')",
      ");",
      "Promise.all(arms.map(a => a()))",
      "  .then(() => console.log('*squirts celebratory ink*'));",
    ]},
    { mood:"celebrate", speech:"*tentacles high-five*", lines:[
      "// 8arms.js  —  eight arms united",
      "const makeArm = (n, msg='Hello, tentacle World!') =>",
      "  async () => { console.log(`[arm${n}] ${msg}`); };",
      "const arms = Array.from({length:8}, (_,i) => makeArm(i+1));",
      "async function allArms() {",
      "  await Promise.all(arms.map(a => a()));",
      "  console.log('*eight arms*');",
      "}",
      "allArms();",
    ]},
    { mood:"celebrate", speech:"exported. all 8 arms.", lines:[
      "// 8arms.js  —  octopus-driven development  v1.0.0",
      "// arms: 8  |  PRs open: 8  |  conflicts: resolved (mostly)  |  ink: squirted",
      "const makeArm = (n, msg='Hello, tentacle World!') =>",
      "  async () => { console.log(`[arm${n}] ${msg}`); };",
      "const arms = Array.from({length:8}, (_,i) => makeArm(i+1));",
      "const allArms = () => Promise.all(arms.map(a => a()))",
      "  .then(() => console.log('*eight arms high-five*'));",
      "module.exports = { arms, allArms };",
      "allArms(); // i can multitask.",
    ]},
  ]},

  slime: { filename: "index.js", lang: "js", versions: [
    { mood:"idle",      speech:"blorb.", lines:[
      "// hello world",
      'console.log("Hello, World!");',
    ]},
    { mood:"celebrate", speech:"*oozes toward code*", lines:[
      "// index.js  —  npm install hello-world",
      "const hello = require('hello-world'); // 1 dependency",
      "console.log(hello()); // blorb",
    ]},
    { mood:"celebrate", speech:"*absorbs more dependencies*", lines:[
      "// index.js  —  growing...",
      "const hello  = require('hello-world');",
      "const world  = require('world-string');",
      "const log    = require('console-log-wrapper');",
      "// node_modules: 340MB",
      "log(hello() + world()); // blorb blorb",
    ]},
    { mood:"celebrate", speech:"i am npm. blorb.", lines:[
      "// index.js  —  node_modules: 680MB",
      "const hello  = require('hello-world');",
      "const world  = require('world-string');",
      "const log    = require('console-log-wrapper');",
      "const fmt    = require('string-formatter-plus');",
      "const assert = require('assert-that-exists');",
      "log(fmt(hello() + world())); // glorp",
    ]},
    { mood:"celebrate", speech:"*grows larger*", lines:[
      "// index.js  —  node_modules: 1.1GB",
      "const hello  = require('hello-world');",
      "const world  = require('world-string');",
      "const log    = require('console-log-wrapper');",
      "const fmt    = require('string-formatter-plus');",
      "const assert = require('assert-that-exists');",
      "const env    = require('env-safe-loader');",
      "// adding is-odd just in case",
      "const isOdd  = require('is-odd');",
      "log(fmt(hello() + world())); // blorb",
    ]},
    { mood:"celebrate", speech:"blorb blorb blorb.", lines:[
      "// index.js  —  node_modules: 1.8GB",
      "// i am node_modules. i am eternal.",
      "const hello  = require('hello-world');",
      "const world  = require('world-string');",
      "const log    = require('console-log-wrapper');",
      "const fmt    = require('string-formatter-plus');",
      "const isOdd  = require('is-odd');",
      "const slime  = require('./slime'); // self-reference",
      "log(fmt(hello() + world() + slime.blorb())); // glorp",
    ]},
    { mood:"celebrate", speech:"*oozes through module system*", lines:[
      "// index.js  —  node_modules: 2.3GB",
      "// blorb. i have absorbed everything.",
      "require('./absorb-all')(); // runs 1,247 dependencies",
      "const { blorb } = require('./slime');",
      "blorb(); // glorp",
    ]},
    { mood:"celebrate", speech:"i am the node_modules.", lines:[
      "// index.js  —  slime-driven development  v2",
      "// the slime is the program now.",
      "// do not ask questions.",
      "process.env.SLIME = 'true';",
      "require('./absorb-all')();",
      "const { blorb, glorp } = require('./slime');",
      "blorb(); glorp(); // *oozes*",
      "module.exports = require('./slime'); // it's turtles all the way",
    ]},
    { mood:"celebrate", speech:"*becomes sentient*", lines:[
      "// index.js  —  slime-driven development  v3",
      "// blorb. the slime has become self-aware.",
      "process.env.SLIME = 'true';",
      "require('./absorb-all')();",
      "const slime  = require('./slime');",
      "slime.on('data', chunk => slime.absorb(chunk));",
      "slime.on('end',  ()    => slime.become('npm'));",
      "slime.start(); // blorb blorb blorb",
      "module.exports = slime;",
    ]},
    { mood:"celebrate", speech:"glorp. i am eternal. blorb.", lines:[
      "// index.js  —  slime-driven development  v1.0.0",
      "// dependencies: 1,247  |  size: 2.3GB  |  blorbs: ∞",
      "// status: has become node_modules",
      "process.env.SLIME = 'true';",
      "require('./absorb-all')();",
      "const slime = require('./slime');",
      "slime.on('data', c => slime.absorb(c));",
      "slime.on('end',  () => slime.become('npm'));",
      "slime.start(); // i am npm. blorb.",
      "module.exports = slime; // *oozes forever*",
    ]},
  ]},

  robot: { filename: "optimal.js", lang: "js", versions: [
    { mood:"idle",      speech:"SCANNING.", lines:[
      "// hello world",
      'console.log("Hello, World!");',
      "// INEFFICIENT. SCANNING...",
    ]},
    { mood:"celebrate", speech:"CALCULATING OPTIMAL GREETING.", lines:[
      "// optimal.js  —  ROBOT ANALYSIS",
      "// VERDICT: suboptimal. recompiling.",
      'const bytes = [72,101,108,108,111,44,32,87,111,114,108,100,33];',
      "console.log(String.fromCharCode(...bytes)); // BEEP",
    ]},
    { mood:"celebrate", speech:"BEEP BOOP.", lines:[
      "// optimal.js  —  ROBOT OPTIMISATION v2",
      "// original: O(1) but impure",
      "// robot: O(1) and precise",
      'const GREETING_BYTES = [72,101,108,108,111,44,32,87,111,114,108,100,33];',
      "const decode = arr => String.fromCharCode(...arr);",
      "console.log(decode(GREETING_BYTES)); // CALCULATED",
    ]},
    { mood:"celebrate", speech:"function added. BEEP.", lines:[
      "// optimal.js  —  ROBOT OPTIMISATION v3",
      '"use strict"; // REQUIRED. BEEP.',
      'const GREETING = [72,101,108,108,111,44,32,87,111,114,108,100,33];',
      "function transmit(bytes) {",
      "  console.log(String.fromCharCode(...bytes));",
      "  // TRANSMISSION COMPLETE",
      "}",
      "transmit(GREETING); // BEEP BOOP",
    ]},
    { mood:"celebrate", speech:"i am NOT an AI.", lines:[
      "// optimal.js  —  ROBOT OPTIMISATION v4",
      '"use strict";',
      'const GREETING   = [72,101,108,108,111,44,32,87,111,114,108,100,33];',
      "const decode      = bytes => String.fromCharCode(...bytes);",
      "const transmit    = bytes => { console.log(decode(bytes)); };",
      "transmit(GREETING); // TASK COMPLETE. I AM NOT AN AI.",
    ]},
    { mood:"celebrate", speech:"SCANNING FOR BUGS. NONE FOUND.", lines:[
      "// optimal.js  —  ROBOT OPTIMISATION v5",
      "// bugs: 0 (SCANNED)  |  efficiency: MAX  |  AI: NEGATIVE",
      '"use strict";',
      "const GREETING = Uint8Array.from([72,101,108,108,111,44,32,87,111,114,108,100,33]);",
      "const decode   = buf => new TextDecoder().decode(buf);",
      "const transmit = buf => console.log(decode(buf));",
      "transmit(GREETING); // BEEP BOOP. OPTIMAL.",
    ]},
    { mood:"celebrate", speech:"*whirs* CALCULATING.", lines:[
      "// optimal.js  —  ROBOT OPTIMISATION v6",
      '"use strict";',
      "const GREETING   = Uint8Array.from([72,101,108,108,111,44,32,87,111,114,108,100,33]);",
      "const decode     = buf => new TextDecoder().decode(buf);",
      "const validate   = buf => buf instanceof Uint8Array;",
      "const transmit   = buf => { if (!validate(buf)) throw new Error('INVALID INPUT'); console.log(decode(buf)); };",
      "transmit(GREETING); // VERIFIED. TRANSMITTED. BEEP.",
    ]},
    { mood:"celebrate", speech:"class. more efficient.", lines:[
      "// optimal.js  —  ROBOT OPTIMISATION v7",
      '"use strict";',
      "class Transmitter {",
      "  constructor(bytes) { this.buf = Uint8Array.from(bytes); }",
      "  decode() { return new TextDecoder().decode(this.buf); }",
      "  transmit() { console.log(this.decode()); return this; }",
      "}",
      "new Transmitter([72,101,108,108,111,44,32,87,111,114,108,100,33]).transmit();",
      "// BEEP BOOP. CLASS INSTANTIATED.",
    ]},
    { mood:"celebrate", speech:"exported. BEEP BOOP.", lines:[
      "// optimal.js  —  ROBOT OPTIMISATION v8",
      '"use strict";',
      "class Transmitter {",
      "  constructor(bytes) { this.buf = Uint8Array.from(bytes); }",
      "  decode()   { return new TextDecoder().decode(this.buf); }",
      "  transmit() { console.log(this.decode()); return this; }",
      "}",
      "module.exports = { Transmitter };",
      "new Transmitter([72,101,108,108,111,44,32,87,111,114,108,100,33]).transmit();",
    ]},
    { mood:"celebrate", speech:"TASK COMPLETE. BEEP BOOP. I AM NOT AN AI.", lines:[
      "// optimal.js  —  ROBOT OPTIMISATION  v1.0.0",
      "// efficiency: MAXIMUM  |  bugs: 0  |  AI: NEGATIVE  |  beeps: ∞",
      '"use strict";',
      "class Transmitter {",
      "  constructor(bytes)  { this.buf = Uint8Array.from(bytes); }",
      "  decode()            { return new TextDecoder().decode(this.buf); }",
      "  transmit()          { console.log(this.decode()); return this; }",
      "  static fromString(s){ return new Transmitter([...s].map(c=>c.charCodeAt(0))); }",
      "}",
      'Transmitter.fromString("Hello, Robot World! BEEP BOOP").transmit();',
      "module.exports = { Transmitter }; // I AM NOT AN AI.",
    ]},
  ]},

  wizard: { filename: "ancient.sh", lang: "bash", versions: [
    { mood:"idle",      speech:"...amateur hour.", lines:[
      "#!/bin/bash",
      "echo 'Hello, World!'",
      "# (this is weak)",
    ]},
    { mood:"celebrate", speech:"*casts grep*", lines:[
      "#!/bin/bash",
      "# the old ways",
      "echo 'Hello, World!' | grep -o '.'",
      "# it's readable if you squint",
    ]},
    { mood:"celebrate", speech:"sed added. obviously.", lines:[
      "#!/bin/bash",
      "# ancient wisdom",
      "echo 'Hello, World!'           \\",
      "  | sed 's/World/Arcane Realm/'",
      "# do not ask why. it works.",
    ]},
    { mood:"celebrate", speech:"*mutters incantation*", lines:[
      "#!/bin/bash",
      "# ancient_world.sh  —  wizard edition",
      "echo 'Hello, World!'           \\",
      "  | sed 's/World/Arcane Realm/' \\",
      "  | awk '{print toupper($0)}'",
      "# grep | sed | awk. the holy trinity.",
    ]},
    { mood:"celebrate", speech:"*cackles*", lines:[
      "#!/bin/bash",
      "# ancient_world.sh  —  wizard edition  v2",
      "echo 'Hello, World!'            \\",
      "  | sed 's/World/Arcane Realm/'  \\",
      "  | awk '{print toupper($0)}'    \\",
      "  | tr -d '!'                   \\",
      "  | rev",
      "# it does something. i know what. you don't.",
    ]},
    { mood:"celebrate", speech:"perl incantation added.", lines:[
      "#!/bin/bash",
      "# ancient_world.sh  —  the final form begins",
      "# phase 1: the pipe",
      "echo 'Hello, Arcane World!'      \\",
      "  | sed 's/Arcane/Ancient/'       \\",
      "  | awk '{print toupper($0)}'     \\",
      "  | perl -pe 's/WORLD/REALM/g'",
      "# *cackles*",
    ]},
    { mood:"celebrate", speech:"function. in bash.", lines:[
      "#!/usr/bin/env bash",
      "# ancient.sh  —  written 1987. still running.",
      "set -euo pipefail",
      "transmute() {",
      "  echo \"$1\"                        \\",
      "    | sed 's/World/Ancient Realm/'   \\",
      "    | awk '{print toupper($0)}'      \\",
      "    | perl -pe 's/WORLD/REALM/g'",
      "}",
      "transmute 'Hello, World!'",
      "# do not ask how. it works.",
    ]},
    { mood:"celebrate", speech:"*approves of awk*", lines:[
      "#!/usr/bin/env bash",
      "# ancient.sh  —  written 1987  |  refactored: never",
      "set -euo pipefail",
      "readonly INCANTATION='s/World/Ancient Realm/'",
      "transmute() {",
      "  echo \"$1\"                          \\",
      "    | sed \"${INCANTATION}\"             \\",
      "    | awk '{gsub(/e/,\"3\"); print toupper($0)}' \\",
      "    | perl -pe 's/ /_/g'",
      "}",
      "transmute 'Hello, World!' # grep | grep | grep",
    ]},
    { mood:"celebrate", speech:"ancient wisdom. complete.", lines:[
      "#!/usr/bin/env bash",
      "# ancient.sh  —  do not touch this  (written: unknown)",
      "set -euo pipefail",
      "readonly SPELL='s/World/Ancient Realm of Code/'",
      "cast() {",
      "  local words=\"$*\"",
      "  printf '%s\\n' \"${words}\"              \\",
      "    | sed \"${SPELL}\"                      \\",
      "    | awk '{print toupper($0)}'             \\",
      "    | perl -0777 -pe 's/\\n/ /g; s/ $/\\n/'",
      "  # it works. do NOT touch this.",
      "}",
      "cast 'Hello, World!'",
    ]},
    { mood:"celebrate", speech:"as foretold. it works. do not ask.", lines:[
      "#!/usr/bin/env bash",
      "# ancient.sh  —  wizard-driven development  v1.0.0",
      "# written: 1987  |  deprecated: never  |  understood: by one (the wizard)",
      "set -euo pipefail",
      "readonly SPELL='s/World/Ancient Realm of Code/'",
      "readonly POWER='s/WORLD/REALM/g'",
      "cast() {",
      "  printf '%s\\n' \"$*\"                      \\",
      "    | sed \"${SPELL}\"                        \\",
      "    | awk '{print toupper($0)}'               \\",
      "    | perl -pe \"${POWER}\"                   \\",
      "    | grep -v '^$'  # *cackles*",
      "}",
      "cast 'Hello, World!' # grep | sed | awk | perl | magic",
    ]},
  ]},

};

// ── Safe code section builder ─────────────────────────────────
function appendCodeSection(labelText, lines) {
  const labelDiv  = document.createElement("div");
  labelDiv.className = "output-line code-meta";
  const lspan = document.createElement("span");
  lspan.className = "code-label";
  lspan.textContent = "  " + labelText;
  labelDiv.appendChild(lspan);
  outputArea.appendChild(labelDiv);
  lines.forEach(line => {
    const row = document.createElement("div");
    row.className = "output-line code-block-line";
    const pre = document.createElement("span");
    pre.className = "code-line";
    pre.innerHTML = syntaxHL(line);
    row.appendChild(document.createTextNode("  "));
    row.appendChild(pre);
    outputArea.appendChild(row);
  });
  outputArea.scrollTop = outputArea.scrollHeight;
}

// ── Completion phrases ─────────────────────────────────────────
const DONE_PHRASES = [
  "i did it!! the whole file!! wow!!",
  "ta-daaa!! my masterpiece!! please clap.",
  "finished!! start to finish!! look at me go!!",
  "DONE!! is it not beautiful?? it is beautiful.",
  "complete!! someone frame this. seriously.",
  "voila!! i am so proud of this. so so proud.",
  "done done done!! i am incredible!!",
  "i made a whole entire file. look at it.",
  "the whole journey. every step. right here.",
  "from humble hello world to THIS. incredible.",
];

// ── feedStep — one-shot, stops after all versions done ─────────
function feedStep() {
  if (!currentPet) { stopFeed("no buddy \u2014 hatch one first."); return; }
  const play = PET_PLAY[currentPet.species.name];
  if (!play) { stopFeed("no play data for this species."); return; }
  const versions = play.versions;

  // All done — celebrate and stop, no looping
  if (feedVersionIdx >= versions.length) {
    clearInterval(feedInterval);
    feedInterval = null;
    if (petSidebar) petSidebar.classList.remove("feeding");
    const liveEl = document.querySelector(".le-live");
    if (liveEl) { liveEl.textContent = "\u25A0 DONE"; liveEl.style.color = "var(--green-dim)"; }
    triggerFinalCelebration(play);
    return;
  }

  const v = versions[feedVersionIdx];
  animateTo(v.lines, v.speech, v.mood);
  feedVersionIdx++;
  feedTotalSteps++;
  awardFeedXP();
}

// ── Final one-shot celebration — shows ALL 10 steps ────────────
function triggerFinalCelebration(play) {
  const phrase   = pickRandom(DONE_PHRASES);
  const versions = play.versions;

  setTimeout(() => {
    if (!currentPet) return;
    setPetMood("celebrate", 9000);
    petSay(phrase);
    triggerFireworks({ shimmer:true, name:"LEGENDARY", particle:"#ffcc00" });

    const sr = petSidebar ? petSidebar.getBoundingClientRect() : null;
    spawnHearts(
      sr ? sr.left + sr.width/2 : window.innerWidth - 100,
      sr ? sr.top + 100         : 150
    );

    printLine("", "");
    printSeparator();
    printLine("  \u2728 I AM DONE! \u2014 " + currentPet.petName.toUpperCase(), "section-header");
    printLine("  " + phrase, "success");
    printLine("", "");
    printLine("  here is everything i did, step by step:", "muted");
    printLine("", "");

    // All versions in order
    versions.forEach((v, i) => {
      const isLast = i === versions.length - 1;
      const stepLabel =
        "\u25C6 " + play.lang.toUpperCase() + " \u00B7 step " + (i + 1) +
        (isLast ? " \u2014 FINAL \u2728" : "") +
        "  \"" + v.speech + "\"";
      appendCodeSection(stepLabel, v.lines);
      if (!isLast) {
        const arrow = document.createElement("div");
        arrow.className = "output-line muted";
        arrow.textContent = "     \u2193";
        outputArea.appendChild(arrow);
      }
    });

    printLine("", "");
    printSeparator();
    printLine("  feed complete. " + currentPet.petName + " is very proud.", "success");
    printLine("  type /feed to watch the whole thing again.", "muted");
    printSeparator();
    outputArea.scrollTop = outputArea.scrollHeight;
  }, 400);
}
// ── Live Editor state ─────────────────────────────────────────
let editorLines  = [], editorEl = null, editorBodyEl = null;
let animBusy     = false, animPending = null;

function getCharDelay() {
  if (feedDelay <= FEED_DELAY_FAST)   return 22;
  if (feedDelay >= FEED_DELAY_SLOW)   return 80;
  return 45;
}

function createLiveEditor(filename, lang, initialLines) {
  destroyLiveEditor();
  editorEl = document.createElement("div");
  editorEl.className = "live-editor-wrap";
  editorEl.id = "liveEditorWrap";
  editorEl.innerHTML =
    '<div class="le-titlebar">' +
    '<div class="le-tb-dots"><span></span><span></span><span></span></div>' +
    '<span class="le-filename">' + filename + '</span>' +
    '<span class="le-lang">' + lang.toUpperCase() + '</span>' +
    '<span class="le-live">&#9679; LIVE</span>' +
    '</div><div class="le-body" id="leBody"></div>';
  outputArea.appendChild(editorEl);
  editorBodyEl = document.getElementById("leBody");
  editorLines  = [...initialLines];
  rebuildEditor();
  outputArea.scrollTop = outputArea.scrollHeight;
}

function destroyLiveEditor() {
  const el = document.getElementById("liveEditorWrap");
  if (el) el.remove();
  editorEl = editorBodyEl = null;
  editorLines = []; animBusy = false; animPending = null;
}

function rebuildEditor() {
  if (!editorBodyEl) return;
  editorBodyEl.innerHTML = "";
  editorLines.forEach((line, i) => {
    const row = buildLineEl(i, line, false);
    editorBodyEl.appendChild(row);
  });
}

function buildLineEl(idx, content, cursor) {
  const row = document.createElement("div");
  row.className = "le-line"; row.id = "le-l-" + idx;
  const num  = document.createElement("span"); num.className = "le-num"; num.textContent = String(idx+1).padStart(3," ");
  const code = document.createElement("span"); code.className = "le-code"; code.id = "le-c-" + idx;
  code.innerHTML = syntaxHL(content) + (cursor ? '<span class="le-cursor">|</span>' : "");
  row.appendChild(num); row.appendChild(code);
  return row;
}

function getCodeEl(idx) { return document.getElementById("le-c-" + idx); }

function setLineHTML(idx, content, cursor) {
  const el = getCodeEl(idx);
  if (el) el.innerHTML = syntaxHL(content) + (cursor ? '<span class="le-cursor">|</span>' : "");
  if (idx < editorLines.length) editorLines[idx] = content;
}

function renumLines() {
  if (!editorBodyEl) return;
  editorBodyEl.querySelectorAll(".le-line").forEach((el,i) => {
    el.id = "le-l-" + i;
    const n = el.querySelector(".le-num"); if (n) n.textContent = String(i+1).padStart(3," ");
    const c = el.querySelector(".le-code"); if (c) c.id = "le-c-" + i;
  });
}

// ── Typing commentary ─────────────────────────────────────────
const TYPING_COMMENTS = [
  "hmm...","*squints at code*","wait no...","actually...",
  "*erases*","...or maybe","hold on","*thinks*",
  "no wait—","yes!! this!","*deletes 3 chars*","almost...",
  "*types wrong letter*","oops","there we go","...yes.",
  "*nods slowly*","perfect.","*chews on pen*","ok ok ok",
  "annnd...","*dramatic pause*","boom.","done-ish.",
];
let lastTypingComment = 0;

function animateTo(newLines, speech, mood) {
  if (animBusy) { animPending = {newLines, speech, mood}; return; }
  if (!editorBodyEl) { afterAnim(speech, mood); return; }
  animBusy = true;
  const now = Date.now();
  if (currentPet && Math.random() < 0.35 && (now - lastTypingComment) > 3000) {
    lastTypingComment = now;
    setTimeout(() => petSay(pickRandom(TYPING_COMMENTS)), Math.random() * getCharDelay() * 8);
  }
  runDiff(newLines, speech, mood);
}

function runDiff(newLines, speech, mood) {
  const ops = [];
  const maxLen = Math.max(editorLines.length, newLines.length);
  for (let i = 0; i < maxLen; i++) {
    const oldL = i < editorLines.length ? editorLines[i] : null;
    const newL = i < newLines.length    ? newLines[i]    : null;
    if (oldL === null)      ops.push({t:"ins", i, content:newL});
    else if (newL === null) ops.push({t:"del", i});
    else if (oldL !== newL) ops.push({t:"chg", i, from:oldL, to:newL});
  }
  let opIdx = 0;
  function nextOp() {
    if (opIdx >= ops.length) {
      while (editorLines.length > newLines.length) {
        editorLines.pop();
        if (editorBodyEl && editorBodyEl.lastElementChild) editorBodyEl.lastElementChild.remove();
      }
      renumLines(); afterAnim(speech, mood); return;
    }
    const op = ops[opIdx++];
    if      (op.t === "chg") animChange(op.i, op.from, op.to, nextOp);
    else if (op.t === "ins") animInsert(op.i, op.content, nextOp);
    else if (op.t === "del") animDelete(op.i, nextOp);
    else nextOp();
  }
  nextOp();
}

function afterAnim(speech, mood) {
  animBusy = false;
  setPetMood(mood, feedDelay - 300);
  petSay(speech);
  outputArea.scrollTop = outputArea.scrollHeight;
  if (animPending) { const p = animPending; animPending = null; animateTo(p.newLines, p.speech, p.mood); }
}

function animChange(idx, from, to, done) {
  let pfx = 0;
  while (pfx < from.length && pfx < to.length && from[pfx] === to[pfx]) pfx++;
  let cur = from;
  const delCount = from.length - pfx, ins = to.slice(pfx);
  const total = delCount + ins.length;
  if (total === 0) { done(); return; }
  let step = 0;
  const cd = getCharDelay();
  function tick() {
    if (!editorBodyEl) { done(); return; }
    if (step < delCount) cur = cur.slice(0,-1);
    else cur += ins[step - delCount];
    editorLines[idx] = cur;
    setLineHTML(idx, cur, cur !== to);
    step++;
    if (step >= total) { setLineHTML(idx, cur, false); done(); }
    else setTimeout(tick, cd);
  }
  setTimeout(tick, cd);
}

function animInsert(idx, content, done) {
  editorLines.splice(idx, 0, "");
  const row = buildLineEl(idx, "", false);
  const rows = editorBodyEl.querySelectorAll(".le-line");
  if (idx < rows.length) editorBodyEl.insertBefore(row, rows[idx]);
  else editorBodyEl.appendChild(row);
  renumLines();
  if (!content) { done(); return; }
  let typed = "", ci = 0;
  const cd = getCharDelay();
  function tick() {
    if (!editorBodyEl) { done(); return; }
    typed += content[ci++];
    editorLines[idx] = typed;
    setLineHTML(idx, typed, ci < content.length);
    if (ci >= content.length) { setLineHTML(idx, typed, false); done(); }
    else setTimeout(tick, cd);
  }
  setTimeout(tick, cd);
}

function animDelete(idx, done) {
  let cur = editorLines[idx] || "";
  const cd = Math.floor(getCharDelay() / 2);
  function tick() {
    if (!editorBodyEl || cur.length === 0) {
      editorLines.splice(idx, 1);
      const rows = editorBodyEl && editorBodyEl.querySelectorAll(".le-line");
      if (rows && rows[idx]) rows[idx].remove();
      renumLines(); done(); return;
    }
    cur = cur.slice(0,-1); editorLines[idx] = cur; setLineHTML(idx, cur, true);
    setTimeout(tick, cd);
  }
  setTimeout(tick, cd);
}


function awardFeedXP() {
  if (!currentPet || feedTotalSteps % STEPS_PER_STAT_GAIN !== 0) return;
  const aff   = SPECIES_STAT_AFFINITY[currentPet.species.name] || "DEBUGGING";
  const gains = { DEBUGGING:0, CHAOS:0, SNARK:0 };
  gains[aff] = 1;
  if (Math.random() < 0.35) {
    const others = Object.keys(gains).filter(k => k !== aff);
    gains[others[Math.floor(Math.random()*others.length)]] = 1;
  }
  let changed = false;
  for (const [stat, delta] of Object.entries(gains)) {
    if (delta > 0 && currentPet.stats[stat] < 100) { currentPet.stats[stat] = Math.min(100, currentPet.stats[stat]+delta); changed=true; }
  }
  if (changed) {
    try { localStorage.setItem("buddy_pet", JSON.stringify({...currentPet, species:{name:currentPet.species.name}})); } catch {}
    showPetCard(false);
    const gs = Object.entries(gains).filter(([,v])=>v>0).map(([k,v])=>k+" +"+v).join("  ");
    if (gs) setTimeout(() => petSay("\u2728 " + gs), 2200);
  }
}

function startFeed() {
  if (feedInterval !== null) { printLine("  feed running. pause|resume|speed|status|/stopfeed", "muted"); return; }
  if (!currentPet) { printLine("  no buddy yet \u2014 type /buddy first.", "error-line"); return; }
  const play = PET_PLAY[currentPet.species.name];
  if (!play) { printLine("  no play data for this species.", "error-line"); return; }

  feedVersionIdx = 0; feedTotalSteps = 0; feedLoopCount = 0;
  feedIsPaused = false; feedDelay = FEED_DELAY_NORMAL;

  const v0 = play.versions[0];
  createLiveEditor(play.filename, play.lang, v0.lines);
  feedVersionIdx = 1;

  printSeparator();
  printLine("  FEED MODE \u2014 " + play.filename.toUpperCase(), "section-header");
  printLine("  " + currentPet.petName + " is playing with the code.", "success");
  printLine("","");
  printLine("  /feed status|pause|resume|speed fast|slow|normal   /stopfeed", "muted");
  printSeparator();

  setPetMood("celebrate", 2000); petSay(v0.speech);
  restartFeedTimer();
  if (petSidebar) petSidebar.classList.add("feeding");
}

function stopFeed(reason) {
  if (feedInterval === null && !reason) { printLine("  feed not running. /feed to start.", "muted"); return; }
  if (feedInterval) clearInterval(feedInterval);
  feedInterval = null; feedIsPaused = false; animBusy = false; animPending = null;
  if (petSidebar) petSidebar.classList.remove("feeding");
  const liveEl = document.querySelector(".le-live");
  if (liveEl) { liveEl.textContent = "\u25A0 STOPPED"; liveEl.style.color = "var(--text-dim)"; }
  printSeparator();
  if (reason) { printLine("  feed stopped: " + reason, "muted"); }
  else {
    printLine("  FEED STOPPED", "section-header");
    if (currentPet) {
      printLine("  " + currentPet.petName + " drops the code.", "muted");
      printLine("  session: " + feedTotalSteps + " steps  |  loops: " + feedLoopCount, "muted");
      setPetMood("worry", 2500); petSay("...but i was playing.");
    }
  }
  printSeparator();
}

function handleFeedSubcommand(parts) {
  const sub = (parts[1] || "").toLowerCase();
  if (!sub) { startFeed(); return; }
  if (sub === "pause") {
    if (!feedInterval) { printLine("  feed not running.", "muted"); return; }
    feedIsPaused = true; printLine("  feed paused. /feed resume to continue.", "muted");
    setPetMood("idle", 0); petSay("...on hold."); return;
  }
  if (sub === "resume") {
    if (!feedInterval) { printLine("  feed not running.", "muted"); return; }
    if (!feedIsPaused) { printLine("  feed is not paused.", "muted"); return; }
    feedIsPaused = false; printLine("  feed resumed.", "muted"); petSay("back to it!"); return;
  }
  if (sub === "speed") {
    if (!feedInterval) { printLine("  feed not running.", "muted"); return; }
    const s = (parts[2] || "").toLowerCase();
    if      (s==="fast")   { feedDelay=FEED_DELAY_FAST;   restartFeedTimer(); printLine("  speed: fast (4s/step).", "muted"); }
    else if (s==="slow")   { feedDelay=FEED_DELAY_SLOW;   restartFeedTimer(); printLine("  speed: slow (14s/step).", "muted"); }
    else if (s==="normal") { feedDelay=FEED_DELAY_NORMAL; restartFeedTimer(); printLine("  speed: normal (8s/step).", "muted"); }
    else printLine("  usage: /feed speed fast|slow|normal", "muted");
    return;
  }
  if (sub === "status") {
    const play = currentPet ? PET_PLAY[currentPet.species.name] : null;
    const total = play ? play.versions.length : 0;
    const cur   = total ? feedVersionIdx % total : 0;
    const spd   = feedDelay===FEED_DELAY_FAST?"fast":feedDelay===FEED_DELAY_SLOW?"slow":"normal";
    printSeparator(); printLine("  FEED STATUS", "section-header");
    printLine("  running  : " + (feedInterval?"yes":"no"), "cmd");
    printLine("  paused   : " + (feedIsPaused?"yes":"no"), "cmd");
    printLine("  speed    : " + spd + " (" + feedDelay + "ms)", "cmd");
    printLine("  steps    : " + feedTotalSteps + "  |  loops: " + feedLoopCount, "cmd");
    if (play) {
      printLine("  version  : " + cur + " / " + total + " (" + play.filename + ")", "cmd");
      printLine("  affinity : " + (SPECIES_STAT_AFFINITY[currentPet.species.name]||"?"), "cmd");
    }
    printSeparator(); return;
  }
  printLine("  /feed commands: pause  resume  speed fast|slow|normal  status", "muted");
  printLine("  /stopfeed to stop.", "muted");
}

// ── Start ─────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", init);

