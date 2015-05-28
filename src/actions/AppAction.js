import Actions from '../constants/Actions';

export function setPageTitle(context, payload){
  context.dispatch(Actions.SET_PAGE_TITLE, payload);
}

export function setStatusCode(context, payload){
  context.dispatch(Actions.SET_STATUS_CODE, payload);
}
