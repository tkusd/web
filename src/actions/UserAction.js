import Actions from '../constants/Actions';
import {api, parseJSON, filterError} from '../utils/request';
import {dispatchEvent} from './common';

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
  const {TokenStore} = this.getStore();

  return api('users/' + id, {
    method: 'delete'
  }, this)
    .then(filterError)
    .then(() => {
      this.dispatch(Actions.DELETE_USER, id);

      if (TokenStore.getUserID() === id){
        this.dispatch(Actions.DELETE_TOKEN);
      }
    });
}

export function loadCurrentUser(){
  const {TokenStore} = this.getStore();
  if (!TokenStore.isLoggedIn()) return Promise.resolve();

  return getUser.call(this, TokenStore.getUserID());
}
