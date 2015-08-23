import CollectionStore from './CollectionStore';
import Actions from '../constants/Actions';
import Immutable, {List, OrderedSet} from 'immutable';
import uuid from 'node-uuid';
import omit from 'lodash/object/omit';
import {api, parseJSON, filterError} from '../utils/request';
import debounce from 'lodash/function/debounce';

const DEBOUNCE_DELAY = 5000;

function sortByIndex(a, b){
  return a.get('index') - b.get('index');
}

function getElementBody(element){
  let body = {
    is_visible: element.get('is_visible', true),
    name: element.get('name'),
    type: element.get('type')
  };

  if (element.get('styles')){
    body.styles = element.get('styles').toJS();
  }

  if (element.get('attributes')){
    body.attributes = element.get('attributes').toJS();
  }

  if (element.get('elements')){
    body.elements = element.get('elements').toJS();
  }

  return body;
}

class ElementStore extends CollectionStore {
  static handlers = {
    createElement: Actions.CREATE_ELEMENT,
    updateElement: Actions.UPDATE_ELEMENT,
    setList: Actions.UPDATE_ELEMENT_LIST,
    deleteElement: Actions.DELETE_ELEMENT,
    selectElement: Actions.SELECT_ELEMENT,
    pushHoverElement: Actions.PUSH_HOVER_ELEMENT,
    popHoverElement: Actions.POP_HOVER_ELEMENT,
    updateElementNow: Actions.UPDATE_ELEMENT_NOW,
    updateElementIndex: Actions.UPDATE_ELEMENT_INDEX
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
    if (!payload.id){
      payload.id = '_' + uuid.v4();
    }

    if (!payload.index){
      const lastSibling = this.getChildElements(payload.element_id)
        .sort(sortByIndex)
        .last();

      const lastIndex = lastSibling ? lastSibling.get('index') : 0;
      payload.index = lastIndex + 1;
    }

    this.set(payload.id, payload);
    this.pushQueue(payload.id);
  }

  updateElement(id, payload, async){
    this.set(id, payload);
    if (async) this.pushQueue(id);
  }

  deleteElement(id){
    const element = this.get(id);
    const {EventStore} = this.context.getStore();

    if (this.selectedElement === id){
      this.selectedElement = element.get('element_id');
    }

    this.queue = this.queue.remove(id);

    this.data = this.data.withMutations(data => {
      data.remove(id);
      EventStore.deleteEventsOfElement(id);
      this.deleteChildElement(data, id);
    });

    this.emitChange();

    if (id[0] !== '_'){
      api(`elements/${id}`, {
        method: 'delete'
      }, this.context);
    }
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
      .sort(sortByIndex);
  }

  getChildElements(id){
    return this.data
      .filter(item => item.get('element_id') === id)
      .sort(sortByIndex);
  }

  setList(payload){
    const {EventStore} = this.context.getStore();

    this.data = this.data.withMutations(data => {
      payload.forEach(item => {
        data.set(item.id, Immutable.fromJS(omit(item, 'events')));

        if (item.events){
          EventStore.setList(item.events);
        }
      });
    });

    this.emitChange();
  }

  hasUnsavedChanges(){
    if (this.currentTask) return true;
    return this.queue.count() > 0;
  }

  isSavingChanges(){
    return this.currentTask != null;
  }

  pushQueue(id){
    if (this.hasUnsavedChanges()){
      this.queue = this.queue.add(id);
    } else {
      this.queue = this.queue.add(id);
      this.debounceEnqueue();
    }

    this.emitChange();
  }

  enqueue() {
    let id = this.queue.first();
    if (!id) return;

    this.queue = this.queue.remove(id);

    if (this.currentTask === id) return;

    // Skip if the element does not exist
    if (!this.has(id)) return;

    this.promise = this.promise.then(() => {
      this.currentTask = id;
      this.emitChange();

      let element = this.get(id);

      // Update the current element
      if (id[0] !== '_'){
        return api(`elements/${id}`, {
          method: 'put',
          body: getElementBody(element)
        }, this.context)
          .then(filterError)
          .then(parseJSON)
          .then(data => {
            this.set(id, Immutable.fromJS(data));
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
        if (!parentElement.get('id')[0] === '_') {
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
        body: getElementBody(element)
      }, this.context)
        .then(filterError)
        .then(parseJSON)
        .then(data => {
          this.data = this.data.withMutations(map => {
            map.remove(id);
            map.set(data.id, Immutable.fromJS(data));
          }).map(item => {
            let newItem = item;

            // Replace element_id of child elements
            if (item.get('element_id') === id){
              newItem = newItem.set('element_id', data.id);
            }

            // Replace id in elements
            if (item.get('elements')){
              const elements = item.get('elements');
              let index = elements.indexOf(id);

              if (~index){
                newItem = newItem.set('elements', elements.set(index, data.id));
              }
            }

            return newItem;
          });

          if (this.selectedElement === id){
            this.selectedElement = data.id;
          }

          id = data.id;
        });
    }).catch(err => {
      console.error(err);
    }).then(() => {
      this.currentTask = null;
      this.emitChange();

      if (this.hasUnsavedChanges()){
        this.enqueue();
      }
    });
  }

  debounceEnqueue = debounce(this.enqueue.bind(this), DEBOUNCE_DELAY, {
    leading: false
  })

  updateElementNow(){
    if (!this.isSavingChanges()) this.enqueue();
  }

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

  updateElementIndex(id, indexes){
    this.data = this.data.withMutations(map => {
      map.set(id, map.get(id).set('elements', List(indexes)));

      indexes.forEach((item, i) => {
        map.set(item, map.get(item).set('index', i + 1));
      });
    });

    this.pushQueue(id);
  }
}

export default ElementStore;
