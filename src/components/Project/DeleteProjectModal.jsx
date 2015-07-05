import React from 'react';
import {Modal} from '../modal';
import {Form} from '../form';
import * as ProjectAction from '../../actions/ProjectAction';
import bindActions from '../../utils/bindActions';
import Translation from '../i18n/Translation';

class DeleteProjectModal extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    project: React.PropTypes.object.isRequired
  }

  constructor(props, context){
    super(props, context);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render(){
    const {closeModal} = this.props;

    return (
      <Modal title={<Translation id="project.delete_project"/>} onDismiss={closeModal}>
        <Form onSubmit={this.handleSubmit}>
          <p>
            <Translation id="project.delete_project_prompt"/>
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

    const {project} = this.props;
    const {deleteProject} = bindActions(ProjectAction, this.context.flux);

    deleteProject(project.get('id')).then(() => {
      this.context.router.transitionTo('/users/' + project.get('user_id'));
    });
  }
}

export default DeleteProjectModal;
