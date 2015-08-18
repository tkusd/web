import CollectionStore from './CollectionStore';
import Actions from '../constants/Actions';
import Immutable, {OrderedSet} from 'immutable';
import uuid from 'node-uuid';
import omit from 'lodash/object/omit';
import {api, parseJSON, filterError} from '../utils/request';
import throttle from 'lodash/function/throttle';

const THROTTLE_DELAY = 5000;

class ElementStore extends CollectionStore {
  static handlers = {
    createElement: Actions.CREATE_ELEMENT,
    updateElement: Actions.UPDATE_ELEMENT,
    setList: Actions.UPDATE_ELEMENT_LIST,
    deleteElement: Actions.DELETE_ELEMENT,
    selectElement: Actions.SELECT_ELEMENT,
    pushHoverElement: Actions.PUSH_HOVER_ELEMENT,
    popHoverElement: Actions.POP_HOVER_ELEMENT
  }

  constructor(context){
    super(context);

    this.promise = Promise.resolve();
    this.queue = OrderedSet();
    this.currentTask = null;
    this.selectedElement = null;
    this.hoverElements = OrderedSet();
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
    let map = Immutable.fromJS(payload);

    if (!map.has('id')) {
      // Create a random UUID for client
      map = map.set('id', uuid.v4());
    }

    if (!payload.index){
      const lastIndex = this.data
        .filter(element => element.get('id') === payload.element_id)
        .sort((a, b) => a.get('index') - b.get('index'))
        .last()
        .get('index');

      map = map.set('index', lastIndex + 1);
    }

    map = map.set('$created', false);

    this.set(map.get('id'), map);
    this.pushQueue(map.get('id'));
  }

  updateElement(payload){
    let map = Immutable.fromJS(payload);

    map = map.set('$created', true);

    this.set(map.get('id'), map);
    this.pushQueue(map.get('id'));
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
    const {EventStore} = this.context.getStore();

    this.data = this.data.withMutations(data => {
      payload.forEach(item => {
        item.$created = true;
        data.set(item.id, Immutable.fromJS(omit(item, 'events')));

        if (item.events){
          EventStore.setList(item.events);
        }
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

    this.queue = this.queue.add(id);

    if (queueEmpty && !this.currentTask){
      this.throttleEnqueue();
    }
  }

  enqueue() {
    let id = this.queue.first();
    this.queue = this.queue.remove(id);

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
          this.queue = this.queue.add(id);
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

        id = data.id;
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

  throttleEnqueue = throttle(this.enqueue.bind(this), THROTTLE_DELAY)

  getHoverElements(){
    return this.hoverElements;
  }

  pushHoverElement(id){
    this.hoverElements = this.hoverElements.add(id);
    this.emitChange();
  }

  popHoverElement(id){
    this.hoverElements = this.hoverElements.remove(id);
    this.emitChange();
  }
}

export default ElementStore;
