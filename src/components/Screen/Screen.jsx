import React from 'react';
import Canvas from './Canvas';
import ElementSidebar from './ElementSidebar';
import * as ElementAction from '../../actions/ElementAction';
import bindActions from '../../utils/bindActions';

if (process.env.BROWSER){
  require('../../styles/Screen/Screen.styl');
}

class Screen extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired
  }

  static propTypes = {
    elements: React.PropTypes.object.isRequired,
    components: React.PropTypes.object.isRequired,
    editable: React.PropTypes.bool.isRequired,
    selectedElement: React.PropTypes.string,
    selectedScreen: React.PropTypes.string.isRequired
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      //
    };
  }

  componentWillUnmount(){
    const {selectElement} = bindActions(ElementAction, this.context.flux);
    selectElement(null);
  }

  render(){
    return (
      <div className="screen">
        {this.renderCanvas()}
        {this.renderSidebar()}
      </div>
    );
  }

  renderCanvas(){
    const {elements, selectedScreen} = this.props;

    return (
      <div className="screen__canvas">
        <Canvas {...this.props} element={elements.get(selectedScreen)}/>
      </div>
    );
  }

  renderSidebar(){
    const {editable} = this.props;
    if (!editable) return;

    return <ElementSidebar {...this.props}/>;
  }
}

export default Screen;
