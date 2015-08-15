import Actions from '../constants/Actions';
import {api, parseJSON, filterError} from '../utils/request';
import {dispatchEvent} from './common';
import assign from 'lodash/object/assign';
import omit from 'lodash/object/omit';
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

export function getFullProject(id, options = {}){
  options = assign({
    flat: true
  }, options);

  return api(`projects/${id}/full?${qs.stringify(options)}`, {
    method: 'get'
  }, this)
    .then(filterError)
    .then(parseJSON)
    .then(data => {
      this.dispatch(Actions.UPDATE_PROJECT, omit(data, 'elements', 'actions', 'assets'));
      this.dispatch(Actions.UPDATE_ELEMENT_LIST, data.elements);
      this.dispatch(Actions.UPDATE_ACTION_LIST, data.actions);
      this.dispatch(Actions.UPDATE_ASSET_LIST, data.assets);
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
