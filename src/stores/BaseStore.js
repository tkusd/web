import EventEmitter from 'eventemitter3';

const CHANGE_EVENT = 'change';

class BaseStore extends EventEmitter {
  constructor(context){
    super();

    this.context = context;
    this._hasChanged = false;
  }

  addChangeListener(listener){
    this.on(CHANGE_EVENT, listener);
  }

  removeChangeListener(listener){
    this.off(CHANGE_EVENT, listener);
  }

  shouldDehydrate(){
    return this._hasChanged;
  }

  emitChange(...args){
    this._hasChanged = true;
    this.emit(CHANGE_EVENT, ...args);
  }

  dehydrate(){
    return {};
  }

  rehydrate(){
    //
  }
}

export default BaseStore;
