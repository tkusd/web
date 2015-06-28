import Actions from '../constants/Actions';
import {api} from '../utils/request';
import {parseJSON, dispatchEvent, filterError} from './common';
import {assign} from 'lodash';
import qs from 'querystring';

export function createElement(projectID, payload){
  return api(`projects/${projectID}/elements`, {
    method: 'post',
    body: payload
  }, this)
    .then(filterError)
    .then(parseJSON)
    .then(dispatchEvent(this, Actions.UPDATE_ELEMENT));
}

export function createChildElement(parent, payload){
  return api(`elements/${parent}/elements`, {
    method: 'post',
    body: payload
  }, this)
    .then(filterError)
    .then(parseJSON)
    .then(dispatchEvent(this, Actions.UPDATE_ELEMENT));
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
  return api('elements/' + id, {
    method: 'put',
    body: payload
  }, this)
    .then(filterError)
    .then(parseJSON)
    .then(dispatchEvent(this, Actions.UPDATE_ELEMENT));
}

export function deleteElement(id, payload){
  return api('elements/' + id, {
    method: 'delete',
    body: payload
  }, this)
    .then(filterError)
    .then(() => {
      this.dispatch(Actions.DELETE_ELEMENT, id);
    });
}

export function selectElement(id){
  this.dispatch(Actions.SELECT_ELEMENT, id);
}
