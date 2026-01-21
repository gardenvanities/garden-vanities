import { describe, it, expect } from 'vitest';
import { getGradientFromSeed } from './gradients';

describe('getGradientFromSeed', () => {
    it('should return a string containing linear-gradient', () => {
        const gradient = getGradientFromSeed('test-seed');
        expect(gradient).toContain('linear-gradient');
    });

    it('should return the same gradient for the same seed', () => {
        const seed = 'consistent-seed';
        const gradient1 = getGradientFromSeed(seed);
        const gradient2 = getGradientFromSeed(seed);
        expect(gradient1).toBe(gradient2);
    });

    it('should return different gradients for different seeds (likely)', () => {
        const gradient1 = getGradientFromSeed('seed-a');
        const gradient2 = getGradientFromSeed('seed-b');
        expect(gradient1).not.toBe(gradient2);
    });

    it('should handle empty strings gracefully', () => {
        const gradient = getGradientFromSeed('');
        expect(gradient).toBeDefined();
        expect(gradient).toContain('linear-gradient');
    });
});
