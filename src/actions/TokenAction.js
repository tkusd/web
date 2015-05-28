import Actions from '../constants/Actions';
import {api, internal} from '../utils/request';
import TokenStore from '../stores/TokenStore';
import {loadCurrentUser} from './UserAction';
import {parseJSON, dispatchEvent, filterError} from './common';

export function create(context, payload){
  return internal('tokens', {
    method: 'post',
    body: payload
  }, context)
    .then(filterError)
    .then(parseJSON)
    .then(dispatchEvent(context, Actions.UPDATE_TOKEN_SUCCESS));
}

export function update(context, payload){
  return api('tokens/' + payload.id, {
    method: 'put'
  }, context)
    .then(filterError)
    .then(parseJSON)
    .then(dispatchEvent(context, Actions.UPDATE_TOKEN_SUCCESS));
}

export function destroy(context, payload){
  return internal('tokens', {
    method: 'delete',
    body: {
      id: payload.id
    }
  }, context)
    .then(filterError)
    .then(res => {
      context.dispatch(Actions.UPDATE_TOKEN_SUCCESS, null);
    });
}

export function login(context, payload){
  let data;

  return create(context, payload).then(data_ => {
    data = data_;
    return context.executeAction(loadCurrentUser);
  }).then(() => {
    return data;
  });
}

export function logout(context, payload, done){
  const tokenStore = context.getStore(TokenStore);
  if (!tokenStore.isLoggedIn()) return Promise.resolve();

  let token = tokenStore.getData();

  return destroy(context, token).then(() => {
    context.dispatch(Actions.DELETE_USER_DATA, token.user_id);
  });
}

export function checkToken(context, payload){
  if (!payload || !payload.id) return Promise.resolve();
  return update(context, payload);
}
