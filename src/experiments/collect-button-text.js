export default {
  name: 'collect-button-text',
  experimentID: '3zWuqnDmRJmKe89D_4M_sg',
  isEligible: ({ route }) => !process.server && !!route.name && !route.name.includes('in-embed-id'),
  variants: [{ name: 'origin', weight: 1 }, { name: 'variant', weight: 1 }],
};
