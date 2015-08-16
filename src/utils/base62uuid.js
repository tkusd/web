import uuid from 'node-uuid';
import baseX from 'base-x';

const base62 = baseX('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

export function encode(id){
  return base62.encode(uuid.parse(id));
}

export function decode(id){
  return uuid.unparse(base62.decode(id));
}

export default encode;
