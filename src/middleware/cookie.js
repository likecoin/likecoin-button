import { TEST_MODE } from '@/constant';

export default function ({ req, res }) {
  if (process.server) {
    if (!req.cookies || !req.cookies.likebutton_cookie) {
      if (res.cookie) {
        res.cookie('likebutton_cookie', '1', {
          domain: TEST_MODE ? undefined : '.like.co',
          path: '/',
          secure: !TEST_MODE,
        });
      } else {
        res.setHeader('Set-Cookie', `likebutton_cookie=1; ${TEST_MODE ? '' : 'Domain=.like.co '}Path=/;${TEST_MODE ? '' : ' Secure'}`);
      }
    }
  }
}
