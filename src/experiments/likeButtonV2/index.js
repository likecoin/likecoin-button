export default {
  name: 'like-button-v3',
  experimentID: 'fF2Uw4gCS2-j1m3nGg1HTw',
  isEligible: ({ req, route }) => {
    if (process.server && req.headers && req.headers.dnt === '1') return false;
    if (process.client && (window.doNotTrack
      || navigator.doNotTrack
      || !navigator.cookieEnabled
      || !(document.cookie && /likecoin_cookie=true/.test(document.cookie)))
    ) {
      return false;
    }
    return route.name === 'in-embed-id-button';
  },
  variants: [
    { name: 'original', weight: 9 },
    { name: 'v3', weight: 1 },
  ],
};
