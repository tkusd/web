import Context from './Context';

class Flux {
  constructor(stores = {}){
    this.stores = stores;
  }

  createContext(){
    return new Context(this);
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
