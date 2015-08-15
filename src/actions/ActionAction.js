import Actions from '../constants/Actions';
import {api, parseJSON, filterError} from '../utils/request';
import {dispatchEvent} from './common';

export function getActionList(projectID){
  return api(`projects/${projectID}/actions`, {
    method: 'get'
  }, this)
    .then(filterError)
    .then(parseJSON)
    .then(dispatchEvent(this, Actions.UPDATE_ACTION_LIST));
}

export function createAction(projectID, payload){
  return api(`projects/${projectID}/actions`, {
    method: 'post',
    body: payload
  }, this)
    .then(filterError)
    .then(parseJSON)
    .then(dispatchEvent(this, Actions.UPDATE_ACTION));
}

export function updateAction(id, payload){
  return api('actions/' + id, {
    method: 'put',
    body: payload
  }, this)
    .then(filterError)
    .then(parseJSON)
    .then(dispatchEvent(this, Actions.UPDATE_ACTION));
}

export function deleteAction(id){
  return api('actions/' + id, {
    method: 'delete'
  }, this)
    .then(filterError)
    .then(() => {
      this.dispatch(Actions.DELETE_ACTION, id);
    });
}
