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
    type: ElementTypes.layout,
    container: true,
    resizable: true
  },
  {
    type: ElementTypes.button,
    container: true,
    resizable: true
  },
  {
    type: ElementTypes.input,
    resizable: true
  },
  {
    type: ElementTypes.link,
    resizable: true,
    container: true,
    attributes: {
      href: {
        type: 'text'
      }
    }
  },
  {
    type: ElementTypes.image,
    resizable: true,
    attributes: {
      src: {
        type: 'text'
      }
    }
  },
  {
    type: ElementTypes.list,
    resizable: true
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
