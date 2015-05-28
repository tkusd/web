import Context from './Context';

class Flux {
  constructor(options={}){
    this.stores = [];
  }

  createContext(){
    return new Context(this);
  }

  registerStore(store){
    this.stores.push(store);
  }

  dehydrate(context){
    return context.dehydrate();
  }

  rehydrate(state){
    let context = this.createContext();
    context.rehydrate(state);
    return context;
  }
}

export default Flux;
