/* Although firebase fn should not have access to sensitive internal res,
  and this isolation behaviour should be used as main defense,
  still implement basic filter on url to avoid SSRF
*/
export const checkValidDomainNotIP = (url) => {
  const match = url.match(/^(?:http(?:s)?:\/\/)?([a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+)(?::\d+)?/);
  if (!match || !match[1]) return false;
  const parts = match[1].split('.');
  const isIP = (parts.length === 4 && parts.every((part) => {
    try {
      if (!part.match(/^\d{1,3}$/)) return false;
      const partNum = Number(part);
      return partNum >= 0 && partNum <= 255;
    } catch (err) {
      return false;
    }
  }));
  return !isIP;
};

export default checkValidDomainNotIP;
