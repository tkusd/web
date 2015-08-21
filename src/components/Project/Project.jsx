import React from 'react';
import ProjectSidebar from './ProjectSidebar';
import ProjectHeader from './ProjectHeader';

if (process.env.BROWSER){
  require('../../styles/Project/Project.styl');
}

class Project extends React.Component {
  static propTypes = {
    project: React.PropTypes.object.isRequired,
    elements: React.PropTypes.object.isRequired,
    components: React.PropTypes.object.isRequired,
    selectedScreen: React.PropTypes.string,
    editable: React.PropTypes.bool.isRequired
  }

  render(){
    return (
      <div className="project">
        <ProjectHeader {...this.props}/>
        <ProjectSidebar {...this.props}/>
        {this.props.children}
      </div>
    );
  }
}

export default Project;
