import {BaseStore} from '../flux';
import Actions from '../constants/Actions';
import {Map} from 'immutable';

class ProjectStore extends BaseStore {
  static storeName = 'ProjectStore';

  static handlers = {
    [Actions.UPDATE_PROJECT_SUCCESS]: 'setData',
    [Actions.UPDATE_PROJECT_FAILED]: 'setError'
  }

  constructor(context){
    super(context);

    this.data = Map({});
    this.error = null;
  }

  getProject(id){
    return this.data.get(id);
  }

  setProject(id, data){
    let newCollection = this.data.set(id, data);
    if (newCollection === this.data) return;

    this.data = newCollection;
    this.emitChange();
  }

  getProjectOfUser(id){
    return this.data.filter(item => item.user_id === id);
  }

  getData(){
    return this.data;
  }

  setData(payload){
    this.error = null;
    this.setProject(payload.id, payload);
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

export default ProjectStore;
