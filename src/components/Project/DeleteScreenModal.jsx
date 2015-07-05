import React from 'react';
import {Modal} from '../modal';
import {Form} from '../form';
import * as ElementAction from '../../actions/ElementAction';
import bindActions from '../../utils/bindActions';
import Translation from '../i18n/Translation';

class DeleteScreenModal extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    element: React.PropTypes.object.isRequired
  }

  constructor(props, context){
    super(props, context);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render(){
    const {closeModal} = this.props;

    return (
      <Modal title={<Translation id="project.delete_screen"/>} onDismiss={closeModal}>
        <Form onSubmit={this.handleSubmit}>
          <p>
            <Translation id="project.delete_screen_prompt"/>
          </p>
          <div className="modal__btn-group">
            <a className="modal__btn" onClick={closeModal}>
              <Translation id="common.cancel"/>
            </a>
            <button className="modal__btn--danger" type="submit">
              <Translation id="common.delete"/>
            </button>
          </div>
        </Form>
      </Modal>
    );
  }

  handleSubmit(e){
    e.preventDefault();

    const {element} = this.props;
    const {deleteElement} = bindActions(ElementAction, this.context.flux);

    // Redirect to the project page before deleting the element to avoid errors
    this.context.router.transitionTo('/projects/' + element.get('project_id'));
    deleteElement(element.get('id'));
  }
}

export default DeleteScreenModal;
