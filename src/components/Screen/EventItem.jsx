import React from 'react';
import {ModalPortal} from '../modal';
import EventModal from './EventModal';
import {FormattedMessage} from '../intl';
import FontAwesome from '../common/FontAwesome';

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
          <FontAwesome icon="bolt"/>
          <FormattedMessage message={'event.' + event.get('event')}/>
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
