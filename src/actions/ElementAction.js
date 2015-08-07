import Actions from '../constants/Actions';
import {api, parseJSON, filterError} from '../utils/request';
import {dispatchEvent} from './common';
import qs from 'querystring';
import assign from 'lodash/object/assign';

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

export function updateElement(id, payload){
  this.dispatch(Actions.UPDATE_ELEMENT, payload);
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
