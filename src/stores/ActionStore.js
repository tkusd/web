import CollectionStore from './CollectionStore';
import Actions from '../constants/Actions';
import Immutable from 'immutable';

class ActionStore extends CollectionStore {
  static handlers = {
    setAction: Actions.UPDATE_ACTION,
    setList: Actions.UPDATE_ACTION_LIST,
    deleteAction: Actions.DELETE_ACTION
  }

  getAction(id){
    return this.get(id);
  }

  setAction(payload){
    this.set(payload.id, payload);
  }

  deleteAction(id){
    this.remove(id);
  }

  setList(payload){
    this.data = this.data.withMutations(data => {
      payload.forEach(item => data.set(item.id, Immutable.fromJS(item)));
    });

    this.emitChange();
  }

  getActionsOfProject(projectID){
    return this.data.filter(action => action.get('project_id') === projectID);
  }
}

export default ActionStore;
