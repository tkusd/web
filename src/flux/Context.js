class Context {
  constructor(flux){
    this.stores = {};
    this.handlers = {};

    flux.stores.forEach(Store => {
      let storeName = Store.storeName || Store.name || Store;
      let store = this.stores[storeName] = new Store(this);

      if (Store.handlers){
        Object.keys(Store.handlers).forEach(key => {
          let handler = store[Store.handlers[key]];

          if (typeof handler !== 'function'){
            throw new TypeError('handler must be a function');
          }

          this.handlers[key] = handler.bind(store);
        });
      }
    });
  }

  dehydrate(){
    let state = {};

    Object.keys(this.stores).forEach(key => {
      let store = this.stores[key];
      if (!store.shouldDehydrate()) return;

      state[key] = store.dehydrate();
    });

    return state;
  }

  rehydrate(state){
    Object.keys(state).forEach(key => {
      this.stores[key].rehydrate(state[key]);
    });
  }

  getStore(store){
    let storeName = store.storeName || store.name || store;
    return this.stores[storeName];
  }

  dispatch(action, ...args){
    if (typeof action !== 'string'){
      throw new TypeError('action must be a string');
    }

    let handler = this.handlers[action];

    if (!handler){
      throw new TypeError('handler not found');
    }

    return handler(...args);
  }

  executeAction(action, ...args){
    if (typeof action !== 'function'){
      throw new TypeError('action must be a function');
    }

    return action(this, ...args);
  }
}

export default Context;
