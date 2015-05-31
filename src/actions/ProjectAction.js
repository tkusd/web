import Actions from '../constants/Actions';
import {api} from '../utils/request';
import {parseJSON, dispatchEvent, filterError} from './common';
import {assign} from 'lodash';

export function getProjectList(context, payload){
  return api(`users/${payload.user_id}/projects`, {
    method: 'get'
  }, context)
    .then(filterError)
    .then(parseJSON)
    .then(data => assign({user_id: payload.user_id}, data))
    .then(dispatchEvent(context, Actions.UPDATE_PROJECT_LIST));
}

export function create(context, payload){
  return api(`users/${payload.user_id}/projects`, {
    method: 'post',
    body: payload
  }, context)
    .then(filterError)
    .then(parseJSON)
    .then(dispatchEvent(context, Actions.UPDATE_PROJECT_SUCCESS));
}
