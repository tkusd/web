import React from 'react';
import connectToStores from '../../utils/connectToStores';
import ProjectStore from '../../stores/ProjectStore';
import AppStore from '../../stores/AppStore';
import {getProjectList} from '../../actions/ProjectAction';
import NewProjectModal from './NewProjectModal';
import Portal from 'react-portal';
import {Link} from 'react-router';
import pureRender from '../../utils/pureRender';
import Translation from '../i18n/Translation';
import FontAwesome from '../common/FontAwesome';

if (process.env.BROWSER){
  require('../../styles/Profile/ProjectList.styl');
}

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
    router: React.PropTypes.func.isRequired,
    __: React.PropTypes.func.isRequired
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
    return (
      <div className="project-list">
        <header className="project-list__header">
          <h2 className="project-list__title">
            <Translation id="profile.projects"/>
          </h2>
          {this.renderPortal()}
        </header>
        <div className="project-list__content">
          {this.renderList()}
        </div>
      </div>
    );
  }

  renderPortal(){
    const {user, currentUser} = this.props;
    if (!currentUser || user.get('id') !== currentUser.get('id')) return;

    let btn = (
      <button className="project-list__new-project-btn">
        <FontAwesome icon="plus"/><Translation id="profile.new_project"/>
      </button>
    );

    return (
      <div className="project-list__portal">
        <Portal openByClickOn={btn} closeOnEsc={true}>
          <NewProjectModal context={this.context} user={user}/>
        </Portal>
      </div>
    );
  }

  renderList(){
    const {projects} = this.state;

    if (projects.count()){
      return (
        <ul className="project-list__list">
          {projects.map((item, key) => (
            <li className="project-list__item" key={key}>
              <Link className="project-list__item-link" to="project" params={{id: key}}>
                <strong>{item.get('title')}</strong>
              </Link>
            </li>
          )).toArray()}
        </ul>
      );
    } else {
      return (
        <div className="project-list__empty">
          <Translation id="profile.no_projects"/>
        </div>
      );
    }
  }
}

export default ProjectList;
