import Actions from '../constants/Actions';

export function setPageTitle(context, payload, done){
  context.dispatch(Actions.SET_PAGE_TITLE, payload);
  done();
}

export function setCSRFToken(context, payload, done){
  context.dispatch(Actions.SET_CSRF_TOKEN, payload);
  done();
}
