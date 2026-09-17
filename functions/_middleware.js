// www.money-radar.kr → money-radar.kr 301.
// www 는 DNS 만 붙어 있고 리다이렉트가 없어 같은 페이지가 두 호스트로 200 을 냈다 — 서치콘솔에
// "적절한 표준 태그가 포함된 대체 페이지" 6건으로 잡혔다 (2026-09-17). Pages Function 은 정적 자산보다 먼저 돈다.
export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (url.hostname === 'www.money-radar.kr') {
    url.hostname = 'money-radar.kr';
    return Response.redirect(url.toString(), 301);
  }
  return next();
}
