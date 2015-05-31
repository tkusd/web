import {BaseStore} from '../flux';
import Actions from '../constants/Actions';

class AppStore extends BaseStore {
  static handlers = {
    [Actions.SET_PAGE_TITLE]: 'setPageTitle',
    [Actions.SET_STATUS_CODE]: 'setStatusCode'
  }

  constructor(context){
    super(context);

    this.pageTitle = '';
    this.csrfToken = '';
    this.firstRender = true;
    this.statusCode = 200;
  }

  getPageTitle(){
    return this.pageTitle;
  }

  setPageTitle(title){
    if (this.pageTitle === title){
      return;
    }

    this.pageTitle = title;
    this.emitChange();
  }

  getCSRFToken(){
    return this.csrfToken;
  }

  setCSRFToken(token){
    this.csrfToken = token;
    this.emitChange();
  }

  isFirstRender(){
    return this.firstRender;
  }

  setFirstRender(payload){
    this.firstRender = payload;
    this.emitChange();
  }

  getStatusCode(){
    return this.statusCode;
  }

  setStatusCode(payload){
    this.statusCode = payload;
    this.emitChange();
  }

  dehydrate(){
    return {
      pageTitle: this.pageTitle,
      csrfToken: this.csrfToken
    };
  }

  rehydrate(state){
    this.pageTitle = state.pageTitle;
    this.csrfToken = state.csrfToken;
  }
}

export default AppStore;
