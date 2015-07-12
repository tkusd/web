import CollectionStore from './CollectionStore';
import Actions from '../constants/Actions';
import Immutable from 'immutable';

function fromElementObject(key, value){
  if (!key) return value.toMap();

  let isIndexed = Immutable.Iterable.isIndexed(value);
  return isIndexed ? value.toList() : value.toMap();
}

class ElementStore extends CollectionStore {
  static handlers = {
    setElement: Actions.UPDATE_ELEMENT,
    setList: Actions.UPDATE_ELEMENT_LIST,
    deleteElement: Actions.DELETE_ELEMENT
  }

  getElement(id){
    return this.get(id);
  }

  setElement(payload){
    let map = Immutable.fromJS(payload, fromElementObject);
    this.data = this.data.set(payload.id, map);
    this.emitChange();
  }

  deleteElement(id){
    this.data = this.data.withMutations(data => {
      this.deleteChildElement(data, id);
    });

    this.emitChange();
  }

  deleteChildElement(data, id){
    data.remove(id);

    data.filter(item => item.get('element_id') === id)
      .forEach((item, id) => this.deleteChildElement(data, id));
  }

  deleteElementsOfProject(id){
    this.data = this.data.filter(item => item.get('project_id') !== id);
    this.emitChange();
  }

  getElementsOfProject(id){
    return this.data
      .filter(item => item.get('project_id') === id)
      .sort((a, b) => a.get('order_id') - b.get('order_id'));
  }

  setList(payload){
    this.data = this.data.withMutations(data => {
      payload.forEach(item => {
        let map = Immutable.fromJS(item, fromElementObject);
        data.set(item.id, map);
      });
    });

    this.emitChange();
  }

  rehydrate(state){
    this.data = this.data.withMutations(function(data){
      state.data.forEach(item => {
        let map = Immutable.fromJS(item, fromElementObject);
        data.set(item.id, map);
      });
    });
  }
}

export default ElementStore;
