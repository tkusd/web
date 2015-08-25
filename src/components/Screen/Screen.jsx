import React from 'react';
import connectToStores from '../../decorators/connectToStores';
import pureRender from '../../decorators/pureRender';
import * as ElementAction from '../../actions/ElementAction';
import bindActions from '../../utils/bindActions';
import ElementSidebar from './ElementSidebar';
import ViewMask from './ViewMask';
import ScreenToolbar from './ScreenToolbar';
import cx from 'classnames';
import Mousetrap from 'mousetrap';

if (process.env.BROWSER){
  require('../../styles/Screen/Screen.styl');
}

function loadThemeCSS(theme){
  if (!process.env.BROWSER) return Promise.resolve();

  return new Promise((resolve, reject) => {
    switch (theme){
    case 'ios':
      require.ensure([
        'framework7/dist/css/framework7.ios.css?theme=ios',
        'framework7/dist/css/framework7.ios.colors.css?theme=ios'
      ], require => {
        require('framework7/dist/css/framework7.ios.css?theme=ios');
        require('framework7/dist/css/framework7.ios.colors.css?theme=ios');
        resolve();
      }, 'theme-ios');

      break;

    case 'material':
      require.ensure([
        'framework7/dist/css/framework7.material.css?theme=material',
        'framework7/dist/css/framework7.material.colors.css?theme=material'
      ], require => {
        require('framework7/dist/css/framework7.material.css?theme=material');
        require('framework7/dist/css/framework7.material.colors.css?theme=material');
        resolve();
      }, 'theme-material');

      break;

    default:
      resolve();
    }
  });
}

@connectToStores([
  'ElementStore',
  'ComponentStore',
  'ProjectStore',
  'ActionStore',
  'EventStore',
  'AssetStore',
  'AppStore'
], (stores, props) => ({
  project: stores.ProjectStore.getProject(props.params.projectID),
  elements: stores.ElementStore.getElementsOfProject(props.params.projectID),
  components: stores.ComponentStore.getList(),
  editable: stores.ProjectStore.isEditable(props.params.projectID),
  activeElement: stores.ElementStore.getSelectedElement(),
  hoverElements: stores.ElementStore.getHoverElements(),
  hasUnsavedChanges: stores.ElementStore.hasUnsavedChanges(),
  isSavingChanges: stores.ElementStore.isSavingChanges(),
  actions: stores.ActionStore.getActionsOfProject(props.params.projectID),
  events: stores.EventStore.getList(),
  actionDefinitions: stores.ActionStore.getDefinitions(),
  assets: stores.AssetStore.getAssetsOfProject(props.params.projectID),
  apiEndpoint: stores.AppStore.getAPIEndpoint(),
  selectedAsset: stores.AssetStore.getSelectedAsset()
}))
@pureRender
class Screen extends React.Component {
  static onEnter(state, transition){
    const {AppStore, ProjectStore} = this.getStore();
    const {getFullElement} = bindActions(ElementAction, this);
    let promise;

    if (AppStore.isFirstRender()){
      promise = Promise.resolve();
    } else {
      promise = getFullElement(state.params.screenID);
    }

    return promise.then(element => {
      const project = ProjectStore.getProject(state.params.projectID);
      return loadThemeCSS(project.get('theme'));
    }).catch(err => {
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

    this.state = {
      screenSize: '360x640',
      screenDimension: 'landscape',
      screenScale: 1
    };

    this.routerWillLeave = this.routerWillLeave.bind(this);
    this.selectElement = this.selectElement.bind(this);
    this.updateScreenSize = this.updateScreenSize.bind(this);
    this.updateScreenDimension = this.updateScreenDimension.bind(this);
    this.updateScreenScale = this.updateScreenScale.bind(this);
    this.saveNow = this.saveNow.bind(this);
  }

  componentDidMount(){
    this.context.router.addTransitionHook(this.routerWillLeave);
    Mousetrap.bind(['command+s', 'ctrl+s'], this.saveNow);
  }

  componentWillUnmount(){
    this.context.router.removeTransitionHook(this.routerWillLeave);
    Mousetrap.unbind(['command+s', 'ctrl+s'], this.saveNow);
  }

  componentWillUpdate(nextProps, nextState){
    if (this.state.project.get('theme') !== nextState.project.get('theme')){
      loadThemeCSS(nextState.project.get('theme'));
      this.selectElement(null);
    }
  }

  routerWillLeave(state, transition){
    this.selectElement(null);
  }

  render(){
    const {editable, elements} = this.state;
    const selectedScreen = this.props.params.screenID;

    let containerClassName = cx('screen__container', {
      'screen__container--full': editable
    });

    return (
      <div className="screen">
        <div className={containerClassName}>
          <div className="screen__content" ref="content">
            <ViewMask {...this.state}
              element={elements.get(selectedScreen)}
              selectElement={this.selectElement}/>
            <ScreenToolbar {...this.state}
              updateScreenSize={this.updateScreenSize}
              updateScreenDimension={this.updateScreenDimension}
              updateScreenScale={this.updateScreenScale}/>
          </div>
          {editable && (
            <ElementSidebar
              {...this.state}
              selectElement={this.selectElement}
              selectedScreen={selectedScreen}/>
          )}
        </div>
      </div>
    );
  }

  selectElement(id){
    const {selectElement} = bindActions(ElementAction, this.context.flux);
    selectElement(id);
  }

  updateScreenSize(size){
    this.setState({
      screenSize: size
    });
  }

  updateScreenDimension(dimension){
    this.setState({
      screenDimension: dimension
    });
  }

  updateScreenScale(scale){
    this.setState({
      screenScale: scale
    });
  }

  saveNow(e){
    e.preventDefault();

    const {updateElementNow} = bindActions(ElementAction, this.context.flux);
    updateElementNow();
  }
}

export default Screen;
