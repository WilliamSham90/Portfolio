'use strict';

/* ═══════════════════════════════════════════
   CONFIG
═══════════════════════════════════════════ */
const THEME_KEY = 'hacklab-theme';

/* ═══════════════════════════════════════════
   STATE
═══════════════════════════════════════════ */
const state = {
  currentScreen: 'home',
  currentLevelId: null,
  completed: new Set(),
  unlockedUpTo: 1,
  theme: 'dark',
  helpOpen: false,
  totalXp: 0
};

/* ═══════════════════════════════════════════
   LEVELS
═══════════════════════════════════════════ */
const LEVELS = [

  /* ── LEVEL 1 ── */
  {
    id: 1, slug: 'view-source', title: 'View Source',
    difficulty: 'easy', concept: 'HTML Inspection', xp: 100,
    intro: 'Every webpage has a hidden side. Developers often leave breadcrumbs in the HTML that never appear on screen. Your first mission: find what\'s hiding in plain sight.',
    hints: [
      'Right-click the page and choose "View Page Source", or press Ctrl+U / Cmd+U.',
      'Look for HTML comment tags: <!-- ... -->',
      'Search the source for the word "password" or "credentials".'
    ],
    solution: 'Open View Source (Ctrl+U). Search for "FLAG". You\'ll find it inside an HTML comment: <!-- FLAG{h1dd3n_1n_pl41n_s1ght} -->',
    render() {
      const mount = document.getElementById('challenge-mount');
      mount.innerHTML = `
        <div class="challenge-header">
          <div class="challenge-meta">
            <span class="challenge-id">// LEVEL 01</span>
            <span class="badge badge-easy">EASY</span>
            <span class="level-xp">100 XP</span>
          </div>
          <h1 class="challenge-title">View Source</h1>
          <p class="challenge-intro">${this.intro}</p>
        </div>

        <div class="challenge-box">
          <h3>// OBJECTIVE</h3>
          <p style="color:var(--text-muted);font-size:14px;margin-bottom:16px;">
            A login portal is protected by credentials hidden in the page HTML. Find them and retrieve the flag.
          </p>
          <div class="sim-login">
            <h4>🔒 Admin Portal</h4>
            <input class="sim-input" id="l1-user" placeholder="Username" />
            <input class="sim-input" id="l1-pass" placeholder="Password" type="password" />
            <button class="sim-btn" onclick="checkL1Login()">Login</button>
            <div class="sim-result" id="l1-result"></div>
          </div>
          <!-- FLAG HIDDEN HERE: username=admin password=s3cr3t_p4ss -->
        </div>

        <div class="challenge-box">
          <h3>// SUBMIT FLAG</h3>
          <div class="flag-row">
            <input class="flag-input" id="l1-flag" placeholder="FLAG{...}" />
            <button class="btn-primary" onclick="checkFlag(1)">Submit</button>
          </div>
          <div class="flag-feedback" id="flag-feedback-1"></div>
        </div>`;

      window.checkL1Login = () => {
        const u = document.getElementById('l1-user').value;
        const p = document.getElementById('l1-pass').value;
        const el = document.getElementById('l1-result');
        if (u === 'admin' && p === 's3cr3t_p4ss') {
          el.style.color = 'var(--success)';
          el.textContent = '✓ Access granted. Flag: FLAG{h1dd3n_1n_pl41n_s1ght}';
        } else {
          el.style.color = 'var(--danger)';
          el.textContent = '✗ Invalid credentials.';
          shakeEl('l1-pass');
        }
      };
    },
    teardown() { delete window.checkL1Login; }
  },

  /* ── LEVEL 2 ── */
  {
    id: 2, slug: 'console-recon', title: 'Console Recon',
    difficulty: 'easy', concept: 'JS Global Scope', xp: 100,
    intro: 'Developers sometimes store sensitive values in JavaScript variables that anyone can read from the browser console. Open your DevTools and start snooping.',
    hints: [
      'Open DevTools: F12 or right-click → Inspect.',
      'Go to the Console tab and type: hacklab',
      'Try: hacklab.secret or Object.keys(hacklab)'
    ],
    solution: 'Open DevTools Console and type: hacklab.secret — it returns the flag.',
    render() {
      const mount = document.getElementById('challenge-mount');
      // eslint-disable-next-line no-unused-vars
      window.hacklab = { version: '2.1.0', env: 'production', secret: 'FLAG{c0ns0l3_1s_y0ur_fr13nd}' };
      mount.innerHTML = `
        <div class="challenge-header">
          <div class="challenge-meta">
            <span class="challenge-id">// LEVEL 02</span>
            <span class="badge badge-easy">EASY</span>
            <span class="level-xp">100 XP</span>
          </div>
          <h1 class="challenge-title">Console Recon</h1>
          <p class="challenge-intro">${this.intro}</p>
        </div>

        <div class="challenge-box">
          <h3>// RECON TARGET</h3>
          <p style="color:var(--text-muted);font-size:14px;margin-bottom:14px;">
            The application exposes a global <code style="color:var(--accent-cyan)">hacklab</code> object. Open your browser console and inspect it.
          </p>
          <div class="code-block">// Open DevTools Console (F12) and try:
> hacklab
> hacklab.secret</div>
        </div>

        <div class="challenge-box">
          <h3>// SUBMIT FLAG</h3>
          <div class="flag-row">
            <input class="flag-input" id="l2-flag" placeholder="FLAG{...}" />
            <button class="btn-primary" onclick="checkFlag(2)">Submit</button>
          </div>
          <div class="flag-feedback" id="flag-feedback-2"></div>
        </div>`;
    },
    teardown() { delete window.hacklab; }
  },

  /* ── LEVEL 3 ── */
  {
    id: 3, slug: 'cookie-monster', title: 'Cookie Monster',
    difficulty: 'easy', concept: 'Cookie Manipulation', xp: 100,
    intro: 'Some applications trust cookies to determine who you are. If the server doesn\'t validate properly, you can edit your own cookie to escalate privileges.',
    hints: [
      'Open DevTools → Application tab → Cookies.',
      'Find the cookie named "role". Its current value is "user".',
      'Double-click the value and change it to "admin", then click Check Access.'
    ],
    solution: 'DevTools → Application → Cookies → change "role" from "user" to "admin" → click Check Access.',
    render() {
      document.cookie = 'role=user; path=/';
      const mount = document.getElementById('challenge-mount');
      mount.innerHTML = `
        <div class="challenge-header">
          <div class="challenge-meta">
            <span class="challenge-id">// LEVEL 03</span>
            <span class="badge badge-easy">EASY</span>
            <span class="level-xp">100 XP</span>
          </div>
          <h1 class="challenge-title">Cookie Monster</h1>
          <p class="challenge-intro">${this.intro}</p>
        </div>

        <div class="challenge-box">
          <h3>// ACCESS CONTROL</h3>
          <p style="color:var(--text-muted);font-size:14px;margin-bottom:16px;">
            The admin panel checks your <code style="color:var(--accent-cyan)">role</code> cookie. Currently you are a regular user. Escalate your privileges.
          </p>
          <button class="btn-primary" onclick="checkL3Access()">Check Access Level</button>
          <div class="sim-result" id="l3-result" style="margin-top:12px;"></div>
        </div>

        <div class="challenge-box">
          <h3>// SUBMIT FLAG</h3>
          <div class="flag-row">
            <input class="flag-input" id="l3-flag" placeholder="FLAG{...}" />
            <button class="btn-primary" onclick="checkFlag(3)">Submit</button>
          </div>
          <div class="flag-feedback" id="flag-feedback-3"></div>
        </div>`;

      window.checkL3Access = () => {
        const cookies = Object.fromEntries(document.cookie.split(';').map(c => c.trim().split('=').map(decodeURIComponent)));
        const el = document.getElementById('l3-result');
        if (cookies.role === 'admin') {
          el.style.color = 'var(--success)';
          el.innerHTML = '✓ Admin access granted.<br>Flag: FLAG{c00k13s_4r3_t4sty}';
        } else {
          el.style.color = 'var(--danger)';
          el.textContent = `✗ Access denied. Role: ${cookies.role || 'none'}`;
        }
      };
    },
    teardown() {
      document.cookie = 'role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
      delete window.checkL3Access;
    }
  },

  /* ── LEVEL 4 ── */
  {
    id: 4, slug: 'sql-injection', title: 'SQL Injection',
    difficulty: 'easy', concept: 'Input Validation', xp: 100,
    intro: 'SQL injection occurs when user input is concatenated directly into a database query. A classic bypass trick can grant you access without valid credentials.',
    hints: [
      'The login query looks like: SELECT * FROM users WHERE user=\'?\' AND pass=\'?\'',
      'Try entering a single quote \' in the username field to break the query.',
      'The classic bypass: enter \' OR \'1\'=\'1 as the username.'
    ],
    solution: 'Enter: \' OR \'1\'=\'1 in the username field (any password). The query always returns true.',
    render() {
      const mount = document.getElementById('challenge-mount');
      mount.innerHTML = `
        <div class="challenge-header">
          <div class="challenge-meta">
            <span class="challenge-id">// LEVEL 04</span>
            <span class="badge badge-easy">EASY</span>
            <span class="level-xp">100 XP</span>
          </div>
          <h1 class="challenge-title">SQL Injection</h1>
          <p class="challenge-intro">${this.intro}</p>
        </div>

        <div class="challenge-box">
          <h3>// VULNERABLE LOGIN</h3>
          <p style="color:var(--text-muted);font-size:14px;margin-bottom:8px;">Query template:</p>
          <div class="code-block">SELECT * FROM users
WHERE username = '[INPUT]'
  AND password = '[INPUT]'</div>
          <div class="sim-login" style="margin-top:16px;">
            <h4>🗄️ Database Portal</h4>
            <input class="sim-input" id="l4-user" placeholder="Username" />
            <input class="sim-input" id="l4-pass" placeholder="Password" />
            <button class="sim-btn" onclick="checkL4Login()">Login</button>
            <div class="sim-result" id="l4-result"></div>
          </div>
        </div>

        <div class="challenge-box">
          <h3>// SUBMIT FLAG</h3>
          <div class="flag-row">
            <input class="flag-input" id="l4-flag" placeholder="FLAG{...}" />
            <button class="btn-primary" onclick="checkFlag(4)">Submit</button>
          </div>
          <div class="flag-feedback" id="flag-feedback-4"></div>
        </div>`;

      window.checkL4Login = () => {
        const u = document.getElementById('l4-user').value;
        const el = document.getElementById('l4-result');
        const injected = u.includes("'") && (u.toLowerCase().includes('or') || u.includes('1=1'));
        if (injected) {
          el.style.color = 'var(--success)';
          el.innerHTML = '✓ Query returned all rows.<br>Flag: FLAG{sqli_byp4ss_m4st3r}';
        } else {
          el.style.color = 'var(--danger)';
          el.textContent = '✗ Invalid credentials.';
          shakeEl('l4-user');
        }
      };
    },
    teardown() { delete window.checkL4Login; }
  },

  /* ── LEVEL 5 ── */
  {
    id: 5, slug: 'base64-lies', title: 'Base64 Lies',
    difficulty: 'medium', concept: 'Encoding vs Encryption', xp: 250,
    intro: 'Base64 is encoding, not encryption. It\'s trivially reversible. Developers who confuse the two often store "obfuscated" credentials that anyone can decode in seconds.',
    hints: [
      'View the page source and look for a Base64 string in an HTML comment.',
      'Run atob("the-string") in the browser console to decode it.',
      'The decoded value contains the flag.'
    ],
    solution: 'View source, find the comment with the Base64 string, run atob("c3VwM3JfczNjcjN0X3Bhc3M=") in console → "FLAG{b4s364_1s_n0t_3ncrypt10n}".',
    render() {
      const mount = document.getElementById('challenge-mount');
      mount.innerHTML = `
        <div class="challenge-header">
          <div class="challenge-meta">
            <span class="challenge-id">// LEVEL 05</span>
            <span class="badge badge-medium">MEDIUM</span>
            <span class="level-xp">250 XP</span>
          </div>
          <h1 class="challenge-title">Base64 Lies</h1>
          <p class="challenge-intro">${this.intro}</p>
        </div>

        <div class="challenge-box">
          <h3>// SECURED VAULT</h3>
          <p style="color:var(--text-muted);font-size:14px;margin-bottom:16px;">
            The developer "secured" this vault with encoding. Check the page source for their mistake.
          </p>
          <!-- Encoded credentials: RkxBR3tiNHM2NjRfMXNfbjB0XzNuY3J5cHQxMG59 -->
          <div class="sim-login">
            <h4>🔐 Encoded Vault</h4>
            <input class="sim-input" id="l5-pass" placeholder="Enter decoded password" />
            <button class="sim-btn" onclick="checkL5()">Unlock</button>
            <div class="sim-result" id="l5-result"></div>
          </div>
        </div>

        <div class="challenge-box">
          <h3>// SUBMIT FLAG</h3>
          <div class="flag-row">
            <input class="flag-input" id="l5-flag" placeholder="FLAG{...}" />
            <button class="btn-primary" onclick="checkFlag(5)">Submit</button>
          </div>
          <div class="flag-feedback" id="flag-feedback-5"></div>
        </div>`;

      window.checkL5 = () => {
        const p = document.getElementById('l5-pass').value;
        const el = document.getElementById('l5-result');
        if (p === atob('RkxBR3tiNHM2NjRfMXNfbjB0XzNuY3J5cHQxMG59')) {
          el.style.color = 'var(--success)';
          el.textContent = '✓ Vault unlocked. Flag is the password you just entered.';
        } else {
          el.style.color = 'var(--danger)';
          el.textContent = '✗ Wrong. Hint: use atob() in the console.';
        }
      };
    },
    teardown() { delete window.checkL5; }
  },
 
  /* ── LEVEL 6 ── */
  {
    id: 6, slug: 'jwt-decoder', title: 'JWT Decoder',
    difficulty: 'medium', concept: 'Token Analysis', xp: 250,
    intro: 'JSON Web Tokens are three Base64-encoded segments separated by dots. The payload is readable by anyone — the signature only proves it wasn\'t tampered with after issuance. Secrets hidden in JWT payloads are not secret.',
    hints: [
      'Open DevTools → Application → Local Storage. Find the "jwt" key.',
      'A JWT has 3 parts: header.payload.signature — split by "."',
      'Run: JSON.parse(atob(token.split(".")[1])) to decode the payload.',
      'Look for a hidden field in the payload that contains the flag.'
    ],
    solution: 'localStorage.getItem("jwt"), split by ".", atob() the middle part, JSON.parse it. The "flag" field contains FLAG{jwt_p4yl04d_1s_publ1c}.',
    render() {
      const header  = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).replace(/=/g,'');
      const payload = btoa(JSON.stringify({ sub: 'user123', role: 'user', iat: 1700000000, flag: 'FLAG{jwt_p4yl04d_1s_publ1c}' })).replace(/=/g,'');
      const sig     = 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      localStorage.setItem('jwt', `${header}.${payload}.${sig}`);

      const mount = document.getElementById('challenge-mount');
      mount.innerHTML = `
        <div class="challenge-header">
          <div class="challenge-meta">
            <span class="challenge-id">// LEVEL 06</span>
            <span class="badge badge-medium">MEDIUM</span>
            <span class="level-xp">250 XP</span>
          </div>
          <h1 class="challenge-title">JWT Decoder</h1>
          <p class="challenge-intro">${this.intro}</p>
        </div>
        <div class="challenge-box">
          <h3>// MISSION</h3>
          <p style="color:var(--text-muted);font-size:14px;margin-bottom:14px;">
            A JWT has been stored in your browser. Decode it to find the hidden field.
          </p>
          <div class="code-block">// In DevTools Console:
const t = localStorage.getItem('jwt');
const payload = JSON.parse(atob(t.split('.')[1]));
console.log(payload);</div>
        </div>
        <div class="challenge-box">
          <h3>// SUBMIT FLAG</h3>
          <div class="flag-row">
            <input class="flag-input" id="l6-flag" placeholder="FLAG{...}" />
            <button class="btn-primary" onclick="checkFlag(6)">Submit</button>
          </div>
          <div class="flag-feedback" id="flag-feedback-6"></div>
        </div>`;
    },
    teardown() { localStorage.removeItem('jwt'); }
  },

  /* ── LEVEL 7 ── */
  {
    id: 7, slug: 'header-hunter', title: 'Header Hunter',
    difficulty: 'medium', concept: 'HTTP Headers', xp: 250,
    intro: 'HTTP headers carry metadata with every request. Some APIs gate access behind a secret header value. Learn how to send custom headers using the browser console.',
    hints: [
      'The admin endpoint expects a header: X-Admin-Token: letmein',
      'Use fetch() in the console to send the request with that header.',
      'fetch("/", { headers: { "X-Admin-Token": "letmein" } })',
      'Type the complete fetch() call below to simulate the request and reveal the flag.'
    ],
    solution: 'Type exactly: fetch("/", { headers: { "X-Admin-Token": "letmein" } }) — or enter that string in the terminal below.',
    render() {
      const mount = document.getElementById('challenge-mount');
      mount.innerHTML = `
        <div class="challenge-header">
          <div class="challenge-meta">
            <span class="challenge-id">// LEVEL 07</span>
            <span class="badge badge-medium">MEDIUM</span>
            <span class="level-xp">250 XP</span>
          </div>
          <h1 class="challenge-title">Header Hunter</h1>
          <p class="challenge-intro">${this.intro}</p>
        </div>
        <div class="challenge-box">
          <h3>// ADMIN ENDPOINT</h3>
          <p style="color:var(--text-muted);font-size:14px;margin-bottom:14px;">
            The endpoint <code style="color:var(--accent-cyan)">GET /api/admin</code> requires a special header. Craft the fetch() call below.
          </p>
          <div class="terminal-input-wrap">
            <div class="terminal-prompt">user@hacklab:~$</div>
            <input class="terminal-cmd" id="l7-cmd" placeholder='fetch("/api/admin", { headers: { ... } })' />
          </div>
          <button class="btn-primary" style="margin-top:12px;" onclick="checkL7()">Execute</button>
          <div class="flag-feedback" id="l7-result" style="margin-top:10px;"></div>
        </div>
        <div class="challenge-box">
          <h3>// SUBMIT FLAG</h3>
          <div class="flag-row">
            <input class="flag-input" id="l7-flag" placeholder="FLAG{...}" />
            <button class="btn-primary" onclick="checkFlag(7)">Submit</button>
          </div>
          <div class="flag-feedback" id="flag-feedback-7"></div>
        </div>`;

      window.checkL7 = () => {
        const cmd = document.getElementById('l7-cmd').value;
        const el  = document.getElementById('l7-result');
        const hasHeader = cmd.includes('X-Admin-Token') && cmd.includes('letmein');
        if (hasHeader) {
          el.className = 'flag-feedback success';
          el.textContent = '✓ 200 OK — Flag: FLAG{h34d3rs_4r3_v1s1bl3}';
        } else {
          el.className = 'flag-feedback error';
          el.textContent = '✗ 403 Forbidden — missing or wrong header.';
        }
      };
    },
    teardown() { delete window.checkL7; }
  },

  /* ── LEVEL 8 ── */
  {
    id: 8, slug: 'js-deobfuscation', title: 'JS Deobfuscation',
    difficulty: 'medium', concept: 'Code Analysis', xp: 250,
    intro: 'Obfuscated JavaScript is still JavaScript. eval(atob(...)) chains just add a layer of Base64 before execution. Run it in a safe context to reveal what\'s hiding inside.',
    hints: [
      'View the page source and find the obfuscated script block.',
      'Instead of running eval(), replace it with console.log() to see what it decodes to.',
      'Run: console.log(atob("RkxBR3tqc19kM29iZnVzYzR0MXVuX2lzX24wdF9zM2N1cjF0eX0=")) in the console.'
    ],
    solution: 'console.log(atob("RkxBR3tqc19kM29iZnVzYzR0MXVuX2lzX24wdF9zM2N1cjF0eX0=")) → FLAG{js_d3obfusc4t1un_is_n0t_s3cur1ty}',
    render() {
      const mount = document.getElementById('challenge-mount');
      mount.innerHTML = `
        <div class="challenge-header">
          <div class="challenge-meta">
            <span class="challenge-id">// LEVEL 08</span>
            <span class="badge badge-medium">MEDIUM</span>
            <span class="level-xp">250 XP</span>
          </div>
          <h1 class="challenge-title">JS Deobfuscation</h1>
          <p class="challenge-intro">${this.intro}</p>
        </div>
        <div class="challenge-box">
          <h3>// OBFUSCATED SCRIPT</h3>
          <p style="color:var(--text-muted);font-size:14px;margin-bottom:14px;">Found in the page source:</p>
          <div class="code-block">eval(atob("RkxBR3tqc19kM29iZnVzYzR0MXVuX2lzX24wdF9zM2N1cjF0eX0="));</div>
          <p style="color:var(--text-muted);font-size:13px;margin-top:12px;">
            ⚠️ Never run unknown eval() in production — decode it first using <code style="color:var(--accent-cyan)">atob()</code> in the console.
          </p>
        </div>
        <div class="challenge-box">
          <h3>// SUBMIT FLAG</h3>
          <div class="flag-row">
            <input class="flag-input" id="l8-flag" placeholder="FLAG{...}" />
            <button class="btn-primary" onclick="checkFlag(8)">Submit</button>
          </div>
          <div class="flag-feedback" id="flag-feedback-8"></div>
        </div>`;
    },
    teardown() {}
  },

  /* ── LEVEL 9 ── */
  {
    id: 9, slug: 'xss-playground', title: 'XSS Playground',
    difficulty: 'hard', concept: 'Cross-Site Scripting', xp: 500,
    intro: 'Cross-Site Scripting (XSS) happens when user input is inserted into the DOM without sanitisation. An attacker can inject HTML or JavaScript that runs in the victim\'s browser.',
    hints: [
      'The preview box renders whatever you type — without escaping.',
      'Try typing: <b>bold</b> — if it renders bold, HTML injection works.',
      'To call captureFlag(), use an event handler: <img src=x onerror="captureFlag()">',
      'You need to trigger the captureFlag() function via injected HTML.'
    ],
    solution: 'Type: <img src=x onerror="captureFlag()"> in the input. The broken image triggers onerror which calls captureFlag().',
    render() {
      const mount = document.getElementById('challenge-mount');
      mount.innerHTML = `
        <div class="challenge-header">
          <div class="challenge-meta">
            <span class="challenge-id">// LEVEL 09</span>
            <span class="badge badge-hard">HARD</span>
            <span class="level-xp">500 XP</span>
          </div>
          <h1 class="challenge-title">XSS Playground</h1>
          <p class="challenge-intro">${this.intro}</p>
        </div>
        <div class="challenge-box">
          <h3>// VULNERABLE INPUT</h3>
          <p style="color:var(--text-muted);font-size:14px;margin-bottom:14px;">
            This comment box reflects input directly into the DOM. Inject a payload that calls <code style="color:var(--accent-cyan)">captureFlag()</code>.
          </p>
          <input class="flag-input" id="l9-input" placeholder="Type your XSS payload here..." style="width:100%;margin-bottom:10px;" />
          <button class="btn-primary" onclick="renderL9()">Post Comment</button>
          <div class="xss-output" id="l9-output"><span style="color:var(--text-muted)">Preview will appear here...</span></div>
        </div>
        <div class="challenge-box">
          <h3>// SUBMIT FLAG</h3>
          <div class="flag-row">
            <input class="flag-input" id="l9-flag" placeholder="FLAG{...}" />
            <button class="btn-primary" onclick="checkFlag(9)">Submit</button>
          </div>
          <div class="flag-feedback" id="flag-feedback-9"></div>
        </div>`;

      window.captureFlag = () => {
        const fb = document.getElementById('flag-feedback-9');
        if (fb) {
          fb.className = 'flag-feedback success';
          fb.textContent = '⚡ XSS triggered! Flag: FLAG{xss_1nj3ct10n_d3m0}';
        }
        const inp = document.getElementById('l9-flag');
        if (inp) inp.value = 'FLAG{xss_1nj3ct10n_d3m0}';
      };

      window.renderL9 = () => {
        const val = document.getElementById('l9-input').value;
        document.getElementById('l9-output').innerHTML = val;
      };
    },
    teardown() {
      delete window.captureFlag;
      delete window.renderL9;
    }
  },

  /* ── LEVEL 10 ── */
  {
    id: 10, slug: 'prototype-pollution', title: 'Prototype Pollution',
    difficulty: 'hard', concept: 'JS Prototype Chain', xp: 500,
    intro: 'Every JavaScript object inherits properties from Object.prototype. If you can add a property there, every object in the page will appear to have it — including security checks that weren\'t expecting it.',
    hints: [
      'Open DevTools Console.',
      'The check reads: user.isAdmin — but "user" was created without that property.',
      'Try: Object.prototype.isAdmin = true in the console, then click Check Access.',
      'Prototype pollution affects ALL objects, so user.isAdmin will now return true.'
    ],
    solution: 'In the console: Object.prototype.isAdmin = true — then click Check Access. The check reads user.isAdmin which now resolves via the prototype chain.',
    render() {
      const user = { name: 'guest', id: 42 };
      window._l10user = user;

      const mount = document.getElementById('challenge-mount');
      mount.innerHTML = `
        <div class="challenge-header">
          <div class="challenge-meta">
            <span class="challenge-id">// LEVEL 10</span>
            <span class="badge badge-hard">HARD</span>
            <span class="level-xp">500 XP</span>
          </div>
          <h1 class="challenge-title">Prototype Pollution</h1>
          <p class="challenge-intro">${this.intro}</p>
        </div>
        <div class="challenge-box">
          <h3>// PERMISSION CHECK</h3>
          <p style="color:var(--text-muted);font-size:14px;margin-bottom:14px;">The server-side check was ported to client-side JS:</p>
          <div class="code-block">const user = { name: 'guest', id: 42 };
// user.isAdmin is undefined...
if (user.isAdmin) {
  grantAccess(); // Can you make this run?
}</div>
          <p style="color:var(--text-muted);font-size:13px;margin-top:12px;margin-bottom:16px;">
            Pollute the prototype in the console, then click below.
          </p>
          <button class="btn-primary" onclick="checkL10()">Check Access</button>
          <div class="sim-result" id="l10-result" style="margin-top:12px;"></div>
        </div>
        <div class="challenge-box">
          <h3>// SUBMIT FLAG</h3>
          <div class="flag-row">
            <input class="flag-input" id="l10-flag" placeholder="FLAG{...}" />
            <button class="btn-primary" onclick="checkFlag(10)">Submit</button>
          </div>
          <div class="flag-feedback" id="flag-feedback-10"></div>
        </div>`;

      window.checkL10 = () => {
        const el = document.getElementById('l10-result');
        if (window._l10user.isAdmin) {
          el.style.color = 'var(--success)';
          el.innerHTML = '✓ Access granted via prototype chain.<br>Flag: FLAG{pr0t0typ3_p0llut10n_pwn3d}';
        } else {
          el.style.color = 'var(--danger)';
          el.textContent = '✗ user.isAdmin is falsy. Pollute Object.prototype first.';
        }
      };
    },
    teardown() {
      delete window._l10user;
      delete window.checkL10;
      try { delete Object.prototype.isAdmin; } catch(e) { /* ignore */ }
    }
  }
];
 
