import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeExternalLinks from 'rehype-external-links';

export default defineConfig({
  site: 'https://money-radar.kr',
  markdown: {
    // 본문 외부 링크(출처 등)는 새 탭에서. 검색엔진에는 nofollow 로 신호 누수 방지.
    rehypePlugins: [[rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'nofollow'] }]],
  },
  integrations: [
    sitemap({
      serialize(item) {
        const m = item.url.match(/\/posts\/(\d{4})(\d{2})(\d{2})-/);
        if (m) {
          // 글: 슬러그의 발행일 = 수정일 (발행 후 수정 없음)
          item.lastmod = `${m[1]}-${m[2]}-${m[3]}T00:00:00+09:00`;
        } else if (new URL(item.url).pathname === '/') {
          // 홈: 매일 새 글이 실리므로 빌드일
          item.lastmod = new Date().toISOString();
        }
        return item;
      },
    }),
  ],
});
