#!/usr/bin/env node
import { readFileSync } from 'fs';
import * as sx from './index.js';

const [cmd, ...args] = process.argv.slice(2);

function readStdin() {
  try { return readFileSync(0, 'utf8').trim(); } catch { return ''; }
}

function getInput() {
  return args[0] || readStdin();
}

function parseData(arg) {
  if (!arg) return {};
  try { return JSON.parse(arg); } catch { return {}; }
}

const cmds = {
  camel: () => sx.camelCase(getInput()),
  pascal: () => sx.pascalCase(getInput()),
  snake: () => sx.snakeCase(getInput()),
  kebab: () => sx.kebabCase(getInput()),
  constant: () => sx.constantCase(getInput()),
  dot: () => sx.dotCase(getInput()),
  title: () => sx.titleCase(getInput()),
  sentence: () => sx.sentenceCase(getInput()),
  compact: () => sx.compact(getInput()),
  slug: () => sx.slugify(getInput()),
  truncate: () => sx.truncate(getInput(), parseInt(args[1] || '20', 10)),
  prune: () => sx.prune(getInput(), parseInt(args[1] || '20', 10)),
  escape: () => sx.escapeHtml(getInput()),
  unescape: () => sx.unescapeHtml(getInput()),
  stripTags: () => sx.stripTags(getInput()),
  stripWs: () => sx.stripWhitespace(getInput()),
  reverse: () => sx.reverse(getInput()),
  capitalize: () => sx.capitalize(getInput()),
  swapCase: () => sx.swapCase(getInput()),
  template: () => {
    const tpl = args[0];
    const dataIdx = args.indexOf('--data');
    const data = dataIdx >= 0 ? parseData(args[dataIdx + 1]) : {};
    return sx.interpolate(tpl, data);
  },
  levenshtein: () => String(sx.levenshtein(args[0] || '', args[1] || '')),
  similarity: () => String(sx.similarity(args[0] || '', args[1] || '')),
  words: () => sx.words(getInput()).join(', '),
  pad: () => sx.pad(getInput(), parseInt(args[1] || '20', 10), args[2] || ' '),
  padLeft: () => sx.padLeft(getInput(), parseInt(args[1] || '20', 10), args[2] || ' '),
  padRight: () => sx.padRight(getInput(), parseInt(args[1] || '20', 10), args[2] || ' '),
  demo: () => {
    const samples = ['Hello World', 'fooBar', 'snake_case', 'kebab-case', 'café résumé'];
    return samples.map(s =>
      `${s}\n  camel: ${sx.camelCase(s)}\n  snake: ${sx.snakeCase(s)}\n  kebab: ${sx.kebabCase(s)}\n  slug:  ${sx.slugify(s)}`
    ).join('\n\n');
  },
};

if (!cmd || cmd === '--help' || cmd === '-h') {
  console.log(`string-x CLI

Commands:
  camel <str>       Convert to camelCase
  pascal <str>      Convert to PascalCase
  snake <str>       Convert to snake_case
  kebab <str>       Convert to kebab-case
  constant <str>    Convert to CONSTANT_CASE
  title <str>       Convert to Title Case
  slug <str>        Slugify
  truncate <n>      Truncate to N chars (reads stdin)
  escape <str>      Escape HTML
  unescape <str>    Unescape HTML
  stripTags <str>   Strip HTML tags
  reverse <str>     Reverse string
  template <tpl> --data '{"k":"v"}'
  levenshtein <a> <b>
  similarity <a> <b>
  demo              Show examples`);
  process.exit(0);
}

const fn = cmds[cmd];
if (!fn) {
  console.error(`Unknown command: ${cmd}`);
  process.exit(1);
}

const result = fn();
if (result != null) console.log(result);
