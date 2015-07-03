import React from 'react';
import Canvas from './Canvas';
import ElementSidebar from './ElementSidebar';
import {getChildElements, selectElement} from '../../actions/ElementAction';

if (process.env.BROWSER){
  require('../../styles/Screen/Screen.styl');
}

class Screen extends React.Component {
  static propTypes = {
    project: React.PropTypes.object.isRequired,
    elements: React.PropTypes.object.isRequired,
    components: React.PropTypes.object.isRequired,
    selectedElement: React.PropTypes.string,
    selectedScreen: React.PropTypes.string,
    editable: React.PropTypes.bool.isRequired
  }

  static onEnter(transition, params, query){
    const {AppStore} = this.context.getStore();

    if (AppStore.isFirstRender()){
      return Promise.resolve();
    }

    return this.context.executeAction(getChildElements, params.screenID).catch(err => {
      if (err.response && err.response.status === 404){
        transition.redirect('project', {
          projectID: params.projectID
        });
      } else {
        throw err;
      }
    });
  }

  static onLeave(){
    this.context.executeAction(selectElement, null);
  }

  render(){
    const {elements, selectedScreen} = this.props;

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
