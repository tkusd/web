import React from 'react';
import connectToStores from '../../utils/connectToStores';
import ProjectStore from '../../stores/ProjectStore';
import ElementStore from '../../stores/ElementStore';
import ComponentStore from '../../stores/ComponentStore';
import AppStore from '../../stores/AppStore';
import {getFullProject} from '../../actions/ProjectAction';
import {setPageTitle, setStatusCode} from '../../actions/AppAction';
import {selectElement, selectScreen} from '../../actions/ElementAction';
import Project from './Project';
import NotFound from '../NotFound';
import pureRender from '../../utils/pureRender';

@connectToStores([ProjectStore, ElementStore, ComponentStore], (stores, props) => ({
  project: stores.ProjectStore.getProject(props.params.id),
  elements: stores.ElementStore.getElementsOfProject(props.params.id),
  selectedElement: stores.ElementStore.getSelectedElement(),
  selectedScreen: stores.ElementStore.getSelectedScreen(),
  components: stores.ComponentStore.getList()
}))
@pureRender
class ProjectContainer extends React.Component {
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
    this.context.executeAction(selectScreen, null);
  }

  render(){
    if (this.state.project){
      return <Project {...this.state}/>;
    } else {
      return <NotFound/>;
    }
  }
}

export default ProjectContainer;
