import React from 'react';
import {Modal} from '../modal';
import {FormattedMessage} from '../intl';
import Select from 'react-select';
import bindActions from '../../utils/bindActions';
import * as EventAction from '../../actions/EventAction';
import {formatIntlFromContext} from '../../utils/formatIntl';
import BlocklyWorkspace from './BlocklyWorkspace';

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
    component: React.PropTypes.object.isRequired
  }

  constructor(props, context){
    super(props, context);

    const {event} = this.props;

    this.state = {
      eventValue: event && event.get('event'),
      isSaving: false
    };
  }

  render(){
    const {closeModal, event} = this.props;

    return (
      <Modal
        title={<FormattedMessage message={event ? 'project.editEvent' : 'project.newEvent'}/>}
        onDismiss={closeModal}
        large>
        <div className="event-modal__select-wrap">
          {this.renderEventSelector()}
        </div>
        <BlocklyWorkspace {...this.props}
          className="event-modal__workspace"
          ref="workspace"
          workspace={event && event.get('workspace')}/>
        <div className="modal__btn-group">
          {event && <button className="modal__btn--danger event-modal__delete-btn" onClick={this.deleteEvent}>
            <FormattedMessage message="common.delete"/>
          </button>}
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
    const intl = formatIntlFromContext(this.context.flux);

    let options = component.get('availableEventTypes').map(event => ({
      value: event,
      label: intl.getIntlMessage('event.' + event)
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

  handleSelectChange(field, value){
    this.setState({
      [field]: value
    });
  }

  createEvent = () => {
    const {element, closeModal} = this.props;
    const {eventValue} = this.state;
    const {createEvent} = bindActions(EventAction, this.context.flux);

    if (!eventValue) return;

    createEvent(element.get('id'), {
      event: eventValue,
      workspace: this.refs.workspace.getXMLString()
    }).then(() => {
      closeModal();
    }).catch(err => {
      console.error(err);
    });
  }

  updateEvent = () => {
    const {event, closeModal} = this.props;
    const {eventValue} = this.state;
    const {updateEvent} = bindActions(EventAction, this.context.flux);

    if (!eventValue) return;

    updateEvent(event.get('id'), {
      event: eventValue,
      workspace: this.refs.workspace.getXMLString()
    }).then(() => {
      closeModal();
    }).catch(err => {
      console.error(err);
    });
  }

  deleteEvent = () => {
    if (!confirm('Are you sure?')) return;

    const {deleteEvent} = bindActions(EventAction, this.context.flux);
    const {event, closeModal} = this.props;

    closeModal();
    deleteEvent(event.get('id'));
  }
}

export default EventModal;
