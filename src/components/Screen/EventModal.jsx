import React from 'react';
import {Modal} from '../modal';
import {FormattedMessage} from '../intl';
import ActionBoard from './ActionBoard';
import Select from 'react-select';
import bindActions from '../../utils/bindActions';
import * as EventAction from '../../actions/EventAction';

if (process.env.BROWSER){
  require('../../styles/Screen/EventModal.styl');
  require('react-select/less/default.less');
}

class EventModal extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired
  }

  static propTypes = {
    event: React.PropTypes.object,
    component: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired,
    actionDefinitions: React.PropTypes.object.isRequired
  }

  constructor(props, context){
    super(props, context);

    const {event} = this.props;

    this.state = {
      eventValue: event && event.get('event'),
      actionValue: event && event.get('action_id')
    };
  }

  render(){
    const {closeModal, event} = this.props;
    const {actionValue} = this.state;

    return (
      <Modal title={event ? 'Edit event' : 'New event'} onDismiss={closeModal} full>
        <div className="event-modal__select-wrap">
          {this.renderEventSelector()}
          {this.renderActionSelector()}
        </div>
        <div className="event-modal__action-board">
          <ActionBoard {...this.props} actionID={actionValue}/>
        </div>
        <div className="modal__btn-group">
          <button className="modal__btn" onClick={closeModal}>
            <FormattedMessage message="common.cancel"/>
          </button>
          <button className="modal__btn--primary" onClick={event ? this.updateEvent : this.createEvent}>
            <FormattedMessage message={event ? 'common.update' : 'common.create'}/>
          </button>
        </div>
      </Modal>
    );
  }

  renderEventSelector(){
    const {component} = this.props;
    const {eventValue} = this.state;

    let options = component.get('availableEventTypes').map(event => ({
      value: event,
      label: event
    })).toArray();

    return (
      <div className="event-modal__select">
        <label className="event-modal__select-label">Event</label>
        <Select value={eventValue}
          options={options}
          onChange={this.handleSelectChange.bind(this, 'eventValue')}/>
      </div>
    );
  }

  renderActionSelector(){
    const {actions, actionDefinitions} = this.props;
    const {actionValue} = this.state;

    let options = actions
      .filter(action => !action.get('action_id'))
      .map((action, key) => {
        const definition = actionDefinitions.get(action.get('action'));

        return {
          value: key,
          label: definition.get('name') + (action.get('name') ? ' - ' + action.get('name') : '')
        };
      })
      .toArray();

    return (
      <div className="event-modal__select">
        <label className="event-modal__select-label">Action</label>
        <Select value={actionValue}
          options={options}
          onChange={this.handleSelectChange.bind(this, 'actionValue')}
          placeholder="New action..."/>
      </div>
    );
  }

  handleSelectChange(field, value){
    this.setState({
      [field]: value
    });
  }

  createEvent = () => {
    const {element, closeModal} = this.props;
    const {eventValue, actionValue} = this.state;
    const {createEvent} = bindActions(EventAction, this.context.flux);

    if (!eventValue || !actionValue) return;

    createEvent(element.get('id'), {
      event: eventValue,
      action_id: actionValue
    }).then(() => {
      closeModal();
    });
  }

  updateEvent = () => {
  }
}

export default EventModal;
