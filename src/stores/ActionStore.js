import CollectionStore from './CollectionStore';
import Actions from '../constants/Actions';
import Immutable from 'immutable';
import {actions as ElementActionTypes} from '../constants/ElementTypes';

const ACTIONS = Immutable.fromJS({
  [ElementActionTypes.alert]: {
    name: 'Alert',
    description: 'Open an alert modal.',
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
    name: 'Confirm',
    description: `Open a confirm modal. It's used when it is required to confirm some action.`,
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
    name: 'Prompt',
    description: `Open a prompt modal. It's used when it is required to get some data from user.`,
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
    name: 'Transition',
    description: 'Load the specified page.',
    data: {
      screen: {
        type: 'string',
        label: 'Screen ID'
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
