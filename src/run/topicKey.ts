// The topic key: a chapter and topic packed into one string.
//
// A drill setup form offers topics as a single <select>, and one select can only
// submit one value per name — so the pair has to travel as one value. Encoding
// and decoding are two halves of the same format; keeping them in one module is
// what stops the separator drifting between the form and the parser.

const SEPARATOR = '::';

export function encodeTopicKey(chapter: string, topic: string): string {
  return `${chapter}${SEPARATOR}${topic}`;
}

export function decodeTopicKey(raw: string | null): { chapter: string; topic: string } | null {
  if (!raw) return null;
  const at = raw.indexOf(SEPARATOR);
  if (at < 0) return null;
  const chapter = raw.slice(0, at);
  // Split on the first separator only, so a topic containing one survives intact.
  const topic = raw.slice(at + SEPARATOR.length);
  if (!chapter || !topic) return null;
  return { chapter, topic };
}
