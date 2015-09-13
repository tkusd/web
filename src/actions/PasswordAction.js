import {api, filterError} from '../utils/request';

export function createPasswordReset(body){
  return api('passwords/reset', {
    method: 'post',
    body
  }, this)
    .then(filterError);
}

export function sendPasswordReset(token, body){
  return api('passwords/reset/' + token, {
    method: 'post',
    body
  }, this)
    .then(filterError);
}