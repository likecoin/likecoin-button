export default {
  name: 'collect-button-text',
  experimentID: 'HaKreU0uTbmL7uGnQa_Tpg',
  isEligible: ({ route }) => !process.server && !!route.name,
  variants: [{ name: 'origin', weight: 1 }, { name: 'variant', weight: 1 }],
};
