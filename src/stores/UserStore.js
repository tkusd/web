import {BaseStore} from 'fluxible/addons';
import Actions from '../constants/Actions';
import {Map} from 'immutable';
import TokenStore from './TokenStore';

class UserStore extends BaseStore {
  static storeName = 'UserStore'

  static handlers = {
    [Actions.UPDATE_USER_SUCCESS]: 'setData',
    [Actions.UPDATE_USER_FAILED]: 'setError',
    [Actions.DELETE_USER_DATA]: 'removeUser'
  }

  constructor(dispatcher){
    super(dispatcher);

    this.data = Map({});
    this.error = null;
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
    let token = this.dispatcher.getStore(TokenStore).getData();
    if (!token) return null;

    return this.getUser(token.user_id);
  }

  getData(){
    return this.data;
  }

  setData(payload){
    this.error = null;
    this.setUser(payload.id, payload);
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
      data: this.data.toObject(),
      error: this.error
    };
  }

  rehydrate(state){
    this.data = Map(state.data);
    this.error = state.error;
  }
}

export default UserStore;
