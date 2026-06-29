const { PW, TTL, makeToken } = require('./_auth');

const HTML = (err) => `<!DOCTYPE html><html lang="ko"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>AFG 보험심사평가</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;background:#F0F4F8;display:flex;align-items:center;justify-content:center;min-height:100vh}
.card{background:white;border-radius:16px;padding:40px 36px;width:360px;box-shadow:0 4px 24px rgba(0,0,0,.12)}
.logo{display:flex;align-items:center;gap:12px;margin-bottom:28px;justify-content:center}
.t1{font-size:15px;font-weight:700;color:#1B2A4A}.t2{font-size:11px;color:#94a3b8;margin-top:1px}
input{width:100%;padding:12px 14px;border:1.5px solid #E2E8F0;border-radius:10px;font-size:14px;font-family:inherit;outline:none;margin-bottom:12px}
input:focus{border-color:#1B2A4A}
button{width:100%;padding:13px;background:#1B2A4A;color:white;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer}
.err{background:#FEE2E2;color:#991B1B;border-radius:8px;padding:10px 14px;font-size:13px;margin-bottom:14px}
.footer{text-align:center;margin-top:18px;font-size:11px;color:#94a3b8}
</style></head><body>
<div class="card">
  <div class="logo">
    <svg width="80" height="26" viewBox="0 0 180 50">
      <g transform="translate(2,2)">
        <g opacity=".25"><polygon points="18,0 28,8 18,16 8,8" fill="#1B2A4A"/><polygon points="28,0 38,8 28,16 18,8" fill="#1B2A4A"/><polygon points="8,0 18,8 8,16 -2,8" fill="#1B2A4A"/></g>
        <g opacity=".55"><polygon points="14,16 24,24 14,32 4,24" fill="#1B2A4A"/><polygon points="24,16 34,24 24,32 14,24" fill="#1B2A4A"/></g>
        <g opacity="1"><polygon points="18,32 28,40 18,48 8,40" fill="#1B2A4A"/></g>
        <g opacity=".4"><polygon points="4,8 14,16 4,24" fill="#1B2A4A"/><polygon points="32,8 42,16 32,24" fill="#1B2A4A"/></g>
      </g>
      <text x="54" y="36" font-family="Arial Black,Arial" font-weight="900" font-size="32" fill="#1B2A4A">AFG</text>
      <line x1="124" y1="8" x2="124" y2="44" stroke="#ccc" stroke-width="1"/>
      <text x="130" y="20" font-family="Arial" font-weight="700" font-size="9" fill="#1B2A4A" letter-spacing="2">AUTHENTIC</text>
      <text x="130" y="33" font-family="Arial" font-size="9" fill="#1B2A4A" letter-spacing="2">FINANCIAL</text>
      <text x="130" y="46" font-family="Arial" font-size="9" fill="#1B2A4A" letter-spacing="2">GROUP</text>
    </svg>
    <div><div class="t1">보험심사평가</div><div class="t2">고지의무 위반 분석 시스템</div></div>
  </div>
  ${err ? '<div class="err">⚠️ 비밀번호가 올바르지 않습니다.</div>' : ''}
  <form method="POST" action="/login">
    <input type="password" name="pw" placeholder="비밀번호를 입력하세요" autofocus/>
    <button type="submit">접속하기</button>
  </form>
  <div class="footer">AFG Authentic · 보험심사평가사 전용</div>
</div>
</body></html>`;

function parseBody(req) {
  return new Promise(res => {
    let b = '';
    req.on('data', c => b += c);
    req.on('end', () => res(Object.fromEntries(new URLSearchParams(b))));
  });
}

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { pw } = await parseBody(req);
    if (pw !== PW) {
      res.writeHead(302, { Location: '/login?e=1' });
      return res.end();
    }
    const token = makeToken();
    res.writeHead(302, {
      Location: '/',
      'Set-Cookie': `afg_tok=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${TTL}`
    });
    return res.end();
  }
  const err = (req.url || '').includes('e=1');
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(HTML(err));
};
