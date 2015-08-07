import BaseStore from './BaseStore';
import Immutable, {Map} from 'immutable';
import ElementTypes from '../constants/ElementTypes';

const COMPONENTS = [
  {
    type: ElementTypes.screen,
    hidden: true,
    component: true
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
  },
  {
    type: ElementTypes.checkbox,
    attributes: {
      checked: {
        type: 'boolean',
        initialValue: false
      },
      disabled: {
        type: 'boolean',
        initialValue: false
      }
    }
  },
  {
    type: ElementTypes.toggle,
    attributes: {
      checked: {
        type: 'boolean',
        initialValue: false
      },
      disabled: {
        type: 'boolean',
        initialValue: false
      }
    }
  },
  {
    type: ElementTypes.input,
    attributes: {
      type: {
        type: 'text',
        initialValue: 'text'
      },
      placeholder: {
        type: 'text'
      }
    }
  },
  {
    type: ElementTypes.webview
  }
];

class ComponentStore extends BaseStore {
  constructor(context){
    super(context);

    this.data = Map().withMutations(data => {
      COMPONENTS.forEach(item => {
        data.set(item.type, Immutable.fromJS(item));
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
