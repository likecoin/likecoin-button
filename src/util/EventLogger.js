export function logTrackerEvent(
  vue,
  category,
  action,
  label,
  value,
) {
  try {
    // do not track
    if (window.doNotTrack || navigator.doNotTrack) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'customEvent',
      category,
      action,
      label,
      value,
    });
    if (window.fbq) window.fbq('track', action);
  } catch (err) {
    console.error('logging error:');
    console.error(err);
  }
}

export default logTrackerEvent;
