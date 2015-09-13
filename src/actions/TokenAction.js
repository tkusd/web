import Actions from '../constants/Actions';
import {api, internal, parseJSON, filterError} from '../utils/request';
import * as UserAction from './UserAction';
import bindActions from '../utils/bindActions';
import {dispatchEvent} from './common';

export function createToken(payload){
  return internal('tokens', {
    method: 'post',
    body: payload
  }, this)
    .then(filterError)
    .then(parseJSON)
    .then(dispatchEvent(this, Actions.UPDATE_TOKEN));
}

export function deleteToken(id){
  return internal('tokens', {
    method: 'delete',
    body: {id}
  }, this)
    .then(filterError)
    .then(() => {
      this.dispatch(Actions.DELETE_TOKEN);
    });
}

export function login(payload){
  const {loadCurrentUser} = bindActions(UserAction, this);

  return createToken.call(this, payload).then(data => {
    return loadCurrentUser().then(() => data);
  });
}

export function logout(){
  const {TokenStore} = this.getStore();
  if (!TokenStore.isLoggedIn()) return Promise.resolve();

  return deleteToken.call(this, TokenStore.getTokenID());
}

export function checkToken(payload){
  if (!payload || !payload.id) return Promise.resolve();

  return api('tokens/' + payload.id, {
    method: 'get'
  }, this).then(filterError);
}
