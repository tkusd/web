import BaseStore from './BaseStore';
import {Map} from 'immutable';

const COMPONENTS = {
  text: {
    name: 'Text'
  },
  button: {
    name: 'Button'
  }
};

class ComponentStore extends BaseStore {
  static storeName = 'ComponentStore'

  constructor(context){
    super(context);

    let data = {};

    Object.keys(COMPONENTS).forEach(type => {
      data[type] = Map(COMPONENTS[type]).set('type', type);
    });

    this.data = Map(data);
  }

  getData(){
    return this.data;
  }
}

export default ComponentStore;
