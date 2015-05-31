import {BaseStore} from '../flux';
import Actions from '../constants/Actions';
import {Map} from 'immutable';

class ProjectStore extends BaseStore {
  static handlers = {
    [Actions.UPDATE_PROJECT_SUCCESS]: 'setData',
    [Actions.UPDATE_PROJECT_LIST]: 'setList'
  }

  constructor(context){
    super(context);

    this.data = Map({});
    this.pagination = Map({});
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

  getData(){
    return this.data;
  }

  setData(payload){
    this.setProject(payload.id, payload);
  }

  getList(id){
    return this.data.filter(item => item.user_id === id);
  }

  setList(payload){
    this.pagination = this.pagination.set(payload.user_id, payload);
    this.data = this.data.withMutations(data => {
      payload.data.forEach(item => data.set(item.id, item));
    });

    this.emitChange();
  }

  getPagination(id){
    return this.pagination.get(id);
  }

  dehydrate(){
    return {
      data: this.data.toObject(),
      pagination: this.pagination.toObject()
    };
  }

  rehydrate(state){
    this.data = Map(state.data);
    this.pagination = Map(state.pagination);
  }
}

export default ProjectStore;
