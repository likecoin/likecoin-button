export default {
  name: 'like-button-v2',
  experimentID: '7eu94FzASCa11yY1XY3MBQ',
  isEligible: ({ req, route }) => {
    if (process.server && req.headers && req.headers.dnt === '1') return false;
    if (process.client && (window.doNotTrack || navigator.doNotTrack)) return false;
    return route.name === 'in-embed-id-button';
  },
  variants: [
    { name: 'original', weight: 1 },
    { name: 'v2', weight: 1 },
  ],
};
