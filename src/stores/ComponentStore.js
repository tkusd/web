import BaseStore from './BaseStore';
import {Map} from 'immutable';
import ElementTypes from '../constants/ElementTypes';

const COMPONENTS = {
  [ElementTypes.screen]: {
    hide: true,
    container: true
  },

  [ElementTypes.text]: {
    attributes: {
      text: {
        type: 'text',
        initialValue: 'Text'
      }
    }
  },

  [ElementTypes.layout]: {
    container: true
  },

  [ElementTypes.button]: {
    container: true
  },

  [ElementTypes.input]: {
    attributes: {
      type: {
        label: 'Type',
        type: 'text'
      }
    }
  },

  [ElementTypes.link]: {
    container: true
  },

  [ElementTypes.image]: {
  },

  [ElementTypes.list]: {
  }
};

class ComponentStore extends BaseStore {
  static storeName = 'ComponentStore'

  constructor(context){
    super(context);

    let data = {};

    Object.keys(COMPONENTS).forEach(type => {
      data[type] = Map(COMPONENTS[type])
        .set('type', type);
    });

    this.data = Map(data);
  }

  get(id){
    return this.data.get(id);
  }

  getList(){
    return this.data;
  }
}

export default ComponentStore;
