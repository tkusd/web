import CollectionStore from './CollectionStore';
import Actions from '../constants/Actions';
import {Map} from 'immutable';
import ElementStore from './ElementStore';

class ProjectStore extends CollectionStore {
  static handlers = {
    [Actions.UPDATE_PROJECT]: 'setProject',
    [Actions.UPDATE_PROJECT_LIST]: 'setList',
    [Actions.DELETE_PROJECT]: 'deleteProject'
  }

  constructor(context){
    super(context);

    this.pagination = Map();
  }

  getProject(id){
    return this.get(id);
  }

  setProject(payload){
    this.set(payload.id, payload);
  }

  deleteProject(id){
    if (!this.has(id)) return;

    const elementStore = this.context.getStore(ElementStore);

    this.remove(id);
    elementStore.deleteElementsOfProject(id);
  }

  deleteProjectsOfUser(id){
    this.data = this.data.filter(item => item.get('user_id') !== id);
    this.emitChange();
  }

  getList(id){
    return this.data.filter(item => item.get('user_id') === id);
  }

  setList(payload){
    this.pagination = this.pagination.set(payload.user_id, payload);
    this.data = this.data.withMutations(data => {
      payload.data.forEach(item => data.set(item.id, Map(item)));
    });

    this.emitChange();
  }
}

export default ProjectStore;
