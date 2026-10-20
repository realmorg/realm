// A small Markdown subset: headings, paragraphs, lists, quotes, rules, fenced code and inline
// code, bold, italic, strikethrough and links. Text is escaped first, and REALM's `html` slot
// sanitises the result again before it reaches the page.

const ENTITIES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const SAFE_URL = /^(?:https?:|mailto:|#|\/|\.{1,2}\/)/i;

const escapeHtml = (text) => text.replace(/[&<>"']/g, (char) => ENTITIES[char]);

const INLINE = [
  [/\*\*(.+?)\*\*/g, "<strong>$1</strong>"],
  [/(^|[^*])\*([^*\s][^*]*?)\*/g, "$1<em>$2</em>"],
  [/(^|\W)_([^_\s][^_]*?)_(?=\W|$)/g, "$1<em>$2</em>"],
  [/~~(.+?)~~/g, "<del>$1</del>"],
  [
    /\[([^\]]+)\]\(([^)\s]+)\)/g,
    (_, label, url) => (SAFE_URL.test(url) ? `<a href="${url}">${label}</a>` : label),
  ],
];

const inline = (text) =>
  text
    .split(/(`[^`]+`)/)
    .map((part, index) =>
      index % 2
        ? `<code>${escapeHtml(part.slice(1, -1))}</code>`
        : INLINE.reduce(
            (html, [pattern, replacement]) => html.replace(pattern, replacement),
            escapeHtml(part),
          ),
    )
    .join("");

const FENCE = /^```/;
const HEADING = /^(#{1,6})\s+(.*)$/;
const RULE = /^(?:-{3,}|\*{3,}|_{3,})\s*$/;
const QUOTE = /^>\s?/;
const BULLET = /^\s*[-*+]\s+/;
const NUMBER = /^\s*\d+[.)]\s+/;
const BLANK = /^\s*$/;

const startsBlock = (line) =>
  [FENCE, HEADING, RULE, QUOTE, BULLET, NUMBER, BLANK].some((pattern) => pattern.test(line));

const takeWhile = (lines, start, test) => {
  let end = start;
  while (end < lines.length && test(lines[end])) end++;
  return end;
};

// Headings start at h3 because the page has the h1 and the note list and editor use h2.
const BLOCKS = [
  {
    test: (line) => FENCE.test(line),
    read(lines, start) {
      const end = takeWhile(lines, start + 1, (line) => !FENCE.test(line));
      const code = escapeHtml(lines.slice(start + 1, end).join("\n"));
      return { html: `<pre><code>${code}</code></pre>`, next: end + 1 };
    },
  },
  {
    test: (line) => HEADING.test(line),
    read(lines, start) {
      const [, marks, text] = lines[start].match(HEADING);
      const level = Math.min(marks.length + 2, 6);
      return { html: `<h${level}>${inline(text)}</h${level}>`, next: start + 1 };
    },
  },
  {
    test: (line) => RULE.test(line),
    read: (_, start) => ({ html: "<hr>", next: start + 1 }),
  },
  {
    test: (line) => QUOTE.test(line),
    read(lines, start) {
      const end = takeWhile(lines, start, (line) => QUOTE.test(line));
      const inner = lines.slice(start, end).map((line) => line.replace(QUOTE, ""));
      return { html: `<blockquote>${markdown(inner.join("\n"))}</blockquote>`, next: end };
    },
  },
  ...[
    [BULLET, "ul"],
    [NUMBER, "ol"],
  ].map(([marker, tag]) => ({
    test: (line) => marker.test(line),
    read(lines, start) {
      const end = takeWhile(lines, start, (line) => marker.test(line));
      const items = lines
        .slice(start, end)
        .map((line) => `<li>${inline(line.replace(marker, ""))}</li>`);
      return { html: `<${tag}>${items.join("")}</${tag}>`, next: end };
    },
  })),
  {
    test: (line) => BLANK.test(line),
    read: (_, start) => ({ html: "", next: start + 1 }),
  },
];

const paragraph = (lines, start) => {
  const end = takeWhile(lines, start + 1, (line) => !startsBlock(line));
  return { html: `<p>${lines.slice(start, end).map(inline).join("<br>")}</p>`, next: end };
};

export const markdown = (source) => {
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  const html = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    const block = BLOCKS.find((candidate) => candidate.test(line));
    const { html: part, next } = block ? block.read(lines, index) : paragraph(lines, index);
    html.push(part);
    index = next;
  }
  return html.join("");
};
