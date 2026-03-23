/* ============================================================
   DocScan — Application Logic
   ============================================================
   OpenCV.js + jscanify  → edge detection & perspective correction
   Tesseract.js v5       → client-side OCR (text extraction)
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Helpers ---------- */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  /* ---------- DOM refs ---------- */
  const loadingOverlay = $('#loadingOverlay');
  const appEl          = $('#app');

  // Camera
  const video          = $('#video');
  const overlayCanvas  = $('#overlayCanvas');
  const btnCapture     = $('#btnCapture');
  const btnGallery     = $('#btnGallery');
  const btnUpload      = $('#btnUpload');
  const btnAutoCapture = $('#btnAutoCapture');
  const btnSwitchCam   = $('#btnSwitchCamera');
  const fileInput      = $('#fileInput');
  const detectionBadge = $('#detectionStatus');
  const scanBrackets   = $('.scan-brackets');
  const docTypeChips   = $('#docTypeChips');

  // Crop
  const cropCanvas     = $('#cropCanvas');
  const btnCropBack    = $('#btnCropBack');
  const btnCropApply   = $('#btnCropApply');

  // Result — image panel
  const resultCanvas   = $('#resultCanvas');
  const filterBtns     = $$('.filter-btn');

  // Result — mode toggle
  const modeBtns       = $$('.mode-btn');
  const panelImage     = $('#panelImage');
  const panelOCR       = $('#panelOCR');

  // Result — OCR panel
  const ocrLoading     = $('#ocrLoading');
  const ocrStatusText  = $('#ocrStatusText');
  const ocrProgressFill = $('#ocrProgressFill');
  const ocrPercent     = $('#ocrPercent');
  const ocrResult      = $('#ocrResult');
  const ocrDocType     = $('#ocrDocType');
  const ocrConfidence  = $('#ocrConfidence');
  const ocrText        = $('#ocrText');
  const btnCopyText    = $('#btnCopyText');
  const btnDownloadTxt = $('#btnDownloadTxt');

  // Shared result controls
  const btnResultBack  = $('#btnResultBack');
  const btnDownload    = $('#btnDownload');

  /* ---------- State ---------- */
  let scanner           = null;
  let stream            = null;
  let scanInterval      = null;
  let facingMode        = 'environment';
  let autoCapture       = false;
  let autoStableCount   = 0;
  let lastCorners       = null;
  let selectedDocType   = 'auto';

  let capturedImage     = null;
  let detectedCorners   = null;
  let cornerHandles     = [];
  let extractedCanvas   = null;
  let originalExtracted = null;

  // OCR
  let ocrWorker         = null;   // cached Tesseract worker
  let ocrRanForCurrent  = false;  // have we already run OCR on this scan?
  let lastOCRText       = '';

  // Standard card ratio ~1.586:1
  const CARD_WIDTH  = 640;
  const CARD_HEIGHT = 404;

  /* ============================================================
     1. INIT
     ============================================================ */

  function waitForOpenCV() {
    return new Promise((resolve) => {
      if (window.cv && window.cv.Mat) { resolve(); return; }
      const check = setInterval(() => {
        if (window.cv && window.cv.Mat) { clearInterval(check); resolve(); }
      }, 100);
      if (window.cv) {
        const orig = window.cv.onRuntimeInitialized;
        window.cv.onRuntimeInitialized = () => {
          clearInterval(check);
          if (orig) orig();
          resolve();
        };
      }
    });
  }

  async function init() {
    await waitForOpenCV();
    scanner = new jscanify();
    loadingOverlay.classList.add('done');
    appEl.classList.remove('hidden');
    await startCamera();
    bindEvents();
  }

  init();

  /* ============================================================
     2. CAMERA
     ============================================================ */

  async function startCamera() {
    stopCamera();
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      video.srcObject = stream;
      await video.play();
      video.addEventListener('loadedmetadata', () => {
        overlayCanvas.width  = video.videoWidth;
        overlayCanvas.height = video.videoHeight;
      }, { once: true });
      startDetectionLoop();
    } catch (err) {
      console.error('Camera error:', err);
      alert('Could not access camera. Please allow camera permissions and reload.');
    }
  }

  function stopCamera() {
    if (scanInterval) { clearInterval(scanInterval); scanInterval = null; }
    if (stream) { stream.getTracks().forEach((t) => t.stop()); stream = null; }
  }

  async function switchCamera() {
    facingMode = facingMode === 'environment' ? 'user' : 'environment';
    await startCamera();
  }

  /* ============================================================
     3. DETECTION LOOP
     ============================================================ */

  function startDetectionLoop() {
    const overlayCtx = overlayCanvas.getContext('2d');

    scanInterval = setInterval(() => {
      if (video.readyState < 2) return;
      const w = video.videoWidth;
      const h = video.videoHeight;
      if (!w || !h) return;
      overlayCanvas.width = w;
      overlayCanvas.height = h;

      try {
        const tmp = document.createElement('canvas');
        tmp.width = w; tmp.height = h;
        tmp.getContext('2d').drawImage(video, 0, 0, w, h);

        const mat = cv.imread(tmp);
        const contour = scanner.findPaperContour(mat);
        const corners = contour ? scanner.getCornerPoints(contour) : null;
        mat.delete();

        overlayCtx.clearRect(0, 0, w, h);

        if (corners && isReasonableQuad(corners, w, h)) {
          drawOverlayQuad(overlayCtx, corners);
          showDetected(true);
          lastCorners = corners;
          if (autoCapture) {
            autoStableCount++;
            if (autoStableCount > 8) { autoStableCount = 0; captureFrame(); }
          }
        } else {
          showDetected(false);
          autoStableCount = 0;
          lastCorners = null;
        }
      } catch (_) {
        overlayCtx.clearRect(0, 0, w, h);
        showDetected(false);
      }
    }, 150);
  }

  function isReasonableQuad(corners, fw, fh) {
    const pts = [corners.topLeftCorner, corners.topRightCorner,
                 corners.bottomRightCorner, corners.bottomLeftCorner];
    for (const p of pts) {
      if (p.x < 0 || p.y < 0 || p.x > fw || p.y > fh) return false;
    }
    const area = quadArea(pts);
    return area > fw * fh * 0.05 && area < fw * fh * 0.98;
  }

  function quadArea(pts) {
    let a = 0;
    for (let i = 0; i < pts.length; i++) {
      const j = (i + 1) % pts.length;
      a += pts[i].x * pts[j].y - pts[j].x * pts[i].y;
    }
    return Math.abs(a) / 2;
  }

  function drawOverlayQuad(ctx, corners) {
    const pts = [corners.topLeftCorner, corners.topRightCorner,
                 corners.bottomRightCorner, corners.bottomLeftCorner];
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.closePath();
    ctx.fillStyle = 'rgba(108,92,231,.12)';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(0,206,201,.85)';
    ctx.stroke();
    for (const p of pts) {
      ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#00cec9'; ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = '#fff'; ctx.stroke();
    }
  }

  function showDetected(yes) {
    detectionBadge.classList.toggle('hidden', !yes);
    scanBrackets.classList.toggle('detected', yes);
  }

  /* ============================================================
     4. CAPTURE
     ============================================================ */

  function captureFrame() {
    const w = video.videoWidth;
    const h = video.videoHeight;
    if (!w || !h) return;

    $('.camera-wrapper').classList.add('flash');
    setTimeout(() => $('.camera-wrapper').classList.remove('flash'), 300);

    capturedImage = document.createElement('canvas');
    capturedImage.width = w; capturedImage.height = h;
    capturedImage.getContext('2d').drawImage(video, 0, 0, w, h);

    detectedCorners = detectCornersOn(capturedImage, w, h);
    stopCamera();
    showView('crop');
    renderCropView();
  }

  function detectCornersOn(canvas, w, h) {
    try {
      const mat = cv.imread(canvas);
      const contour = scanner.findPaperContour(mat);
      const corners = contour ? scanner.getCornerPoints(contour) : null;
      mat.delete();
      if (corners && isReasonableQuad(corners, w, h)) {
        return {
          tl: { x: corners.topLeftCorner.x, y: corners.topLeftCorner.y },
          tr: { x: corners.topRightCorner.x, y: corners.topRightCorner.y },
          br: { x: corners.bottomRightCorner.x, y: corners.bottomRightCorner.y },
          bl: { x: corners.bottomLeftCorner.x, y: corners.bottomLeftCorner.y },
        };
      }
      if (lastCorners) {
        return {
          tl: { ...lastCorners.topLeftCorner }, tr: { ...lastCorners.topRightCorner },
          br: { ...lastCorners.bottomRightCorner }, bl: { ...lastCorners.bottomLeftCorner },
        };
      }
    } catch (_) { /* fallback below */ }
    return {
      tl: { x: w * .1, y: h * .1 }, tr: { x: w * .9, y: h * .1 },
      br: { x: w * .9, y: h * .9 }, bl: { x: w * .1, y: h * .9 },
    };
  }

  /* ============================================================
     5. CROP VIEW
     ============================================================ */

  function renderCropView() {
    const wrapper = $('.crop-wrapper');
    cornerHandles.forEach((h) => h.remove());
    cornerHandles = [];

    const img = capturedImage;
    const maxW = wrapper.clientWidth;
    const maxH = wrapper.clientHeight;
    const scale = Math.min(maxW / img.width, maxH / img.height, 1);

    cropCanvas.width  = img.width * scale;
    cropCanvas.height = img.height * scale;
    const ctx = cropCanvas.getContext('2d');
    ctx.drawImage(img, 0, 0, cropCanvas.width, cropCanvas.height);
    drawCropOverlay(ctx, scale);

    ['tl', 'tr', 'br', 'bl'].forEach((key) => {
      const handle = document.createElement('div');
      handle.className = 'corner-handle';
      handle.dataset.corner = key;
      wrapper.appendChild(handle);
      cornerHandles.push(handle);
      positionHandle(handle, key, scale, cropCanvas.getBoundingClientRect());

      let dragging = false;
      handle.addEventListener('pointerdown', (e) => {
        dragging = true; handle.setPointerCapture(e.pointerId); e.preventDefault();
      });
      handle.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const rect = cropCanvas.getBoundingClientRect();
        const x = Math.max(0, Math.min((e.clientX - rect.left) / scale, img.width));
        const y = Math.max(0, Math.min((e.clientY - rect.top) / scale, img.height));
        detectedCorners[key] = { x, y };
        positionHandle(handle, key, scale, rect);
        const cx = cropCanvas.getContext('2d');
        cx.clearRect(0, 0, cropCanvas.width, cropCanvas.height);
        cx.drawImage(img, 0, 0, cropCanvas.width, cropCanvas.height);
        drawCropOverlay(cx, scale);
      });
      handle.addEventListener('pointerup', () => { dragging = false; });
      handle.addEventListener('pointercancel', () => { dragging = false; });
    });
  }

  function positionHandle(handle, key, scale, canvasRect) {
    const pt = detectedCorners[key];
    const pr = handle.parentElement.getBoundingClientRect();
    handle.style.left = (canvasRect.left - pr.left + pt.x * scale) + 'px';
    handle.style.top  = (canvasRect.top  - pr.top  + pt.y * scale) + 'px';
  }

  function drawCropOverlay(ctx, scale) {
    const pts = ['tl','tr','br','bl'].map((k) => ({
      x: detectedCorners[k].x * scale, y: detectedCorners[k].y * scale,
    }));
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,.45)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
    pts.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
    pts.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.closePath(); ctx.lineWidth = 2; ctx.strokeStyle = '#6c5ce7'; ctx.stroke();
  }

  /* ============================================================
     6. PERSPECTIVE CORRECTION
     ============================================================ */

  function applyPerspectiveCorrection() {
    const c = detectedCorners;
    const srcPts = cv.matFromArray(4, 1, cv.CV_32FC2, [
      c.tl.x, c.tl.y, c.tr.x, c.tr.y, c.br.x, c.br.y, c.bl.x, c.bl.y,
    ]);

    const wT = dist(c.tl, c.tr), wB = dist(c.bl, c.br);
    const hL = dist(c.tl, c.bl), hR = dist(c.tr, c.br);

    let outW = Math.round(Math.max(wT, wB));
    let outH = Math.round(Math.max(hL, hR));
    outW = Math.max(200, Math.min(outW, CARD_WIDTH));
    outH = Math.max(120, Math.min(outH, CARD_HEIGHT));
    const ratio = outW / outH;
    if (ratio > 1.3 && ratio < 2.0) { outW = CARD_WIDTH; outH = CARD_HEIGHT; }

    const dstPts = cv.matFromArray(4, 1, cv.CV_32FC2, [
      0, 0, outW, 0, outW, outH, 0, outH,
    ]);

    const src = cv.imread(capturedImage);
    const dst = new cv.Mat();
    const M = cv.getPerspectiveTransform(srcPts, dstPts);
    cv.warpPerspective(src, dst, M, new cv.Size(outW, outH),
      cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

    extractedCanvas = document.createElement('canvas');
    extractedCanvas.width = outW; extractedCanvas.height = outH;
    cv.imshow(extractedCanvas, dst);

    originalExtracted = document.createElement('canvas');
    originalExtracted.width = outW; originalExtracted.height = outH;
    originalExtracted.getContext('2d').drawImage(extractedCanvas, 0, 0);

    src.delete(); dst.delete(); M.delete(); srcPts.delete(); dstPts.delete();
  }

  function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }

  /* ============================================================
     7. IMAGE FILTERS
     ============================================================ */

  function applyFilter(name) {
    if (!originalExtracted) return;
    const src = cv.imread(originalExtracted);
    const dst = new cv.Mat();
    switch (name) {
      case 'grayscale':
        cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
        cv.cvtColor(dst, dst, cv.COLOR_GRAY2RGBA);
        break;
      case 'enhance': {
        const lab = new cv.Mat(); const labC = new cv.Mat();
        cv.cvtColor(src, lab, cv.COLOR_RGBA2RGB);
        cv.cvtColor(lab, labC, cv.COLOR_RGB2Lab);
        const ch = new cv.MatVector(); cv.split(labC, ch);
        const clahe = new cv.CLAHE(3.0, new cv.Size(8, 8));
        const enh = new cv.Mat(); clahe.apply(ch.get(0), enh);
        ch.set(0, enh); cv.merge(ch, labC);
        cv.cvtColor(labC, dst, cv.COLOR_Lab2RGB);
        cv.cvtColor(dst, dst, cv.COLOR_RGB2RGBA);
        lab.delete(); labC.delete(); ch.delete(); enh.delete(); clahe.delete();
        break;
      }
      case 'threshold': {
        const g = new cv.Mat();
        cv.cvtColor(src, g, cv.COLOR_RGBA2GRAY);
        cv.GaussianBlur(g, g, new cv.Size(5, 5), 0);
        cv.adaptiveThreshold(g, dst, 255,
          cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 21, 10);
        cv.cvtColor(dst, dst, cv.COLOR_GRAY2RGBA);
        g.delete();
        break;
      }
      default: src.copyTo(dst);
    }
    cv.imshow(resultCanvas, dst);
    src.delete(); dst.delete();
  }

  /* ============================================================
     8. OCR — Tesseract.js v5
     ============================================================ */

  /**
   * Preprocess the scanned image for better OCR accuracy:
   * convert to grayscale, apply CLAHE contrast enhancement,
   * then adaptive threshold for clean B&W text.
   */
  function preprocessForOCR(sourceCanvas) {
    const src = cv.imread(sourceCanvas);
    const gray = new cv.Mat();
    const enhanced = new cv.Mat();
    const result = new cv.Mat();

    // Grayscale
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

    // CLAHE contrast enhancement
    const clahe = new cv.CLAHE(2.5, new cv.Size(8, 8));
    clahe.apply(gray, enhanced);

    // Light gaussian blur to reduce noise
    cv.GaussianBlur(enhanced, enhanced, new cv.Size(3, 3), 0);

    // Adaptive threshold for clean text
    cv.adaptiveThreshold(enhanced, result, 255,
      cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 15, 8);

    // Write to a temp canvas
    const ocrCanvas = document.createElement('canvas');
    ocrCanvas.width = sourceCanvas.width;
    ocrCanvas.height = sourceCanvas.height;
    cv.imshow(ocrCanvas, result);

    src.delete(); gray.delete(); enhanced.delete();
    result.delete(); clahe.delete();

    return ocrCanvas;
  }

  async function runOCR() {
    if (ocrRanForCurrent && lastOCRText) {
      // Already ran — just show result
      showOCRResult(lastOCRText, null);
      return;
    }

    // Show loading
    ocrLoading.classList.remove('hidden');
    ocrResult.classList.add('hidden');
    ocrProgressFill.style.width = '0%';
    ocrPercent.textContent = '0%';
    ocrStatusText.textContent = 'Preparing OCR engine\u2026';

    try {
      // Preprocess image for OCR accuracy
      ocrStatusText.textContent = 'Preprocessing image\u2026';
      ocrProgressFill.style.width = '10%';
      ocrPercent.textContent = '10%';

      const preprocessed = preprocessForOCR(originalExtracted);

      ocrStatusText.textContent = 'Loading Tesseract worker\u2026';
      ocrProgressFill.style.width = '20%';
      ocrPercent.textContent = '20%';

      // Create worker (reuse if possible)
      if (!ocrWorker) {
        ocrWorker = await Tesseract.createWorker('eng', 1, {
          logger: (info) => {
            if (info.status === 'recognizing text') {
              const pct = Math.round(20 + info.progress * 75);
              ocrProgressFill.style.width = pct + '%';
              ocrPercent.textContent = pct + '%';
              ocrStatusText.textContent = 'Recognizing text\u2026';
            }
          },
        });
      }

      ocrStatusText.textContent = 'Recognizing text\u2026';
      const { data } = await ocrWorker.recognize(preprocessed);

      ocrProgressFill.style.width = '100%';
      ocrPercent.textContent = '100%';

      lastOCRText = data.text ? data.text.trim() : '';
      const confidence = data.confidence ? Math.round(data.confidence) : null;
      ocrRanForCurrent = true;

      showOCRResult(lastOCRText, confidence);

    } catch (err) {
      console.error('OCR error:', err);
      ocrStatusText.textContent = 'OCR failed — please try again.';
      ocrProgressFill.style.width = '0%';
    }
  }

  function showOCRResult(text, confidence) {
    ocrLoading.classList.add('hidden');
    ocrResult.classList.remove('hidden');

    // Doc type badge
    const typeLabels = {
      auto: 'Auto', id: 'ID Book', smartid: 'Smart ID',
      passport: 'Passport', license: 'Licence',
    };
    ocrDocType.textContent = typeLabels[selectedDocType] || 'Auto';

    // Confidence
    if (confidence !== null && confidence !== undefined) {
      ocrConfidence.textContent = 'Confidence: ' + confidence + '%';
      ocrConfidence.className = 'ocr-confidence ' +
        (confidence >= 80 ? 'high' : confidence >= 50 ? 'medium' : 'low');
    } else {
      ocrConfidence.textContent = '';
    }

    // Text
    ocrText.textContent = text || '(No text could be extracted from this document.)';
  }

  /* ============================================================
     9. FILE UPLOAD
     ============================================================ */

  function handleFileUpload(file) {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      capturedImage = document.createElement('canvas');
      capturedImage.width = img.naturalWidth;
      capturedImage.height = img.naturalHeight;
      capturedImage.getContext('2d').drawImage(img, 0, 0);
      detectedCorners = detectCornersOn(capturedImage, img.naturalWidth, img.naturalHeight);
      stopCamera();
      showView('crop');
      renderCropView();
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  }

  /* ============================================================
     10. VIEW NAVIGATION
     ============================================================ */

  function showView(name) {
    $$('.view').forEach((v) => v.classList.remove('active'));
    const map = { camera: 'viewCamera', crop: 'viewCrop', result: 'viewResult' };
    const el = $('#' + map[name]);
    if (el) el.classList.add('active');
  }

  function setResultMode(mode) {
    modeBtns.forEach((b) => b.classList.toggle('active', b.dataset.mode === mode));
    panelImage.classList.toggle('active', mode === 'image');
    panelOCR.classList.toggle('active', mode === 'ocr');
    btnDownload.style.display = mode === 'image' ? '' : 'none';

    if (mode === 'ocr') runOCR();
  }

  /* ============================================================
     11. UTILITY — Copy & Download text
     ============================================================ */

  function copyText() {
    const text = ocrText.innerText;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard!');
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      showToast('Copied to clipboard!');
    });
  }

  function downloadTxt() {
    const text = ocrText.innerText;
    if (!text) return;
    const typeLabels = {
      auto: 'document', id: 'id_book', smartid: 'smart_id',
      passport: 'passport', license: 'licence',
    };
    const filename = 'docscan_' + (typeLabels[selectedDocType] || 'document') + '_' + Date.now() + '.txt';
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = filename;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function showToast(msg) {
    let toast = $('.copy-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'copy-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1800);
  }

  /* ============================================================
     12. EVENT BINDINGS
     ============================================================ */

  function bindEvents() {
    // Capture
    btnCapture.addEventListener('click', captureFrame);

    // Switch camera
    btnSwitchCam.addEventListener('click', switchCamera);

    // Auto-capture
    btnAutoCapture.addEventListener('click', () => {
      autoCapture = !autoCapture;
      btnAutoCapture.classList.toggle('active-auto', autoCapture);
    });

    // Upload
    btnUpload.addEventListener('click', () => fileInput.click());
    btnGallery.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length) handleFileUpload(e.target.files[0]);
      e.target.value = '';
    });

    // Doc type chips
    docTypeChips.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      docTypeChips.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      selectedDocType = chip.dataset.type;
    });

    // Crop view
    btnCropBack.addEventListener('click', async () => {
      cornerHandles.forEach((h) => h.remove());
      cornerHandles = [];
      showView('camera');
      await startCamera();
    });

    btnCropApply.addEventListener('click', () => {
      cornerHandles.forEach((h) => h.remove());
      cornerHandles = [];
      applyPerspectiveCorrection();

      resultCanvas.width = extractedCanvas.width;
      resultCanvas.height = extractedCanvas.height;
      resultCanvas.getContext('2d').drawImage(extractedCanvas, 0, 0);

      filterBtns.forEach((b) => b.classList.toggle('active', b.dataset.filter === 'original'));

      // Reset OCR state for new scan
      ocrRanForCurrent = false;
      lastOCRText = '';
      ocrLoading.classList.remove('hidden');
      ocrResult.classList.add('hidden');

      // Default to image mode
      setResultMode('image');
      showView('result');
    });

    // Mode toggle (Image vs OCR)
    modeBtns.forEach((btn) => {
      btn.addEventListener('click', () => setResultMode(btn.dataset.mode));
    });

    // Filters
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilter(btn.dataset.filter);
      });
    });

    // Result — back
    btnResultBack.addEventListener('click', async () => {
      showView('camera');
      await startCamera();
    });

    // Download image
    btnDownload.addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = 'docscan_' + Date.now() + '.png';
      link.href = resultCanvas.toDataURL('image/png');
      link.click();
    });

    // OCR actions
    btnCopyText.addEventListener('click', copyText);
    btnDownloadTxt.addEventListener('click', downloadTxt);
  }

})();
