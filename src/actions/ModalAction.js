import Actions from '../constants/Actions';

export function openModal(id, modal){
  this.dispatch(Actions.OPEN_MODAL, id, modal);
}

export function closeModal(id){
  this.dispatch(Actions.CLOSE_MODAL, id);
}

export function killModal(id){
  this.dispatch(Actions.KILL_MODAL, id);
}
