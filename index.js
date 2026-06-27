/**
 * string-x — Zero-dependency string manipulation utilities
 *
 * Case conversion, trimming, padding, truncation, templates,
 * slugify, HTML/RegExp escaping, and more.
 *
 * @module string-x
 * @license MIT
 */

export const VERSION = '1.1.0';

// ─── Case Conversion ────────────────────────────────────────────────

/**
 * Split a string into words using common delimiters.
 * Handles camelCase, PascalCase, snake_case, kebab-case,
 * CONSTANT_CASE, dot.case, and spaces.
 * @param {string} str
 * @returns {string[]}
 */
export function words(str) {
  if (!str) return [];
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .split(/[\s_.\-/]+/)
    .filter(Boolean);
}

/** @param {string} str */
export function camelCase(str) {
  const w = words(str);
  return w.map((word, i) =>
    i === 0 ? word.toLowerCase() : word[0].toUpperCase() + word.slice(1).toLowerCase()
  ).join('');
}

/** @param {string} str */
export function pascalCase(str) {
  return words(str).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join('');
}

/** @param {string} str */
export function snakeCase(str) {
  return words(str).map(w => w.toLowerCase()).join('_');
}

/** @param {string} str */
export function kebabCase(str) {
  return words(str).map(w => w.toLowerCase()).join('-');
}

/** @param {string} str */
export function constantCase(str) {
  return words(str).map(w => w.toUpperCase()).join('_');
}

/** @param {string} str */
export function dotCase(str) {
  return words(str).map(w => w.toLowerCase()).join('.');
}

