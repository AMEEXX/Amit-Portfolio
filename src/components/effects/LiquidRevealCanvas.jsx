// src/components/effects/LiquidRevealCanvas.jsx
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
      if (cw <= 0 || ch <= 0) return;

      // Strict object-fit: cover math to perfectly align 1:1 with the CSS base image
      const scale = Math.max(cw / iw, ch / ih);
      const sw = iw * scale;
      const sh = ih * scale;
      const sx = (cw - sw) / 2;
      const sy = (ch - sh) / 2;

      coverCtx.clearRect(0, 0, cw, ch);
      coverCtx.drawImage(afterImg, sx, sy, sw, sh);
    }

    const afterImg = new Image();
    afterImg.crossOrigin = 'anonymous';

    function onImageLoaded() {
      ready = true;
      sizeCanvas(); // Always call sizeCanvas when image loads to guarantee drawing
    }

    afterImg.onload = onImageLoaded;

    // CORS Fallback if anonymous crossOrigin fails on Cloudinary CDN
    afterImg.onerror = () => {
      if (afterImg.crossOrigin) {
        afterImg.removeAttribute('crossOrigin');
        afterImg.src = afterImgUrl;
      }
    };

    afterImg.src = afterImgUrl;
    if (afterImg.complete && afterImg.naturalWidth) {
      onImageLoaded();
    }

    function sizeCanvas() {
      // Use offsetWidth/offsetHeight to ignore CSS transform scaling from the warp transition!
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      if (width <= 0 || height <= 0) return;

      cw = Math.round(width * dpr);
      ch = Math.round(height * dpr);
      canvas.width = cw;
      canvas.height = ch;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      radius = brushRadius * dpr;

      coverCanvas = document.createElement('canvas');
      coverCanvas.width = cw;
      coverCanvas.height = ch;
      coverCtx = coverCanvas.getContext('2d');

      const diam = Math.ceil(radius * 2);
      brushCanvas = document.createElement('canvas');
      brushCanvas.width = diam;
      brushCanvas.height = diam;
      brushCtx = brushCanvas.getContext('2d');

      ctx.clearRect(0, 0, cw, ch);

      if (afterImg.complete && afterImg.naturalWidth) {
        drawCover();
      }
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
      // Calculate normalized percentage coordinates to handle any active CSS transforms
      const px = (e.clientX - rect.left) / (rect.width || 1);
      const py = (e.clientY - rect.top) / (rect.height || 1);
      
      // Map to un-transformed canvas resolution
      const x = px * container.offsetWidth * dpr;
      const y = py * container.offsetHeight * dpr;

      if (cursorDot) {
        cursorDot.style.left = (px * container.offsetWidth) + 'px';
        cursorDot.style.top = (py * container.offsetHeight) + 'px';
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
      if (!coverCtx || cw <= 0 || ch <= 0) return;
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
