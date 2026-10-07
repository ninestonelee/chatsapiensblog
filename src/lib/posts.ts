// Markdown post loader.
// Drop a file into src/posts/*.md with a frontmatter block and it shows up on the blog.
//
// ---
// title: 글 제목
// slug: url-slug              (optional, defaults to file name)
// excerpt: 카드에 보일 요약
// category: Tech
// date: 2026.10.07
// cover: /posts/<folder>/cover.png   (optional, image in public/)
// tags: [태그1, 태그2]
// ---

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  cover?: string;
  tags: string[];
  body?: string; // markdown; undefined = placeholder post without a detail page
}

const files = import.meta.glob("../posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const text = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: text };
  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const i = line.indexOf(":");
    if (i === -1) continue;
    const key = line.slice(0, i).trim();
    let value = line.slice(i + 1).trim();
    if (/^".*"$|^'.*'$/.test(value)) value = value.slice(1, -1);
    if (key) meta[key] = value;
  }
  return { meta, body: match[2] };
}

function parseTags(value?: string): string[] {
  if (!value) return [];
  return value
    .replace(/^\[|\]$/g, "")
    .split(",")
    .map((t) => t.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

const markdownPosts: Post[] = Object.entries(files).map(([path, raw]) => {
  const fileSlug = path.split("/").pop()!.replace(/\.md$/, "");
  const { meta, body } = parseFrontmatter(raw);
  const slug = meta.slug || fileSlug;
  return {
    id: slug,
    slug,
    title: meta.title || fileSlug,
    excerpt: meta.excerpt || "",
    category: meta.category || "Tech",
    date: meta.date || "",
    cover: meta.cover || undefined,
    tags: parseTags(meta.tags),
    body,
  };
});

// Original design placeholders (no body yet).
const placeholderPosts: Post[] = [
  { id: "1", slug: "holo-tech-aesthetics", title: "The Ultimate Guide to Holo-Tech Aesthetics", excerpt: "Dive into the iridescent world of holographic design and why it's dominating the 2026 digital landscape.", category: "Design", date: "2026.05.02", tags: [] },
  { id: "2", slug: "cyberpunk-and-y2k", title: "Why Cyber-Punk and Y2K are One and the Same", excerpt: "Exploring the intersections of 90s optimistic futurism and the gritty reality of tomorrow.", category: "Culture", date: "2026.04.28", tags: [] },
  { id: "3", slug: "retro-future-coding", title: "Retro-Future Coding: Building with Nostalgia", excerpt: "How to implement classic web patterns in modern React architectures without sacrificing performance.", category: "Tech", date: "2026.04.15", tags: [] },
  { id: "4", slug: "dot-matrix-ui", title: "Pixel Perfect: The Return of Dot Matrix UI", excerpt: "Screens are sharper than ever, so why are we craving the low-res look of 1999?", category: "Trends", date: "2026.04.05", tags: [] },
  { id: "5", slug: "synthwave-office", title: "Synthwave Beats for the Modern Office", excerpt: "Our curated playlist for maximum productivity and retro vibes in your digital workspace.", category: "Lifestyle", date: "2026.03.22", tags: [] },
  { id: "6", slug: "vr-age-of-discovery", title: "Virtual Reality in the Age of Discovery", excerpt: "Predicting the next decade of immersive storytelling through the lens of early internet wonder.", category: "Discovery", date: "2026.03.10", tags: [] },
];

const byDateDesc = (a: Post, b: Post) => b.date.localeCompare(a.date);

export const POSTS: Post[] = [...markdownPosts.sort(byDateDesc), ...placeholderPosts.sort(byDateDesc)];

export const CATEGORIES: string[] = ["All", ...Array.from(new Set(POSTS.map((p) => p.category)))];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug && p.body !== undefined);
}
