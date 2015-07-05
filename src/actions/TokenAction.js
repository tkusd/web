import Actions from '../constants/Actions';
import {api, internal} from '../utils/request';
import * as UserAction from './UserAction';
import bindActions from '../utils/bindActions';
import {parseJSON, dispatchEvent, filterError} from './common';

export function createToken(payload){
  return internal('tokens', {
    method: 'post',
    body: payload
  }, this)
    .then(filterError)
    .then(parseJSON)
    .then(dispatchEvent(this, Actions.UPDATE_TOKEN));
}

export function updateToken(id){
  return api('tokens/' + id, {
    method: 'put'
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

  const id = TokenStore.getUserID();

  return deleteToken.call(this, TokenStore.getToken()).then(() => {
    this.dispatch(Actions.DELETE_USER, id);
  });
}

export function checkToken(payload){
  if (!payload || !payload.id) return Promise.resolve();
  return updateToken.call(this, payload.id);
}
