export default {
  name: 'collect-button-text',
  experimentID: 'zDXr_rXTRSqaSe1r_EjpqA',
  isEligible: ({ route }) => !process.server && !!route.name && !route.name.includes('in-embed-id'),
  variants: [{ name: 'origin', weight: 1 }, { name: 'variant', weight: 1 }],
};
