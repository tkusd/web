import {isEmail, isURL} from 'validator';

export function required(message='Required'){
  return function required(input, value){
    if (!value || !value.length) return message;
  };
}

export function length(min, max, message){
  min = min || 0;

  if (!message){
    if (min && max){
      message = `The length must be between ${min} to ${max}`;
    } else if (max){
      message = `The maximum length is ${max}`;
    } else if (min){
      message = `The minimum length is ${min}`;
    }
  }

  return function length(input, value){
    if (value.length < min || (max && value.length > max)){
      return message;
    }
  };
}

export function email(message='Email is invalid'){
  return function email(input, value){
    if (!isEmail(value)) return message;
  };
}

export function url(message='URL is invalid'){
  return function url(input, value){
    if (!isURL(value)) return message;
  };
}
