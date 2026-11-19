// Indent every non-empty line of a block by n spaces (inverse of the
// extractor's dedent), dropping the trailing newline.
export const indent = (text, n) =>
  text
    .replace(/\n$/, '')
    .split('\n')
    .map(line => (line ? ' '.repeat(n) + line : line))
    .join('\n');
