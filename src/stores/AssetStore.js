import CollectionStore from './CollectionStore';
import Actions from '../constants/Actions';
import Immutable from 'immutable';

class AssetStore extends CollectionStore {
  static handlers = {
    setAsset: Actions.UPDATE_ASSET,
    setList: Actions.UPDATE_ASSET_LIST,
    deleteAsset: Actions.DELETE_ASSET
  }

  getAsset(id){
    return this.get(id);
  }

  setAsset(payload){
    this.set(payload.id, payload);
  }

  deleteAsset(id){
    this.remove(id);
  }

  setList(payload){
    this.data = this.data.withMutations(data => {
      payload.forEach(item => data.set(item.id, Immutable.fromJS(item)));
    });

    this.emitChange();
  }
}

export default AssetStore;
