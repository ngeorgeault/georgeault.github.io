import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const API = 'https://georgeault.net/wp-json/wp/v2/posts?per_page=20&_embed=1&status=publish';
const OUT = new URL('../src/content/articles/', import.meta.url);
const OKF_OUT = new URL('../knowledge/okf/imported/', import.meta.url);

const knownOkf = new Map([
  ['je-me-suis-trompe-sur-power-automate', 'knowledge/okf/articles/power-automate-agents.md'],
  ['laudit-la-fondation-de-toute-transformation', 'knowledge/okf/articles/audit-source-of-proof.md'],
  ['votre-ia-ecrit-comme-une-ia', 'knowledge/okf/articles/ia-style-redactionnel.md'],
  ['enterprise-brain-apres-la-connaissance-il-faudra-mesurer-lintelligence-de-lorganisation', 'knowledge/okf/articles/enterprise-brain-measurement.md'],
  ['du-prompt-engineering-au-harness-engineering-copilot-studio-change-dechelle', 'knowledge/okf/articles/harness-engineering.md'],
]);

const decode = (value = '') => value
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"')
  .replace(/&#039;|&apos;/g, "'")
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>');

const stripTags = (html = '') => decode(html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());

const yamlString = (value = '') => JSON.stringify(String(value).replace(/\r?\n/g, ' ').trim());

const cleanHtml = (html = '') => html
  .replace(/<script[\s\S]*?<\/script>/gi, '')
  .replace(/<style[\s\S]*?<\/style>/gi, '')
  .replace(/<!--([\s\S]*?)-->/g, '')
  .trim();

const embeddedTerms = (post) => (post._embedded?.['wp:term'] ?? []).flat();

const categories = (post) => embeddedTerms(post)
  .filter((term) => term.taxonomy === 'category')
  .map((term) => decode(term.name));

const tags = (post) => embeddedTerms(post)
  .filter((term) => term.taxonomy === 'post_tag')
  .map((term) => decode(term.name));

const media = (post) => post._embedded?.['wp:featuredmedia']?.[0];

const firstImage = (html = '') => {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1];
};

await mkdir(OUT, { recursive: true });
await mkdir(OKF_OUT, { recursive: true });

// Remove only generated FR-CA publication files. Keep the en-CA folder intact.
for (const entry of await readdir(OUT, { withFileTypes: true })) {
  if (entry.isFile() && entry.name.endsWith('.md')) {
    await rm(join(OUT.pathname, entry.name));
  }
}

const response = await fetch(API, {
  headers: { 'User-Agent': 'georgeault-github-io-migration-poc/1.0' },
});

if (!response.ok) {
  throw new Error(`WordPress REST API returned ${response.status} ${response.statusText}`);
}

const posts = await response.json();

if (!Array.isArray(posts) || posts.length !== 20) {
  throw new Error(`Expected 20 WordPress posts, received ${Array.isArray(posts) ? posts.length : 'invalid payload'}`);
}

for (const post of posts) {
  const slug = post.slug;
  const title = decode(post.title?.rendered ?? slug);
  const body = cleanHtml(post.content?.rendered ?? '');
  const excerpt = stripTags(post.excerpt?.rendered ?? '').slice(0, 320);
  const wordCount = stripTags(body).split(/\\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 220));
  const postCategories = categories(post);
  const postTags = tags(post);
  const featured = media(post);
  const imageUrl = featured?.source_url || firstImage(body);
  const imageAlt = decode(featured?.alt_text || title);
  const author = decode(post._embedded?.author?.[0]?.name || 'Nicolas Georgeault');
  const publishedAt = String(post.date ?? '').slice(0, 10);
  const legacyUrl = new URL(post.link).pathname;
  const okfSource = knownOkf.get(slug) || `knowledge/okf/imported/${slug}.md`;

  const frontmatter = [
    '---',
    `title: ${yamlString(title)}`,
    `description: ${yamlString(excerpt || title)}`,
    `publishedAt: ${publishedAt}`,
    `author: ${yamlString(author)}`,
    `categories: ${JSON.stringify(postCategories)}`,
    `tags: ${JSON.stringify(postTags)}`,
    `legacyUrl: ${yamlString(legacyUrl)}`,
    `sourceUrl: ${yamlString(post.link)}`,
    `okfSource: ${yamlString(okfSource)}`,
    'migrationStatus: "full"',
    'lang: "fr-CA"',
    `translationKey: ${yamlString(slug)}`,
    'translationStatus: "source"',
    `wpId: ${Number(post.id)}`,
    post.modified ? `modifiedAt: ${String(post.modified).slice(0, 10)}` : null,
    `readingMinutes: ${readingMinutes}`,
    imageUrl ? `imageUrl: ${yamlString(imageUrl)}` : null,
    imageAlt ? `imageAlt: ${yamlString(imageAlt)}` : null,
    '---',
  ].filter(Boolean).join('\n');

  // WordPress provides already-rendered article HTML. Keeping it as raw HTML is
  // deliberate for this dry-run: it preserves headings, figures, captions,
  // lists, embeds and inline images instead of reducing the article to a summary.
  await writeFile(
    new URL(`${publishedAt}-${slug}.md`, OUT),
    `${frontmatter}\n\n${body}\n`,
    'utf8'
  );

  if (!knownOkf.has(slug)) {
    const okf = `---\nid: WP-${post.id}\ntype: publication-source\ntitle: ${yamlString(title)}\nstatus: pending-extraction\nsourcePublication: ${yamlString(legacyUrl)}\nsourceUrl: ${yamlString(post.link)}\n---\n\n# Knowledge extraction status\n\nThis file is intentionally separate from the publication. The article has been imported in full, while reusable knowledge still needs to be extracted, normalized and reviewed before becoming a canonical OKF knowledge object.\n`;
    await writeFile(new URL(`${slug}.md`, OKF_OUT), okf, 'utf8');
  }

  console.log(`Imported: ${publishedAt} — ${title}`);
}

console.log(`Synced ${posts.length} complete WordPress articles.`);
