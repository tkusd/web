import {BaseStore} from '../flux';
import Actions from '../constants/Actions';

class TokenStore extends BaseStore {
  static storeName = 'TokenStore'

  static handlers = {
    [Actions.UPDATE_TOKEN_SUCCESS]: 'setData'
  }

  constructor(context){
    super(context);

    this.data = null;
  }

  getData(){
    return this.data;
  }

  setData(data){
    this.data = data;
    this.emitChange();
  }

  isLoggedIn(){
    return Boolean(this.data && this.data.id);
  }

  dehydrate(){
    return {
      data: this.data
    };
  }

  rehydrate(state){
    this.data = state.data;
  }
}

export default TokenStore;
