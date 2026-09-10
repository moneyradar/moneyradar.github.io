// github.io 리다이렉트 페이지 생성 — 글·고정 페이지마다 200 응답의 이동 페이지를 만든다.
// 404.html 만으로는 GitHub Pages 가 404 상태를 돌려줘 검색엔진이 이전 신호로 약하게 받는다.
// 실행: node scripts/make-redirects.mjs  (CI 의 build 잡에서 upload-pages-artifact 직전에 호출)
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const NEW = 'https://money-radar.kr';
const OUT = 'redirect';

function page(path) {
  const target = `${NEW}${path}`;
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<title>머니레이더 — money-radar.kr 로 이동</title>
<link rel="canonical" href="${target}">
<meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0; url=${target}">
<script>location.replace(${JSON.stringify(target)} + location.search + location.hash);</script>
</head>
<body><p>이 글은 <a href="${target}">${target}</a> 로 이전했습니다.</p></body>
</html>
`;
}

const paths = ['/about/'];
for (const f of readdirSync('src/content/posts')) {
  const m = f.match(/^(.+)\.(md|mdx)$/);
  if (m) paths.push(`/posts/${m[1]}/`);
}

let n = 0;
for (const p of paths) {
  const dir = join(OUT, p);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), page(p));
  n++;
}
console.log(`리다이렉트 페이지 ${n}개 생성 → ${OUT}/`);
