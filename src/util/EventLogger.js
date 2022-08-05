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

export async function setTrackerUser({ user }) {
  if (window.doNotTrack || navigator.doNotTrack) return;
  window.dataLayer = window.dataLayer || [];
  try {
    let hashedId = await digestMessage(user);
    hashedId = hexString(hashedId);
    window.dataLayer.push({
      userId: hashedId,
    });
  } catch (err) {
    console.error(err);
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
    if (window.doNotTrack || navigator.doNotTrack) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'customEvent',
      category,
      action,
      label,
      value,
    });
  } catch (err) {
    console.error('logging error:');
    console.error(err);
  }
}

export default logTrackerEvent;
