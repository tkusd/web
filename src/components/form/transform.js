import validator from 'validator';

export function trim(input, value){
  return validator.trim(value);
}

export function escape(input, value){
  return validator.escape(value);
}
