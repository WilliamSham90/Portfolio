/* ============================================================
   DocScan v4 — Text-Region-First OCR Pipeline
   ============================================================
   KEY v4 CHANGES:
   1. MORPHOLOGICAL TEXT REGION DETECTION — finds text blocks
      using gradient + dilate, isolates each block
   2. PER-REGION OCR — each text block is cropped, enhanced,
      and OCR'd individually with optimal PSM
   3. INVERTED TEXT — tries both normal AND inverted (white on
      dark) per region, keeps whichever scores higher
   4. MULTI-STRATEGY BINARIZATION — Otsu + CLAHE + adaptive
      threshold tried; best result kept
   5. Still does 4-rotation auto-orientation
   ============================================================ */

(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  /* ---- DOM ---- */
  const loadingOverlay=$('#loadingOverlay'), appEl=$('#app');
  const video=$('#video'), overlayCanvas=$('#overlayCanvas');
  const btnCapture=$('#btnCapture'), btnGallery=$('#btnGallery');
  const btnUpload=$('#btnUpload'), btnAutoCapture=$('#btnAutoCapture');
  const btnSwitchCam=$('#btnSwitchCamera'), fileInput=$('#fileInput');
  const detectionBadge=$('#detectionStatus'), scanBrackets=$('.scan-brackets');
  const docTypeChips=$('#docTypeChips');
  const cropCanvas=$('#cropCanvas'), btnCropBack=$('#btnCropBack'), btnCropApply=$('#btnCropApply');
  const resultCanvas=$('#resultCanvas'), filterBtns=$$('.filter-btn');
  const modeBtns=$$('.mode-btn'), panelImage=$('#panelImage'), panelOCR=$('#panelOCR');
  const ocrLoading=$('#ocrLoading'), ocrStatusText=$('#ocrStatusText');
  const ocrProgressFill=$('#ocrProgressFill'), ocrPercent=$('#ocrPercent');
  const ocrResult=$('#ocrResult'), ocrDocType=$('#ocrDocType');
  const ocrConfidence=$('#ocrConfidence'), ocrText=$('#ocrText');
  const btnCopyText=$('#btnCopyText'), btnDownloadTxt=$('#btnDownloadTxt');
  const btnResultBack=$('#btnResultBack'), btnDownload=$('#btnDownload');

  /* ---- State ---- */
  let stream, scanInterval, facingMode='environment', autoCapture=false, selectedDocType='auto';
  let capturedImage, detectedCorners, cornerHandles=[], extractedCanvas, originalExtracted;
  let ocrRanForCurrent=false, lastOCRText='';
  let smoothedCorners=null, stableFrameCount=0;
  const EMA=0.35, STABLE_PX=12, STABLE_NEED=5, AUTO_NEED=12;

  /* ============================================================
     INIT
     ============================================================ */
  function waitCV(){return new Promise(r=>{if(window.cv?.Mat)return r();const i=setInterval(()=>{if(window.cv?.Mat){clearInterval(i);r();}},100);if(window.cv){const o=window.cv.onRuntimeInitialized;window.cv.onRuntimeInitialized=()=>{clearInterval(i);o?.();r();};}});}
  (async()=>{await waitCV();loadingOverlay.classList.add('done');appEl.classList.remove('hidden');await startCamera();bindEvents();})();

  /* ============================================================
     CAMERA
     ============================================================ */
  async function startCamera(){stopCamera();try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode,width:{ideal:1920},height:{ideal:1080}},audio:false});video.srcObject=stream;await video.play();video.addEventListener('loadedmetadata',()=>{overlayCanvas.width=video.videoWidth;overlayCanvas.height=video.videoHeight;},{once:true});smoothedCorners=null;stableFrameCount=0;startDetectionLoop();}catch(e){console.error('Camera:',e);alert('Could not access camera.');}}
  function stopCamera(){if(scanInterval){clearInterval(scanInterval);scanInterval=null;}if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}}

  /* ============================================================
     DOCUMENT DETECTION (same as v3 — multi-threshold + EMA)
     ============================================================ */
  function detectDocument(canvas){
    const oW=canvas.width,oH=canvas.height,sf=Math.min(640/oW,640/oH,1);
    const pW=Math.round(oW*sf),pH=Math.round(oH*sf);
    const src=cv.imread(canvas),sm=new cv.Mat();
    cv.resize(src,sm,new cv.Size(pW,pH),0,0,cv.INTER_AREA);src.delete();
    const gray=new cv.Mat(),blur=new cv.Mat();
    cv.cvtColor(sm,gray,cv.COLOR_RGBA2GRAY);cv.GaussianBlur(gray,blur,new cv.Size(7,7),0);sm.delete();
    const thresholds=[[30,90],[50,150],[75,200]];
    let best=null,bestA=0;const fA=pW*pH;
    for(const[lo,hi]of thresholds){
      const e=new cv.Mat();cv.Canny(blur,e,lo,hi);
      const k=cv.getStructuringElement(cv.MORPH_RECT,new cv.Size(5,5));
      cv.dilate(e,e,k,new cv.Point(-1,-1),2);cv.erode(e,e,k,new cv.Point(-1,-1),1);k.delete();
      const cts=new cv.MatVector(),h=new cv.Mat();
      cv.findContours(e,cts,h,cv.RETR_EXTERNAL,cv.CHAIN_APPROX_SIMPLE);e.delete();
      const cands=[];
      for(let i=0;i<cts.size();i++){const a=cv.contourArea(cts.get(i),false);if(a>fA*0.05)cands.push({c:cts.get(i),a});}
      cands.sort((a,b)=>b.a-a.a);
      for(const cd of cands.slice(0,5)){
        const p=cv.arcLength(cd.c,true),ap=new cv.Mat();
        cv.approxPolyDP(cd.c,ap,0.02*p,true);
        if(ap.rows===4&&cv.isContourConvex(ap)&&cd.a>bestA){
          const pts=[];for(let j=0;j<4;j++)pts.push({x:ap.data32S[j*2]/sf,y:ap.data32S[j*2+1]/sf});
          best=orderCorners(pts);bestA=cd.a;}ap.delete();}
      h.delete();cts.delete();if(best&&bestA>fA*0.12)break;}
    gray.delete();blur.delete();return best;}
  function orderCorners(pts){const s=pts.map(p=>p.x+p.y),d=pts.map(p=>p.y-p.x);return{tl:pts[s.indexOf(Math.min(...s))],br:pts[s.indexOf(Math.max(...s))],tr:pts[d.indexOf(Math.min(...d))],bl:pts[d.indexOf(Math.max(...d))]};}
  function smoothCorners(nc){if(!smoothedCorners){smoothedCorners=JSON.parse(JSON.stringify(nc));return smoothedCorners;}let mx=0;for(const k of['tl','tr','br','bl']){const dx=nc[k].x-smoothedCorners[k].x,dy=nc[k].y-smoothedCorners[k].y;smoothedCorners[k].x+=EMA*dx;smoothedCorners[k].y+=EMA*dy;mx=Math.max(mx,Math.hypot(dx,dy));}stableFrameCount=mx<STABLE_PX?stableFrameCount+1:Math.max(0,stableFrameCount-2);return smoothedCorners;}

  function startDetectionLoop(){const ctx=overlayCanvas.getContext('2d');scanInterval=setInterval(()=>{if(video.readyState<2)return;const w=video.videoWidth,h=video.videoHeight;if(!w)return;overlayCanvas.width=w;overlayCanvas.height=h;try{const t=document.createElement('canvas');t.width=w;t.height=h;t.getContext('2d').drawImage(video,0,0,w,h);const raw=detectDocument(t);ctx.clearRect(0,0,w,h);if(raw){const sm=smoothCorners(raw);const ok=stableFrameCount>=STABLE_NEED;drawQuad(ctx,sm,ok);showDet(ok);if(autoCapture&&stableFrameCount>=AUTO_NEED){stableFrameCount=0;captureFrame();}}else{stableFrameCount=Math.max(0,stableFrameCount-1);showDet(stableFrameCount>=STABLE_NEED);if(smoothedCorners&&stableFrameCount>0)drawQuad(ctx,smoothedCorners,false);}}catch(_){ctx.clearRect(0,0,w,h);showDet(false);}},200);}
  function drawQuad(ctx,c,ok){const pts=[c.tl,c.tr,c.br,c.bl];ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);pts.slice(1).forEach(p=>ctx.lineTo(p.x,p.y));ctx.closePath();ctx.fillStyle=ok?'rgba(0,206,201,.08)':'rgba(108,92,231,.06)';ctx.fill();ctx.lineWidth=ok?3:2;ctx.strokeStyle=ok?'rgba(0,206,201,.85)':'rgba(162,155,254,.5)';ctx.setLineDash(ok?[]:[8,6]);ctx.stroke();ctx.setLineDash([]);for(const p of pts){ctx.beginPath();ctx.arc(p.x,p.y,ok?7:5,0,Math.PI*2);ctx.fillStyle=ok?'#00cec9':'#a29bfe';ctx.fill();if(ok){ctx.lineWidth=2;ctx.strokeStyle='#fff';ctx.stroke();}}}
  function showDet(y){detectionBadge.classList.toggle('hidden',!y);scanBrackets.classList.toggle('detected',y);}

  /* ============================================================
     CAPTURE
     ============================================================ */
  function captureFrame(){const w=video.videoWidth,h=video.videoHeight;if(!w)return;$('.camera-wrapper').classList.add('flash');setTimeout(()=>$('.camera-wrapper').classList.remove('flash'),300);capturedImage=document.createElement('canvas');capturedImage.width=w;capturedImage.height=h;capturedImage.getContext('2d').drawImage(video,0,0,w,h);if(smoothedCorners&&stableFrameCount>=STABLE_NEED){detectedCorners=JSON.parse(JSON.stringify(smoothedCorners));}else{const f=detectDocument(capturedImage);detectedCorners=f||{tl:{x:w*.1,y:h*.1},tr:{x:w*.9,y:h*.1},br:{x:w*.9,y:h*.9},bl:{x:w*.1,y:h*.9}};}stopCamera();showView('crop');renderCropView();}

  /* ============================================================
     CROP VIEW
     ============================================================ */
  function renderCropView(){const wr=$('.crop-wrapper');cornerHandles.forEach(h=>h.remove());cornerHandles=[];const img=capturedImage;const sc=Math.min(wr.clientWidth/img.width,wr.clientHeight/img.height,1);cropCanvas.width=img.width*sc;cropCanvas.height=img.height*sc;const ctx=cropCanvas.getContext('2d');ctx.drawImage(img,0,0,cropCanvas.width,cropCanvas.height);drawCropOv(ctx,sc);for(const key of['tl','tr','br','bl']){const h=document.createElement('div');h.className='corner-handle';wr.appendChild(h);cornerHandles.push(h);posH(h,key,sc,cropCanvas.getBoundingClientRect());let drag=false;h.addEventListener('pointerdown',e=>{drag=true;h.setPointerCapture(e.pointerId);e.preventDefault();});h.addEventListener('pointermove',e=>{if(!drag)return;const r=cropCanvas.getBoundingClientRect();detectedCorners[key]={x:Math.max(0,Math.min((e.clientX-r.left)/sc,img.width)),y:Math.max(0,Math.min((e.clientY-r.top)/sc,img.height))};posH(h,key,sc,r);const c=cropCanvas.getContext('2d');c.clearRect(0,0,cropCanvas.width,cropCanvas.height);c.drawImage(img,0,0,cropCanvas.width,cropCanvas.height);drawCropOv(c,sc);});h.addEventListener('pointerup',()=>{drag=false;});h.addEventListener('pointercancel',()=>{drag=false;});}}
  function posH(h,k,s,cr){const p=detectedCorners[k],pr=h.parentElement.getBoundingClientRect();h.style.left=(cr.left-pr.left+p.x*s)+'px';h.style.top=(cr.top-pr.top+p.y*s)+'px';}
  function drawCropOv(ctx,s){const pts=['tl','tr','br','bl'].map(k=>({x:detectedCorners[k].x*s,y:detectedCorners[k].y*s}));ctx.save();ctx.fillStyle='rgba(0,0,0,.45)';ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.globalCompositeOperation='destination-out';ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);pts.slice(1).forEach(p=>ctx.lineTo(p.x,p.y));ctx.closePath();ctx.fill();ctx.restore();ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);pts.slice(1).forEach(p=>ctx.lineTo(p.x,p.y));ctx.closePath();ctx.lineWidth=2;ctx.strokeStyle='#6c5ce7';ctx.stroke();}

  /* ============================================================
     PERSPECTIVE CORRECTION
     ============================================================ */
  function applyPerspective(){const c=detectedCorners;const sp=cv.matFromArray(4,1,cv.CV_32FC2,[c.tl.x,c.tl.y,c.tr.x,c.tr.y,c.br.x,c.br.y,c.bl.x,c.bl.y]);let oW=Math.round(Math.max(dist(c.tl,c.tr),dist(c.bl,c.br))),oH=Math.round(Math.max(dist(c.tl,c.bl),dist(c.tr,c.br)));oW=Math.max(300,Math.min(oW,1600));oH=Math.max(200,Math.min(oH,1200));const r=oW/oH;if(r>1.3&&r<2.0){oW=Math.min(1200,1600);oH=Math.round(oW/1.586);}const dp=cv.matFromArray(4,1,cv.CV_32FC2,[0,0,oW,0,oW,oH,0,oH]);const src=cv.imread(capturedImage),dst=new cv.Mat();const M=cv.getPerspectiveTransform(sp,dp);cv.warpPerspective(src,dst,M,new cv.Size(oW,oH),cv.INTER_LINEAR,cv.BORDER_CONSTANT,new cv.Scalar());extractedCanvas=document.createElement('canvas');extractedCanvas.width=oW;extractedCanvas.height=oH;cv.imshow(extractedCanvas,dst);originalExtracted=document.createElement('canvas');originalExtracted.width=oW;originalExtracted.height=oH;originalExtracted.getContext('2d').drawImage(extractedCanvas,0,0);src.delete();dst.delete();M.delete();sp.delete();dp.delete();}
  function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y);}

  /* ============================================================
     IMAGE ENHANCEMENT
     ============================================================ */
  function enhanceMat(inputMat){
    const rgb=new cv.Mat();cv.cvtColor(inputMat,rgb,cv.COLOR_RGBA2RGB);
    const lab=new cv.Mat();cv.cvtColor(rgb,lab,cv.COLOR_RGB2Lab);rgb.delete();
    const ch=new cv.MatVector();cv.split(lab,ch);
    const clahe=new cv.CLAHE(4.0,new cv.Size(8,8));const enh=new cv.Mat();clahe.apply(ch.get(0),enh);
    const bright=new cv.Mat();const add=new cv.Mat(enh.rows,enh.cols,enh.type(),new cv.Scalar(30));
    cv.add(enh,add,bright);add.delete();enh.delete();
    ch.set(0,bright);cv.merge(ch,lab);
    const res=new cv.Mat();cv.cvtColor(lab,res,cv.COLOR_Lab2RGB);cv.cvtColor(res,res,cv.COLOR_RGB2RGBA);
    lab.delete();ch.delete();bright.delete();clahe.delete();
    const bl=new cv.Mat();cv.GaussianBlur(res,bl,new cv.Size(0,0),3);
    const sh=new cv.Mat();cv.addWeighted(res,1.5,bl,-0.5,0,sh);bl.delete();res.delete();
    return sh;
  }

  /* ============================================================
     FILTERS
     ============================================================ */
  function applyFilter(name){if(!originalExtracted)return;const src=cv.imread(originalExtracted);let dst;switch(name){case'grayscale':dst=new cv.Mat();cv.cvtColor(src,dst,cv.COLOR_RGBA2GRAY);cv.cvtColor(dst,dst,cv.COLOR_GRAY2RGBA);src.delete();break;case'enhance':dst=enhanceMat(src);src.delete();break;case'threshold':{dst=new cv.Mat();const g=new cv.Mat();cv.cvtColor(src,g,cv.COLOR_RGBA2GRAY);cv.GaussianBlur(g,g,new cv.Size(5,5),0);cv.adaptiveThreshold(g,dst,255,cv.ADAPTIVE_THRESH_GAUSSIAN_C,cv.THRESH_BINARY,21,10);cv.cvtColor(dst,dst,cv.COLOR_GRAY2RGBA);g.delete();src.delete();break;}default:dst=new cv.Mat();src.copyTo(dst);src.delete();}cv.imshow(resultCanvas,dst);dst.delete();}

  /* ============================================================
     OCR v4 — TEXT REGION DETECTION + PER-REGION OCR
     ============================================================

     Pipeline:
     1. Enhance source image (CLAHE + brightness)
     2. Try all 4 rotations (0, 90, 180, 270)
     3. For each rotation:
        a. Detect text regions via morphological ops:
           - Grayscale → morphological gradient (outlines text)
           - Threshold → heavy horizontal dilate (merge chars→blocks)
           - findContours → filter by size/aspect
        b. For each text region:
           - Crop & pad
           - Try NORMAL binarization (Otsu)
           - Try INVERTED binarization (for white-on-dark text)
           - OCR both, keep higher confidence
        c. Also OCR the full image as fallback
     4. Pick rotation with best overall result
     ============================================================ */

  /** Rotate canvas by 0/90/180/270 degrees */
  function rotateCanvas(src, deg) {
    if (deg === 0) {
      const c = document.createElement('canvas');
      c.width = src.width; c.height = src.height;
      c.getContext('2d').drawImage(src, 0, 0);
      return c;
    }
    const m = cv.imread(src); let d = new cv.Mat();
    if (deg === 90)  { cv.transpose(m, d); cv.flip(d, d, 1); }
    if (deg === 180) { cv.flip(m, d, -1); }
    if (deg === 270) { cv.transpose(m, d); cv.flip(d, d, 0); }
    const o = document.createElement('canvas'); o.width = d.cols; o.height = d.rows;
    cv.imshow(o, d); m.delete(); d.delete(); return o;
  }

  /** Detect text-block bounding boxes using morphological operations */
  function findTextRegions(grayMat) {
    const regions = [];
    const w = grayMat.cols, h = grayMat.rows;

    // 1. Morphological gradient — highlights edges of text characters
    const grad = new cv.Mat();
    const kSmall = cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(3, 3));
    cv.morphologyEx(grayMat, grad, cv.MORPH_GRADIENT, kSmall);
    kSmall.delete();

    // 2. Threshold the gradient
    const bw = new cv.Mat();
    cv.threshold(grad, bw, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU);
    grad.delete();

    // 3. Heavy horizontal dilate to merge characters into text lines/blocks
    const kHorz = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(
      Math.max(9, Math.round(w * 0.04)),   // wider kernel for wider images
      Math.max(3, Math.round(h * 0.008))
    ));
    cv.dilate(bw, bw, kHorz, new cv.Point(-1,-1), 2);
    kHorz.delete();

    // 3b. Vertical close to merge multi-line text blocks
    const kVert = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(1, Math.max(3, Math.round(h * 0.015))));
    cv.morphologyEx(bw, bw, cv.MORPH_CLOSE, kVert);
    kVert.delete();

    // 4. Find contours
    const contours = new cv.MatVector(), hierarchy = new cv.Mat();
    cv.findContours(bw, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    bw.delete();

    const minArea = w * h * 0.002;  // at least 0.2% of image
    const maxArea = w * h * 0.95;

    for (let i = 0; i < contours.size(); i++) {
      const rect = cv.boundingRect(contours.get(i));
      const area = rect.width * rect.height;
      // Filter: reasonable size, not too thin
      if (area > minArea && area < maxArea && rect.width > 15 && rect.height > 8) {
        // Add padding
        const pad = Math.round(Math.max(rect.width, rect.height) * 0.1);
        regions.push({
          x: Math.max(0, rect.x - pad),
          y: Math.max(0, rect.y - pad),
          w: Math.min(w - Math.max(0, rect.x - pad), rect.width + pad * 2),
          h: Math.min(h - Math.max(0, rect.y - pad), rect.height + pad * 2),
        });
      }
    }
    hierarchy.delete(); contours.delete();

    // Sort top-to-bottom, then left-to-right
    regions.sort((a, b) => {
      const rowA = Math.floor(a.y / (h * 0.05));
      const rowB = Math.floor(b.y / (h * 0.05));
      return rowA !== rowB ? rowA - rowB : a.x - b.x;
    });

    return regions;
  }

  /** Prepare a single text region for OCR — tries normal & inverted */
  function prepareRegion(srcMat, region) {
    // Crop the region
    const roi = srcMat.roi(new cv.Rect(region.x, region.y, region.w, region.h));

    // Upscale (3× minimum for good OCR)
    const scale = Math.max(3, Math.min(5, 600 / Math.max(region.w, region.h)));
    const big = new cv.Mat();
    cv.resize(roi, big, new cv.Size(Math.round(roi.cols * scale), Math.round(roi.rows * scale)), 0, 0, cv.INTER_CUBIC);
    roi.delete();

    // Grayscale
    let gray;
    if (big.channels() > 1) {
      gray = new cv.Mat();
      cv.cvtColor(big, gray, big.channels() === 4 ? cv.COLOR_RGBA2GRAY : cv.COLOR_RGB2GRAY);
      big.delete();
    } else {
      gray = big;
    }

    // Sharpen
    const bl = new cv.Mat();
    cv.GaussianBlur(gray, bl, new cv.Size(0, 0), 2);
    const sharp = new cv.Mat();
    cv.addWeighted(gray, 1.5, bl, -0.5, 0, sharp);
    bl.delete(); gray.delete();

    // Strategy A: Normal (Otsu binarization — dark text on light bg)
    const normal = new cv.Mat();
    cv.threshold(sharp, normal, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU);

    // Strategy B: Inverted (light text on dark bg)
    const inverted = new cv.Mat();
    cv.bitwise_not(normal, inverted);

    // Add white borders (Tesseract needs margins)
    const bdr = Math.round(15 * scale);
    const normBordered = new cv.Mat();
    cv.copyMakeBorder(normal, normBordered, bdr, bdr, bdr, bdr, cv.BORDER_CONSTANT, new cv.Scalar(255));
    const invBordered = new cv.Mat();
    cv.copyMakeBorder(inverted, invBordered, bdr, bdr, bdr, bdr, cv.BORDER_CONSTANT, new cv.Scalar(255));

    normal.delete(); inverted.delete(); sharp.delete();

    // Convert to canvases
    const normCanvas = document.createElement('canvas');
    normCanvas.width = normBordered.cols; normCanvas.height = normBordered.rows;
    cv.imshow(normCanvas, normBordered); normBordered.delete();

    const invCanvas = document.createElement('canvas');
    invCanvas.width = invBordered.cols; invCanvas.height = invBordered.rows;
    cv.imshow(invCanvas, invBordered); invBordered.delete();

    return { normal: normCanvas, inverted: invCanvas };
  }

  /** Full-image fallback preparation */
  function prepareFullImage(srcCanvas) {
    const src = cv.imread(srcCanvas);
    const enh = enhanceMat(src); src.delete();
    const scale = Math.max(2, Math.min(4, 2400 / Math.max(enh.cols, enh.rows)));
    const big = new cv.Mat();
    cv.resize(enh, big, new cv.Size(Math.round(enh.cols*scale), Math.round(enh.rows*scale)), 0, 0, cv.INTER_CUBIC);
    enh.delete();
    const gray = new cv.Mat(); cv.cvtColor(big, gray, cv.COLOR_RGBA2GRAY); big.delete();
    const sh = new cv.Mat(), bl = new cv.Mat();
    cv.GaussianBlur(gray, bl, new cv.Size(0,0), 2);
    cv.addWeighted(gray, 1.3, bl, -0.3, 0, sh); gray.delete(); bl.delete();
    const bdr = Math.round(20 * scale);
    const bordered = new cv.Mat();
    cv.copyMakeBorder(sh, bordered, bdr, bdr, bdr, bdr, cv.BORDER_CONSTANT, new cv.Scalar(255));
    sh.delete();
    const out = document.createElement('canvas');
    out.width = bordered.cols; out.height = bordered.rows;
    cv.imshow(out, bordered); bordered.delete();
    return out;
  }

  /** Main OCR function */
  async function runOCR() {
    if (ocrRanForCurrent && lastOCRText) { showOCRResult(lastOCRText, null, ''); return; }

    ocrLoading.classList.remove('hidden');
    ocrResult.classList.add('hidden');
    setProg(0, 'Enhancing image\u2026');

    try {
      const rotations = [0, 180, 90, 270]; // try 0° and 180° first (most common)
      let bestText = '', bestConf = -1, bestDeg = 0, bestMethod = '';

      for (let ri = 0; ri < rotations.length; ri++) {
        const deg = rotations[ri];
        const basePct = ri * 22;
        setProg(basePct + 2, `Trying ${deg}\u00B0\u2026`);

        const rotated = rotateCanvas(originalExtracted, deg);

        // ---- Enhance the rotated image ----
        const srcMat = cv.imread(rotated);
        const enhanced = enhanceMat(srcMat);
        srcMat.delete();

        // ---- Find text regions ----
        const grayForRegions = new cv.Mat();
        cv.cvtColor(enhanced, grayForRegions, cv.COLOR_RGBA2GRAY);
        const regions = findTextRegions(grayForRegions);
        grayForRegions.delete();

        setProg(basePct + 5, `${deg}\u00B0: found ${regions.length} text blocks`);

        // ---- OCR each region ----
        const worker = await Tesseract.createWorker('eng', 1, {
          logger: info => {
            if (info.status === 'recognizing text') {
              setProg(basePct + 5 + Math.round(info.progress * 15), `Reading text at ${deg}\u00B0\u2026`);
            }
          }
        });
        const psm = regions.length > 0 ? '6' : '3'; // single block per region, or auto for full
        await worker.setParameters({ tessedit_pageseg_mode: psm });

        let allTexts = [];
        let totalConf = 0, confCount = 0;

        if (regions.length > 0) {
          for (const reg of regions) {
            const { normal, inverted } = prepareRegion(enhanced, reg);

            // Try normal
            await worker.setParameters({ tessedit_pageseg_mode: '6' });
            const rNorm = await worker.recognize(normal);
            const tNorm = (rNorm.data.text || '').trim();
            const cNorm = rNorm.data.confidence || 0;

            // Try inverted
            const rInv = await worker.recognize(inverted);
            const tInv = (rInv.data.text || '').trim();
            const cInv = rInv.data.confidence || 0;

            // Keep whichever has higher confidence and meaningful text
            if (cNorm >= cInv && tNorm.length > 1) {
              allTexts.push(tNorm); totalConf += cNorm; confCount++;
            } else if (tInv.length > 1) {
              allTexts.push(tInv); totalConf += cInv; confCount++;
            } else if (tNorm.length > 0) {
              allTexts.push(tNorm); totalConf += cNorm; confCount++;
            }
          }
        }

        // Also try full image as fallback
        const fullPrepped = prepareFullImage(rotated);
        await worker.setParameters({ tessedit_pageseg_mode: '3' });
        const rFull = await worker.recognize(fullPrepped);
        const tFull = (rFull.data.text || '').trim();
        const cFull = rFull.data.confidence || 0;

        await worker.terminate();
        enhanced.delete();

        // Combine region texts
        const regionText = allTexts.filter(t => t.length > 0).join('\n');
        const avgConf = confCount > 0 ? totalConf / confCount : 0;

        // Decide: use region-based or full-image, whichever is better
        let finalText, finalConf, method;
        if (regionText.length > tFull.length * 0.5 && avgConf > cFull * 0.7) {
          finalText = regionText; finalConf = avgConf; method = `${regions.length} blocks`;
        } else if (tFull.length > regionText.length && cFull > 20) {
          finalText = tFull; finalConf = cFull; method = 'full-page';
        } else {
          // Merge both — deduplicate by keeping the longer one
          finalText = regionText.length >= tFull.length ? regionText : tFull;
          finalConf = Math.max(avgConf, cFull);
          method = 'merged';
        }

        if (finalConf > bestConf && finalText.length > 3) {
          bestConf = finalConf; bestText = finalText; bestDeg = deg;
          bestMethod = method;
        }

        // If we got a very high confidence result, skip remaining rotations
        if (bestConf > 75 && bestText.length > 20) break;
      }

      setProg(100, 'Done!');
      lastOCRText = bestText || '(No readable text found.)';
      ocrRanForCurrent = true;
      const label = bestDeg === 0 ? bestMethod : `${bestDeg}\u00B0, ${bestMethod}`;
      showOCRResult(lastOCRText, bestConf > 0 ? Math.round(bestConf) : null, label);

    } catch (err) {
      console.error('OCR error:', err);
      ocrStatusText.textContent = 'OCR failed \u2014 please try again.';
    }
  }

  function setProg(pct, msg) {
    ocrProgressFill.style.width = pct + '%';
    ocrPercent.textContent = Math.round(pct) + '%';
    if (msg) ocrStatusText.textContent = msg;
  }

  function showOCRResult(text, confidence, label) {
    ocrLoading.classList.add('hidden'); ocrResult.classList.remove('hidden');
    const labels = {auto:'Auto',id:'ID Book',smartid:'Smart ID',passport:'Passport',license:'Licence'};
    ocrDocType.textContent = labels[selectedDocType] || 'Auto';
    if (confidence != null) {
      ocrConfidence.textContent = `Confidence: ${confidence}%${label ? ' (' + label + ')' : ''}`;
      ocrConfidence.className = 'ocr-confidence ' + (confidence >= 70 ? 'high' : confidence >= 45 ? 'medium' : 'low');
    } else { ocrConfidence.textContent = ''; }
    ocrText.textContent = text;
  }

  /* ============================================================
     FILE UPLOAD + NAVIGATION + UTILS
     ============================================================ */
  function handleFileUpload(f){if(!f)return;const img=new Image();img.onload=()=>{capturedImage=document.createElement('canvas');capturedImage.width=img.naturalWidth;capturedImage.height=img.naturalHeight;capturedImage.getContext('2d').drawImage(img,0,0);const d=detectDocument(capturedImage);detectedCorners=d||{tl:{x:img.naturalWidth*.05,y:img.naturalHeight*.05},tr:{x:img.naturalWidth*.95,y:img.naturalHeight*.05},br:{x:img.naturalWidth*.95,y:img.naturalHeight*.95},bl:{x:img.naturalWidth*.05,y:img.naturalHeight*.95}};stopCamera();showView('crop');renderCropView();URL.revokeObjectURL(img.src);};img.src=URL.createObjectURL(f);}
  function showView(n){$$('.view').forEach(v=>v.classList.remove('active'));$('#'+({camera:'viewCamera',crop:'viewCrop',result:'viewResult'})[n])?.classList.add('active');}
  function setResultMode(m){modeBtns.forEach(b=>b.classList.toggle('active',b.dataset.mode===m));panelImage.classList.toggle('active',m==='image');panelOCR.classList.toggle('active',m==='ocr');btnDownload.style.display=m==='image'?'':'none';if(m==='ocr')runOCR();}
  function copyText(){const t=ocrText.innerText;if(!t)return;navigator.clipboard.writeText(t).then(()=>toast('Copied!')).catch(()=>{const a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();document.execCommand('copy');a.remove();toast('Copied!');});}
  function downloadTxt(){const t=ocrText.innerText;if(!t)return;const l={auto:'document',id:'id_book',smartid:'smart_id',passport:'passport',license:'licence'};const b=new Blob([t],{type:'text/plain'});const a=document.createElement('a');a.download=`docscan_${l[selectedDocType]||'doc'}_${Date.now()}.txt`;a.href=URL.createObjectURL(b);a.click();URL.revokeObjectURL(a.href);}
  function toast(m){let t=$('.copy-toast');if(!t){t=document.createElement('div');t.className='copy-toast';document.body.appendChild(t);}t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800);}

  /* ============================================================
     EVENTS
     ============================================================ */
  function bindEvents(){
    btnCapture.addEventListener('click',captureFrame);
    btnSwitchCam.addEventListener('click',()=>{facingMode=facingMode==='environment'?'user':'environment';startCamera();});
    btnAutoCapture.addEventListener('click',()=>{autoCapture=!autoCapture;btnAutoCapture.classList.toggle('active-auto',autoCapture);});
    btnUpload.addEventListener('click',()=>fileInput.click());
    btnGallery.addEventListener('click',()=>fileInput.click());
    fileInput.addEventListener('change',e=>{if(e.target.files.length)handleFileUpload(e.target.files[0]);e.target.value='';});
    docTypeChips.addEventListener('click',e=>{const c=e.target.closest('.chip');if(!c)return;docTypeChips.querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));c.classList.add('active');selectedDocType=c.dataset.type;});
    btnCropBack.addEventListener('click',()=>{cornerHandles.forEach(h=>h.remove());cornerHandles=[];showView('camera');startCamera();});
    btnCropApply.addEventListener('click',()=>{cornerHandles.forEach(h=>h.remove());cornerHandles=[];applyPerspective();resultCanvas.width=extractedCanvas.width;resultCanvas.height=extractedCanvas.height;resultCanvas.getContext('2d').drawImage(extractedCanvas,0,0);filterBtns.forEach(b=>b.classList.toggle('active',b.dataset.filter==='original'));ocrRanForCurrent=false;lastOCRText='';ocrLoading.classList.remove('hidden');ocrResult.classList.add('hidden');setResultMode('image');showView('result');});
    modeBtns.forEach(b=>b.addEventListener('click',()=>setResultMode(b.dataset.mode)));
    filterBtns.forEach(b=>b.addEventListener('click',()=>{filterBtns.forEach(x=>x.classList.remove('active'));b.classList.add('active');applyFilter(b.dataset.filter);}));
    btnResultBack.addEventListener('click',()=>{showView('camera');startCamera();});
    btnDownload.addEventListener('click',()=>{const a=document.createElement('a');a.download=`docscan_${Date.now()}.png`;a.href=resultCanvas.toDataURL('image/png');a.click();});
    btnCopyText.addEventListener('click',copyText);
    btnDownloadTxt.addEventListener('click',downloadTxt);
  }
})();
