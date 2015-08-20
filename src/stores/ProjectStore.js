import CollectionStore from './CollectionStore';
import Actions from '../constants/Actions';
import Immutable, {Map} from 'immutable';

class ProjectStore extends CollectionStore {
  static handlers = {
    setProject: Actions.UPDATE_PROJECT,
    setList: Actions.UPDATE_PROJECT_LIST,
    deleteProject: Actions.DELETE_PROJECT
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

    const {ElementStore, ActionStore} = this.context.getStore();

    this.remove(id);
    ElementStore.deleteElementsOfProject(id);
    ActionStore.deleteActionsOfProject(id);
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
      payload.data.forEach(item => data.set(item.id, Immutable.fromJS(item)));
    });

    this.emitChange();
  }

  isEditable(id){
    const project = this.getProject(id);
    if (!project) return false;

    const {UserStore} = this.context.getStore();
    const currentUser = UserStore.getCurrentUser();
    if (!currentUser) return false;

    return currentUser.get('id') === project.get('user_id');
  }
}

export default ProjectStore;
