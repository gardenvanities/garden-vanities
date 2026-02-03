import { describe, it, expect } from 'vitest';
import { getCreatorName } from '$lib/modules/library/utils';
import type { Resource } from '$lib/modules/library/types';

describe('Library Utils', () => {
    describe('getCreatorName', () => {
        it('should extract author (string)', () => {
            const resource = { author: 'J.R.R. Tolkien' } as Resource;
            expect(getCreatorName(resource)).toBe('J.R.R. Tolkien');
        });

        it('should extract first author from array', () => {
            const resource = { author: ['Neil Gaiman', 'Terry Pratchett'] } as Resource;
            expect(getCreatorName(resource)).toBe('Neil Gaiman');
        });

        it('should extract director', () => {
            const resource = { director: 'Christopher Nolan' } as Resource;
            expect(getCreatorName(resource)).toBe('Christopher Nolan');
        });

        it('should extract artist', () => {
            const resource = { artist: 'Daft Punk' } as Resource;
            expect(getCreatorName(resource)).toBe('Daft Punk');
        });

        it('should handle complex mixed authorship (prioritize author)', () => {
            const resource = { author: 'Writer', director: 'Director' } as unknown as Resource;
            expect(getCreatorName(resource)).toBe('Writer');
        });

        it('should return null if no creator found', () => {
            const resource = { title: 'No Creator' } as Resource;
            expect(getCreatorName(resource)).toBe(null);
        });
    });
});
