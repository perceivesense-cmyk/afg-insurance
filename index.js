const { isAuthed, LOGIN_HTML, MAIN_HTML } = require('./_util');

module.exports = (req, res) => {
  if (!isAuthed(req)) {
    res.writeHead(302, { Location: '/login' });
    return res.end();
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(MAIN_HTML);
};
