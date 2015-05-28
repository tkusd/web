import {BaseStore} from '../flux';
import Actions from '../constants/Actions';
import {Map} from 'immutable';
import TokenStore from './TokenStore';

class UserStore extends BaseStore {
  static storeName = 'UserStore'

  static handlers = {
    [Actions.UPDATE_USER_SUCCESS]: 'setData',
    [Actions.DELETE_USER_DATA]: 'removeUser'
  }

  constructor(context){
    super(context);

    this.data = Map({});
  }

  getUser(id){
    return this.data.get(id);
  }

  setUser(id, data){
    let newCollection = this.data.set(id, data);
    if (newCollection === this.data) return;

    this.data = newCollection;
    this.emitChange();
  }

  removeUser(id){
    if (!this.data.has(id)) return;

    this.data = this.data.remove(id);
    this.emitChange();
  }

  getCurrentUser(){
    let token = this.context.getStore(TokenStore).getData();
    if (!token) return null;

    return this.getUser(token.user_id);
  }

  getData(){
    return this.data;
  }

  setData(payload){
    this.setUser(payload.id, payload);
  }

  dehydrate(){
    return {
      data: this.data.toObject()
    };
  }

  rehydrate(state){
    this.data = Map(state.data);
  }
}

export default UserStore;
