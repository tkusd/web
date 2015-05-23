import request from 'superagent';
import AppStore from '../stores/AppStore';
import TokenStore from '../stores/TokenStore';
import {setCSRFToken} from '../actions/AppAction';

const API_BASE = 'http://localhost:3000/v1/';
const INTERNAL_BASE = '/_api/';

function parseMethod(method){
  method = method.toLowerCase();

  if (method === 'delete') return 'del';
  return method;
}

export function api(method, url, context){
  let req = request[parseMethod(method)](API_BASE + url)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');

  if (context){
    let tokenStore = context.getStore(TokenStore);

    if (tokenStore.isLoggedIn()){
      let token = tokenStore.getData();
      req = req.set('Authorization', 'Bearer ' + token.id);
    }
  }

  return req;
}

export function internal(context, method, url, payload, callback){
  let appStore = context.getStore(AppStore);

  request[parseMethod(method)](INTERNAL_BASE + url)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .set('X-CSRF-Token', appStore.getCSRFToken())
    .send(payload)
    .end((err, res) => {
      if (!res.header['x-csrf-token']){
        return callback(err, res);
      }

      context.executeAction(setCSRFToken, res.header['x-csrf-token'], () => {
        callback(err, res);
      });
    });
}
