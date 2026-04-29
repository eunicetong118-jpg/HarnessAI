import { IB_MAPPING } from '../config/ib-mapping';
import { MILESTONES } from '../config/milestones';

describe('Configuration Files', () => {
  test('IB_MAPPING should have at least 3 countries', () => {
    expect(IB_MAPPING.length).toBeGreaterThanOrEqual(3);
    expect(IB_MAPPING.some(c => c.countryCode === 'ID')).toBe(true);
    expect(IB_MAPPING.some(c => c.countryCode === 'MY')).toBe(true);
    expect(IB_MAPPING.some(c => c.countryCode === 'SG')).toBe(true);
  });

  test('MILESTONES should use BigInt for thresholds', () => {
    expect(MILESTONES.length).toBeGreaterThanOrEqual(3);
    MILESTONES.forEach(m => {
      expect(typeof m.threshold).toBe('bigint');
    });
  });

  test('MILESTONES should include specific thresholds', () => {
    const thresholds = MILESTONES.map(m => m.threshold);
    expect(thresholds).toContain(10000n);
    expect(thresholds).toContain(50000n);
    expect(thresholds).toContain(100000n);
  });
});
