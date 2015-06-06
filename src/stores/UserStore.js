import CollectionStore from './CollectionStore';
import Actions from '../constants/Actions';
import TokenStore from './TokenStore';
import ProjectStore from './ProjectStore';

class UserStore extends CollectionStore {
  static storeName = 'UserStore'

  static handlers = {
    [Actions.UPDATE_USER]: 'setUser',
    [Actions.DELETE_USER]: 'deleteUser'
  }

  getUser(id){
    return this.get(id);
  }

  setUser(payload){
    this.set(payload.id, payload);
  }

  deleteUser(id){
    if (!this.has(id)) return;

    const projectStore = this.context.getStore(ProjectStore);

    this.remove(id);
    projectStore.deleteProjectsOfUser(id);
  }

  getCurrentUser(){
    const tokenStore = this.context.getStore(TokenStore);
    if (!tokenStore.isLoggedIn()) return null;

    return this.getUser(tokenStore.getUserID());
  }
}

export default UserStore;
