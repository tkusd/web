import Actions from '../constants/Actions';

export function setPageTitle(title){
  this.dispatch(Actions.SET_PAGE_TITLE, title);
}

export function setStatusCode(status){
  this.dispatch(Actions.SET_STATUS_CODE, status);
}
