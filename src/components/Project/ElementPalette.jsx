import React from 'react';
import Palette from './Palette';
import Portal from 'react-portal';
import NewScreenModal from './NewScreenModal';
import ElementList from './ElementList';

class ElementPalette extends React.Component {
  static propTypes = {
    project: React.PropTypes.object.isRequired,
    elements: React.PropTypes.object.isRequired,
    selectedElement: React.PropTypes.string
  }

  render(){
    return (
      <Palette title="Elements">
        <ElementList {...this.props}/>
      </Palette>
    );
  }
}

export default ElementPalette;
