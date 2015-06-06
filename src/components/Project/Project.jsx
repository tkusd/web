import React from 'react';
import connectToStores from '../../utils/connectToStores';
import ProjectStore from '../../stores/ProjectStore';
import ElementStore from '../../stores/ElementStore';
import AppStore from '../../stores/AppStore';
import {getFullProject} from '../../actions/ProjectAction';
import {setPageTitle, setStatusCode} from '../../actions/AppAction';
import {selectElement} from '../../actions/ElementAction';
import ProjectContainer from './ProjectContainer';
import NotFound from '../NotFound';

if (process.env.BROWSER){
  require('../../styles/Project/Project.styl');
}

@connectToStores([ProjectStore, ElementStore], (stores, props) => ({
  project: stores.ProjectStore.getProject(props.params.id),
  elements: stores.ElementStore.getElementsOfProject(props.params.id),
  selectedElement: stores.ElementStore.getSelectedElement()
}))
class Project extends React.Component {
  static onEnter(transition, params, query){
    if (this.context.getStore(AppStore).isFirstRender()){
      return Promise.resolve();
    }

    return this.context.executeAction(getFullProject, params.id).then(project => {
      this.context.executeAction(setPageTitle, project.title);
    }).catch(err => {
      console.error(err);

      this.context.executeAction(setPageTitle, 'Not found');
      this.context.executeAction(setStatusCode, 404);
    });
  }

  static onLeave(transition){
    this.context.executeAction(selectElement, null);
  }

  render(){
    if (this.state.project){
      return <ProjectContainer {...this.state}/>;
    } else {
      return <NotFound/>;
    }
  }
}

export default Project;
