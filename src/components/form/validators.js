import {isEmail, isURL} from 'validator';

export function required(message='Required'){
  return (input, value) => {
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

  return (input, value) => {
    if (value.length < min || (max && value.length > max)){
      return message;
    }
  };
}

export function email(message='Email is invalid'){
  return (input, value) => {
    if (!isEmail(value)) return message;
  };
}

export function url(message='URL is invalid'){
  return (input, value) => {
    if (!isURL(value)) return message;
  };
}
