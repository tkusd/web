import Actions from '../constants/Actions';
import {api, parseJSON, filterError} from '../utils/request';
import {dispatchEvent} from './common';
import qs from 'querystring';
import assign from 'lodash/object/assign';
import omit from 'lodash/object/omit';

export function createElement(payload){
  this.dispatch(Actions.CREATE_ELEMENT, payload);
}

export function createScreen(projectID, payload){
  const {ProjectStore} = this.getStore();
  const project = ProjectStore.getProject(projectID);

  return api(`projects/${projectID}/elements`, {
    method: 'post',
    body: payload
  }, this)
    .then(filterError)
    .then(parseJSON)
    .then(data => {
      this.dispatch(Actions.UPDATE_ELEMENT, data.id, data);

      if (!project.get('main_screen')){
        this.dispatch(Actions.UPDATE_PROJECT, project.set('main_screen', data.id).toJS());
      }

      return data;
    });
}

export function getElement(id){
  return api('elements/' + id, {
    method: 'get'
  }, this)
    .then(filterError)
    .then(parseJSON)
    .then(data => {
      this.dispatch(Actions.UPDATE_ELEMENT, data.id, data);
    });
}

export function getChildElements(id, options){
  options = assign({
    flat: true
  }, options);

  return api(`elements/${id}/elements?${qs.stringify(options)}`, {
    method: 'get'
  }, this)
    .then(filterError)
    .then(parseJSON)
    .then(dispatchEvent(this, Actions.UPDATE_ELEMENT_LIST));
}

export function getFullElement(id, options = {}){
  options = assign({
    flat: true
  }, options);

  return api(`elements/${id}/full?${qs.stringify(options)}`, {
    method: 'get'
  }, this)
    .then(filterError)
    .then(parseJSON)
    .then(data => {
      this.dispatch(Actions.UPDATE_ELEMENT, data.id, omit(data, 'elements', 'events'));
      this.dispatch(Actions.UPDATE_ELEMENT_LIST, data.elements);

      if (data.events){
        this.dispatch(Actions.UPDATE_EVENT_LIST, data.events);
      }

      return data;
    });
}

export function updateElement(id, payload){
  this.dispatch(Actions.UPDATE_ELEMENT, id, payload, true);
}

export function updateElementIndex(id, indexes){
  this.dispatch(Actions.UPDATE_ELEMENT_INDEX, id, indexes);
}

export function deleteElement(id){
  this.dispatch(Actions.DELETE_ELEMENT, id);
}

export function updateElementNow(){
  this.dispatch(Actions.UPDATE_ELEMENT_NOW);
}

export function selectElement(id){
  this.dispatch(Actions.SELECT_ELEMENT, id);
  this.dispatch(Actions.SELECT_ASSET, null);
}

export function deselectElement(){
  this.dispatch(Actions.SELECT_ELEMENT, null);
}

export function pushHoverElement(id){
  this.dispatch(Actions.PUSH_HOVER_ELEMENT, id);
}

export function popHoverElement(id){
  this.dispatch(Actions.POP_HOVER_ELEMENT, id);
}
