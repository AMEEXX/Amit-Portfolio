/**
 * CanvasRevealEffect — High-fidelity 2D Canvas rewrite.
 *
 * The original used @react-three/fiber (<Canvas> = a WebGL context per card).
 * Combined with Spline (1 WebGL ctx) + StarfieldScene (1 WebGL ctx), the
 * browser hits its hard WebGL context limit (~8-16) and crashes EVERYTHING.
 *
 * This version reproduces the exact same animated dot-matrix using the 2D
 * Canvas API. Same visual effect, zero WebGL contexts.
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

// ── PHI-based random matching the original GLSL ───────────────────────────────
const PHI = 1.6180339887498948;
function random(x, y) {
  const d = Math.sqrt((x * PHI - x) ** 2 + (y * PHI - y) ** 2);
  return Math.abs(Math.tan(d * 0.5) * x) % 1;
}

// ── DotMatrixCanvas ───────────────────────────────────────────────────────────
function DotMatrixCanvas({
  colors = [[0, 255, 255]],
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  animationSpeed = 0.4,
  dotSize = 3,
  totalSize = 4,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  // Build a 6-colour array matching the original GLSL u_colors logic
  const colorsArray = React.useMemo(() => {
    if (colors.length === 1) return [colors[0], colors[0], colors[0], colors[0], colors[0], colors[0]];
    if (colors.length === 2) return [colors[0], colors[0], colors[0], colors[1], colors[1], colors[1]];
    return [colors[0], colors[0], colors[1], colors[1], colors[2], colors[2]];
  }, [colors]);

  const draw = useCallback((ts) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (startRef.current === null) startRef.current = ts;
    const uTime = (ts - startRef.current) / 1000;

    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    const cols = Math.ceil(W / totalSize);
    const rows = Math.ceil(H / totalSize);

    // Center offsets matching GLSL
    const offX = Math.abs(Math.floor(((W % totalSize) - dotSize) * 0.5));
    const offY = Math.abs(Math.floor(((H % totalSize) - dotSize) * 0.5));

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const stX = col * totalSize - offX;
        const stY = row * totalSize - offY;

        if (stX < 0 || stY < 0) continue;

        // st2 = grid coordinates
        const st2x = col;
        const st2y = row;

        // Frequency-based random (matches GLSL)
        const frequency = 5.0;
        const showOffset = random(st2x, st2y);
        const randVal = random(
          st2x * Math.floor(uTime / frequency + showOffset + frequency) + 1.0,
          st2y * Math.floor(uTime / frequency + showOffset + frequency) + 1.0
        );

        let opacity = opacities[Math.min(Math.floor(randVal * 10), 9)] ?? 0.5;

        // Dot mask (only draw if within the dot portion of the cell)
        // Already handled by drawing fixed-size dots at cell origins

        // Pick colour from the 6-element palette
        const colorIdx = Math.min(Math.floor(showOffset * 6), 5);
        const [r, g, b] = colorsArray[colorIdx];

        // Animation: intro_offset + step logic from original GLSL
        const dx = (W / 2) / totalSize - st2x;
        const dy = (H / 2) / totalSize - st2y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const introOffset = dist * 0.01 + random(st2x, st2y) * 0.15;
        const t = uTime * animationSpeed;

        // step(introOffset, t) — dot hasn't appeared yet
        if (t < introOffset) continue;

        // clamp((1 - step(introOffset + 0.1, t)) * 1.25, 1, 1.25)
        const fadeMul = t < introOffset + 0.1 ? 1.25 : 1.0;
        opacity *= fadeMul;

        ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(opacity, 1)})`;
        ctx.fillRect(stX, stY, dotSize, dotSize);
      }
    }

    rafRef.current = requestAnimationFrame(draw);
  }, [colorsArray, opacities, animationSpeed, dotSize, totalSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    startRef.current = null;
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  );
}

// ── Public API (identical to original) ────────────────────────────────────────

export const CanvasRevealEffect = ({
  animationSpeed = 0.4,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
}) => (
  <div className={cn('h-full relative bg-white w-full', containerClassName)}>
    <div className="h-full w-full relative">
      <DotMatrixCanvas
        colors={colors}
        opacities={opacities}
        animationSpeed={animationSpeed}
        dotSize={dotSize ?? 3}
        totalSize={4}
      />
    </div>
    {showGradient && (
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-[84%]" />
    )}
  </div>
);