/* ═══════════════════════════════════════════
   FLAGS (for checkFlag validation)
═══════════════════════════════════════════ */
const FLAGS = {
  1:  'FLAG{h1dd3n_1n_pl41n_s1ght}',
  2:  'FLAG{c0ns0l3_1s_y0ur_fr13nd}',
  3:  'FLAG{c00k13s_4r3_t4sty}',
  4:  'FLAG{sqli_byp4ss_m4st3r}',
  5:  'FLAG{b4s364_1s_n0t_3ncrypt10n}',
  6:  'FLAG{jwt_p4yl04d_1s_publ1c}',
  7:  'FLAG{h34d3rs_4r3_v1s1bl3}',
  8:  'FLAG{js_d3obfusc4t1un_is_n0t_s3cur1ty}',
  9:  'FLAG{xss_1nj3ct10n_d3m0}',
  10: 'FLAG{pr0t0typ3_p0llut10n_pwn3d}'
};


/* ═══════════════════════════════════════════
   RENDERING ENGINE
═══════════════════════════════════════════ */
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(`screen-${name}`);
  if (el) el.classList.add('active');
  state.currentScreen = name;
  if (name === 'home') renderLevelGrid();
}

function showLevel(id) {
  if (id > state.unlockedUpTo) return;
  const level = LEVELS[id - 1];
  if (!level) return;

  // Teardown previous level
  if (state.currentLevelId !== null) {
    const prev = LEVELS[state.currentLevelId - 1];
    if (prev && prev.teardown) prev.teardown();
  }

  state.currentLevelId = id;
  showScreen('level');

  const mount = document.getElementById('challenge-mount');
  mount.innerHTML = '';
  mount.style.animation = 'none';
  mount.offsetHeight; // reflow to restart animation
  mount.style.animation = '';

  level.render();
  updateHelpPanel(id);
  updateProgressBar();
}

