import BaseStore from './BaseStore';
import Actions from '../constants/Actions';

class TokenStore extends BaseStore {
  static handlers = {
    setData: Actions.UPDATE_TOKEN,
    deleteData: Actions.DELETE_TOKEN
  }

  constructor(context){
    super(context);

    this.id = null;
    this.userID = null;
    this.secret = null;
  }

  getTokenID(){
    return this.id;
  }

  getTokenSecret(){
    return this.secret;
  }

  getUserID(){
    return this.userID;
  }

  setData(payload){
    this.id = payload.id;
    this.secret = payload.secret;
    this.userID = payload.user_id;
    this.emitChange();
  }

  deleteData(){
    this.id = null;
    this.secret = null;
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
