import CollectionStore from './CollectionStore';
import Actions from '../constants/Actions';
import {Map} from 'immutable';

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
    this.set(payload.id, payload);
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
        data.set(item.id, Map(item));
      });
    });

    this.emitChange();
  }
}

export default ElementStore;
