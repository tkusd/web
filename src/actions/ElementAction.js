import Actions from '../constants/Actions';
import {api, parseJSON, filterError} from '../utils/request';
import {dispatchEvent} from './common';
import qs from 'querystring';
import assign from 'lodash/object/assign';
import omit from 'lodash/object/omit';

export function createElement(payload){
  this.dispatch(Actions.CREATE_ELEMENT, payload);
}

export function getElement(id){
  return api('elements/' + id, {
    method: 'get'
  }, this)
    .then(filterError)
    .then(parseJSON)
    .then(dispatchEvent(this, Actions.UPDATE_ELEMENT));
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
      this.dispatch(Actions.UPDATE_ELEMENT, omit(data, 'elements'));
      this.dispatch(Actions.UPDATE_ELEMENT_LIST, data.elements);

      return data;
    });
}

export function updateElement(id, payload){
  this.dispatch(Actions.UPDATE_ELEMENT, id, payload);
}

export function deleteElement(id){
  this.dispatch(Actions.DELETE_ELEMENT, id);
}

export function selectElement(id){
  this.dispatch(Actions.SELECT_ELEMENT, id);
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
