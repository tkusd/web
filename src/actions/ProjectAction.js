import Actions from '../constants/Actions';
import {api} from '../utils/request';

export function getProjectsOfUser(context, payload, done){
  api('get', `users/${payload.id}/projects`, context).end((err, {body}) => {
    if (err){
      context.dispatch(Actions.UPDATE_PROJECT_FAILED, body);
    } else {
      context.dispatch(Actions.UPDATE_PROJECT_SUCCESS, body);
    }

    done();
  });
}

export function get(context, payload, done){
  //
}

export function create(context, payload, done){
  //
}

export function update(context, payload, done){
  //
}

export function destroy(context, payload, done){
  //
}
