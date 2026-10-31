import {defaults, type ContentKey} from './visual-fields';

export function contentLimits(key: ContentKey) {
  const heading = key.endsWith('Heading') || key === 'homeHeroTop' || key === 'homeHeroBottom' || key.startsWith('homeClosingHeading');
  const compact = key.endsWith('Label') || key.endsWith('Link') || key.endsWith('Button') || key.endsWith('Eyebrow') || key.endsWith('Quote') || key.endsWith('Signature');
  return {min: heading ? 3 : compact ? 2 : 20, max: heading ? 120 : compact ? 80 : 1500};
}

export function parseContentChanges(input: unknown): {key: ContentKey; value: string}[] {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Kies minstens één tekst om op te slaan.');
  const entries = Object.entries(input);
  if (!entries.length || entries.length > Object.keys(defaults).length) throw new Error('Kies minstens één tekst om op te slaan.');
  return entries.map(([key, value]) => {
    if (!Object.hasOwn(defaults, key) || typeof value !== 'string') throw new Error('Onbekend tekstveld.');
    const {min, max} = contentLimits(key as ContentKey);
    const clean = value.trim();
    if (clean.length < min || clean.length > max) throw new Error(`Gebruik ${min} tot ${max} tekens voor deze tekst.`);
    return {key: key as ContentKey, value: clean};
  });
}
