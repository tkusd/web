import BaseStore from './BaseStore';
import Actions from '../constants/Actions';
import {OrderedMap} from 'immutable';

class ModalStore extends BaseStore {
  static handlers = {
    openModal: Actions.OPEN_MODAL,
    closeModal: Actions.CLOSE_MODAL,
    killModal: Actions.KILL_MODAL
  }

  constructor(context){
    super(context);

    this.list = OrderedMap();
  }

  getList(){
    return this.list;
  }

  openModal(id, modal){
    this.list = this.list.set(id, modal);
    this.emitChange();
  }

  closeModal(id){
    this.list = this.list.remove(id);
    this.emitChange();
  }

  killModal(id){
    //
  }

  shouldDehydrate(){
    return false;
  }
}

export default ModalStore;
