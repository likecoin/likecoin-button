export default {
  name: 'like-button-flip-x',
  experimentID: 'cwbwITx0Qse5gWILr7oYDA',
  isEligible: ({ req, route }) => {
    if (process.server && req.headers && req.headers.dnt === '1') return false;
    if (process.client && (window.doNotTrack
      || navigator.doNotTrack
      || !navigator.cookieEnabled
      || !(document.cookie && /likebutton_cookie=1/.test(document.cookie)))
    ) {
      return false;
    }
    return route.name === 'in-embed-id-button';
  },
  variants: [
    { name: 'original', weight: 9 },
    { name: 'flipped', weight: 1 },
  ],
};
