import React from 'react';
import {Modal} from '../modal';
import * as ProjectAction from '../../actions/ProjectAction';
import bindActions from '../../utils/bindActions';
import {FormattedMessage} from '../intl';

class DeleteProjectModal extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    project: React.PropTypes.object.isRequired
  }

  render(){
    const {closeModal} = this.props;

    return (
      <Modal title={<FormattedMessage message="project.delete_project"/>} onDismiss={closeModal}>
        <p>
          <FormattedMessage message="project.delete_project_prompt"/>
        </p>
        <div className="modal__btn-group">
          <button className="modal__btn" onClick={closeModal}>
            <FormattedMessage message="common.cancel"/>
          </button>
          <button className="modal__btn--danger" onClick={this.deleteProject}>
            <FormattedMessage message="common.delete"/>
          </button>
        </div>
      </Modal>
    );
  }

  deleteProject = () => {
    const {project} = this.props;
    const {deleteProject} = bindActions(ProjectAction, this.context.flux);

    this.context.router.replaceWith('/users/' + project.get('user_id'));
    deleteProject(project.get('id'));
  }
}

export default DeleteProjectModal;
