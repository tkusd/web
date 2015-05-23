import {isEmail, isURL} from 'validator';

export function required(input, value){
  if (!value.length){
    return input.getLabel() + ' is required';
  }
}

export function length(min, max){
  min = min || 0;

  return (input, value) => {
    if (value.length < min || (max && value.length > max)){
      if (min && max){
        return `The length of ${input.getLabel()} must be between ${min}~${max}`;
      } else if (max){
        return `The maximum length of ${input.getLabel()} is ${max}`;
      } else if (min){
        return `The minimum length of ${input.getLabel()} is ${min}`;
      }
    }
  };
}

export function email(input, value){
  if (!isEmail(value)){
    return 'Email is not valid';
  }
}

export function url(input, value){
  if (!isURL(value)){
    return 'URL is not valid';
  }
}
