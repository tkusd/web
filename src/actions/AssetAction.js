import Actions from '../constants/Actions';

export function createAsset(payload){
  this.dispatch(Actions.CREATE_ASSET, payload);
}

export function updateAsset(payload){
  this.dispatch(Actions.UPDATE_ASSET, payload);
}

export function deleteAsset(id){
  this.dispatch(Actions.DELETE_ASSET, id);
}
