// src/components/PageLoader.jsx
import React from 'react';
import { BootTerminal } from './boot-terminal/boot-terminal';

export default function PageLoader({ onComplete }) {
  return <BootTerminal onComplete={onComplete} playOnce={false} skippable={true} />;
}
