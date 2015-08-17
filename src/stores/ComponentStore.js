import BaseStore from './BaseStore';
import Immutable, {Map} from 'immutable';
import ElementTypes from '../constants/ElementTypes';

const COMPONENTS = [
  {
    type: ElementTypes.screen,
    hidden: true
  },
  {
    type: ElementTypes.navbar
  },
  {
    type: ElementTypes.toolbar
  },
  {
    type: ElementTypes.label
  },
  {
    type: ElementTypes.card
  },
  {
    type: ElementTypes.button
  },
  {
    type: ElementTypes.block
  },
  {
    type: ElementTypes.buttonRow
  },
  {
    type: ElementTypes.list
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
