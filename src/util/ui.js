export function ellipsis(value) {
  if (value) {
    const len = value.length;
    const dots = '...';
    if (!value) return '';
    if (value.length > 15) {
      return value.substring(0, 8) + dots + value.substring(len - 3, len);
    }
    return value;
  }
  return value;
}

export default ellipsis;
