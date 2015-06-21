import Actions from '../constants/Actions';
import {api} from '../utils/request';
import TokenStore from '../stores/TokenStore';
import {parseJSON, dispatchEvent, filterError} from './common';

export function getUser(id){
  return api('users/' + id, {
    method: 'get'
  }, this)
    .then(filterError)
    .then(parseJSON)
    .then(dispatchEvent(this, Actions.UPDATE_USER));
}

export function createUser(payload){
  return api('users', {
    method: 'post',
    body: payload
  }, this)
    .then(filterError)
    .then(parseJSON)
    .then(dispatchEvent(this, Actions.UPDATE_USER));
}

export function updateUser(id, payload){
  return api('users/' + id, {
    method: 'put',
    body: payload
  }, this)
    .then(filterError)
    .then(parseJSON)
    .then(dispatchEvent(this, Actions.UPDATE_USER));
}

export function deleteUser(id){
  const tokenStore = this.getStore(TokenStore);

  return api('users/' + id, {
    method: 'delete'
  }, this)
    .then(filterError)
    .then(() => {
      this.dispatch(Actions.DELETE_USER, id);

      if (tokenStore.getUserID() === id){
        this.dispatch(Actions.DELETE_TOKEN);
      }
    });
}

export function loadCurrentUser(){
  const tokenStore = this.getStore(TokenStore);
  if (!tokenStore.isLoggedIn()) return Promise.resolve();

  return getUser.call(this, tokenStore.getUserID());
}
