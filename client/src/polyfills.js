// Polyfills for Node.js globals in browser environment
import process from 'process/browser';
import { Buffer } from 'buffer';
import util from 'util';

// Make process available globally
window.process = process;

// Make Buffer available globally
window.Buffer = Buffer;

// Make util available globally
window.util = util;

// Additional process properties that might be needed
if (!process.nextTick) {
  process.nextTick = (callback, ...args) => {
    setTimeout(() => callback(...args), 0);
  };
}

if (!process.platform) {
  process.platform = 'browser';
}

if (!process.version) {
  process.version = 'v16.0.0';
}

if (!process.versions) {
  process.versions = {
    node: '16.0.0',
    v8: '9.4.146.24-node.14',
    uv: '1.43.0',
    zlib: '1.2.11',
    brotli: '1.0.9',
    ares: '1.18.1',
    modules: '93',
    nghttp2: '1.47.0',
    napi: '8',
    llhttp: '6.0.4',
    openssl: '1.1.1n+quic',
    cldr: '41.0',
    icu: '71.1',
    tz: '2022a',
    unicode: '14.0',
    ngtcp2: '0.1.0-DEV',
    nghttp3: '0.1.0-DEV'
  };
}

// Ensure global is available
if (typeof global === 'undefined') {
  window.global = window;
} 