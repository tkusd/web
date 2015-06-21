import React from 'react';
import Palette from './Palette';
import ElementList from './ElementList';

class ElementPalette extends React.Component {
  static propTypes = {
    project: React.PropTypes.object.isRequired,
    elements: React.PropTypes.object.isRequired,
    selectedElement: React.PropTypes.string,
    selectedScreen: React.PropTypes.string
  }

  render(){
    const {elements, selectedElement, selectedScreen} = this.props;

    if (selectedScreen){
      return (
        <Palette title="Elements">
          <ElementList elements={elements} selectedElement={selectedElement} parent={selectedScreen}/>
        </Palette>
      );
    } else {
      return <div>Please select a screen</div>;
    }
  }
}

export default ElementPalette;
