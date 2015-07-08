import React from 'react';
import connectToStores from '../../decorators/connectToStores';
import * as ProjectAction from '../../actions/ProjectAction';
import * as AppAction from '../../actions/AppAction';
import Project from './Project';
import NotFound from '../NotFound';
import pureRender from '../../decorators/pureRender';
import bindActions from '../../utils/bindActions';

@connectToStores(['ProjectStore', 'ElementStore', 'ComponentStore'], (stores, props) => ({
  project: stores.ProjectStore.getProject(props.params.projectID),
  elements: stores.ElementStore.getElementsOfProject(props.params.projectID),
  components: stores.ComponentStore.getList(),
  editable: stores.ProjectStore.isEditable(props.params.projectID)
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
