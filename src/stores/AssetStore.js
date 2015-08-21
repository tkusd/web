import CollectionStore from './CollectionStore';
import Actions from '../constants/Actions';
import Immutable, {OrderedSet} from 'immutable';
import uuid from 'node-uuid';
import {api, parseJSON, filterError} from '../utils/request';

function getAssetBody(asset){
  let form = new FormData();

  if (asset.get('name')){
    form.append('name', asset.get('name'));
  }

  if (asset.get('description')){
    form.append('description', asset.get('description'));
  }

  if (asset.get('data')){
    form.append('data', asset.get('data'));
  }

  return form;
}

class AssetStore extends CollectionStore {
  static handlers = {
    createAsset: Actions.CREATE_ASSET,
    updateAsset: Actions.UPDATE_ASSET,
    setList: Actions.UPDATE_ASSET_LIST,
    deleteAsset: Actions.DELETE_ASSET
  }

  constructor(props, context){
    super(props, context);

    this.promise = Promise.resolve();
    this.queue = OrderedSet();
    this.currentTask = null;
  }

  getAsset(id){
    return this.get(id);
  }

  createAsset(payload){
    if (!payload.id){
      payload.id = '_' + uuid.v4();
    }

    this.set(payload.id, payload);
    this.pushQueue(payload.id);
  }

  updateAsset(payload){
    this.set(payload.id, payload);
    this.pushQueue(payload.id);
  }

  deleteAsset(id){
    this.queue = this.queue.remove(id);
    this.remove(id);

    if (id[0] !== '_'){
      api(`assets/${id}`, {
        method: 'delete'
      });
    }
  }

  setList(payload){
    this.data = this.data.withMutations(data => {
      payload.forEach(item => data.set(item.id, Immutable.fromJS(item)));
    });

    this.emitChange();
  }

  getAssetsOfProject(projectID){
    return this.data.filter(item => item.get('project_id') === projectID);
  }

  deleteAssetsOfProject(projectID){
    this.data = this.data.filter(item => item.get('project_id') !== projectID);
    this.emitChange();
  }

  hasUnsavedChanges(){
    if (this.currentTask) return true;
    return this.queue.count() > 0;
  }

  isSavingChanges(){
    return this.currentTask != null;
  }

  pushQueue(id){
    if (this.hasUnsavedChanges()){
      this.queue = this.queue.add(id);
    } else {
      this.queue = this.queue.add(id);
      this.enqueue();
    }

    this.emitChange();
  }

  enqueue(){
    let id = this.queue.first();
    if (!id) return;

    this.queue = this.queue.remove(id);

    if (this.currentTask === id) return;

    // Skip if the element does not exist
    if (!this.has(id)) return;

    this.promise = this.promise.then(() => {
      this.currentTask = id;
      this.emitChange();

      let asset = this.get(id);

      // Update the current asset
      if (id[0] !== '_'){
        return api(`assets/${id}`, {
          method: 'put',
          body: getAssetBody(asset)
        }, this.context)
          .then(filterError)
          .then(parseJSON)
          .then(data => {
            this.set(id, data);
          });
      }

      return api(`projects/${asset.get('project_id')}/assets`, {
        method: 'post',
        body: getAssetBody(asset)
      }, this.context)
        .then(filterError)
        .then(parseJSON)
        .then(data => {
          this.data = this.data.remove(id).set(data.id, Immutable.fromJS(data));
          id = data.id;
        });
    }).catch(err => {
      console.error(err);
    }).then(() => {
      this.currentTask = null;
      this.emitChange();

      if (this.hasUnsavedChanges()){
        this.enqueue();
      }
    });
  }
}

export default AssetStore;
