import React from 'react';
import {Modal} from '../modal';

class NewEventModal extends React.Component {
  render(){
    const {closeModal} = this.props;

    return (
      <Modal title="New event" onDismiss={closeModal}>
      </Modal>
    );
  }
}

export default NewEventModal;
