import Actions from '../constants/Actions';

export function createAsset(payload){
  this.dispatch(Actions.CREATE_ASSET, payload);
}

export function updateAsset(id, payload){
  this.dispatch(Actions.UPDATE_ASSET, id, payload);
}

export function deleteAsset(id){
  this.dispatch(Actions.DELETE_ASSET, id);
}

export function selectAsset(id){
  this.dispatch(Actions.SELECT_ASSET, id);
}
