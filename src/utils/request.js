import fetch from 'isomorphic-fetch';
import {merge} from 'lodash';
import AppStore from '../stores/AppStore';
import TokenStore from '../stores/TokenStore';

const API_BASE = process.env.NODE_ENV === 'production' ? 'http://tkusd.zespia.tw/v1/' : 'http://localhost:3000/v1/';
const INTERNAL_BASE = '/_api/';

function setupRequestOptions(options){
  options = merge({
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }, options);

  if (typeof options.body === 'object'){
    options.body = JSON.stringify(options.body);
  }

  return options;
}

export function api(url, options, context){
  options = setupRequestOptions(options);

  options.mode = 'cors';

  if (context){
    const tokenStore = context.getStore(TokenStore);

    if (tokenStore.isLoggedIn()){
      const token = tokenStore.getData();
      options.headers.Authorization = 'Bearer ' + token.id;
    }
  }

  return fetch(API_BASE + url, options);
}

export function internal(url, options, context){
  options = setupRequestOptions(options);

  const appStore = context.getStore(AppStore);
  options.headers['X-CSRF-Token'] = appStore.getCSRFToken();
  options.credentials = 'include';

  return fetch(INTERNAL_BASE + url, options)
    .then(res => {
      // Update CSRF token
      let csrfToken = res.headers.get('X-CSRF-Token');

      if (csrfToken){
        appStore.setCSRFToken(csrfToken);
      }

      return res;
    });
}
