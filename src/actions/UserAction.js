import Actions from '../constants/Actions';
import {api, internal} from '../utils/request';
import TokenStore from '../stores/TokenStore';
import UserStore from '../stores/UserStore';
import {parseJSON, dispatchEvent, filterError} from './common';

export function get(context, payload){
  return api('users/' + payload.id, {
    method: 'get'
  }, context)
    .then(filterError)
    .then(parseJSON)
    .then(dispatchEvent(context, Actions.UPDATE_USER_SUCCESS));
}

export function create(context, payload){
  return api('users', {
    method: 'post',
    body: payload
  }, context)
    .then(filterError)
    .then(parseJSON)
    .then(dispatchEvent(context, Actions.UPDATE_USER_SUCCESS));
}

export function update(context, payload){
  return api('users/' + payload.id, {
    method: 'put',
    body: payload
  }, context)
    .then(filterError)
    .then(parseJSON)
    .then(dispatchEvent(context, Actions.UPDATE_USER_SUCCESS));
}

export function destroy(context, payload){
  let user = context.getStore(UserStore).getCurrentUser();
  if (!user) return Promise.resolve();

  return internal('users', {
    method: 'delete',
    body: {
      id: user.id
    }
  }, context).then(res => {
    context.dispatch(Actions.DELETE_USER_DATA, user.id);
    context.dispatch(Actions.UPDATE_TOKEN_SUCCESS, null);
  });
}

export function loadCurrentUser(context){
  const tokenStore = context.getStore(TokenStore);
  if (!tokenStore.isLoggedIn()) return Promise.resolve();

  let token = tokenStore.getData();

  return get(context, {id: token.user_id});
}
