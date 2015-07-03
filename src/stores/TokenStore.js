import BaseStore from './BaseStore';
import Actions from '../constants/Actions';

class TokenStore extends BaseStore {
  static handlers = {
    [Actions.UPDATE_TOKEN]: 'setData',
    [Actions.DELETE_TOKEN]: 'deleteData'
  }

  constructor(context){
    super(context);

    this.id = null;
    this.userID = null;
  }

  getToken(){
    return this.id;
  }

  getUserID(){
    return this.userID;
  }

  setData(payload){
    this.id = payload.id;
    this.userID = payload.user_id;
    this.emitChange();
  }

  deleteData(){
    this.id = null;
    this.userID = null;
    this.emitChange();
  }

  isLoggedIn(){
    return Boolean(this.id);
  }

  dehydrate(){
    return {
      id: this.id,
      userID: this.userID
    };
  }

  rehydrate(state){
    this.id = state.id;
    this.userID = state.userID;
  }
}

export default TokenStore;
