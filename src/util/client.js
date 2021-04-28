export function checkIsMobileClient() {
  if (!global.window) return false;
  const ua = global.window.navigator.userAgent;
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) {
    return true;
  }
  return false;
}

export function checkIsDesktopChrome() {
  if (!global.window) return false;
  const ua = global.window.navigator.userAgent;
  const uv = global.window.navigator.vendor;
  if (checkIsMobileClient()) return false;
  return (/Chrome/i.test(ua) && /Google/i.test(uv)) && !(/OPR/i.test(ua));
}

export function checkIsTrustClient() {
  return window.web3 && window.web3.currentProvider.isTrust;
}

export function checkIsIOSInApp() {
  if (!global.window) return false;
  const ua = global.window.navigator.userAgent;
  if (!/iPhone|iPad|iPod/i.test(ua)) return false;
  return !/Safari/i.test(ua);
}

export function isAndroid() {
  if (!navigator) return false;
  return /android/i.test(navigator.userAgent);
}

export function isFacebookBrowser() {
  if (!navigator) return false;
  return /FB_IAB/i.test(navigator.userAgent);
}

export function isIOS() {
  if (!navigator) return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

export function openURL(vue, url, name, specs, replace) {
  if (checkIsTrustClient(vue)) {
    window.location.assign(url);
  } else {
    const w = window.open(url, name || '_blank', specs, replace);
    if (w) w.opener = null;
  }
}

export async function checkHasStorageAPIAccess() {
  // https://webkit.org/blog/8311/intelligent-tracking-prevention-2-0/
  // TODO: try to request for storageAPI access
  if (typeof document.hasStorageAccess !== 'function') return true;
  try {
    const res = await document.hasStorageAccess();
    return res;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export function checkIsFirefoxStrictMode() {
  const isFireFox = navigator.userAgent.includes('Firefox');
  const DNT = window.doNotTrack || navigator.doNotTrack;
  // We cannot detect ETP strict mode, but it sets DNT to 1.
  return (isFireFox && DNT && DNT === '1');
}

export async function requestStorageAPIAccess() {
  if (typeof document.requestStorageAccess !== 'function') return false;
  try {
    const res = await document.requestStorageAccess();
    return res || true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
