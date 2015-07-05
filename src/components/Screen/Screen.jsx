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
    project: React.PropTypes.object.isRequired,
    elements: React.PropTypes.object.isRequired,
    components: React.PropTypes.object.isRequired,
    selectedElement: React.PropTypes.string,
    selectedScreen: React.PropTypes.string,
    editable: React.PropTypes.bool.isRequired
  }

  static onEnter(state, transition){
    const {AppStore} = this.getStore();
    const {getChildElements} = bindActions(ElementAction, this);

    if (AppStore.isFirstRender()){
      return Promise.resolve();
    }

    return getChildElements(state.params.screenID).catch(err => {
      if (err.response && err.response.status === 404){
        transition.to('/projects/' + state.params.projectID);
      } else {
        throw err;
      }
    });
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
    if (!selectedScreen) return;

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
