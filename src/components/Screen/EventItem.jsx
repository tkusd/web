import React from 'react';
import {ModalPortal} from '../modal';
import EventModal from './EventModal';
import {FormattedMessage} from '../intl';

if (process.env.BROWSER){
  require('../../styles/Screen/EventItem.styl');
}

class EventItem extends React.Component {
  static propTypes = {
    event: React.PropTypes.object.isRequired
  }

  render(){
    const {event} = this.props;

    let trigger = (
      <li className="event-item">
        <div className="event-item__content">
          <strong className="event-item__event">
            <FormattedMessage message={'event.' + event.get('event')}/>
          </strong>
        </div>
      </li>
    );

    return (
      <ModalPortal trigger={trigger}>
        <EventModal {...this.props}/>
      </ModalPortal>
    );
  }
}

export default EventItem;