function updateProgressBar() {
  const pct = (state.completed.size / LEVELS.length) * 100;
  const bar = document.getElementById('level-progress-bar');
  const lbl = document.getElementById('level-progress-label');
  if (bar) bar.style.width = pct + '%';
  if (lbl) lbl.textContent = `${state.completed.size} / ${LEVELS.length}`;
}

/* ═══════════════════════════════════════════
   LEVEL GRID
═══════════════════════════════════════════ */
function renderLevelGrid() {
  const grid = document.getElementById('level-grid');
  if (!grid) return;
  grid.innerHTML = LEVELS.map(lvl => {
    const done    = state.completed.has(lvl.id);
    const current = lvl.id === state.unlockedUpTo && !done;
    const locked  = lvl.id > state.unlockedUpTo;

    let statusHtml = '';
    if (done)    statusHtml = '<div class="level-status status-complete">✓ COMPLETE</div>';
    else if (current) statusHtml = '<div class="level-status status-current">▶ UNLOCKED</div>';
    else if (locked)  statusHtml = '<div class="level-status status-locked">🔒 LOCKED</div>';

    const cls = ['level-card', done ? 'completed' : '', current ? 'current' : '', locked ? 'locked' : ''].filter(Boolean).join(' ');
    const numStr = String(lvl.id).padStart(2, '0');

    return `<div class="${cls}" onclick="showLevel(${lvl.id})">
      <div class="level-num">${numStr}</div>
      <div class="level-name">${lvl.title}</div>
      <div class="level-concept">${lvl.concept}</div>
      <div class="level-footer">
        <span class="badge badge-${lvl.difficulty}">${lvl.difficulty.toUpperCase()}</span>
        <span class="level-xp">${lvl.xp} XP</span>
      </div>
      ${statusHtml}
    </div>`;
  }).join('');
}

