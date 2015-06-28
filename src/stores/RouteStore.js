import BaseStore from './BaseStore';

class RouteStore extends BaseStore {
  constructor(context){
    super(context);

    this.state = {};
  }

  getState(){
    return this.state;
  }

  setState(state){
    this.state = state;
    this.emitChange();
  }

  getPath(){
    return this.state.path;
  }

  getParams(){
    return this.state.params;
  }

  getQuery(){
    return this.state.query;
  }

  shouldDehydrate(){
    return false;
  }
}

export default RouteStore;
