export function logTrackerEvent(
  vue,
  category,
  action,
  label,
  value,
) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'customEvent',
    category,
    action,
    label,
    value,
  });
  if (window.fbq) window.fbq('track', action);
}

export default logTrackerEvent;
