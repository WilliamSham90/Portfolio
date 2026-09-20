/* ============================================
   TextMotion — Script
   CSS Text Animation Showcase
   ============================================ */

(function () {
    'use strict';

    /* ═══════════════════════════════════════════
       Animation Definitions
       - cls: CSS class applied to preview-text
       - cat: filter category
       - loop: true = infinite animation
       - stagger: true = text split into letter spans
       - custom: 'type' = special HTML rendering
       - css: code users copy
       ═══════════════════════════════════════════ */

    var ANIMS = [
        // ── FADE ──
        { name: 'Fade In', cls: 'tm-fade-in', cat: 'fade', css: '.tm-fade-in {\n  animation: tm-fade-in 0.8s ease both;\n}\n@keyframes tm-fade-in {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}' },
        { name: 'Fade Up', cls: 'tm-fade-up', cat: 'fade', css: '.tm-fade-up {\n  animation: tm-fade-up 0.7s ease both;\n}\n@keyframes tm-fade-up {\n  from { opacity: 0; transform: translateY(24px); }\n  to { opacity: 1; transform: translateY(0); }\n}' },
        { name: 'Fade Down', cls: 'tm-fade-down', cat: 'fade', css: '.tm-fade-down {\n  animation: tm-fade-down 0.7s ease both;\n}\n@keyframes tm-fade-down {\n  from { opacity: 0; transform: translateY(-24px); }\n  to { opacity: 1; transform: translateY(0); }\n}' },
        { name: 'Fade Left', cls: 'tm-fade-left', cat: 'fade', css: '.tm-fade-left {\n  animation: tm-fade-left 0.7s ease both;\n}\n@keyframes tm-fade-left {\n  from { opacity: 0; transform: translateX(-30px); }\n  to { opacity: 1; transform: translateX(0); }\n}' },
        { name: 'Fade Right', cls: 'tm-fade-right', cat: 'fade', css: '.tm-fade-right {\n  animation: tm-fade-right 0.7s ease both;\n}\n@keyframes tm-fade-right {\n  from { opacity: 0; transform: translateX(30px); }\n  to { opacity: 1; transform: translateX(0); }\n}' },
        { name: 'Blur Fade In', cls: 'tm-blur-in', cat: 'fade', css: '.tm-blur-in {\n  animation: tm-blur-in 0.8s ease both;\n}\n@keyframes tm-blur-in {\n  from { opacity: 0; filter: blur(12px); }\n  to { opacity: 1; filter: blur(0); }\n}' },
        // ── SLIDE ──
        { name: 'Slide Up', cls: 'tm-slide-up', cat: 'slide', css: '.tm-slide-up {\n  animation: tm-slide-up 0.6s cubic-bezier(0.22,1,0.36,1) both;\n}\n@keyframes tm-slide-up {\n  from { transform: translateY(100%); }\n  to { transform: translateY(0); }\n}' },
        { name: 'Slide Down', cls: 'tm-slide-down', cat: 'slide', css: '.tm-slide-down {\n  animation: tm-slide-down 0.6s cubic-bezier(0.22,1,0.36,1) both;\n}\n@keyframes tm-slide-down {\n  from { transform: translateY(-100%); }\n  to { transform: translateY(0); }\n}' },
        { name: 'Slide Left', cls: 'tm-slide-left', cat: 'slide', css: '.tm-slide-left {\n  animation: tm-slide-left 0.6s cubic-bezier(0.22,1,0.36,1) both;\n}\n@keyframes tm-slide-left {\n  from { transform: translateX(100%); }\n  to { transform: translateX(0); }\n}' },
        { name: 'Slide Right', cls: 'tm-slide-right', cat: 'slide', css: '.tm-slide-right {\n  animation: tm-slide-right 0.6s cubic-bezier(0.22,1,0.36,1) both;\n}\n@keyframes tm-slide-right {\n  from { transform: translateX(-100%); }\n  to { transform: translateX(0); }\n}' },
        // ── SCALE ──
        { name: 'Scale Up', cls: 'tm-scale-up', cat: 'scale', css: '.tm-scale-up {\n  animation: tm-scale-up 0.5s cubic-bezier(0.22,1,0.36,1) both;\n}\n@keyframes tm-scale-up {\n  from { opacity: 0; transform: scale(0.5); }\n  to { opacity: 1; transform: scale(1); }\n}' },
        { name: 'Scale Down', cls: 'tm-scale-down', cat: 'scale', css: '.tm-scale-down {\n  animation: tm-scale-down 0.5s cubic-bezier(0.22,1,0.36,1) both;\n}\n@keyframes tm-scale-down {\n  from { opacity: 0; transform: scale(1.5); }\n  to { opacity: 1; transform: scale(1); }\n}' },
        { name: 'Flip X', cls: 'tm-flip-x', cat: 'scale', css: '.tm-flip-x {\n  animation: tm-flip-x 0.7s ease both;\n}\n@keyframes tm-flip-x {\n  from { opacity: 0; transform: perspective(400px) rotateX(90deg); }\n  to { opacity: 1; transform: perspective(400px) rotateX(0); }\n}' },
        { name: 'Flip Y', cls: 'tm-flip-y', cat: 'scale', css: '.tm-flip-y {\n  animation: tm-flip-y 0.7s ease both;\n}\n@keyframes tm-flip-y {\n  from { opacity: 0; transform: perspective(400px) rotateY(90deg); }\n  to { opacity: 1; transform: perspective(400px) rotateY(0); }\n}' },
        { name: 'Rotate In', cls: 'tm-rotate-in', cat: 'scale', css: '.tm-rotate-in {\n  animation: tm-rotate-in 0.6s cubic-bezier(0.22,1,0.36,1) both;\n}\n@keyframes tm-rotate-in {\n  from { opacity: 0; transform: rotate(-180deg) scale(0.3); }\n  to { opacity: 1; transform: rotate(0) scale(1); }\n}' },
        // ── BOUNCE ──
        { name: 'Bounce In', cls: 'tm-bounce-in', cat: 'bounce', css: '.tm-bounce-in {\n  animation: tm-bounce-in 0.7s cubic-bezier(0.68,-0.55,0.27,1.55) both;\n}\n@keyframes tm-bounce-in {\n  from { opacity: 0; transform: scale(0.3); }\n  50% { opacity: 1; transform: scale(1.08); }\n  to { transform: scale(1); }\n}' },
        { name: 'Bounce Up', cls: 'tm-bounce-up', cat: 'bounce', css: '.tm-bounce-up {\n  animation: tm-bounce-up 0.8s cubic-bezier(0.34,1.56,0.64,1) both;\n}\n@keyframes tm-bounce-up {\n  from { opacity: 0; transform: translateY(40px); }\n  60% { opacity: 1; transform: translateY(-8px); }\n  to { transform: translateY(0); }\n}' },
        { name: 'Elastic', cls: 'tm-elastic', cat: 'bounce', css: '.tm-elastic {\n  animation: tm-elastic 1s cubic-bezier(0.68,-0.55,0.27,1.55) both;\n}\n@keyframes tm-elastic {\n  from { transform: scaleX(0); }\n  to { transform: scaleX(1); }\n}' },
        { name: 'Rubber Band', cls: 'tm-rubber-band', cat: 'bounce', loop: true, css: '.tm-rubber-band {\n  animation: tm-rubber-band 0.9s ease both;\n}\n@keyframes tm-rubber-band {\n  0% { transform: scale(1); }\n  30% { transform: scaleX(1.25) scaleY(0.75); }\n  40% { transform: scaleX(0.75) scaleY(1.25); }\n  50% { transform: scaleX(1.15) scaleY(0.85); }\n  65% { transform: scaleX(0.95) scaleY(1.05); }\n  75% { transform: scaleX(1.05) scaleY(0.95); }\n  100% { transform: scale(1); }\n}' },
        { name: 'Jello', cls: 'tm-jello', cat: 'bounce', loop: true, css: '.tm-jello {\n  animation: tm-jello 0.9s ease both;\n}\n@keyframes tm-jello {\n  0%, 100% { transform: skewX(0) skewY(0); }\n  30% { transform: skewX(-12deg) skewY(-3deg); }\n  40% { transform: skewX(8deg) skewY(2deg); }\n  50% { transform: skewX(-5deg) skewY(-1deg); }\n  65% { transform: skewX(3deg) skewY(0.5deg); }\n  75% { transform: skewX(-1deg) skewY(-0.5deg); }\n}' },
        // ── GRADIENT ──
        { name: 'Gradient Sweep', cls: 'tm-gradient-sweep', cat: 'gradient', loop: true, css: '.tm-gradient-sweep {\n  animation: tm-gradient-sweep 3s ease infinite;\n  background: linear-gradient(90deg, #7c6aff, #ff6bcb, #00d4ff, #7c6aff);\n  background-size: 300% 100%;\n  -webkit-background-clip: text; background-clip: text;\n  -webkit-text-fill-color: transparent;\n}\n@keyframes tm-gradient-sweep {\n  0% { background-position: 0% 50%; }\n  50% { background-position: 100% 50%; }\n  100% { background-position: 0% 50%; }\n}' },
        { name: 'Shimmer', cls: 'tm-shimmer', cat: 'gradient', loop: true, css: '.tm-shimmer {\n  animation: tm-shimmer 2.5s ease infinite;\n  background: linear-gradient(105deg, #e8e8f0 0%, #e8e8f0 35%, #7c6aff 50%, #e8e8f0 65%, #e8e8f0 100%);\n  background-size: 250% 100%;\n  -webkit-background-clip: text; background-clip: text;\n  -webkit-text-fill-color: transparent;\n}\n@keyframes tm-shimmer {\n  0% { background-position: 200% 0; }\n  100% { background-position: -200% 0; }\n}' },
        { name: 'Rainbow Flow', cls: 'tm-rainbow', cat: 'gradient', loop: true, css: '.tm-rainbow {\n  animation: tm-rainbow 4s linear infinite;\n  background: linear-gradient(90deg, #ff0000, #ff7700, #ffff00, #00ff00, #0077ff, #8800ff, #ff0000);\n  background-size: 400% 100%;\n  -webkit-background-clip: text; background-clip: text;\n  -webkit-text-fill-color: transparent;\n}\n@keyframes tm-rainbow {\n  0% { background-position: 0% 50%; }\n  100% { background-position: 400% 50%; }\n}' },
        { name: 'Color Pulse', cls: 'tm-color-pulse', cat: 'gradient', loop: true, css: '.tm-color-pulse {\n  animation: tm-color-pulse 2s ease-in-out infinite;\n}\n@keyframes tm-color-pulse {\n  0%, 100% { color: #7c6aff; }\n  33% { color: #ff6bcb; }\n  66% { color: #00d4ff; }\n}' },
        // ── GLOW ──
        { name: 'Neon Glow', cls: 'tm-neon-glow', cat: 'glow', loop: true, css: '.tm-neon-glow {\n  animation: tm-neon-glow 2s ease-in-out infinite alternate;\n  color: #00ffff;\n}\n@keyframes tm-neon-glow {\n  from { text-shadow: 0 0 4px #00ffff, 0 0 11px #00ffff, 0 0 19px #00ffff, 0 0 40px #0077ff; }\n  to { text-shadow: 0 0 2px #00ffff, 0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 20px #0077ff; }\n}' },
        { name: 'Shadow Pop', cls: 'tm-shadow-pop', cat: 'glow', css: '.tm-shadow-pop {\n  animation: tm-shadow-pop 0.6s cubic-bezier(0.22,1,0.36,1) both;\n}\n@keyframes tm-shadow-pop {\n  from { text-shadow: 0 0 0 rgba(124,106,255,0); transform: scale(0.95); }\n  to { text-shadow: 2px 2px 0 #5a4fcc, 4px 4px 0 #3d348a, 6px 6px 12px rgba(124,106,255,0.3); transform: scale(1); }\n}' },
        { name: 'Neon Flicker', cls: 'tm-neon-flicker', cat: 'glow', loop: true, css: '.tm-neon-flicker {\n  animation: tm-neon-flicker 3s linear infinite;\n  color: #ff0080;\n}\n@keyframes tm-neon-flicker {\n  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {\n    text-shadow: 0 0 4px #ff0080, 0 0 11px #ff0080, 0 0 19px #ff0080, 0 0 40px #ff0080;\n    opacity: 1;\n  }\n  20%, 24%, 55% { text-shadow: none; opacity: 0.4; }\n}' },
        { name: 'Shadow Dance', cls: 'tm-shadow-dance', cat: 'glow', loop: true, css: '.tm-shadow-dance {\n  animation: tm-shadow-dance 2s ease-in-out infinite;\n}\n@keyframes tm-shadow-dance {\n  0%, 100% { text-shadow: -3px -3px 0 #ff6bcb, 3px 3px 0 #00d4ff; }\n  25% { text-shadow: 3px -3px 0 #ff6bcb, -3px 3px 0 #00d4ff; }\n  50% { text-shadow: 3px 3px 0 #ff6bcb, -3px -3px 0 #00d4ff; }\n  75% { text-shadow: -3px 3px 0 #ff6bcb, 3px -3px 0 #00d4ff; }\n}' },
        // ── REVEAL ──
        { name: 'Typewriter', cls: 'tm-typewriter', cat: 'reveal', css: '.tm-typewriter {\n  animation: tm-typewriter 2.5s steps(12) both;\n  overflow: hidden; white-space: nowrap;\n  border-right: 2px solid currentColor; width: 0;\n}\n@keyframes tm-typewriter { to { width: 100%; } }' },
        { name: 'Clip Reveal Left', cls: 'tm-clip-left', cat: 'reveal', css: '.tm-clip-left {\n  animation: tm-clip-left 0.8s cubic-bezier(0.22,1,0.36,1) both;\n  clip-path: inset(0 100% 0 0);\n}\n@keyframes tm-clip-left { to { clip-path: inset(0 0 0 0); } }' },
        { name: 'Clip Reveal Down', cls: 'tm-clip-down', cat: 'reveal', css: '.tm-clip-down {\n  animation: tm-clip-down 0.8s cubic-bezier(0.22,1,0.36,1) both;\n  clip-path: inset(0 0 100% 0);\n}\n@keyframes tm-clip-down { to { clip-path: inset(0 0 0 0); } }' },
        { name: 'Tracking In', cls: 'tm-tracking-in', cat: 'reveal', css: '.tm-tracking-in {\n  animation: tm-tracking-in 0.8s cubic-bezier(0.22,1,0.36,1) both;\n}\n@keyframes tm-tracking-in {\n  from { letter-spacing: 0.5em; opacity: 0; }\n  to { letter-spacing: normal; opacity: 1; }\n}' },
        // ── WAVE (stagger) ──
        { name: 'Wave', cls: 'tm-wave', cat: 'wave', stagger: true, loop: true, css: '/* Wrap each letter in <span> with staggered delay */\n.tm-wave { display: inline-flex; }\n.tm-wave span {\n  animation: tm-wave-char 1.4s ease-in-out infinite;\n  display: inline-block;\n}\n@keyframes tm-wave-char {\n  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-12px); }\n}' },
        { name: 'Stagger Up', cls: 'tm-stagger-up', cat: 'wave', stagger: true, css: '.tm-stagger-up { display: inline-flex; }\n.tm-stagger-up span {\n  animation: tm-stagger-up-char 0.5s cubic-bezier(0.22,1,0.36,1) both;\n  display: inline-block;\n}\n@keyframes tm-stagger-up-char {\n  from { opacity: 0; transform: translateY(20px); }\n  to { opacity: 1; transform: translateY(0); }\n}' },
        { name: 'Stagger Fade', cls: 'tm-stagger-fade', cat: 'wave', stagger: true, css: '.tm-stagger-fade { display: inline-flex; }\n.tm-stagger-fade span {\n  animation: tm-stagger-fade-char 0.4s ease both;\n  display: inline-block;\n}\n@keyframes tm-stagger-fade-char {\n  from { opacity: 0; transform: scale(0.5); }\n  to { opacity: 1; transform: scale(1); }\n}' },
        // ── GLITCH ──
        { name: 'Glitch', cls: 'tm-glitch', cat: 'glitch', loop: true, css: '.tm-glitch {\n  position: relative;\n  animation: tm-glitch 2s linear infinite;\n}\n@keyframes tm-glitch {\n  0%, 90%, 100% { transform: translate(0); }\n  92% { transform: translate(-2px, 2px); }\n  94% { transform: translate(2px, -1px); }\n  96% { transform: translate(-1px, -2px); }\n  98% { transform: translate(1px, 1px); }\n}' },
        { name: 'Shake', cls: 'tm-shake', cat: 'glitch', css: '.tm-shake {\n  animation: tm-shake 0.5s ease both;\n}\n@keyframes tm-shake {\n  0%, 100% { transform: translateX(0); }\n  20% { transform: translateX(-6px); }\n  40% { transform: translateX(6px); }\n  60% { transform: translateX(-4px); }\n  80% { transform: translateX(4px); }\n}' },
        { name: 'Vibrate', cls: 'tm-vibrate', cat: 'glitch', loop: true, css: '.tm-vibrate {\n  animation: tm-vibrate 0.3s linear infinite;\n}\n@keyframes tm-vibrate {\n  0% { transform: translate(0); }\n  20% { transform: translate(-1px, 1px); }\n  40% { transform: translate(1px, -1px); }\n  60% { transform: translate(-1px, -1px); }\n  80% { transform: translate(1px, 1px); }\n  100% { transform: translate(0); }\n}' },
        // ── SPECIAL ──
        { name: 'Float', cls: 'tm-float', cat: 'special', loop: true, css: '.tm-float {\n  animation: tm-float 3s ease-in-out infinite;\n}\n@keyframes tm-float {\n  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-10px); }\n}' },
        { name: 'Pulse', cls: 'tm-pulse', cat: 'special', loop: true, css: '.tm-pulse {\n  animation: tm-pulse 1.5s ease-in-out infinite;\n}\n@keyframes tm-pulse {\n  0%, 100% { transform: scale(1); opacity: 1; }\n  50% { transform: scale(1.06); opacity: 0.85; }\n}' },
        { name: 'Focus In', cls: 'tm-focus-in', cat: 'special', css: '.tm-focus-in {\n  animation: tm-focus-in 0.7s ease both;\n}\n@keyframes tm-focus-in {\n  from { filter: blur(10px); opacity: 0; letter-spacing: 0.3em; }\n  to { filter: blur(0); opacity: 1; letter-spacing: normal; }\n}' },
        { name: 'Pop', cls: 'tm-pop', cat: 'special', css: '.tm-pop {\n  animation: tm-pop 0.4s cubic-bezier(0.68,-0.55,0.27,1.55) both;\n}\n@keyframes tm-pop {\n  from { transform: scale(0); opacity: 0; }\n  to { transform: scale(1); opacity: 1; }\n}' },
        { name: 'Swing', cls: 'tm-swing', cat: 'special', css: '.tm-swing {\n  animation: tm-swing 1s ease both;\n  transform-origin: top center;\n}\n@keyframes tm-swing {\n  20% { transform: rotate(15deg); }\n  40% { transform: rotate(-10deg); }\n  60% { transform: rotate(5deg); }\n  80% { transform: rotate(-5deg); }\n  100% { transform: rotate(0); }\n}' },
        { name: 'Drop In', cls: 'tm-drop-in', cat: 'special', css: '.tm-drop-in {\n  animation: tm-drop-in 0.6s cubic-bezier(0.22,1,0.36,1) both;\n}\n@keyframes tm-drop-in {\n  from { opacity: 0; transform: translateY(-80px) scaleY(1.1); }\n  to { opacity: 1; transform: translateY(0) scaleY(1); }\n}' },
        { name: 'Zoom Blur', cls: 'tm-zoom-blur', cat: 'special', css: '.tm-zoom-blur {\n  animation: tm-zoom-blur 0.6s ease both;\n}\n@keyframes tm-zoom-blur {\n  from { opacity: 0; transform: scale(2); filter: blur(8px); }\n  to { opacity: 1; transform: scale(1); filter: blur(0); }\n}' },
        { name: 'Skew In', cls: 'tm-skew-in', cat: 'special', css: '.tm-skew-in {\n  animation: tm-skew-in 0.5s cubic-bezier(0.22,1,0.36,1) both;\n}\n@keyframes tm-skew-in {\n  from { opacity: 0; transform: skewX(-20deg) translateX(-30px); }\n  to { opacity: 1; transform: skewX(0) translateX(0); }\n}' },

        // ════════════════════════════════════════
        // ADVANCED (6 new)
        // ════════════════════════════════════════
        { name: 'Clip Title', cls: '', cat: 'advanced', custom: 'clip-title', css: '/* Clip-Path Title Reveal — wrap lines in <span> */\n.clip-title span {\n  display: block; font-weight: 800; text-transform: uppercase;\n  clip-path: polygon(100% 0, 100% 100%, 0 100%, 0 80%);\n  transform: translateY(-50px); opacity: 0;\n  animation: clipTitle 3s ease both;\n}\n.clip-title span:nth-child(1) { animation-delay: 0.7s; }\n.clip-title span:nth-child(2) { animation-delay: 0.6s; }\n.clip-title span:nth-child(3) { animation-delay: 0.5s; color: #ffe221; }\n@keyframes clipTitle {\n  0% { transform: translateY(-50px); opacity: 0; clip-path: polygon(100% 0, 100% 100%, 0 100%, 0 80%); }\n  20% { transform: translateY(0); opacity: 1; clip-path: polygon(100% 0, 100% 100%, 0 100%, 0 15%); }\n  80% { transform: translateY(0); opacity: 1; clip-path: polygon(100% 0, 100% 100%, 0 100%, 0 15%); }\n  100% { transform: translateY(50px); opacity: 0; clip-path: polygon(100% 0, 100% 0%, 0 100%, 0 100%); }\n}' },

        { name: 'Word Reveal', cls: '', cat: 'advanced', custom: 'word-reveal', css: '/* Word Reveal Slide — CSS only */\n.wr-main { display: inline-block; animation: wrShowup 7s infinite; }\n.wr-box { display: inline-block; overflow: hidden; width: 0; animation: wrReveal 7s infinite; }\n.wr-box span { display: inline-block; margin-left: -12em; animation: wrSlide 7s infinite; }\n@keyframes wrShowup { 0% { opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { opacity: 0; } }\n@keyframes wrReveal { 0% { opacity: 0; width: 0; } 20% { opacity: 1; width: 0; } 30% { width: 8em; } 80% { opacity: 1; } 100% { opacity: 0; width: 8em; } }\n@keyframes wrSlide { 0%,20% { margin-left: -12em; } 35%,100% { margin-left: 0; } }' },

        { name: 'RGB Glitch', cls: '', cat: 'advanced', custom: 'rgb-glitch', loop: true, css: '/* RGB Glitch — uses ::before/::after + data-text attr */\n.rgb-glitch { position: relative; font-weight: 800; }\n.rgb-glitch::before, .rgb-glitch::after {\n  content: attr(data-text); position: absolute; top: 0; left: 0;\n  width: 100%; height: 100%; background: inherit;\n}\n.rgb-glitch::before { left: 2px; text-shadow: -1px 0 #ff0040; animation: rgbNoise1 2s infinite linear alternate-reverse; }\n.rgb-glitch::after { left: -2px; text-shadow: 1px 0 #00d4ff; animation: rgbNoise2 3s infinite linear alternate-reverse; }\n/* Generate random clip-path inset values for each keyframe step */\n@keyframes rgbNoise1 {\n  0% { clip-path: inset(40% 0 61% 0); } 10% { clip-path: inset(72% 0 12% 0); }\n  20% { clip-path: inset(81% 0 5% 0); } 30% { clip-path: inset(55% 0 23% 0); }\n  40% { clip-path: inset(92% 0 2% 0); } 50% { clip-path: inset(65% 0 15% 0); }\n  60% { clip-path: inset(76% 0 8% 0); } 70% { clip-path: inset(48% 0 30% 0); }\n  80% { clip-path: inset(88% 0 6% 0); } 90% { clip-path: inset(60% 0 18% 0); }\n  100% { clip-path: inset(50% 0 25% 0); }\n}\n@keyframes rgbNoise2 {\n  0% { clip-path: inset(25% 0 50% 0); } 10% { clip-path: inset(10% 0 75% 0); }\n  20% { clip-path: inset(42% 0 35% 0); } 30% { clip-path: inset(6% 0 80% 0); }\n  40% { clip-path: inset(30% 0 45% 0); } 50% { clip-path: inset(15% 0 60% 0); }\n  60% { clip-path: inset(38% 0 40% 0); } 70% { clip-path: inset(20% 0 58% 0); }\n  80% { clip-path: inset(8% 0 82% 0); } 90% { clip-path: inset(70% 0 14% 0); }\n  100% { clip-path: inset(58% 0 20% 0); }\n}' },

        { name: 'Text Scramble', cls: '', cat: 'advanced', custom: 'scramble', loop: true, css: '/* Text Scramble — requires JavaScript */\n.scramble-text { font-family: monospace; }\n.scramble-text .dud { color: #555; }\n\n/* JavaScript: */\nclass TextScramble {\n  constructor(el) {\n    this.el = el;\n    this.chars = "!<>-_\\\\/[]{}—=+*^?#________";\n    this.update = this.update.bind(this);\n  }\n  setText(newText) {\n    const oldText = this.el.innerText;\n    const length = Math.max(oldText.length, newText.length);\n    const promise = new Promise(resolve => this.resolve = resolve);\n    this.queue = [];\n    for (let i = 0; i < length; i++) {\n      const from = oldText[i] || "";\n      const to = newText[i] || "";\n      const start = Math.floor(Math.random() * 40);\n      const end = start + Math.floor(Math.random() * 40);\n      this.queue.push({ from, to, start, end });\n    }\n    cancelAnimationFrame(this.frameRequest);\n    this.frame = 0;\n    this.update();\n    return promise;\n  }\n  update() {\n    let output = "", complete = 0;\n    for (let i = 0; i < this.queue.length; i++) {\n      let { from, to, start, end, char } = this.queue[i];\n      if (this.frame >= end) { complete++; output += to; }\n      else if (this.frame >= start) {\n        if (!char || Math.random() < 0.28) { char = this.chars[Math.floor(Math.random() * this.chars.length)]; this.queue[i].char = char; }\n        output += \'<span class="dud">\' + char + "</span>";\n      } else { output += from; }\n    }\n    this.el.innerHTML = output;\n    if (complete === this.queue.length) this.resolve();\n    else { this.frameRequest = requestAnimationFrame(this.update); this.frame++; }\n  }\n}' },

        { name: 'Word Rotate 3D', cls: '', cat: 'advanced', custom: 'word-rotate', loop: true, css: '/* 3D Word Rotate — requires JavaScript */\n.word-slot { display: inline-block; position: relative; overflow: hidden; }\n.word-slot .word { position: absolute; opacity: 0; }\n.word-slot .word.active { opacity: 1; }\n.letter { display: inline-block; transform-origin: 50% 50% 12px; transition: transform 0.35s cubic-bezier(0.175,0.885,0.32,1.275); }\n.letter.out { transform: rotateX(90deg); transition-timing-function: cubic-bezier(0.55,0.055,0.675,0.19); }\n.letter.behind { transform: rotateX(-90deg); }\n.letter.in { transform: rotateX(0deg); }\n\n/* JS: Split words into letters, cycle with setInterval */\n/* See full source at the TextMotion showcase */'},

        { name: 'Smoky Text', cls: '', cat: 'advanced', custom: 'smoky', css: '/* Smoky Text Dissolve — wrap each letter in <span> */\n.smoky-text { font-family: "Finger Paint", cursive; color: transparent; }\n.smoky-text span {\n  display: inline-block;\n  text-shadow: 0 0 0 #e8e8f0;\n  animation: smoky 4s both;\n}\n.smoky-text span:nth-child(even) { animation-name: smokyMirror; }\n/* Stagger delays per letter: animation-delay: calc(0.5s + var(--i) * 0.1s) */\n@keyframes smoky {\n  60% { text-shadow: 0 0 30px #e8e8f0; }\n  to { transform: translate3d(6rem,-4rem,0) rotate(-40deg) skewX(70deg) scale(1.3); text-shadow: 0 0 16px #e8e8f0; opacity: 0; }\n}\n@keyframes smokyMirror {\n  60% { text-shadow: 0 0 30px #e8e8f0; }\n  to { transform: translate3d(8rem,-4rem,0) rotate(-40deg) skewX(-70deg) scale(1.5); text-shadow: 0 0 16px #e8e8f0; opacity: 0; }\n}' }
    ];

    /* ── DOM Ready ────────────────────────────── */
    document.addEventListener('DOMContentLoaded', function () {

        var grid      = document.getElementById('animGrid');
        var toast     = document.getElementById('toast');
        var toastText = document.getElementById('toastText');
        var animCount = document.getElementById('animCount');
        var PREVIEW   = 'TextMotion';

        animCount.textContent = String(ANIMS.length);

        /* ── Helpers ──────────────────────────────── */
        function staggerHTML(text) {
            return text.split('').map(function (ch, i) {
                if (ch === ' ') return '<span>\u00a0</span>';
                return '<span style="animation-delay:' + (i * 0.07) + 's">' + ch + '</span>';
            }).join('');
        }

        function smokyHTML(text) {
            return text.split('').map(function (ch, i) {
                if (ch === ' ') return '<span>\u00a0</span>';
                return '<span style="animation-delay:' + (0.5 + i * 0.1) + 's">' + ch + '</span>';
            }).join('');
        }

        /* ── Build Custom Preview HTML ────────────── */
        function customPreviewHTML(anim) {
            switch (anim.custom) {
                case 'clip-title':
                    return '<div class="preview-text tm-clip-title-wrap"><span>Hello</span><span>Nice to</span><span>See you</span></div>';
                case 'word-reveal':
                    return '<div class="preview-text tm-word-reveal-wrap"><span class="tm-wr-main">Escape</span><span class="tm-wr-slide-box"><span>into experiences</span></span></div>';
                case 'rgb-glitch':
                    return '<div class="preview-text tm-rgb-glitch" data-text="GLITCH">GLITCH</div>';
                case 'scramble':
                    return '<div class="preview-text tm-scramble-text">TextMotion</div>';
                case 'word-rotate':
                    return '<div class="preview-text tm-word-rotate-wrap"><span class="tm-wr3d-static">Text is</span> <span class="tm-wr3d-slot"></span></div>';
                case 'smoky':
                    return '<div class="preview-text tm-smoky-wrap">' + smokyHTML('Smoky') + '</div>';
                default:
                    return '<div class="preview-text">' + PREVIEW + '</div>';
            }
        }

        /* (Cards are now rendered in the HOVER-REPLAY SYSTEM above) */

        /* ═══ HOVER-REPLAY SYSTEM ═══
           mouseenter: inject fresh animated HTML → animation plays from start
           mouseleave: replace with static HTML → resets for next hover
           This guarantees a clean replay every time. */

        /* Store animated HTML per card */
        var cardData = []; // { animHTML, idx }

        ANIMS.forEach(function (anim, idx) {
            var card = document.createElement('div');
            card.className = 'anim-card';
            card.setAttribute('data-cat', anim.cat);
            card.setAttribute('data-idx', String(idx));
            card.style.animationDelay = (idx * 35) + 'ms';

            var animPreview;
            if (anim.custom) {
                animPreview = customPreviewHTML(anim);
            } else if (anim.stagger) {
                animPreview = '<div class="preview-text ' + anim.cls + '">' + staggerHTML(PREVIEW) + '</div>';
            } else {
                animPreview = '<div class="preview-text ' + anim.cls + '">' + PREVIEW + '</div>';
            }

            card.innerHTML =
                '<div class="card-preview">' + animPreview + '</div>' +
                '<div class="card-info">' +
                    '<div class="card-name">' + anim.name + '</div>' +
                    '<button type="button" class="copy-btn" data-idx="' + idx + '" aria-label="Copy ' + anim.name + '">' +
                        '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>' +
                        'Copy' +
                    '</button>' +
                '</div>';

            grid.appendChild(card);
            cardData.push({ animHTML: animPreview, idx: idx });
        });

        /* Track active JS intervals/frames for cleanup */
        var activeTimers = {};

        /* ── Auto-Loop System ─────────────────────────
           Every card plays its animation continuously.
           - CSS infinite animations (loop:true) run forever via CSS.
           - One-shot animations restart after animationend + 1.5s pause.
           - JS-driven advanced animations handle their own looping.
        ─────────────────────────────────────────────── */
        function startAutoLoop(card, anim, idx) {
            var data = cardData[idx];
            var preview = card.querySelector('.card-preview');
            if (!preview) return;

            // Clean any previous timers for this card before re-injecting
            cleanupTimers(idx);

            // Inject fresh animated HTML to force a clean restart
            preview.innerHTML = data.animHTML;

            // JS-driven customs (scramble, word-rotate) handle their own looping — return early.
            // Pure-CSS customs (clip-title, word-reveal, smoky, rgb-glitch) fall through
            // to the loop/one-shot logic below so they restart automatically.
            if (anim.custom === 'scramble' || anim.custom === 'word-rotate') {
                initAdvanced(card, anim, idx);
                return;
            }

            // CSS infinite animations — CSS handles the loop, nothing more needed
            if (anim.loop) return;

            // One-shot CSS animations: wait for animationend then restart after 1.5s.
            // Listen on the preview container (with useCapture=true) so events from
            // child <span>s (smoky, stagger, clip-title etc.) are also caught.
            var debounceTimer = null;
            preview.addEventListener('animationend', function () {
                // Debounce because stagger/multi-span animations fire many animationend events;
                // wait 150ms for all of them to settle before scheduling the restart.
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(function () {
                    var restartT = setTimeout(function () {
                        startAutoLoop(card, anim, idx);
                    }, 1500);
                    trackTimer(idx, restartT);
                }, 150);
            }, true);
        }

        // Kick off every card with a small stagger so they don't all fire simultaneously
        ANIMS.forEach(function (anim, idx) {
            var card = grid.querySelector('[data-idx="' + idx + '"]');
            if (!card) return;
            var startDelay = setTimeout(function () {
                startAutoLoop(card, anim, idx);
            }, idx * 100);
            trackTimer(idx, startDelay);
        });

        /* ── Copy Handler ─────────────────────────── */
        grid.addEventListener('click', function (e) {
            var btn = e.target.closest('.copy-btn');
            if (!btn) return;
            var idx = parseInt(btn.getAttribute('data-idx'), 10);
            if (isNaN(idx) || idx < 0 || idx >= ANIMS.length) return;
            copyToClipboard(ANIMS[idx].css);
        });

        /* ── Filter ───────────────────────────────── */
        document.querySelector('.filter-inner').addEventListener('click', function (e) {
            var pill = e.target.closest('.filter-pill');
            if (!pill) return;
            var filter = pill.getAttribute('data-filter');
            this.querySelectorAll('.filter-pill').forEach(function (p) { p.classList.remove('active'); });
            pill.classList.add('active');
            grid.querySelectorAll('.anim-card').forEach(function (card) {
                var show = (filter === 'all') || (card.getAttribute('data-cat') === filter);
                card.classList.toggle('hidden', !show);
            });
        });

        /* ═══════════════════════════════════════════
           ADVANCED ANIMATION INITIALIZERS
           Each stores timers in activeTimers[idx] for cleanup
           ═══════════════════════════════════════════ */
        function cleanupTimers(idx) {
            // Call stop callback if present (e.g. scramble)
            if (typeof activeTimers[idx + '_stop'] === 'function') {
                activeTimers[idx + '_stop']();
                delete activeTimers[idx + '_stop'];
            }
            // Cancel animation frames
            if (activeTimers[idx + '_raf']) {
                cancelAnimationFrame(activeTimers[idx + '_raf']);
                delete activeTimers[idx + '_raf'];
            }
            // Clear all timeouts and intervals
            var timers = activeTimers[idx];
            if (!timers) return;
            timers.forEach(function (id) {
                clearTimeout(id);
                clearInterval(id);
            });
            delete activeTimers[idx];
        }

        function trackTimer(idx, id) {
            if (!activeTimers[idx]) activeTimers[idx] = [];
            activeTimers[idx].push(id);
        }

        function initAdvanced(card, anim, idx) {
            cleanupTimers(idx); // Clean any leftover timers
            switch (anim.custom) {
                case 'scramble': initScramble(card, idx); break;
                case 'word-rotate': initWordRotate(card, idx); break;
                // clip-title, word-reveal, rgb-glitch, smoky are pure CSS
            }
        }

        /* ── Text Scramble ────────────────────────── */
        function initScramble(card, idx) {
            var el = card.querySelector('.tm-scramble-text');
            if (!el) return;
            var chars = '!<>-_\\/[]{}—=+*^?#________';
            var phrases = ['TextMotion', 'CSS Magic', 'Hover Me', 'Copy Code', 'Easy CSS', 'Scrambled'];
            var counter = 0;
            var stopped = false;

            function scrambleTo(text) {
                if (stopped) return;
                var oldText = el.innerText;
                var length = Math.max(oldText.length, text.length);
                var queue = [];
                for (var i = 0; i < length; i++) {
                    queue.push({
                        from: oldText[i] || '',
                        to: text[i] || '',
                        start: Math.floor(Math.random() * 40),
                        end: Math.floor(Math.random() * 40) + Math.floor(Math.random() * 40),
                        char: ''
                    });
                }
                var frame = 0;
                function tick() {
                    if (stopped) return;
                    var output = '', complete = 0;
                    for (var j = 0; j < queue.length; j++) {
                        var q = queue[j];
                        if (frame >= q.end) { complete++; output += q.to; }
                        else if (frame >= q.start) {
                            if (!q.char || Math.random() < 0.28) {
                                q.char = chars[Math.floor(Math.random() * chars.length)];
                            }
                            output += '<span class="dud">' + q.char + '</span>';
                        } else { output += q.from; }
                    }
                    el.innerHTML = output;
                    if (complete < queue.length) {
                        var raf = requestAnimationFrame(tick);
                        activeTimers[idx + '_raf'] = raf;
                        frame++;
                    } else {
                        var t = setTimeout(next, 1200);
                        trackTimer(idx, t);
                    }
                }
                tick();
            }
            function next() {
                if (stopped) return;
                counter = (counter + 1) % phrases.length;
                scrambleTo(phrases[counter]);
            }
            var startT = setTimeout(function () { scrambleTo(phrases[1]); }, 600);
            trackTimer(idx, startT);

            // Store stop function for cleanup
            activeTimers[idx + '_stop'] = function () { stopped = true; };
        }

        /* ── Word Rotate 3D ───────────────────────── */
        function initWordRotate(card, idx) {
            var slot = card.querySelector('.tm-wr3d-slot');
            if (!slot) return;
            var words = ['great.', 'magic.', 'cool.', 'bold.', 'fun.'];
            var colors = ['#8e44ad', '#2980b9', '#c0392b', '#16a085', '#2c3e50'];
            var wordEls = [];
            var current = 0;

            words.forEach(function (w, wi) {
                var wordDiv = document.createElement('span');
                wordDiv.className = 'tm-wr3d-word' + (wi === 0 ? ' active' : '');
                wordDiv.style.color = colors[wi];
                var letters = [];
                for (var c = 0; c < w.length; c++) {
                    var span = document.createElement('span');
                    span.className = 'tm-wr3d-letter' + (wi === 0 ? ' in' : '');
                    span.textContent = w[c];
                    wordDiv.appendChild(span);
                    letters.push(span);
                }
                slot.appendChild(wordDiv);
                wordEls.push(letters);
            });

            function changeWord() {
                var cw = wordEls[current];
                var nextI = (current + 1) % words.length;
                var nw = wordEls[nextI];
                cw.forEach(function (l, i) {
                    var t = setTimeout(function () { l.className = 'tm-wr3d-letter out'; }, i * 70);
                    trackTimer(idx, t);
                });
                nw.forEach(function (l, i) {
                    l.className = 'tm-wr3d-letter behind';
                    l.parentElement.classList.add('active');
                    var t = setTimeout(function () { l.className = 'tm-wr3d-letter in'; }, 300 + i * 70);
                    trackTimer(idx, t);
                });
                var t2 = setTimeout(function () { cw[0].parentElement.classList.remove('active'); }, 300);
                trackTimer(idx, t2);
                current = nextI;
            }
            var interval = setInterval(changeWord, 2500);
            trackTimer(idx, interval);
        }

        /* ── Clipboard ────────────────────────────── */
        function copyToClipboard(text) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(function () { showToast('CSS + JS copied!'); }).catch(function () { fallbackCopy(text); });
            } else { fallbackCopy(text); }
        }
        function fallbackCopy(text) {
            var ta = document.createElement('textarea');
            ta.value = text; ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
            document.body.appendChild(ta); ta.select();
            try { document.execCommand('copy'); showToast('CSS + JS copied!'); } catch (e) { showToast('Copy failed'); }
            document.body.removeChild(ta);
        }

        /* ── Toast ────────────────────────────────── */
        var toastTimer = null;
        function showToast(msg) {
            toastText.textContent = msg;
            if (toastTimer) { clearTimeout(toastTimer); toast.classList.remove('show'); }
            void toast.offsetWidth;
            toast.classList.add('show');
            toastTimer = setTimeout(function () { toast.classList.remove('show'); toastTimer = null; }, 2000);
        }

    }); // end DOMContentLoaded
})();