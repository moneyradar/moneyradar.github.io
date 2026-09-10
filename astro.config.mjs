import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeExternalLinks from 'rehype-external-links';
import { readdirSync, readFileSync } from 'node:fs';

// ── 사이트맵 lastmod 계산용: 글 frontmatter 에서 날짜·태그·카테고리를 읽는다 ──
// 태그·카테고리 허브 페이지는 자동으로 사이트맵에 들어가지만 lastmod 가 없으면 크롤러가
// 갱신 여부를 모른다. 그 그룹의 최신 글 발행 시각을 lastmod 로 준다.
function readPostMeta() {
  const dir = 'src/content/posts';
  const posts = [];
  for (const f of readdirSync(dir)) {
    if (!/\.(md|mdx)$/.test(f)) continue;
    const fm = readFileSync(`${dir}/${f}`, 'utf8').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
    const date = fm.match(/^date: (.+)$/m)?.[1]?.trim();
    const category = fm.match(/^category: (.+)$/m)?.[1]?.trim();
    const tags = JSON.parse(fm.match(/^tags: (\[.*\])$/m)?.[1] ?? '[]');
    if (date) posts.push({ id: f.replace(/\.(md|mdx)$/, ''), date: new Date(date), category, tags });
  }
  return posts;
}
const posts = readPostMeta();
const newest = (list) => (list.length ? new Date(Math.max(...list.map((p) => p.date.getTime()))) : null);
const byId = new Map(posts.map((p) => [p.id, p.date]));
const byTag = new Map();
const byCategory = new Map();
for (const p of posts) {
  byCategory.set(p.category, [...(byCategory.get(p.category) ?? []), p]);
  for (const t of p.tags) byTag.set(t, [...(byTag.get(t) ?? []), p]);
}

export default defineConfig({
  site: 'https://money-radar.kr',
  markdown: {
    // 본문 외부 링크(출처 등)는 새 탭에서. 검색엔진에는 nofollow 로 신호 누수 방지.
    rehypePlugins: [[rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'nofollow'] }]],
  },
  integrations: [
    sitemap({
      // 빌드된 모든 페이지가 자동 포함된다 (글·태그·카테고리·홈·소개). 여기서는 lastmod 만 보강.
      serialize(item) {
        const path = decodeURIComponent(new URL(item.url).pathname);
        const post = path.match(/^\/posts\/([^/]+)\/?$/);
        const tag = path.match(/^\/tags\/([^/]+)\/?$/);
        const cat = path.match(/^\/category\/([^/]+)\/?$/);
        let d = null;
        if (post) d = byId.get(post[1]) ?? null; // 글: 발행 시각 (발행 후 수정 없음)
        else if (tag) d = newest(byTag.get(tag[1]) ?? []); // 태그 허브: 그 태그의 최신 글
        else if (cat) d = newest(byCategory.get(cat[1]) ?? []); // 카테고리: 그 분류의 최신 글
        else if (path === '/') d = new Date(); // 홈: 매일 새 글이 실리므로 빌드 시각
        if (d) item.lastmod = d.toISOString();
        return item;
      },
    }),
  ],
});
