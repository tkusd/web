import React from 'react';
import Canvas from './Canvas';
import ElementSidebar from './ElementSidebar';
import * as ElementAction from '../../actions/ElementAction';
import bindActions from '../../utils/bindActions';
import {debounce} from 'lodash';
import ScreenToolbar from './ScreenToolbar';

if (process.env.BROWSER){
  require('../../styles/Screen/Screen.styl');
}

const DEBOUNCE_DELAY = 2000;

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

  static childContextTypes = {
    updateElement: React.PropTypes.func.isRequired
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      elements: this.props.elements,
      updating: false
    };

    this.commitElementChange = debounce(this.commitElementChange.bind(this), DEBOUNCE_DELAY);
  }

  getChildContext(){
    return {
      updateElement: this.updateElement.bind(this)
    };
  }

  componentWillUnmount(){
    const {selectElement} = bindActions(ElementAction, this.context.flux);
    selectElement(null);
  }

  componentWillReceiveProps(props){
    this.setState({
      elements: props.elements
    });
  }

  render(){
    return (
      <div className="screen">
        {this.renderCanvas()}
        {this.renderSidebar()}
        {this.renderToolbar()}
      </div>
    );
  }

  renderCanvas(){
    const {selectedScreen} = this.props;
    const {elements} = this.state;

    return (
      <div className="screen__canvas">
        <Canvas {...this.props} elements={elements} element={elements.get(selectedScreen)}/>
      </div>
    );
  }

  renderSidebar(){
    const {editable} = this.props;
    if (!editable) return;

    return <ElementSidebar {...this.props} elements={this.state.elements}/>;
  }

  renderToolbar(){
    return <ScreenToolbar {...this.props} updating={this.state.updating}/>;
  }

  updateElement(id, data){
    this.setState({
      elements: this.state.elements.set(id, data)
    });

    this.commitElementChange(id);
  }

  commitElementChange(id){
    if (this.state.updating) return;

    const {updateElement} = bindActions(ElementAction, this.context.flux);
    const element = this.state.elements.get(id);

    this.setState({updating: true});

    updateElement(id, {
      attributes: element.get('attributes'),
      styles: element.get('styles'),
      name: element.get('name')
    }).then(() => {
      this.setState({updating: false});
    }).catch(err => {
      console.error(err);
      this.setState({updating: false});
    });
  }
}

export default Screen;
