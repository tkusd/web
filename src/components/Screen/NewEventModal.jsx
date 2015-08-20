import React from 'react';
import {Modal} from '../modal';
import {FormattedMessage} from '../intl';
import ActionBoard from './ActionBoard';

class NewEventModal extends React.Component {
  static propTypes = {
    event: React.PropTypes.object
  }

  render(){
    const {closeModal, event} = this.props;

    return (
      <Modal title={event ? 'Edit event' : 'New event'} onDismiss={closeModal} full>
        <ActionBoard {...this.props}/>
        <div className="modal__btn-group">
          <button className="modal__btn" onClick={closeModal}>
            <FormattedMessage message="common.cancel"/>
          </button>
          <button className="modal__btn--primary" onClick={this.createEvent}>
            <FormattedMessage message="common.create"/>
          </button>
        </div>
      </Modal>
    );
  }

  createEvent = () => {
    //
  }
}

export default NewEventModal;
