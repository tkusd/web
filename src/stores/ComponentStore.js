import BaseStore from './BaseStore';
import {Map} from 'immutable';
import ElementTypes from '../constants/ElementTypes';

const COMPONENTS = {
  [ElementTypes.screen]: {
    hide: true,
    container: true,
    resizable: false
  },

  [ElementTypes.text]: {
    resizable: true,
    attributes: {
      text: {
        type: 'text',
        initialValue: 'Text'
      }
    }
  },

  [ElementTypes.layout]: {
    container: true,
    resizable: true
  },

  [ElementTypes.button]: {
    container: true,
    resizable: true
  },

  [ElementTypes.input]: {
    resizable: true
  },

  [ElementTypes.link]: {
    container: true,
    resizable: true,
    attributes: {
      href: {
        type: 'text'
      }
    }
  },

  [ElementTypes.image]: {
    resizable: true,
    attributes: {
      src: {
        type: 'text'
      }
    }
  },

  [ElementTypes.list]: {
    resizable: true
  }
};

class ComponentStore extends BaseStore {
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
