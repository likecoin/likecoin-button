const experimentID = 'w8WnGvmrQeuegiMBCPO1pw';

export default {
  name: 'standnews',
  experimentID,
  isEligible: ({ req, route, query }) => {
    if (process.server && req.headers && req.headers.dnt === '1') return false;
    if (process.client && (window.doNotTrack
      || navigator.doNotTrack
      || !navigator.cookieEnabled
      || !(document.cookie && /likebutton_cookie=1/.test(document.cookie)))
    ) {
      return false;
    }
    return (
      route.name === 'in-embed-id-button'
      && query.exp && query.exp.indexOf(experimentID) !== -1
    );
  },
  variants: [
    { name: 'original', weight: 1 },
    { name: 'sticky-bottom', weight: 1 },
  ],
};
