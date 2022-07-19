import { bech32 } from 'bech32';

export function isValidAddress(address) {
  try {
    bech32.decode(address);
    return true;
  } catch (error) {
    return false;
  }
}
export function changeAddressPrefix(address, newPrefix) {
  const { words } = bech32.decode(address);
  return bech32.encode(newPrefix, words);
}

export function maskedWallet(address) {
  let replacedAddress = address;
  if (address.startsWith('like1')) {
    replacedAddress = address.replace(/((?:like1|0x).{4}).*(.{8})/, '$1...$2');
  } if (address.startsWith('cosmos1')) {
    replacedAddress = address.replace(/((?:cosmos1|0x).{4}).*(.{6})/, '$1...$2');
  }
  return replacedAddress;
}
