import fetch_ from 'isomorphic-fetch';
import merge from 'lodash/object/merge';

// Fix "Illegal invocation" error in Chrome
// https://github.com/matthew-andrews/isomorphic-fetch/pull/20
const fetch = fetch_.bind(this);

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
    const {TokenStore} = context.getStore();

    if (TokenStore.isLoggedIn()){
      options.headers.Authorization = 'Bearer ' + TokenStore.getToken();
    }
  }

  return fetch(API_BASE + url, options);
}

export function internal(url, options, context){
  options = setupRequestOptions(options);

  const {AppStore} = context.getStore();
  options.headers['X-CSRF-Token'] = AppStore.getCSRFToken();
  options.credentials = 'include';

  return fetch(INTERNAL_BASE + url, options)
    .then(res => {
      // Update CSRF token
      let csrfToken = res.headers.get('X-CSRF-Token');

      if (csrfToken){
        AppStore.setCSRFToken(csrfToken);
      }

      return res;
    });
}
