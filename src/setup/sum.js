function rol16(value, bits) {
  value &= 0xffff;
  return ((value << bits) | (value >>> (16 - bits))) & 0xffff;
}

function ror16(value, bits) {
  value &= 0xffff;
  return ((value >>> bits) | (value << (16 - bits))) & 0xffff;
}

function calcChecksumFromText(text) {
  const bytes = Array.from(new TextEncoder().encode(text));
  if (bytes.length % 2 !== 0) {
    bytes.push(0);
  }
  let state = 0xbeef;
  for (let i = 0; i < bytes.length; i += 2) {
    const word = bytes[i] | (bytes[i + 1] << 8);
    const mixed = (state ^ word) & 0xffff;
    state = ((ror16(mixed, 3) ^ rol16(mixed, 7) ^ state) + mixed) & 0xffff;
  }
  return state;
}

export function calcChecksumFromKV({ I, U, M, S }) {
  const source = `I-${I}+U-${U}+M-${M}+S-${S.slice(0, -4)}`;
  return calcChecksumFromText(source).toString(16).toUpperCase().padStart(4, "0");
}
