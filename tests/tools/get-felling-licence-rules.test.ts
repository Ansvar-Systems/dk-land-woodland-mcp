import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { handleGetFellingLicenceRules } from '../../src/tools/get-felling-licence-rules.js';
import { createSeededDatabase } from '../helpers/seed-db.js';
import type { Database } from '../../src/db.js';
import { existsSync, unlinkSync } from 'fs';

const TEST_DB = 'tests/test-felling.db';

describe('get_felling_licence_rules tool', () => {
  let db: Database;

  beforeAll(() => {
    db = createSeededDatabase(TEST_DB);
  });

  afterAll(() => {
    db.close();
    if (existsSync(TEST_DB)) unlinkSync(TEST_DB);
  });

  test('returns all rules when no filters', () => {
    const result = handleGetFellingLicenceRules(db, {});
    const typed = result as { results_count: number };
    expect(typed.results_count).toBeGreaterThan(5);
  });

  test('provides assessment when volume provided', () => {
    const result = handleGetFellingLicenceRules(db, { volume_m3: 3 });
    const typed = result as { licence_assessment: string };
    expect(typed.licence_assessment).not.toBeNull();
    expect(typed.licence_assessment).toContain('m3');
  });

  test('assessment mentions Danish skovlov context', () => {
    const result = handleGetFellingLicenceRules(db, { volume_m3: 10 });
    const typed = result as { licence_assessment: string };
    expect(typed.licence_assessment).toContain('fredskov');
  });

  test('filters by nødstildet (dangerous tree) reason', () => {
    const result = handleGetFellingLicenceRules(db, { reason: 'nødstildet' });
    const typed = result as { results: { scenario: string }[] };
    expect(typed.results.length).toBeGreaterThan(0);
    expect(typed.results[0].scenario.toLowerCase()).toContain('nødstildet');
  });

  test('rejects unsupported jurisdiction', () => {
    const result = handleGetFellingLicenceRules(db, { jurisdiction: 'US' });
    expect(result).toHaveProperty('error', 'jurisdiction_not_supported');
  });
});
