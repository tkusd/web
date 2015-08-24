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
      actionValue: event && event.get('action_id'),
      isSaving: false
    };
  }

  render(){
    const {closeModal, event} = this.props;
    const {actionValue} = this.state;

    return (
      <Modal
        title={<FormattedMessage message={event ? 'project.edit_event' : 'project.new_event'}/>}
        onDismiss={closeModal} large>
        <div className="event-modal__select-wrap">
          {this.renderEventSelector()}
          {this.renderActionSelector()}
        </div>
        <div className="event-modal__action-board">
          <ActionBoard {...this.props} actionID={actionValue} ref="board"/>
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
    const {eventValue, isSaving} = this.state;

    let options = component.get('availableEventTypes').map(event => ({
      value: event,
      label: event
    })).toArray();

    return (
      <div className="event-modal__select">
        <label className="event-modal__select-label">
          <FormattedMessage message="project.event"/>
        </label>
        <Select value={eventValue}
          options={options}
          onChange={this.handleSelectChange.bind(this, 'eventValue')}
          disabled={isSaving}/>
      </div>
    );
  }

  renderActionSelector(){
    const {actions, actionDefinitions} = this.props;
    const {actionValue, isSaving} = this.state;

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
        <label className="event-modal__select-label">
          <FormattedMessage message="project.action"/>
        </label>
        <Select value={actionValue}
          options={options}
          onChange={this.handleSelectChange.bind(this, 'actionValue')}
          placeholder="New action..."
          disabled={isSaving}/>
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
    const {eventValue} = this.state;
    const {createEvent} = bindActions(EventAction, this.context.flux);
    const {board} = this.refs;

    if (!eventValue) return;

    board.saveChanges().then(() => {
      return createEvent(element.get('id'), {
        event: eventValue,
        action_id: board.getActionID()
      });
    }).then(() => {
      closeModal();
    }).catch(err => {
      console.error(err);
    });
  }

  updateEvent = () => {
    const {updateEvent} = bindActions(EventAction, this.context.flux);
    const {event, closeModal} = this.props;
    const {eventValue} = this.state;
    const {board} = this.refs;

    if (!eventValue) return;

    board.saveChanges().then(() => {
      return updateEvent(event.get('id'), {
        event: eventValue,
        action_id: board.getActionID()
      });
    }).then(() => {
      closeModal();
    }).catch(err => {
      console.error(err);
    });
  }
}

export default EventModal;
