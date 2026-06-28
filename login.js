const { makeToken, isAuthed, LOGIN_HTML, PW, TTL } = require('./_util');

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const params = new URLSearchParams(body);
      resolve(Object.fromEntries(params));
    });
  });
}

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const err = (req.url || '').includes('err=1');
    const html = LOGIN_HTML.replace('{{ERROR}}',
      err ? '<div class="err">⚠️ 비밀번호가 올바르지 않습니다.</div>' : ''
    );
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(html);
  }

  if (req.method === 'POST') {
    const body = await parseBody(req);
    if (body.password !== PW) {
      res.writeHead(302, { Location: '/login?err=1' });
      return res.end();
    }
    const token = makeToken();
    res.writeHead(302, {
      Location: '/',
      'Set-Cookie': `afg_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${TTL}`
    });
    return res.end();
  }

  res.writeHead(405);
  res.end('Method Not Allowed');
};
