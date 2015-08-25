import React from 'react';
import {ModalPortal} from '../modal';
import EventModal from './EventModal';
import {FormattedMessage} from '../intl';

if (process.env.BROWSER){
  require('../../styles/Screen/EventItem.styl');
}

class EventItem extends React.Component {
  static propTypes = {
    event: React.PropTypes.object.isRequired,
    action: React.PropTypes.object.isRequired
  }

  render(){
    const {event, action} = this.props;

    let trigger = (
      <li className="event-item">
        <div className="event-item__content">
          <strong className="event-item__event">
            <FormattedMessage message={'event.' + event.get('event')}/>
          </strong>
          <span className="event-item__action">
            <FormattedMessage message={`action.${action.get('action')}.name`}/>
            {action.get('name') && ' - ' + action.get('name')}
          </span>
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
