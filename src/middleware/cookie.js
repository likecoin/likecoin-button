export default function ({ req, res }) {
  if (process.server) {
    if (!req.cookies || !req.cookies.likecoin_cookie) {
      if (res.cookie) {
        res.cookie('likecoin_cookie', 'true', { path: '/', secure: true });
      } else {
        res.setHeader('Set-Cookie', 'likecoin_cookie=true; Path=/; secure');
      }
    }
  }
}
