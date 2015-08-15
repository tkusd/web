import CollectionStore from './CollectionStore';
import Actions from '../constants/Actions';
import Immutable from 'immutable';

class EventStore extends CollectionStore {
  static handlers = {
    setEvent: Actions.UPDATE_EVENT,
    setList: Actions.UPDATE_EVENT_LIST,
    deleteEvent: Actions.DELETE_EVENT
  }

  getEvent(id){
    return this.get(id);
  }

  setEvent(payload){
    this.set(payload.id, payload);
  }

  deleteEvent(id){
    this.remove(id);
  }

  setList(payload){
    this.data = this.data.withMutations(data => {
      payload.forEach(item => data.set(item.id, Immutable.fromJS(item)));
    });

    this.emitChange();
  }

  getEventsOfElement(elementID){
    return this.data.filter(event => event.get('element_id') === elementID);
  }
}

export default EventStore;
