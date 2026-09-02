// src/data/keyboard-motion.ts

// Resting pose once fully revealed — front-on, slight yaw, good for hovering
// every key. These numbers are meaningful relative to THIS scene file's
// camera/pivot; keep them as-is if you keep the same .spline file.
export const SETTLED_POSE = {
  scale: { x: 0.28, y: 0.28, z: 0.28 },
  position: { x: 0, y: -20, z: 0 },
  rotation: { x: 0, y: Math.PI / 12, z: 0 }, // ~15°
};

export const SETTLED_POSE_MOBILE = {
  scale: { x: 0.34, y: 0.34, z: 0.34 },
  position: { x: 0, y: -20, z: 0 },
  rotation: { x: 0, y: Math.PI / 6, z: 0 }, // ~30°, reads better narrow
};

// Starting point: tiny, positioned below/out of frame, rotated extra turns
// away from the settled angle — that extra distance is what makes it visibly
// spin as it rises, before unwinding to rest.
export const HIDDEN_POSE = {
  scale: { x: 0.001, y: 0.001, z: 0.001 },
  position: { x: 0, y: 350, z: 0 },
  rotation: { x: -Math.PI / 5, y: -Math.PI * 2.5, z: 0 },
};
