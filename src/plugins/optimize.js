/* Sync cookie __session to exp in client due to firebase fn vs GTM limitation */
/* GTM only recognize exp as optimize cookie, while firebase fn only
   accept __session for cookie  */
import * as cookie from 'tiny-cookie';

export default async ({ req, res }) => {
  try {
    if (process.server) {
      // eslint-disable-next-line no-underscore-dangle
      if (res.clearCookie && ((req.cookies || {}).__session)) {
        /* clear legacy cookie affecting a/b testing */
        res.clearCookie('__session',
          {
            path: '/',
            domain: '.like.co',
            secure: true,
            httpOnly: true,
          });
      }
    } else {
      if (!document.cookie || !cookie.enabled()) return;
      const expId = cookie.get('__session');
      if (expId) cookie.set('exp', expId, Date.now());
    }
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
  }
};
