import React from 'react';
import {Link} from 'react-router';
import FontAwesome from '../common/FontAwesome';
import {FormattedRelative} from '../intl';
import {ModalPortal} from '../modal';
import DeleteProjectModal from '../Project/DeleteProjectModal';

if (process.env.BROWSER){
  require('../../styles/Profile/ProjectItem.styl');
}

class ProjectItem extends React.Component {
  static propTypes = {
    project: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired,
    currentUser: React.PropTypes.object
  }

  render(){
    const {project, user, currentUser} = this.props;
    let link = '/projects/' + project.get('id');
    let editable = currentUser && currentUser.get('id') === user.get('id');

    if (project.get('main_screen')){
      link += '/screens/' + project.get('main_screen');
    }

    let deleteBtn = (
      <a className="project-item__delete">
        <FontAwesome icon="trash"/>
      </a>
    );

    return (
      <div className="project-item">
        <Link className="project-item__link" to={link}>
          <FontAwesome className="project-item__icon" icon={project.get('is_private') ? 'lock' : 'globe'}/>
          <strong>{project.get('title')}</strong>
          <footer className="project-item__footer">
            Updated at <FormattedRelative value={project.get('updated_at')}/>
          </footer>
        </Link>
        <div className="project-item__btn-group">
          {editable && <Link className="project-item__edit" to={link}>
            <FontAwesome icon="pencil"/>
          </Link>}
          <a className="project-item__preview" href={this.makePreviewLink()} onClick={this.openPreviewWindow}>
            <FontAwesome icon="eye"/>
          </a>
          {editable && <ModalPortal trigger={deleteBtn}>
            <DeleteProjectModal {...this.props}/>
          </ModalPortal>}
        </div>
      </div>
    );
  }

  makePreviewLink(){
    const {project} = this.props;
    return `/projects/${project.get('id')}/preview`;
  }

  openPreviewWindow = (e) => {
    e.preventDefault();

    const {project} = this.props;
    window.open(this.makePreviewLink(), project.get('id'), 'menubar=no, location=no, width=360, height=640, status=no');
  }
}

export default ProjectItem;
