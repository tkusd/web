import React from 'react';
import Canvas from './Canvas';
import ElementSidebar from './ElementSidebar';
import Immutable from 'immutable';
import ScreenToolbar from './ScreenToolbar';

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
    selectedScreen: React.PropTypes.string.isRequired,
    updateElement: React.PropTypes.func.isRequired,
    hasUnsavedChanges: React.PropTypes.bool.isRequired,
    isSavingChanges: React.PropTypes.bool.isRequired
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      elements: this.props.elements,
      updating: false,
      activeElement: null
    };

    this.selectElement = this.selectElement.bind(this);
    this.updateElement = this.updateElement.bind(this);
  }

  componentWillReceiveProps(props){
    if (!Immutable.is(this.props.elements, props.elements)){
      this.setState({
        elements: props.elements
      });
    }

    // Reset the active element when the screen changed
    if (this.props.selectedScreen !== props.selectedScreen){
      this.setState({
        activeElement: null
      });
    }
  }

  render(){
    const {elements, activeElement} = this.state;
    const {selectedScreen, editable, hasUnsavedChanges, isSavingChanges} = this.props;

    return (
      <div className="screen">
        <div className="screen__canvas">
          <Canvas {...this.props}
            elements={elements}
            element={elements.get(selectedScreen)}
            activeElement={activeElement}
            selectElement={this.selectElement}/>
        </div>
        {editable && (
          <ElementSidebar {...this.props}
            elements={elements}
            activeElement={activeElement}
            selectElement={this.selectElement}
            updateElement={this.updateElement}/>
        )}
        {<ScreenToolbar {...this.props} updating={isSavingChanges} changed={hasUnsavedChanges}/>}
      </div>
    );
  }

  selectElement(id){
    this.setState({activeElement: id});
  }

  updateElement(id, data){
    this.setState({
      elements: this.state.elements.set(id, data)
    });

    this.props.updateElement(id, data);
  }
}

export default Screen;
