import BaseStore from './BaseStore';
import Immutable, {Map} from 'immutable';

class CollectionStore extends BaseStore {
  constructor(context){
    super(context);

    this.data = Map();
  }

  getList(){
    return this.data;
  }

  has(id){
    return this.data.has(id);
  }

  get(id){
    return this.data.get(id);
  }

  set(id, data){
    this.data = this.data.set(id, Immutable.fromJS(data));
    this.emitChange();
  }

  remove(id){
    if (!this.has(id)) return;

    this.data = this.data.remove(id);
    this.emitChange();
  }

  dehydrate(){
    return {
      data: this.data.toArray()
    };
  }

  rehydrate(state){
    this.data = this.data.withMutations(function(data){
      state.data.forEach(item => {
        data.set(item.id, Immutable.fromJS(item));
      });
    });
  }
}

export default CollectionStore;
