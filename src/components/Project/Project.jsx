import React from 'react';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';
import ProjectSidebar from './ProjectSidebar';
import ElementSidebar from './ElementSidebar';
import Canvas from './Canvas';

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
    editable: React.PropTypes.bool.isRequired
  }

  render(){
    return (
      <div className="project">
        {this.renderCanvas()}
        <ProjectSidebar {...this.props}/>
        <ElementSidebar {...this.props}/>
      </div>
    );
  }

  renderCanvas(){
    const {elements, selectedScreen} = this.props;
    if (!selectedScreen) return;

    return (
      <div className="project__canvas-wrap">
        <Canvas {...this.props} element={elements.get(selectedScreen)}/>
      </div>
    );
  }
}

export default Project;
