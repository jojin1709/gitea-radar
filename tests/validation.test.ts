import { describe, it, expect } from 'vitest';
import { validateData } from '../scripts/validate-data';
import fs from 'fs';
import path from 'path';

describe('Data Integrity Validation', () => {
  it('detects missing files in invalid directory', () => {
    const report = validateData(path.join(process.cwd(), 'tests', 'fixtures', 'empty-dir'));
    expect(report.valid).toBe(false);
    expect(report.errors.some(e => e.includes('Missing required dataset file'))).toBe(true);
  });
});
