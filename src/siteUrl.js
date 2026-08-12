export const CANONICAL_ORIGIN = 'https://fvf.x3c.ca';

export function createCanonicalUrl(location) {
  return new URL(
    `${location.pathname}${location.search}${location.hash}`,
    CANONICAL_ORIGIN
  ).href;
}
