import React from 'react';
import connectToStores from '../../decorators/connectToStores';
import * as ElementAction from '../../actions/ElementAction';
import bindActions from '../../utils/bindActions';
import Screen from './Screen';
import pureRender from '../../decorators/pureRender';

@connectToStores(['ElementStore', 'ComponentStore', 'ProjectStore'], (stores, props) => ({
  elements: stores.ElementStore.getElementsOfProject(props.params.projectID),
  components: stores.ComponentStore.getList(),
  editable: stores.ProjectStore.isEditable(props.params.projectID),
  selectedElement: stores.ElementStore.getSelectedElement()
}))
@pureRender
class ScreenContainer extends React.Component {
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

  render(){
    return <Screen {...this.state} selectedScreen={this.props.params.screenID}/>;
  }
}

export default ScreenContainer;
