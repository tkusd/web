class Flux {
  constructor(stores = {}, state){
    this.stores = {};
    this.handlers = {};

    Object.keys(stores).forEach(storeKey => {
      const Store = stores[storeKey];
      const store = this.stores[storeKey] = new Store(this);

      if (Store.handlers){
        Object.keys(Store.handlers).forEach(handlerKey => {
          const handler = store[handlerKey];

          if (typeof handler !== 'function'){
            throw new TypeError(`${storeKey}.${handlerKey} is not a function`);
          }

          this.handlers[Store.handlers[handlerKey]] = handler.bind(store);
        });
      }
    });

    if (state){
      this.rehydrate(state);
    }
  }

  dehydrate(){
    let state = {};

    Object.keys(this.stores).forEach(key => {
      const store = this.stores[key];
      if (typeof store.dehydrate !== 'function') return;
      if (typeof store.shouldDehydrate === 'function' && !store.shouldDehydrate()) return;

      state[key] = store.dehydrate();
    });

    return state;
  }

  rehydrate(state){
    Object.keys(state).forEach(key => {
      const store = this.stores[key];
      if (!store) return;

      if (typeof store.rehydrate === 'function'){
        this.stores[key].rehydrate(state[key]);
      }
    });
  }

  dispatch(action, ...args){
    const handler = this.handlers[action];

    if (!handler){
      throw new TypeError(`No handlers for the action ${action}`);
    }

    return handler(...args);
  }

  getStore(){
    return this.stores;
  }
}

export default Flux;
