import { describe, expect, it } from 'vitest';
import { createCanonicalUrl } from './siteUrl';

describe('createCanonicalUrl', () => {
  it('preserves the path, deck query, and hash on the new domain', () => {
    expect(
      createCanonicalUrl({
        pathname: '/play',
        search: '?deck=1.2',
        hash: '#cards',
      })
    ).toBe('https://fvf.x3c.ca/play?deck=1.2#cards');
  });
});
