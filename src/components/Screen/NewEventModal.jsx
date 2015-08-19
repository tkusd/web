import React from 'react';
import {Modal} from '../modal';

class NewEventModal extends React.Component {
  static propTypes = {
    event: React.PropTypes.object
  }

  render(){
    const {closeModal, event} = this.props;

    return (
      <Modal title={event ? 'Edit event' : 'New event'} onDismiss={closeModal}>
      </Modal>
    );
  }
}

export default NewEventModal;
