import CollectionStore from './CollectionStore';
import Actions from '../constants/Actions';
import {Map, Set} from 'immutable';

class ElementStore extends CollectionStore {
  static storeName = 'ElementStore'

  static handlers = {
    [Actions.UPDATE_ELEMENT]: 'setElement',
    [Actions.UPDATE_ELEMENT_LIST]: 'setList',
    [Actions.DELETE_ELEMENT]: 'deleteElement',
    [Actions.SELECT_ELEMENT]: 'selectElement'
  }

  constructor(context){
    super(context);

    this.selectedElement = null;
  }

  getElement(id){
    return this.get(id);
  }

  setElement(payload){
    this.set(payload.id, payload);
    this.emitChange();
  }

  deleteElement(id){
    this.remove(id);
    // TODO: Remove all child elements
  }

  deleteElementsOfProject(id){
    this.data = this.data.filter(item => item.get('project_id') !== id);
    this.emitChange();
  }

  getElementsOfProject(id){
    return this.data.filter(item => item.get('project_id') === id);
  }

  setList(payload){
    this.data = this.data.withMutations(data => {
      this.setElementTree(data, payload);
    });

    this.emitChange();
  }

  setElementTree(data, elements){
    elements.forEach(item => {
      let id = item.id;
      let map = Map(item);
      /*
      let children = Set(data.elements.map(child => {
        if (child.elements){
          this.setElementTree(data, child.elements);
        }

        return child.id;
      }));

      map = map.set('elements', children);*/

      data.set(id, map);
    });
  }

  getSelectedElement(){
    return this.selectedElement;
  }

  selectElement(id){
    this.selectedElement = id;
    this.emitChange();
  }
}

export default ElementStore;
