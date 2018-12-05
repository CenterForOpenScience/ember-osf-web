export const GUID_ALPHABET_STRING = '23456789abcdefghjkmnpqrstuvwxyz';
export const GUID_ALPHABET = Object.freeze(GUID_ALPHABET_STRING.split(''));
export const GUID_REGEX = new RegExp(`^[${GUID_ALPHABET_STRING}]{5}$`);
