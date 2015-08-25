import CollectionStore from './CollectionStore';
import Actions from '../constants/Actions';
import Immutable from 'immutable';
import {actions as ElementActionTypes} from '../constants/ElementTypes';

const ACTIONS = Immutable.fromJS({
  [ElementActionTypes.alert]: {
    data: {
      text: {
        type: 'string',
        label: 'Text'
      },
      title: {
        type: 'string',
        label: 'Title'
      }
    }
  },
  [ElementActionTypes.confirm]: {
    data: {
      text: {
        type: 'string',
        label: 'Text'
      },
      title: {
        type: 'string',
        label: 'Title'
      }
    }
  },
  [ElementActionTypes.prompt]: {
    data: {
      text: {
        type: 'string',
        label: 'Text'
      },
      title: {
        type: 'string',
        label: 'Title'
      }
    }
  },
  [ElementActionTypes.transition]: {
    data: {
      screen: {
        type: 'select',
        label: 'Screen',
        values({elements}){
          return elements.filter(item => !item.get('element_id')).map((item, key) => ({
            value: key,
            label: item.get('name')
          })).toArray();
        }
      }
    }
  },
  [ElementActionTypes.back]: {
    name: 'Back',
    description: 'Go back to the previous page.'
  }
});

class ActionStore extends CollectionStore {
  static handlers = {
    setAction: Actions.UPDATE_ACTION,
    setList: Actions.UPDATE_ACTION_LIST,
    deleteAction: Actions.DELETE_ACTION
  }

  constructor(context){
    super(context);

    this.definitions = Immutable.fromJS(ACTIONS);
  }

  getAction(id){
    return this.get(id);
  }

  setAction(payload){
    this.set(payload.id, payload);
  }

  deleteAction(id){
    this.remove(id);
  }

  deleteActionsOfProject(projectID){
    this.data = this.data.filter(item => item.get('project_id') !== projectID);
    this.emitChange();
  }

  getDefinitions(){
    return this.definitions;
  }

  setList(payload){
    this.data = this.data.withMutations(data => {
      payload.forEach(item => data.set(item.id, Immutable.fromJS(item)));
    });

    this.emitChange();
  }

  getActionsOfProject(projectID){
    return this.data.filter(action => action.get('project_id') === projectID);
  }
}

export default ActionStore;
