import React from 'react';
import connectToStores from '../../decorators/connectToStores';
import {getFullProject} from '../../actions/ProjectAction';
import {setPageTitle, setStatusCode} from '../../actions/AppAction';
import Project from './Project';
import NotFound from '../NotFound';
import pureRender from '../../decorators/pureRender';
import {assign} from 'lodash';

@connectToStores(['ProjectStore', 'ElementStore', 'ComponentStore', 'UserStore', 'RouteStore'], (stores, props) => ({
  project: stores.ProjectStore.getProject(props.params.projectID),
  elements: stores.ElementStore.getElementsOfProject(props.params.projectID),
  selectedElement: stores.ElementStore.getSelectedElement(),
  selectedScreen: stores.RouteStore.getParams().screenID,
  components: stores.ComponentStore.getList(),
  currentUser: stores.UserStore.getCurrentUser()
}))
@pureRender
class ProjectContainer extends React.Component {
  static contextTypes = {
    executeAction: React.PropTypes.func.isRequired
  }

  static onEnter(transition, params, query){
    const {AppStore} = this.context.getStore();

    if (AppStore.isFirstRender()){
      return Promise.resolve();
    }

    return this.context.executeAction(getFullProject, params.projectID, {depth: 1}).then(project => {
      this.context.executeAction(setPageTitle, project.title);

      if (!params.screenID){
        if (project.main_screen){
          transition.redirect('screen', {
            projectID: project.id,
            screenID: project.main_screen
          });
        }
      }
    }).catch(err => {
      if (err.response && err.response.status === 404){
        this.context.executeAction(setPageTitle, 'Not found');
        this.context.executeAction(setStatusCode, 404);
      } else {
        throw err;
      }
    });
  }

  render(){
    if (this.state.project){
      const {currentUser, project} = this.state;
      let state = assign({
        editable: currentUser ? currentUser.get('id') === project.get('user_id') : false
      }, this.state);

      return <Project {...state}/>;
    } else {
      return <NotFound/>;
    }
  }
}

export default ProjectContainer;
