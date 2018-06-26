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
}

export default logTrackerEvent;
