import React from 'react';
import {Link} from 'react-router';
import FontAwesome from '../common/FontAwesome';

if (process.env.BROWSER){
  require('../../styles/Project/ProjectHeader.styl');
}

class ProjectHeader extends React.Component {
  static propTypes = {
    project: React.PropTypes.object.isRequired
  }

  render(){
    const {project} = this.props;

    return (
      <header className="project-header">
        <h1 className="project-header__title">
          <FontAwesome className="project-header__icon" icon={project.get('is_private') ? 'lock' : 'globe'}/>
          <Link className="project-header__owner" to="profile" params={{userID: project.get('owner').id}}>{project.get('owner').name}</Link>
          <span className="project-header__divider">/</span>
          <span>{project.get('title')}</span>
        </h1>
      </header>
    );
  }
}

export default ProjectHeader;
