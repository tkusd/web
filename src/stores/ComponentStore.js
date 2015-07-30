import BaseStore from './BaseStore';
import {Map} from 'immutable';
import ElementTypes from '../constants/ElementTypes';

const COMPONENTS = [
  {
    type: ElementTypes.screen,
    hidden: true,
    container: true,
    resizable: false
  },
  {
    type: ElementTypes.text,
    resizable: true,
    attributes: {
      text: {
        type: 'text',
        initialValue: 'Text'
      }
    }
  },
  {
    type: ElementTypes.button,
    container: true,
    resizable: true,
    attributes: {
      text: {
        type: 'text',
        initialValue: 'Button'
      },
      icon: {
        type: 'text'
      }
    }
  },
  {
    type: ElementTypes.image,
    resizable: true,
    attributes: {
      src: {
        type: 'text',
        initialValue: 'http://placehold.it/300x300'
      },
      alt: {
        type: 'text',
        initialValue: 'Picture'
      }
    }
  }
];

class ComponentStore extends BaseStore {
  constructor(context){
    super(context);

    this.data = Map().withMutations(data => {
      COMPONENTS.forEach(item => {
        data.set(item.type, Map(item));
      });
    });
  }

  shouldDehydrate(){
    return false;
  }

  get(id){
    return this.data.get(id);
  }

  getList(){
    return this.data;
  }
}

export default ComponentStore;
