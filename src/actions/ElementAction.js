import Actions from '../constants/Actions';
import {api} from '../utils/request';
import {parseJSON, dispatchEvent, filterError} from './common';

export function createElement(projectID, payload){
  return api(`projects/${projectID}/elements`, {
    method: 'post',
    body: payload
  }, this)
    .then(filterError)
    .then(parseJSON)
    .then(dispatchEvent(this, Actions.UPDATE_ELEMENT));
}

export function updateElement(id, payload){
  //
}

export function deleteElement(id, payload){
  //
}

export function selectElement(id){
  this.dispatch(Actions.SELECT_ELEMENT, id);
}
