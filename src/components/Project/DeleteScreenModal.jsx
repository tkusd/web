import React from 'react';
import {Modal} from '../modal';
import {Form} from '../form';
import {deleteElement} from '../../actions/ElementAction';

class DeleteScreenModal extends React.Component {
  static propTypes = {
    element: React.PropTypes.object.isRequired,
    context: React.PropTypes.object.isRequired
  }

  constructor(props, context){
    super(props, context);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render(){
    const {context, closePortal} = this.props;
    const {__} = context;

    return (
      <Modal title={__('project.delete_screen')} onDismiss={closePortal}>
        <Form onSubmit={this.handleSubmit}>
          <p>{__('project.delete_screen_prompt')}</p>
          <div className="modal__btn-group">
            <a className="modal__btn" onClick={closePortal}>{__('common.cancel')}</a>
            <button className="modal__btn--danger" type="submit">{__('common.delete')}</button>
          </div>
        </Form>
      </Modal>
    );
  }

  handleSubmit(e){
    e.preventDefault();

    const {element, context} = this.props;

    // Redirect to the project page before deleting the element to avoid errors
    context.router.transitionTo('project', {projectID: element.get('project_id')});
    context.executeAction(deleteElement, element.get('id'));
  }
}

export default DeleteScreenModal;