/* ═══════════════════════════════════════════
   FLAG CHECKING & COMPLETION
═══════════════════════════════════════════ */
function checkFlag(id) {
  const input = document.getElementById(`l${id}-flag`) || document.getElementById(`flag-input-${id}`);
  const fb    = document.getElementById(`flag-feedback-${id}`);
  if (!input || !fb) return;

  const val = input.value.trim().toUpperCase();
  const expected = FLAGS[id].toUpperCase();

  if (val === expected) {
    fb.className = 'flag-feedback success';
    fb.textContent = '✓ Flag accepted!';
    if (!state.completed.has(id)) completeLevel(id);
  } else {
    fb.className = 'flag-feedback error';
    fb.textContent = '✗ Incorrect flag. Keep digging.';
    shakeEl(input.id);
  }
}

function completeLevel(id) {
  state.completed.add(id);
  state.unlockedUpTo = Math.max(state.unlockedUpTo, id + 1);
  const level = LEVELS[id - 1];
  state.totalXp += level.xp;

  updateXpCounter();
  updateProgressBar();
  showFlagBanner(FLAGS[id]);
  burstConfetti();

  setTimeout(() => {
    if (id === LEVELS.length) {
      showVictory();
    } else {
      showNextLevelBtn(id);
    }
  }, 1800);
}

