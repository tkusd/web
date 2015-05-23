import {BaseStore} from 'fluxible/addons';
import Actions from '../constants/Actions';

class TokenStore extends BaseStore {
  static storeName = 'TokenStore'

  static handlers = {
    [Actions.UPDATE_TOKEN_SUCCESS]: 'setData',
    [Actions.UPDATE_TOKEN_FAILED]: 'setError'
  }

  constructor(dispatcher){
    super(dispatcher);

    this.data = null;
    this.error = null;
  }

  getData(){
    return this.data;
  }

  setData(data){
    this.data = data;
    this.error = null;
    this.emitChange();
  }

  isLoggedIn(){
    return Boolean(this.data && this.data.id);
  }

  getError(){
    return this.error;
  }

  setError(err){
    this.error = err;
    this.emitChange();
  }

  dehydrate(){
    return {
      data: this.data,
      error: this.error
    };
  }

  rehydrate(state){
    this.data = state.data;
    this.error = state.error;
  }
}

export default TokenStore;
