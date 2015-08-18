import React from 'react';
import {Modal} from '../modal';
import * as ElementAction from '../../actions/ElementAction';
import bindActions from '../../utils/bindActions';
import {FormattedMessage} from '../intl';

class DeleteScreenModal extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    element: React.PropTypes.object.isRequired,
    selectedScreen: React.PropTypes.string.isRequired
  }

  render(){
    const {closeModal} = this.props;

    return (
      <Modal title={<FormattedMessage message="project.delete_screen"/>} onDismiss={closeModal}>
        <p>
          <FormattedMessage message="project.delete_screen_prompt"/>
        </p>
        <div className="modal__btn-group">
          <button className="modal__btn" onClick={closeModal}>
            <FormattedMessage message="common.cancel"/>
          </button>
          <button className="modal__btn--danger" onClick={this.deleteScreen}>
            <FormattedMessage message="common.delete"/>
          </button>
        </div>
      </Modal>
    );
  }

  deleteScreen = (e) => {
    const {element, closeModal, selectedScreen} = this.props;
    const {deleteElement} = bindActions(ElementAction, this.context.flux);

    // Redirect to the project page before deleting the element to avoid errors
    if (selectedScreen === element.get('id')){
      this.context.router.replaceWith('/projects/' + element.get('project_id'));
    }

    deleteElement(element.get('id'));
    closeModal();
  }
}

export default DeleteScreenModal;
