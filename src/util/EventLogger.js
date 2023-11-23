function hexString(buffer) {
  const byteArray = new Uint8Array(buffer);
  const hexCodes = [...byteArray].map((value) => {
    const hexCode = value.toString(16);
    const paddedHexCode = hexCode.padStart(2, '0');
    return paddedHexCode;
  });
  return hexCodes.join('');
}

function digestMessage(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  return window.crypto.subtle.digest('SHA-256', data);
}

export async function setTrackerUser(vue, { user }) {
  if (window.doNotTrack || navigator.doNotTrack) { return; }
  try {
    if (vue.$gtag) {
      let hashedId = await digestMessage(user);
      hashedId = hexString(hashedId);
      vue.$gtag.set({ userId: hashedId });
    }
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
  }
}

export function logTrackerEvent(
  vue,
  category,
  action,
  label,
  value,
) {
  try {
    // do not track
    if (window.doNotTrack || navigator.doNotTrack) { return; }
    if (vue.$gtag) {
      vue.$gtag.event(action, {
        event_category: category,
        event_label: label.substring(0, 499),
        value,
      });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('logging error:');
    // eslint-disable-next-line no-console
    console.error(err);
  }
}

export default logTrackerEvent;
