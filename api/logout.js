module.exports = (req, res) => {
  res.writeHead(302, { Location: '/login', 'Set-Cookie': 'afg_tok=; Path=/; Max-Age=0' });
  res.end();
};
