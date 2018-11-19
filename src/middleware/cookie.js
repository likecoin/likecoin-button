export default function ({ res }) {
  if (process.server) {
    res.setHeader('Set-Cookie', 'likecoin_cookie=true; secure');
  }
}
