import React from 'react';
import FontAwesome from '../common/FontAwesome';
import EventItem from './EventItem';
import {ModalPortal} from '../modal';
import NewEventModal from './NewEventModal';

if (process.env.BROWSER){
  require('../../styles/Screen/EventList.styl');
}

class EventList extends React.Component {
  static propTypes = {
    events: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired,
    elements: React.PropTypes.object.isRequired
  }

  render(){
    const {events, actions} = this.props;

    return (
      <div>
        <header className="event-list__header">
          <h4 className="event-list__title">Events</h4>
          {this.renderPortal()}
        </header>
        <ul className="event-list__list">
          {events.map((event, key) => (
            <EventItem {...this.props}
              key={key}
              event={event}
              action={actions.get(event.get('action_id'))}/>
          )).toArray()}
        </ul>
      </div>
    );
  }

  renderPortal(){
    let btn = (
      <button className="event-list__new-btn">
        <FontAwesome icon="plus"/>
      </button>
    );

    return (
      <ModalPortal trigger={btn}>
        <NewEventModal/>
      </ModalPortal>
    );
  }
}

export default EventList;