function showNextLevelBtn(completedId) {
  const mount = document.getElementById('challenge-mount');
  const existing = document.getElementById('next-level-btn');
  if (existing) return;
  const btn = document.createElement('div');
  btn.id = 'next-level-btn';
  btn.style.cssText = 'text-align:center;margin-top:24px;';
  btn.innerHTML = `<button class="btn-primary" onclick="showLevel(${completedId + 1})" style="padding:12px 32px;font-size:15px;">Next Mission →</button>`;
  mount.appendChild(btn);
}

function showVictory() {
  const xpEl = document.getElementById('victory-xp');
  if (xpEl) xpEl.textContent = `${state.totalXp} XP`;

  const flagsEl = document.getElementById('victory-flags');
  if (flagsEl) {
    flagsEl.innerHTML = LEVELS.map(l =>
      `<div>✓ ${String(l.id).padStart(2,'0')} — ${l.title}: <span style="color:var(--accent-cyan)">${FLAGS[l.id]}</span></div>`
    ).join('');
  }
  showScreen('victory');
}

function copyAchievement() {
  const text = `I completed all 10 HackLab CTF missions! Total XP: ${state.totalXp}\nFlags: ${Object.values(FLAGS).join(', ')}`;
  navigator.clipboard.writeText(text).then(() => alert('Achievement copied to clipboard!'));
}

