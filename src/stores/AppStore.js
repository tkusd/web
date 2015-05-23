import {BaseStore} from 'fluxible/addons';
import Actions from '../constants/Actions';

class AppStore extends BaseStore {
  static storeName = 'AppStore'

  static handlers = {
    [Actions.SET_PAGE_TITLE]: 'setPageTitle',
    [Actions.SET_CSRF_TOKEN]: 'setCSRFToken'
  }

  constructor(dispatcher){
    super(dispatcher);

    this.pageTitle = '';
    this.csrfToken = '';
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
