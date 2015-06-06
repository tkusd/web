import React from 'react';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';
import ElementPalette from './ElementPalette';
import ComponentPalette from './ComponentPalette';
//import Screen from './Screen';
import ScreenPalette from './ScreenPalette';

@DragDropContext(HTML5Backend)
class ProjectContainer extends React.Component {
  static propTypes = {
    project: React.PropTypes.object.isRequired,
    elements: React.PropTypes.object.isRequired,
    selectedElement: React.PropTypes.string
  }

  render(){
    return (
      <div id="project">
        <ScreenPalette {...this.props}/>
        <ElementPalette {...this.props}/>
        <ComponentPalette {...this.props}/>
      </div>
    );
  }
}

export default ProjectContainer;
