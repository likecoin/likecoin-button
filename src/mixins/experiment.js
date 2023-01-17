export default function experimentsMixin(
  propName,
  experiemntName,
  variantName,
  isEligible = () => true
) {
  return {
    computed: {
      [propName]() {
        if (!this.$exp || !isEligible(this)) return false;
        const { name, $activeVariants } = this.$exp;
        if (
          this.$exp.isEligible &&
          !this.$exp.isEligible({ route: this.$route })
        ) {
          return false;
        }
        return (
          name === experiemntName &&
          !!$activeVariants.find(variant => variant.name === variantName)
        );
      },
    },
  };
}
