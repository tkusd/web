import React from 'react';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';
import ProjectSidebar from './ProjectSidebar';
import {RouteHandler} from 'react-router';

if (process.env.BROWSER){
  require('../../styles/Project/Project.styl');
}

@DragDropContext(HTML5Backend)
class Project extends React.Component {
  static propTypes = {
    project: React.PropTypes.object.isRequired,
    elements: React.PropTypes.object.isRequired,
    components: React.PropTypes.object.isRequired,
    selectedElement: React.PropTypes.string,
    selectedScreen: React.PropTypes.string,
    editable: React.PropTypes.bool.isRequired,
    currentUser: React.PropTypes.object.isRequired
  }

  render(){
    return (
      <div className="project">
        <ProjectSidebar {...this.props}/>
        <RouteHandler {...this.props}/>
      </div>
    );
  }
}

export default Project;
