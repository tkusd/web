import React from 'react';
import connectToStores from '../../decorators/connectToStores';
import * as ProjectAction from '../../actions/ProjectAction';
import * as AppAction from '../../actions/AppAction';
import Project from './Project';
import NotFound from '../NotFound';
import pureRender from '../../decorators/pureRender';
import bindActions from '../../utils/bindActions';

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
  'ProjectStore',
  'ElementStore',
  'ComponentStore',
  'AppStore',
  'AssetStore'
], (stores, props) => ({
  project: stores.ProjectStore.getProject(props.params.projectID),
  elements: stores.ElementStore.getElementsOfProject(props.params.projectID),
  components: stores.ComponentStore.getList(),
  editable: stores.ProjectStore.isEditable(props.params.projectID),
  apiEndpoint: stores.AppStore.getAPIEndpoint(),
  assets: stores.AssetStore.getAssetsOfProject(props.params.projectID),
  selectedAsset: stores.AssetStore.getSelectedAsset()
}))
@pureRender
class ProjectContainer extends React.Component {
  static onEnter(state, transition){
    const {AppStore} = this.getStore();
    const {getFullProject} = bindActions(ProjectAction, this);
    const {setPageTitle, setStatusCode} = bindActions(AppAction, this);

    if (AppStore.isFirstRender()){
      return Promise.resolve();
    }

    return getFullProject(state.params.projectID).then(project => {
      setPageTitle(project.title);

      if (!state.params.screenID && project.main_screen){
        transition.to(`/projects/${project.id}/screens/${project.main_screen}`);
      }

      return loadThemeCSS(project.theme);
    }).catch(err => {
      if (err.response && err.response.status === 404){
        setPageTitle('Not found');
        setStatusCode(404);
      } else {
        throw err;
      }
    });
  }

  componentWillUpdate(nextProps, nextState){
    if (this.state.project.get('theme') !== nextState.project.get('theme')){
      loadThemeCSS(nextState.project.get('theme'));
    }
  }

  render(){
    if (this.state.project){
      return (
        <Project {...this.state} selectedScreen={this.props.params.screenID}>
          {this.props.children}
        </Project>
      );
    } else {
      return <NotFound/>;
    }
  }
}

export default ProjectContainer;