/** @param {string} str */
export function titleCase(str) {
  return words(str).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

/** @param {string} str */
export function sentenceCase(str) {
  const w = words(str);
  if (!w.length) return '';
  return w[0][0].toUpperCase() + w[0].slice(1).toLowerCase() +
    w.slice(1).map(w => ' ' + w.toLowerCase()).join('');
}

// ─── Trimming & Cleaning ───────────────────────────────────────────

/** Remove leading/trailing whitespace and collapse internal runs. */
export function compact(str) {
  if (str == null) return '';
  return String(str).trim().replace(/\s+/g, ' ');
}

/** Trim each line in a multiline string. */
export function trimLines(str) {
  if (str == null) return '';
  return String(str).split('\n').map(l => l.trim()).join('\n');
}

/** Remove ALL whitespace. */
export function stripWhitespace(str) {
  if (str == null) return '';
  return String(str).replace(/\s+/g, '');
}

// ─── Padding ───────────────────────────────────────────────────────

/** Pad string on both sides to target length. */
export function pad(str, len, char = ' ') {
  const s = String(str);
  if (s.length >= len) return s;
  if (!char) return s; // empty padding char = no padding
  const total = len - s.length;
  const left = Math.ceil(total / 2);
  const right = total - left;
  // For multi-char padding strings, slice to exact length
  const leftStr = char.repeat(Math.ceil(left / char.length)).slice(0, left);
  const rightStr = char.repeat(Math.ceil(right / char.length)).slice(0, right);
  return leftStr + s + rightStr;
}

/** Pad string on the left. */
export function padLeft(str, len, char = ' ') {
  const s = String(str);
  if (s.length >= len || !char) return s;
  const needed = len - s.length;
  return char.repeat(Math.ceil(needed / char.length)).slice(0, needed) + s;
}

/** Pad string on the right. */
export function padRight(str, len, char = ' ') {
  const s = String(str);
  if (s.length >= len || !char) return s;
  const needed = len - s.length;
  return s + char.repeat(Math.ceil(needed / char.length)).slice(0, needed);
}

// ─── Truncation ────────────────────────────────────────────────────

/** Truncate to maxLen, appending suffix (default …). */
export function truncate(str, maxLen, suffix = '…') {
  const s = String(str);
  if (maxLen < 0) maxLen = 0;
  if (s.length <= maxLen) return s;
  const cut = suffix ? maxLen - suffix.length : maxLen;
  if (cut <= 0) return suffix ? suffix.slice(0, maxLen) : '';
  return s.slice(0, cut) + (suffix || '');
}

/** Truncate at word boundary, respecting maxLen. */
export function prune(str, maxLen, suffix = '…') {
  const s = String(str);
  if (s.length <= maxLen) return s;
  let end = maxLen - (suffix ? suffix.length : 0);
  if (end <= 0) return suffix || '';
  // Walk back to word boundary
  while (end > 0 && !/[\s\-._]/.test(s[end])) end--;
  if (end === 0) end = maxLen - (suffix ? suffix.length : 0);
  return s.slice(0, end).replace(/[\s\-._]+$/, '') + (suffix || '');
}

// ─── Search & Count ────────────────────────────────────────────────

/** Count non-overlapping occurrences of substr. */
export function count(str, substr) {
  if (!substr) return 0;
  return String(str).split(substr).length - 1;
}

/** All indices of substr (non-overlapping). */
export function indexOfAll(str, substr) {
  const s = String(str);
  const indices = [];
  if (!substr) return indices;
  let idx = s.indexOf(substr);
  while (idx !== -1) {
    indices.push(idx);
    idx = s.indexOf(substr, idx + substr.length);
  }
  return indices;
}

/** Check if str starts with any of the given prefixes. */
export function startsWithAny(str, prefixes) {
  return prefixes.some(p => String(str).startsWith(p));
}

/** Check if str ends with any of the given suffixes. */
export function endsWithAny(str, suffixes) {
  return suffixes.some(s => String(str).endsWith(s));
}

/** Check if str contains any of the given substrings. */
export function containsAny(str, substrings) {
  return substrings.some(s => String(str).includes(s));
}

// ─── Transform ─────────────────────────────────────────────────────

/** Capitalize first character. */
export function capitalize(str) {
  const s = String(str);
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

/** Capitalize first char of each word (respects apostrophes like "don't" → "Don't"). */
export function capitalizeWords(str) {
  if (str == null) return '';
  return String(str).replace(/(^|[\s\-_.\/])(\w)/g, (_, sep, char) => sep + char.toUpperCase());
}

/** Swap case of each character. */
export function swapCase(str) {
  return String(str).replace(/[a-z]/gi, c =>
    c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
  );
}

/** Reverse a string (handles surrogate pairs). */
export function reverse(str) {
  return [...String(str)].reverse().join('');
}

/** Repeat string n times with optional separator. */
export function repeat(str, n, separator = '') {
  const s = String(str);
  if (n <= 0) return '';
  if (!separator) return s.repeat(n);
  return Array(n).fill(s).join(separator);
}

// ─── Template / Interpolation ──────────────────────────────────────

/**
 * Interpolate {{key}} placeholders with values from a data object.
 * @example interpolate('Hello {{name}}!', { name: 'World' }) → 'Hello World!'
 */
export function interpolate(str, data, opts = {}) {
  const open = opts.open || '{{';
  const close = opts.close || '}}';
  const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(escapeRegex(open) + '\\s*(\\w+(?:\\.\\w+)*)\\s*' + escapeRegex(close), 'g');
  return String(str).replace(re, (_, path) => {
    const val = path.split('.').reduce((obj, key) => obj?.[key], data);
    return val != null ? String(val) : (opts.keepUnfilled ? open + path + close : '');
  });
}

/**
 * Chopped string into N-character chunks.
 * @returns {string[]}
 */
export function chop(str, size) {
  const s = String(str);
  if (size <= 0) return [];
  const chunks = [];
  for (let i = 0; i < s.length; i += size) {
    chunks.push(s.slice(i, i + size));
  }
  return chunks;
}

/** Split multiline string into array of lines. */
export function lines(str) {
  return String(str).split(/\r?\n/);
}

// ─── Escape / Unescape ─────────────────────────────────────────────

const HTML_ESCAPES = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
};

/** Escape HTML special characters. */
export function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => HTML_ESCAPES[c]);
}

