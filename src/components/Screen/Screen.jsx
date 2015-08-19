import React from 'react';
import connectToStores from '../../decorators/connectToStores';
import pureRender from '../../decorators/pureRender';
import * as ElementAction from '../../actions/ElementAction';
import bindActions from '../../utils/bindActions';
import ElementSidebar from './ElementSidebar';
import ViewMask from './ViewMask';
import ScreenToolbar from './ScreenToolbar';

if (process.env.BROWSER){
  require('../../styles/Screen/Screen.styl');
}

@connectToStores(['ElementStore', 'ComponentStore', 'ProjectStore', 'ActionStore', 'EventStore'], (stores, props) => ({
  project: stores.ProjectStore.getProject(props.params.projectID),
  elements: stores.ElementStore.getElementsOfProject(props.params.projectID),
  components: stores.ComponentStore.getList(),
  editable: stores.ProjectStore.isEditable(props.params.projectID),
  activeElement: stores.ElementStore.getSelectedElement(),
  hoverElements: stores.ElementStore.getHoverElements(),
  hasUnsavedChanges: stores.ElementStore.hasUnsavedChanges(),
  actions: stores.ActionStore.getActionsOfProject(props.params.projectID),
  events: stores.EventStore.getList()
}))
@pureRender
class Screen extends React.Component {
  static onEnter(state, transition){
    const {AppStore} = this.getStore();
    const {getFullElement} = bindActions(ElementAction, this);

    if (AppStore.isFirstRender()){
      return Promise.resolve();
    }

    return getFullElement(state.params.screenID).catch(err => {
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
    this.loadThemeCSS();
  }

  componentWillUnmount(){
    this.context.router.removeTransitionHook(this.routerWillLeave);
  }

  componentDidUpdate(prevProps, prevState){
    if (this.state.project.get('theme') !== prevState.project.get('theme')){
      const {deselectElement} = bindActions(ElementAction, this.context.flux);
      this.loadThemeCSS();
      deselectElement();
    }
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
        <ViewMask {...this.state}
          element={elements.get(selectedScreen)}
          selectElement={this.selectElement}/>
        {editable && (
          <ElementSidebar
            {...this.state}
            selectElement={this.selectElement}
            selectedScreen={selectedScreen}/>
        )}
        <ScreenToolbar {...this.state}/>
      </div>
    );
  }

  selectElement(id){
    const {selectElement} = bindActions(ElementAction, this.context.flux);
    selectElement(id);
  }

  loadThemeCSS(){
    const {project} = this.state;

    switch (project.get('theme')){
      case 'ios':
        require.ensure([
          'framework7/dist/css/framework7.ios.css?theme=ios',
          'framework7/dist/css/framework7.ios.colors.css?theme=ios'
        ], require => {
          require('framework7/dist/css/framework7.ios.css?theme=ios');
          require('framework7/dist/css/framework7.ios.colors.css?theme=ios');
        }, 'theme-ios');

        break;

      case 'material':
        require.ensure([
          'framework7/dist/css/framework7.material.css?theme=material',
          'framework7/dist/css/framework7.material.colors.css?theme=material'
        ], require => {
          require('framework7/dist/css/framework7.material.css?theme=material');
          require('framework7/dist/css/framework7.material.colors.css?theme=material');
        }, 'theme-material');

        break;
    }
  }
}

export default Screen;
