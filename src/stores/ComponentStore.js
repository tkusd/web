import BaseStore from './BaseStore';
import {Map} from 'immutable';
import ElementTypes from '../constants/ElementTypes';

const COMPONENTS = {
  [ElementTypes.screen]: {
    // name: 'Screen',
    hide: true,
    container: true,
    styles: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      margin: 'auto',
      width: 360,
      height: 640,
      background: '#fff'
    }
  },

  [ElementTypes.text]: {
    // name: 'Text'
  },

  [ElementTypes.layout]: {
    // name: 'Layout',
    container: true
  },

  [ElementTypes.button]: {
    // name: 'Button',
    container: true
  },

  [ElementTypes.input]: {
    // name: 'Input'
  },

  [ElementTypes.link]: {
    // name: 'Link',
    container: true
  },

  [ElementTypes.image]: {
    // name: 'Image'
  },

  [ElementTypes.list]: {
    // name: 'List'
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
