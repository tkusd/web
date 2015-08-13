import CollectionStore from './CollectionStore';
import Actions from '../constants/Actions';
import Immutable, {List} from 'immutable';
import uuid from 'node-uuid';
import {api, parseJSON, filterError} from '../utils/request';

class ElementStore extends CollectionStore {
  static handlers = {
    createElement: Actions.CREATE_ELEMENT,
    updateElement: Actions.UPDATE_ELEMENT,
    setList: Actions.UPDATE_ELEMENT_LIST,
    deleteElement: Actions.DELETE_ELEMENT,
    selectElement: Actions.SELECT_ELEMENT
  }

  constructor(context){
    super(context);

    this.promise = Promise.resolve();
    this.queue = List();
    this.currentTask = null;
    this.selectedElement = null;
  }

  getSelectedElement(){
    return this.selectedElement;
  }

  selectElement(id){
    this.selectedElement = id;
    this.emitChange();
  }

  getElement(id){
    return this.get(id);
  }

  createElement(payload){
    if (!payload.id) {
      // Create a random UUID for client
      payload.id = uuid.v4();
    }

    payload.$created = false;
    this.set(payload.id, payload);
    this.pushQueue(payload.id);
  }

  updateElement(payload){
    payload.$created = true;
    this.set(payload.id, payload);
    this.pushQueue(payload.id);
  }

  deleteElement(id){
    const element = this.get(id);

    if (this.selectedElement === id){
      this.selectedElement = element.get('element_id');
    }

    this.queue = this.queue.remove(id);

    this.data = this.data.withMutations(data => {
      data.remove(id);
      this.deleteChildElement(data, id);
    });

    this.emitChange();

    api(`elements/${id}`, {
      method: 'delete'
    }, this.context);
  }

  deleteChildElement(data, id){
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
      .sort((a, b) => a.get('index') - b.get('index'));
  }

  setList(payload){
    this.data = this.data.withMutations(data => {
      payload.forEach(item => {
        item.$created = true;
        data.set(item.id, Immutable.fromJS(item));
      });
    });

    this.emitChange();
  }

  isQueueEmpty(){
    return !this.queue.count();
  }

  pushQueue(id){
    if (this.queue.has(id)) return;

    let queueEmpty = this.isQueueEmpty();

    this.queue.push(id);

    if (queueEmpty && !this.currentTask){
      this.enqueue();
    }
  }

  enqueue() {
    const id = this.queue.first();
    this.queue = this.queue.shift();

    if (!this.has(id)) return;

    this.promise = this.promise.then(() => {
      // Skip if the element does not exist
      this.currentTask = id;

      let element = this.get(id);
      this.data = this.data.set(id, element.set('$progress', true));

      // Update the current element
      if (element.get('$created')){
        return api(`elements/${id}`, {
          method: 'put',
          body: element.toJS()
        }, this.context)
        .then(filterError)
        .then(parseJSON)
        .then(data => {
          this.set(data.id, Immutable.fromJS(data));
        });
      }

      let parentID = element.get('element_id');
      let endpoint = '';

      if (parentID){
        // Do nothing if the parent element does not exist
        if (!this.has(parentID)) return;

        let parentElement = this.get(parentID);

        // Push the current element to the queue if the parent element has not
        // been created yet
        if (!parentElement.get('$created')) {
          this.queue = this.queue.push(id);
          return;
        }

        endpoint = `elements/${parentID}/elements`;
      } else {
        let projectID = element.get('project_id');
        endpoint = `projects/${projectID}/elements`;
      }

      return api(endpoint, {
        method: 'post',
        body: element.toJS()
      }, this.context)
      .then(filterError)
      .then(parseJSON)
      .then(data => {
        this.data = this.data.withMutations(map => {
          map.remove(id);
          map.set(data.id, Immutable.fromJS(data));
        }).map(item => {
          if (item.get('element_id') !== id) return item;
          return item.set('element_id', data.id);
        });

        if (this.selectedElement === id){
          this.selectedElement = data.id;
        }

        this.emitChange();
      });
    }).catch(err => {
      console.error(err);
      this.set(id, this.get(id).set('$error', err));
    }).then(() => {
      this.set(id, this.get(id).set('$progress', false));
      this.currentTask = null;
      if (!this.isQueueEmpty()) this.enqueue();
    });
  }
}

export default ElementStore;