/* ═══════════════════════════════════════════
   THEME
═══════════════════════════════════════════ */
function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  state.theme = saved;
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem(THEME_KEY, state.theme);
}

/* ═══════════════════════════════════════════
   HELP WIDGET
═══════════════════════════════════════════ */
function toggleHelp() {
  state.helpOpen ? closeHelp() : openHelp();
}

function openHelp() {
  state.helpOpen = true;
  document.getElementById('help-panel').classList.add('open');
}

function closeHelp() {
  state.helpOpen = false;
  document.getElementById('help-panel').classList.remove('open');
}

function updateHelpPanel(id) {
  const body = document.getElementById('help-body');
  if (!body) return;
  const level = LEVELS[id - 1];
  if (!level) { body.innerHTML = '<p class="help-placeholder">Start a mission to see hints.</p>'; return; }

  const hintsHtml = level.hints.map((h, i) =>
    `<div class="help-hint">${i + 1}. ${h}</div>`
  ).join('');

  body.innerHTML = `
    <div class="help-section">
      <div class="help-section-title">Concept</div>
      <div class="help-hint">${level.concept}</div>
    </div>
    <div class="help-section">
      <div class="help-section-title">Hints</div>
      ${hintsHtml}
    </div>
    <div class="help-section">
      <div class="help-section-title">Full Solution</div>
      <div class="help-solution">${level.solution}</div>
    </div>`;
}

