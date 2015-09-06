import React from 'react';
import connectToStores from '../../decorators/connectToStores';
import pureRender from '../../decorators/pureRender';
import * as ElementAction from '../../actions/ElementAction';
import bindActions from '../../utils/bindActions';
import ElementSidebar from './ElementSidebar';
import ViewMask from './ViewMask';
import ScreenToolbar from './ScreenToolbar';
import cx from 'classnames';
import ScalableView from './ScalableView';
import View from '../preview/View';
import getAssetBlobURL from '../../utils/getAssetBlobURL';

let Mousetrap;

if (process.env.BROWSER){
  Mousetrap = require('mousetrap');
  require('../../styles/Screen/Screen.styl');
}

function preventDefault(e){
  e.preventDefault();
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
  selectedAsset: stores.AssetStore.getSelectedAsset(),
  focusedElement: stores.ElementStore.getFocusedElement()
}))
@pureRender
class Screen extends React.Component {
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
      this.selectElement(null);
    }
  }

  routerWillLeave = (state, transition) => {
    this.selectElement(null);
  }

  render(){
    const {editable} = this.state;
    const selectedScreen = this.props.params.screenID;

    let containerClassName = cx('screen__container', {
      'screen__container--full': editable
    });

    return (
      <div className="screen">
        <div className={containerClassName}>
          <div className="screen__content" ref="content">
            {this.renderView()}
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

  renderView(){
    const {editable, elements, apiEndpoint} = this.state;
    const selectedScreen = this.props.params.screenID;
    const element = elements.get(selectedScreen);
    const getAssetURL = getAssetBlobURL.bind(null, apiEndpoint);

    if (editable){
      return (
        <ViewMask {...this.state}
          element={element}
          selectElement={this.selectElement}
          focusElement={this.focusElement}
          getAssetURL={getAssetURL}/>
      );
    }

    return (
      <ScalableView {...this.state}>
        <View {...this.state}
          element={element}
          getAssetURL={getAssetURL}
          onClick={preventDefault}/>
      </ScalableView>
    );
  }

  selectElement = (id) => {
    const {selectElement} = bindActions(ElementAction, this.context.flux);
    selectElement(id);
  }

  focusElement = (id) => {
    const {focusElement} = bindActions(ElementAction, this.context.flux);
    focusElement(id);
  }

  updateScreenSize = (size) => {
    this.setState({
      screenSize: size
    });
  }

  updateScreenDimension = (dimension) => {
    this.setState({
      screenDimension: dimension
    });
  }

  updateScreenScale = (scale) => {
    this.setState({
      screenScale: scale
    });
  }

  saveNow = (e) => {
    e.preventDefault();

    const {updateElementNow} = bindActions(ElementAction, this.context.flux);
    updateElementNow();
  }
}

export default Screen;
