import React from 'react';
import connectToStores from '../../decorators/connectToStores';
import pureRender from '../../decorators/pureRender';
import * as ElementAction from '../../actions/ElementAction';
import bindActions from '../../utils/bindActions';
import CanvasContainer from './CanvasContainer';
import ElementSidebar from './ElementSidebar';

if (process.env.BROWSER){
  require('../../styles/Screen/Screen.styl');
}

@connectToStores(['ElementStore', 'ComponentStore', 'ProjectStore'], (stores, props) => ({
  elements: stores.ElementStore.getElementsOfProject(props.params.projectID),
  components: stores.ComponentStore.getList(),
  editable: stores.ProjectStore.isEditable(props.params.projectID),
  activeElement: stores.ElementStore.getSelectedElement()
}))
@pureRender
class Screen extends React.Component {
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

  static contextTypes = {
    flux: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
  }

  constructor(props, context){
    super(props, context);

    this.routerWillLeave = this.routerWillLeave.bind(this);
    this.selectElement = this.selectElement.bind(this);
  }

  componentDidMount(){
    this.context.router.addTransitionHook(this.routerWillLeave);
  }

  componentWillUnmount(){
    this.context.router.removeTransitionHook(this.routerWillLeave);
  }

  routerWillLeave(state, transition){
    const {deselectElement} = bindActions(ElementAction, this.context.flux);
    deselectElement();
  }

  render(){
    const {elements, editable} = this.state;
    const selectedScreen = this.props.params.screenID;

    return (
      <div className="screen">
        <div className="screen__canvas">
          <CanvasContainer
            {...this.state}
            element={elements.get(selectedScreen)}
            selectElement={this.selectElement}/>
        </div>
        {editable && (
          <ElementSidebar
            {...this.state}
            selectElement={this.selectElement}
            selectedScreen={selectedScreen}/>
        )}
      </div>
    );
  }

  selectElement(id){
    const {selectElement} = bindActions(ElementAction, this.context.flux);
    selectElement(id);
  }
}

export default Screen;
