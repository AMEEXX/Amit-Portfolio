#!/usr/bin/env node
// Diagnostic script to check what's wrong with the imports
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const checks = [
  'motion',
  '@react-three/fiber',
  'clsx',
  'tailwind-merge',
  'three',
];

console.log('=== Package Check ===');
for (const pkg of checks) {
  try {
    const pkgPath = resolve(__dirname, 'node_modules', pkg, 'package.json');
    if (existsSync(pkgPath)) {
      const { createRequire } = await import('module');
      const req = createRequire(import.meta.url);
      const p = req(pkgPath);
      console.log(`✅ ${pkg} @ ${p.version}`);
    } else {
      console.log(`❌ ${pkg} - package.json not found`);
    }
  } catch(e) {
    console.log(`❌ ${pkg} - ${e.message}`);
  }
}

console.log('\n=== motion/react subpath check ===');
try {
  const req = createRequire(import.meta.url);
  const motionPkg = req(resolve(__dirname, 'node_modules/motion/package.json'));
  const exports = motionPkg.exports || {};
  const reactEntry = exports['./react'];
  console.log('motion/react export:', JSON.stringify(reactEntry, null, 2));
} catch(e) {
  console.log('Error reading motion exports:', e.message);
}

console.log('\n=== @react-three/fiber peer deps check ===');
try {
  const req = createRequire(import.meta.url);
  const r3fPkg = req(resolve(__dirname, 'node_modules/@react-three/fiber/package.json'));
  console.log('R3F version:', r3fPkg.version);
  console.log('Peer deps:', JSON.stringify(r3fPkg.peerDependencies));
} catch(e) {
  console.log('Error:', e.message);
}
