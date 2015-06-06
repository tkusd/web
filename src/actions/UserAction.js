import Actions from '../constants/Actions';
import {api, internal} from '../utils/request';
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

export function deleteData(){
  const tokenStore = this.getStore(TokenStore);
  if (!tokenStore.isLoggedIn()) return Promise.reject(new Error('User has not logged in'));

  const id = tokenStore.getUserID();

  return internal('users', {
    method: 'delete',
    body: {
      id: id
    }
  }, this).then(() => {
    this.dispatch(Actions.DELETE_USER, id);
    this.dispatch(Actions.DELETE_TOKEN);
  });
}

export function loadCurrentUser(){
  const tokenStore = this.getStore(TokenStore);
  if (!tokenStore.isLoggedIn()) return Promise.resolve();

  return getUser.call(this, tokenStore.getUserID());
}
