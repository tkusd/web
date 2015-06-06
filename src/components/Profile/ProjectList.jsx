import React from 'react';
import connectToStores from '../../utils/connectToStores';
import ProjectStore from '../../stores/ProjectStore';
import AppStore from '../../stores/AppStore';
import {getProjectList} from '../../actions/ProjectAction';
import NewProjectModal from './NewProjectModal';
import Portal from 'react-portal';
import {Link} from 'react-router';
import pureRender from '../../utils/pureRender';

@connectToStores([ProjectStore], (stores, props) => ({
  projects: stores.ProjectStore.getList(props.params.id).sort((a, b) => {
    // Sort by created date
    return new Date(b.get('created_at')).getTime() - new Date(a.get('created_at')).getTime();
  })
}))
@pureRender
class ProjectList extends React.Component {
  static contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    router: React.PropTypes.func.isRequired
  }

  static propTypes = {
    user: React.PropTypes.object.isRequired,
    currentUser: React.PropTypes.object,
    params: React.PropTypes.object.isRequired
  }

  static onEnter(transition, params, query){
    if (this.context.getStore(AppStore).isFirstRender()){
      return Promise.resolve();
    }

    return this.context.executeAction(getProjectList, params.id);
  }

  render(){
    let projects = [];

    this.state.projects.forEach(item => {
      projects.push(
        <li key={item.get('id')}>
          <Link to="project" params={{id: item.get('id')}}>{item.get('title')}</Link>
        </li>
      );
    });

    return (
      <div>
        <h2>Project List</h2>
        {this.renderPortal()}
        <ul>{projects}</ul>
      </div>
    );
  }

  renderPortal(){
    let {user, currentUser} = this.props;
    if (!currentUser || user.get('id') !== currentUser.get('id')) return;

    let newProjectBtn = <button>New project</button>;

    return (
      <Portal openByClickOn={newProjectBtn} closeOnEsc={true}>
        <NewProjectModal context={this.context} user={user}/>
      </Portal>
    );
  }
}

export default ProjectList;
