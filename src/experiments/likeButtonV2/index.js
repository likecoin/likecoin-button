export default {
  name: 'like-button-v2',
  experimentID: 'XQVeCU5cSIehBS7opKi9hg',
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
    { name: 'v2', weight: 1 },
  ],
};
