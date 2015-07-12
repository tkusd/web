import React from 'react';
import Canvas from './Canvas';
import ElementSidebar from './ElementSidebar';
import * as ElementAction from '../../actions/ElementAction';
import bindActions from '../../utils/bindActions';
import debounce from 'lodash/function/debounce';
import ScreenToolbar from './ScreenToolbar';
import Immutable from 'immutable';

if (process.env.BROWSER){
  require('../../styles/Screen/Screen.styl');
}

// Save automatically every 5 secs
const DEBOUNCE_DELAY = 5000;

class Screen extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired
  }

  static propTypes = {
    elements: React.PropTypes.object.isRequired,
    components: React.PropTypes.object.isRequired,
    editable: React.PropTypes.bool.isRequired,
    selectedScreen: React.PropTypes.string.isRequired
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      elements: this.props.elements,
      updating: false,
      activeElement: null,
      changed: false
    };

    this.commitElementChange = debounce(this.commitElementChange.bind(this), DEBOUNCE_DELAY);
    this.updateElement = this.updateElement.bind(this);
    this.selectElement = this.selectElement.bind(this);
  }

  componentWillReceiveProps(props){
    this.setState({
      elements: props.elements
    });

    // Reset the active element when the screen changed
    if (this.props.selectedScreen !== props.selectedScreen){
      this.setState({
        activeElement: null
      });
    }
  }

  render(){
    const {elements, updating, activeElement, changed} = this.state;
    const {selectedScreen, editable} = this.props;

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
            updateElement={this.updateElement}
            activeElement={activeElement}
            selectElement={this.selectElement}/>
        )}
        <ScreenToolbar {...this.props} updating={updating} changed={changed}/>
      </div>
    );
  }

  updateElement(id, data){
    let newElements = this.state.elements.set(id, data);

    this.setState({
      elements: newElements,
      changed: !Immutable.is(this.props.elements, newElements)
    });

    setTimeout(() => {
      this.commitElementChange(id);
    }, 0);
  }

  commitElementChange(id){
    if (this.state.updating || !this.state.changed) return;

    const {updateElement} = bindActions(ElementAction, this.context.flux);
    const element = this.state.elements.get(id);

    this.setState({updating: true});

    updateElement(id, {
      attributes: element.get('attributes').toObject(),
      styles: element.get('styles').toObject(),
      name: element.get('name')
    }).then(() => {
      this.setState({
        updating: false,
        changed: false
      });
    }).catch(err => {
      console.error(err);
      this.setState({updating: false});
    });
  }

  selectElement(id){
    this.setState({activeElement: id});
  }
}

export default Screen;
