/* Sync cookie __session to exp in client due to firebase fn vs GTM limitation */
/* GTM only recognize exp as optimize cookie, while firebase fn only
   accept __session for cookie  */
import * as cookie from 'tiny-cookie';

import experiments from '~/experiments';

export default async ({ req, res, query }) => {
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
      let expCookie = cookie.get('__session');
      if (query.exp) {
        const [expId] = query.exp.split('.');
        if (experiments.some(exp => exp.experimentID === expId)) {
          expCookie = query.exp;
        }
      }
      if (expCookie) cookie.set('exp', expCookie, Date.now());
    }
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
  }
};
