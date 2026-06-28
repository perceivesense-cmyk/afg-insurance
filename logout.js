module.exports = (req, res) => {
  res.writeHead(302, {
    Location: '/login',
    'Set-Cookie': 'afg_token=; Path=/; Max-Age=0'
  });
  res.end();
};