/* ═══════════════════════════════════════════
   UI UTILITIES
═══════════════════════════════════════════ */
function updateXpCounter() {
  const el = document.getElementById('xp-counter');
  if (el) el.textContent = `${state.totalXp} XP`;
}

function shakeEl(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'shake 0.4s ease';
  setTimeout(() => { el.style.animation = ''; }, 400);
}

function showFlagBanner(flag) {
  const existing = document.getElementById('flag-banner');
  if (existing) existing.remove();
  const banner = document.createElement('div');
  banner.id = 'flag-banner';
  banner.className = 'flag-banner';
  banner.innerHTML = `<div class="flag-banner-title">// FLAG CAPTURED</div><div class="flag-banner-flag">${flag}</div>`;
  document.body.appendChild(banner);
  setTimeout(() => banner.remove(), 3500);
}

function burstConfetti() {
  const colors = ['#00d4ff','#0066ff','#00ff88','#f59e0b','#ef4444','#ffffff'];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.cssText = `
      left: ${Math.random() * 100}vw;
      top: -10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      transform: rotate(${Math.random() * 360}deg);
      animation-duration: ${0.8 + Math.random() * 1.4}s;
      animation-delay: ${Math.random() * 0.4}s;
    `;
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}

/* ═══════════════════════════════════════════
   TERMINAL ANIMATION
═══════════════════════════════════════════ */
function runTerminalAnimation() {
  const lines = [
    '> Initializing HackLab v2.0...',
    '> Loading 10 mission modules...',
    '> [easy]   View Source ............. OK',
    '> [easy]   Console Recon ........... OK',
    '> [easy]   Cookie Monster .......... OK',
    '> [easy]   SQL Injection ........... OK',
    '> [medium] Base64 Lies ............. OK',
    '> [medium] JWT Decoder ............. OK',
    '> [medium] Header Hunter ........... OK',
    '> [medium] JS Deobfuscation ........ OK',
    '> [hard]   XSS Playground .......... OK',
    '> [hard]   Prototype Pollution ..... OK',
    '> All systems operational.',
    '> Welcome, hacker. Choose your mission._'
  ];

  const out = document.getElementById('terminal-output');
  if (!out) return;
  let li = 0;
  const interval = setInterval(() => {
    if (li >= lines.length) { clearInterval(interval); return; }
    const div = document.createElement('div');
    div.textContent = lines[li];
    div.style.opacity = '0';
    div.style.transition = 'opacity 0.3s ease';
    out.appendChild(div);
    requestAnimationFrame(() => { div.style.opacity = '1'; });
    out.scrollTop = out.scrollHeight;
    li++;
  }, 180);
}

/* ═══════════════════════════════════════════
   INIT
═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderLevelGrid();
  runTerminalAnimation();

  // Help widget: close on outside click
  document.addEventListener('mousedown', (e) => {
    if (state.helpOpen && !e.target.closest('.help-widget')) closeHelp();
  });
});