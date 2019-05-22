/* Sync cookie __session to exp in client due to firebase fn vs GTM limitation */
/* GTM only recognize exp as optimize cookie, while firebase fn only
   accept __session for cookie  */
import * as cookie from 'tiny-cookie';

export default async () => {
  try {
    if (process.server || !window) return;
    if (!document.cookie || !cookie.enabled()) return;
    const expId = cookie.get('__session');
    if (expId) cookie.set('exp', expId, Date.now());
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
  }
};
