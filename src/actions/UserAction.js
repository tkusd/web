import Actions from '../constants/Actions';
import {api, internal} from '../utils/request';
import TokenStore from '../stores/TokenStore';
import UserStore from '../stores/UserStore';
import * as TokenAction from './TokenAction';

export function get(context, payload, done){
  api('get', 'users/' + payload.id, context).end((err, {body}) => {
    if (err){
      context.dispatch(Actions.UPDATE_USER_FAILED, body);
    } else {
      context.dispatch(Actions.UPDATE_USER_SUCCESS, body);
    }

    done();
  });
}

export function create(context, payload, done){
  api('post', 'users', context)
    .send(payload)
    .end((err, {body}) => {
      if (err){
        context.dispatch(Actions.UPDATE_USER_FAILED, body);
        done();
      } else {
        context.dispatch(Actions.UPDATE_USER_SUCCESS, body);

        // Create a token
        context.executeAction(TokenAction.create, {
          email: payload.email,
          password: payload.password
        }, done);
      }
    });
}

export function update(context, payload, done){
  api('put', 'users/' + payload.id, context)
    .send(payload)
    .end((err, {body}) => {
      if (err){
        context.dispatch(Actions.UPDATE_USER_FAILED, body);
      } else {
        context.dispatch(Actions.UPDATE_USER_SUCCESS, body);
      }

      done();
    });
}

export function destroy(context, payload, done){
  let currentUser = context.getStore(UserStore).getCurrentUser();
  if (!currentUser) return done();

  internal(context, 'delete', 'users', {id: currentUser.id}, (err, {body}) => {
    if (err){
      context.dispatch(Actions.UPDATE_USER_FAILED, body);
    } else {
      context.dispatch(Actions.DELETE_USER_DATA, currentUser.id);
      context.dispatch(Actions.UPDATE_TOKEN_SUCCESS, null);
    }

    done();
  });
}

export function loadCurrentUser(context, payload, done){
  let tokenStore = context.getStore(TokenStore);
  if (!tokenStore.isLoggedIn()) return done();

  let token = tokenStore.getData();

  get(context, {id: token.user_id}, done);
}

export function resetError(context, payload, done){
  context.dispatch(Actions.UPDATE_USER_FAILED, null);
  done();
}
