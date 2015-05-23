import Actions from '../constants/Actions';
import {api, internal} from '../utils/request';
import TokenStore from '../stores/TokenStore';
import {loadCurrentUser} from './UserAction';

export function create(context, payload, done){
  internal(context, 'post', 'tokens', payload, (err, {body}) => {
    if (err){
      context.dispatch(Actions.UPDATE_TOKEN_FAILED, body);
    } else {
      context.dispatch(Actions.UPDATE_TOKEN_SUCCESS, body);
    }

    done();
  });
}

export function update(context, payload, done){
  api('put', 'tokens/' + payload.id, context).end((err, {body}) => {
    if (err){
      context.dispatch(Actions.UPDATE_TOKEN_FAILED, body);
    } else {
      context.dispatch(Actions.UPDATE_TOKEN_SUCCESS, body);
    }

    done();
  });
}

export function destroy(context, payload, done){
  internal(context, 'delete', 'tokens', payload, (err, {body}) => {
    if (err){
      context.dispatch(Actions.UPDATE_TOKEN_FAILED, body);
    } else {
      context.dispatch(Actions.UPDATE_TOKEN_SUCCESS, null);
    }

    done();
  });
}

export function login(context, payload, done){
  let tokenStore = context.getStore(TokenStore);

  create(context, payload, () => {
    if (!tokenStore.isLoggedIn()) return done();

    context.executeAction(loadCurrentUser, {}, done);
  });
}

export function logout(context, payload, done){
  let tokenStore = context.getStore(TokenStore);
  if (!tokenStore.isLoggedIn()) return done();

  let token = tokenStore.getData();

  destroy(context, {id: token.id}, () => {
    if (!tokenStore.isLoggedIn()){
      context.dispatch(Actions.DELETE_USER_DATA, token.user_id);
    }

    done();
  });
}

export function checkToken(context, payload, done){
  if (!payload || !payload.id) return done();
  update(context, payload, done);
}

export function resetError(context, payload, done){
  context.dispatch(Actions.UPDATE_TOKEN_FAILED, null);
  done();
}
