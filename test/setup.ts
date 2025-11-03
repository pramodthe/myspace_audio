import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock HTMLMediaElement
Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: vi.fn().mockImplementation(() => Promise.resolve()),
});

Object.defineProperty(window.HTMLMediaElement.prototype, 'pause', {
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(window.HTMLMediaElement.prototype, 'load', {
  writable: true,
  value: vi.fn(),
});

// Mock audio context for tests
global.AudioContext = vi.fn().mockImplementation(() => ({
  createGain: vi.fn(() => ({
    connect: vi.fn(),
    gain: { value: 1 }
  })),
  createMediaElementSource: vi.fn(() => ({
    connect: vi.fn()
  })),
  destination: {}
}));

// Suppress console warnings in tests unless explicitly testing them
const originalWarn = console.warn;
console.warn = (...args) => {
  if (import.meta.env.MODE === 'test' && !args[0]?.includes('ConfigurableMusicPlayer:')) {
    return;
  }
  originalWarn(...args);
};