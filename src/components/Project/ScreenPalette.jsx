import React from 'react';
import Palette from './Palette';
import Portal from 'react-portal';
import NewScreenModal from './NewScreenModal';

class ScreenPalette extends React.Component {
  static contextTypes = {
    executeAction: React.PropTypes.func.isRequired
  }

  static propTypes = {
    project: React.PropTypes.object.isRequired,
    elements: React.PropTypes.object.isRequired,
    selectedElement: React.PropTypes.string
  }

  render(){
    return (
      <Palette title="Screens">
        {this.renderPortal()}
      </Palette>
    );
  }

  renderPortal(){
    let newScreenPalette = <button>New screen</button>;

    return (
      <Portal openByClickOn={newScreenPalette} closeOnEsc={true}>
        <NewScreenModal context={this.context} project={this.props.project}/>
      </Portal>
    );
  }
}

export default ScreenPalette;
