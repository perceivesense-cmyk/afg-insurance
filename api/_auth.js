const crypto = require('crypto');

const PW  = process.env.SITE_PASSWORD || 'afg2024';
const KEY = process.env.TOKEN_SECRET  || 'afg_tok';
const TTL = 8 * 3600;

function sign(exp) {
  return crypto.createHmac('sha256', KEY + PW).update(String(exp)).digest('hex').slice(0,16);
}
function makeToken() {
  const exp = Math.floor(Date.now()/1000) + TTL;
  return Buffer.from(exp+'.'+sign(exp)).toString('base64url');
}
function verifyToken(tok) {
  try {
    const [expStr, sig] = Buffer.from(tok,'base64url').toString().split('.');
    const exp = parseInt(expStr);
    return !isNaN(exp) && Math.floor(Date.now()/1000) < exp && sign(exp)===sig;
  } catch { return false; }
}
function getCookie(req, name) {
  const m = (req.headers.cookie||'').match(new RegExp('(?:^|;\\s*)'+name+'=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
}
function isAuthed(req) {
  const t = getCookie(req,'afg_tok');
  return t && verifyToken(t);
}

module.exports = { PW, TTL, makeToken, isAuthed, getCookie };
