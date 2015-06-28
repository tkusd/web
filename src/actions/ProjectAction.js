import Actions from '../constants/Actions';
import {api} from '../utils/request';
import {parseJSON, dispatchEvent, filterError} from './common';
import {assign, omit} from 'lodash';
import qs from 'querystring';

export function getProjectList(userID, options){
  options = assign({
    order: '-created_at',
    limit: 30,
    offset: 0
  }, options);

  return api(`users/${userID}/projects?${qs.stringify(options)}`, {
    method: 'get'
  }, this)
    .then(filterError)
    .then(parseJSON)
    .then(data => assign({user_id: userID}, data))
    .then(dispatchEvent(this, Actions.UPDATE_PROJECT_LIST));
}

export function createProject(userID, payload){
  return api(`users/${userID}/projects`, {
    method: 'post',
    body: payload
  }, this)
    .then(filterError)
    .then(parseJSON)
    .then(dispatchEvent(this, Actions.UPDATE_PROJECT));
}

export function getProject(id){
  return api('projects/' + id, {
    method: 'get'
  }, this)
    .then(filterError)
    .then(parseJSON)
    .then(dispatchEvent(this, Actions.UPDATE_PROJECT));
}

export function getFullProject(id, options){
  options = assign({
    flat: true
  }, options);

  return api(`projects/${id}/full?${qs.stringify(options)}`, {
    method: 'get'
  }, this)
    .then(filterError)
    .then(parseJSON)
    .then(data => {
      this.dispatch(Actions.UPDATE_PROJECT, omit(data, 'elements'));
      this.dispatch(Actions.UPDATE_ELEMENT_LIST, data.elements);
      return data;
    });
}

export function updateProject(id, payload){
  return api('projects/' + id, {
    method: 'put',
    body: payload
  }, this)
    .then(filterError)
    .then(parseJSON)
    .then(dispatchEvent(this, Actions.UPDATE_PROJECT));
}

export function deleteProject(id){
  return api('projects/' + id, {
    method: 'delete'
  }, this)
    .then(filterError)
    .then(() => {
      this.dispatch(Actions.DELETE_PROJECT, id);
    });
}
