import React from 'react';
//import {connectToStores} from '../../flux';
//import ProjectStore from '../../stores/ProjectStore';
import AppStore from '../../stores/AppStore';
import {getProjectsOfUser} from '../../actions/ProjectAction';

class ProjectList extends React.Component {
  static propTypes = {
    user: React.PropTypes.object.isRequired
  }

  static onEnter(transition, params, query, callback){
    if (this.context.getStore(AppStore).isFirstRender()) return callback();
    this.context.executeAction(getProjectsOfUser, params, callback);
  }

  render(){
    return <div>Project list</div>;
  }
}
/*
ProjectList = connectToStores(ProjectList, [ProjectStore], (stores, props) => ({
  projectList: stores.ProjectStore.getProjectOfUser(props.params.id)
}));*/

export default ProjectList;
