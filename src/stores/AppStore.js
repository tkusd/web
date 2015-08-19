import BaseStore from './BaseStore';
import Actions from '../constants/Actions';

class AppStore extends BaseStore {
  static handlers = {
    setPageTitle: Actions.SET_PAGE_TITLE,
    setStatusCode: Actions.SET_STATUS_CODE,
    setFirstRender: Actions.SET_FIRST_RENDER
  }

  constructor(context){
    super(context);

    this.pageTitle = '';
    this.csrfToken = '';
    this.firstRender = true;
    this.statusCode = 200;
    this.apiEndpoint = '';
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

  getAPIEndpoint(){
    return this.apiEndpoint;
  }

  setAPIEndpoint(url){
    this.apiEndpoint = url;
    this.emitChange();
  }

  dehydrate(){
    return {
      pageTitle: this.pageTitle,
      csrfToken: this.csrfToken,
      apiEndpoint: this.apiEndpoint
    };
  }

  rehydrate(state){
    this.pageTitle = state.pageTitle;
    this.csrfToken = state.csrfToken;
    this.apiEndpoint = state.apiEndpoint;
  }
}

export default AppStore;
