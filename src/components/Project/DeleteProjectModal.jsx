import React from 'react';
import {Modal} from '../modal';
import {Form} from '../form';
import {deleteProject} from '../../actions/ProjectAction';

class DeleteProjectModal extends React.Component {
  static propTypes = {
    project: React.PropTypes.object.isRequired,
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
      <Modal title={__('project.delete_project')} onDismiss={closePortal}>
        <Form onSubmit={this.handleSubmit}>
          <p>{__('project.delete_project_prompt')}</p>
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

    const {project, context} = this.props;

    context.executeAction(deleteProject, project.get('id')).then(() => {
      context.router.transitionTo('profile', {id: project.get('user_id')});
    });
  }
}

export default DeleteProjectModal;
