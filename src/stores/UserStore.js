import CollectionStore from './CollectionStore';
import Actions from '../constants/Actions';

class UserStore extends CollectionStore {
  static handlers = {
    setUser: Actions.UPDATE_USER,
    deleteUser: Actions.DELETE_USER
  }

  getUser(id){
    return this.get(id);
  }

  setUser(payload){
    this.set(payload.id, payload);
  }

  deleteUser(id){
    if (!this.has(id)) return;

    const {ProjectStore} = this.context.getStore();

    this.remove(id);
    ProjectStore.deleteProjectsOfUser(id);
  }

  getCurrentUser(){
    const {TokenStore} = this.context.getStore();
    if (!TokenStore.isLoggedIn()) return null;

    return this.getUser(TokenStore.getUserID());
  }
}

export default UserStore;
