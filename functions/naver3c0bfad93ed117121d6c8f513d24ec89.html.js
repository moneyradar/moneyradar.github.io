// 네이버 서치어드바이저 소유 확인 파일.
// Cloudflare Pages 는 정적 `*.html` 요청을 확장자 없는 경로로 308 리다이렉트하는데, 네이버 검증기는
// 정확한 파일명에서 200 을 요구한다. Pages Function 은 정적 자산보다 먼저 처리되므로 여기서 직접 응답한다.
export function onRequest() {
  return new Response('naver-site-verification: naver3c0bfad93ed117121d6c8f513d24ec89.html', {
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=3600' },
  });
}
