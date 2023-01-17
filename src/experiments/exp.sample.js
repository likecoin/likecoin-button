export default {
  name: 'sample_exp',
  experimentID: 'sample_exp_id',
  isEligible: ({ route }) => !process.server && !!route.name,
  variants: [{ name: 'origin', weight: 1 }, { name: 'variant', weight: 1 }],
};
