export default function ({ req, res }) {
  if (process.server) {
    if (!req.cookies || !req.cookies.likecoin_cookie) {
      res.setHeader('Set-Cookie', 'likecoin_cookie=true; secure');
    }
  }
}
