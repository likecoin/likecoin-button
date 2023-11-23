/*
  HACK: force set google-optimize params for gtag config
*/
export default ({ app }) => {
  if (app.$exp && app.$gtag) {
    const { experimentID, $variantIndexes } = app.$exp;
    if (!experimentID || !$variantIndexes || !$variantIndexes.length) { return; }
    if (app.$gtag && window && window.gtag) {
      // HACK: exp event needs to be sent after page_view is sent
      // no good way to define plugin ordering now, use setTimeout
      setTimeout(() => {
        app.$gtag.set({
          experiments: [{ id: experimentID, variant: $variantIndexes.join('-') }],
        });
        app.$gtag.event('experiment_impression', {
          experiment_id: experimentID,
          variant_id: `${experimentID}.${$variantIndexes.join('-')}`,
        });
      }, 0);
    }
  }
};
