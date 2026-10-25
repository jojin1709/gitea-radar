import { describe, it, expect } from 'vitest';
import { formatNumber, formatBytes, formatRelativeTime, slugify } from '../lib/utils';

describe('Format and String Utilities', () => {
  describe('formatNumber', () => {
    it('formats small numbers as string', () => {
      expect(formatNumber(42)).toBe('42');
      expect(formatNumber(0)).toBe('0');
    });

    it('formats thousands with K suffix', () => {
      expect(formatNumber(1500)).toBe('1.5K');
      expect(formatNumber(1000)).toBe('1K');
      expect(formatNumber(25400)).toBe('25.4K');
    });

    it('formats millions with M suffix', () => {
      expect(formatNumber(1200000)).toBe('1.2M');
    });

    it('handles null and undefined gracefully', () => {
      expect(formatNumber(NaN)).toBe('0');
    });
  });

  describe('formatBytes', () => {
    it('formats 0 or negative bytes as 0 B', () => {
      expect(formatBytes(0)).toBe('0 B');
      expect(formatBytes(-10)).toBe('0 B');
      expect(formatBytes(undefined)).toBe('0 B');
    });

    it('formats bytes into KB, MB, and GB', () => {
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1048576)).toBe('1 MB');
      expect(formatBytes(1073741824)).toBe('1 GB');
    });
  });

  describe('slugify', () => {
    it('converts titles into clean URL-safe slugs', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Go & Rust Tools!')).toBe('go-rust-tools');
      expect(slugify('  Spaced  Out  ')).toBe('spaced-out');
    });
  });

  describe('formatRelativeTime', () => {
    it('handles recent times', () => {
      const now = new Date().toISOString();
      expect(formatRelativeTime(now)).toBe('just now');
    });

    it('returns empty string for empty input', () => {
      expect(formatRelativeTime('')).toBe('');
    });
  });
});
