import React from 'react';
import connectToStores from '../../decorators/connectToStores';
import * as ProjectAction from '../../actions/ProjectAction';
import * as AppAction from '../../actions/AppAction';
import Project from './Project';
import NotFound from '../NotFound';
import pureRender from '../../decorators/pureRender';
import {assign} from 'lodash';
import bindActions from '../../utils/bindActions';

@connectToStores(['ProjectStore', 'ElementStore', 'ComponentStore', 'UserStore'], (stores, props) => ({
  project: stores.ProjectStore.getProject(props.params.projectID),
  elements: stores.ElementStore.getElementsOfProject(props.params.projectID),
  selectedElement: stores.ElementStore.getSelectedElement(),
  components: stores.ComponentStore.getList(),
  currentUser: stores.UserStore.getCurrentUser()
}))
@pureRender
class ProjectContainer extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired
  }

  static onEnter(state, transition){
    const {AppStore} = this.getStore();
    const {getFullProject} = bindActions(ProjectAction, this);
    const {setPageTitle, setStatusCode} = bindActions(AppAction, this);

    if (AppStore.isFirstRender()){
      return Promise.resolve();
    }

    return getFullProject(state.params.projectID, {depth: 1}).then(project => {
      setPageTitle(project.title);

      if (!state.params.screenID && project.main_screen){
        transition.to(`/projects/${project.id}/screens/${project.main_screen}`);
      }
    }).catch(err => {
      if (err.response && err.response.status === 404){
        setPageTitle('Not found');
        setStatusCode(404);
      } else {
        throw err;
      }
    });
  }

  render(){
    if (this.state.project){
      const {currentUser, project} = this.state;

      let state = assign({
        editable: currentUser ? currentUser.get('id') === project.get('user_id') : false,
        selectedScreen: this.props.params.screenID
      }, this.state);

      return <Project {...state} children={this.props.children}/>;
    } else {
      return <NotFound/>;
    }
  }
}

export default ProjectContainer;
