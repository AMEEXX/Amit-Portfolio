import React, { useEffect, useRef } from 'react';

export default function LiquidRevealCanvas({
  afterImgUrl = 'https://res.cloudinary.com/dvfshzhp/image/upload/v1788281218/final_base_2.png',
  containerRef,
  cursorDotRef,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const container = containerRef.current || canvasRef.current?.parentElement;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const brushRadius = 143;
    const decay = 0.016;

    const ALIGN_SCALE = 1.0;
    const ALIGN_X = 3;
    const ALIGN_Y = 0;

    let coverCanvas, brushCanvas, brushCtx, coverCtx;
    let cw = 0, ch = 0, radius = 0;
    let points = [];
    let lastPt = null;
    let idle = 0;
    let drawing = false;
    let ready = false;
    let animationFrameId = null;

    function drawCover() {
      if (!coverCtx || !afterImg.naturalWidth) return;
      const iw = afterImg.naturalWidth, ih = afterImg.naturalHeight;
      const targetWidth = cw * 0.8;
      const scale = Math.max(targetWidth / iw, ch / ih) * ALIGN_SCALE;
      const sw = iw * scale, sh = ih * scale;
      const sx = cw - sw + (ALIGN_X / 100) * cw;
      const sy = (ch - sh) / 2 + (ALIGN_Y / 100) * ch;
      coverCtx.fillStyle = '#000';
      coverCtx.fillRect(0, 0, cw, ch);
      coverCtx.drawImage(afterImg, sx, sy, sw, sh);
    }

    const afterImg = new Image();
    afterImg.crossOrigin = 'anonymous';
    afterImg.onload = () => {
      if (coverCtx) drawCover();
      ready = true;
    };
    afterImg.src = afterImgUrl;
    if (afterImg.complete && afterImg.naturalWidth) {
      if (coverCtx) drawCover();
      ready = true;
    }

    function sizeCanvas() {
      const rect = container.getBoundingClientRect();
      cw = Math.round(rect.width * dpr);
      ch = Math.round(rect.height * dpr);
      canvas.width = cw;
      canvas.height = ch;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      radius = brushRadius * dpr;

      coverCanvas = document.createElement('canvas');
      coverCanvas.width = cw;
      coverCanvas.height = ch;
      coverCtx = coverCanvas.getContext('2d');
      if (afterImg.complete && afterImg.naturalWidth) drawCover();

      const diam = Math.ceil(radius * 2);
      brushCanvas = document.createElement('canvas');
      brushCanvas.width = diam;
      brushCanvas.height = diam;
      brushCtx = brushCanvas.getContext('2d');

      ctx.clearRect(0, 0, cw, ch);
    }

    const ro = new ResizeObserver(() => sizeCanvas());
    ro.observe(container);
    sizeCanvas();

    const cursorDot = cursorDotRef?.current;
    const handlePointerEnter = () => {
      if (cursorDot) cursorDot.classList.add('active');
    };
    const handlePointerLeave = () => {
      if (cursorDot) cursorDot.classList.remove('active');
    };

    container.addEventListener('pointerenter', handlePointerEnter);
    container.addEventListener('pointerleave', handlePointerLeave);

    const handlePointerMove = (e) => {
      if (!ready) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) * dpr;
      const y = (e.clientY - rect.top) * dpr;

      if (cursorDot) {
        cursorDot.style.left = e.clientX - rect.left + 'px';
        cursorDot.style.top = e.clientY - rect.top + 'px';
      }

      if (x < -radius || y < -radius || x > cw + radius || y > ch + radius) {
        lastPt = null;
        return;
      }
      if (!lastPt) {
        lastPt = { x, y };
        points.push({ x, y });
        return;
      }
      const dx = x - lastPt.x,
        dy = y - lastPt.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const step = Math.max(radius * 0.3, 1);
      const n = Math.min(Math.ceil(dist / step), 60);
      for (let i = 1; i <= n; i++) {
        const t = i / n;
        points.push({ x: lastPt.x + dx * t, y: lastPt.y + dy * t });
      }
      lastPt = { x, y };
    };

    window.addEventListener('pointermove', handlePointerMove);

    function stamp(x, y) {
      const diam = Math.ceil(radius * 2);
      const c = radius;
      brushCtx.clearRect(0, 0, diam, diam);
      brushCtx.globalCompositeOperation = 'source-over';
      const grad = brushCtx.createRadialGradient(c, c, 0, c, c, c);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.55, 'rgba(255,255,255,0.82)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      brushCtx.fillStyle = grad;
      brushCtx.fillRect(0, 0, diam, diam);
      brushCtx.globalCompositeOperation = 'source-in';
      brushCtx.drawImage(coverCanvas, x - c, y - c, diam, diam, 0, 0, diam, diam);
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(brushCanvas, x - c, y - c);
    }

    function tick() {
      if (!ready) {
        animationFrameId = requestAnimationFrame(tick);
        return;
      }
      if (points.length > 0) {
        drawing = true;
        idle = 0;
      } else {
        drawing = false;
        idle++;
        if (idle > 120) {
          ctx.clearRect(0, 0, cw, ch);
          animationFrameId = requestAnimationFrame(tick);
          return;
        }
      }
      const fade = drawing ? decay : Math.min(decay + idle * 0.004, 0.5);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,' + fade + ')';
      ctx.fillRect(0, 0, cw, ch);

      if (drawing) {
        const pts = points.splice(0);
        pts.forEach((p) => stamp(p.x, p.y));
      }
      animationFrameId = requestAnimationFrame(tick);
    }

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      ro.disconnect();
      container.removeEventListener('pointerenter', handlePointerEnter);
      container.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [afterImgUrl, containerRef, cursorDotRef]);

  return <canvas ref={canvasRef} aria-hidden="true" />;
}
