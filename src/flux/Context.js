class Context {
  constructor(flux){
    this.stores = {};
    this.handlers = {};

    Object.keys(flux.stores).forEach(storeKey => {
      const Store = flux.stores[storeKey];
      const store = this.stores[storeKey] = new Store(this);

      if (Store.handlers){
        Object.keys(Store.handlers).forEach(handlerKey => {
          const handler = store[Store.handlers[handlerKey]];

          if (typeof handler !== 'function'){
            throw new TypeError(`${storeKey}.${handlerKey} is not a function`);
          }

          this.handlers[handlerKey] = handler.bind(store);
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
      if (this.stores.hasOwnProperty(key)){
        this.stores[key].rehydrate(state[key]);
      }
    });
  }

  getStore(store){
    return this.stores;
  }

  dispatch(action, ...args){
    if (typeof action !== 'string'){
      throw new TypeError('action must be a string');
    }


    const handler = this.handlers[action];

    if (!handler){
      throw new TypeError(`No handlers for the action ${action}`);
    }

    return handler(...args);
  }

  executeAction(action, ...args){
    if (typeof action !== 'function'){
      throw new TypeError('action must be a function');
    }

    return action.apply(this, args);
  }
}

export default Context;