/** Unescape HTML entities (basic set + numeric). */
export function unescapeHtml(str) {
  return String(str)
    .replace(/&(#x?[0-9a-f]+|amp|lt|gt|quot|apos|nbsp);/gi, (match, entity) => {
      if (entity[0] === '#') {
        const code = entity[1] === 'x' || entity[1] === 'X'
          ? parseInt(entity.slice(2), 16)
          : parseInt(entity.slice(1), 10);
        return String.fromCodePoint(code);
      }
      const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
      return named[entity.toLowerCase()] || match;
    });
}

/** Escape special regex characters. */
export function escapeRegExp(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Strip HTML tags. */
export function stripTags(str) {
  return String(str).replace(/<[^>]*>/g, '');
}

// ─── Slugify ───────────────────────────────────────────────────────

/**
 * Convert string to a URL-safe slug.
 * @param {string} str
 * @param {object} opts - { separator, lower, strict }
 */
export function slugify(str, opts = {}) {
  const separator = opts.separator || '-';
  const lower = opts.lower !== false;
  const strict = opts.strict !== false;
  const result = String(str)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .replace(/[\s._\-/]+/g, ' ') // normalize separators to space
    .replace(strict ? /[^a-zA-Z0-9 ]/g : /[^a-zA-Z0-9 ]/g, '') // strip non-alphanumeric (keep spaces)
    .trim()
    .replace(/\s+/g, separator);
  return lower ? result.toLowerCase() : result;
}

// ─── Validation Helpers ────────────────────────────────────────────

/** Check if string is empty or whitespace only. */
export function isBlank(str) {
  return !str || /^\s*$/.test(str);
}

/** Check if string is empty. */
export function isEmpty(str) {
  return !str || str.length === 0;
}

/** Check if string contains only letters. */
export function isAlpha(str) {
  return /^[a-zA-Z]+$/.test(str);
}

/** Check if string contains only letters and numbers. */
export function isAlphanumeric(str) {
  return /^[a-zA-Z0-9]+$/.test(str);
}

/** Check if string is a valid number. */
export function isNumeric(str) {
  if (isBlank(str)) return false;
  return !isNaN(Number(str)) && isFinite(Number(str));
}

// ─── Misc Utilities ────────────────────────────────────────────────

/** Generate a random string of given length from an alphabet. */
export function randomString(len, alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') {
  let result = '';
  for (let i = 0; i < len; i++) {
    result += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return result;
}

/** Levenshtein edit distance between two strings. */
export function levenshtein(a, b) {
  const s1 = String(a), s2 = String(b);
  if (!s1.length) return s2.length;
  if (!s2.length) return s1.length;
  const prev = new Array(s2.length + 1);
  const curr = new Array(s2.length + 1);
  for (let j = 0; j <= s2.length; j++) prev[j] = j;
  for (let i = 1; i <= s1.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= s2.length; j++) prev[j] = curr[j];
  }
  return prev[s2.length];
}

/** Similarity ratio between two strings (0–1). */
export function similarity(a, b) {
  if (!a && !b) return 1;
  const maxLen = Math.max(String(a).length, String(b).length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(a, b) / maxLen;
}

/** Surround a string with a prefix and suffix. */
export function surround(str, wrapper) {
  const w = typeof wrapper === 'string' ? [wrapper, wrapper] : wrapper;
  return (w[0] || '') + String(str) + (w[1] || w[0] || '');
}

/** Uncapitalize first character. */
export function uncapitalize(str) {
  const s = String(str);
  return s ? s[0].toLowerCase() + s.slice(1) : s;
}

// ─── Default Export ────────────────────────────────────────────────

export default {
  VERSION,
  words, camelCase, pascalCase, snakeCase, kebabCase, constantCase, dotCase,
  titleCase, sentenceCase, compact, trimLines, stripWhitespace,
  pad, padLeft, padRight, truncate, prune,
  count, indexOfAll, startsWithAny, endsWithAny, containsAny,
  capitalize, capitalizeWords, swapCase, reverse, repeat,
  interpolate, chop, lines,
  escapeHtml, unescapeHtml, escapeRegExp, stripTags,
  slugify, isBlank, isEmpty, isAlpha, isAlphanumeric, isNumeric,
  randomString, levenshtein, similarity, surround, uncapitalize,
};
