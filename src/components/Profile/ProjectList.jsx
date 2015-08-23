import React from 'react';
import connectToStores from '../../decorators/connectToStores';
import * as ProjectAction from '../../actions/ProjectAction';
import {ModalPortal} from '../modal';
import NewProjectModal from './NewProjectModal';
import pureRender from '../../decorators/pureRender';
import FontAwesome from '../common/FontAwesome';
import bindActions from '../../utils/bindActions';
import {FormattedMessage} from '../intl';
import ProjectItem from './ProjectItem';

if (process.env.BROWSER){
  require('../../styles/Profile/ProjectList.styl');
}

@connectToStores(['ProjectStore'], (stores, props) => ({
  projects: stores.ProjectStore.getList(props.params.userID).sort((a, b) => (
    new Date(b.get('updated_at')).getTime() - new Date(a.get('updated_at')).getTime()
  )),
  pagination: stores.ProjectStore.getPagination(props.params.userID)
}))
@pureRender
class ProjectList extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    user: React.PropTypes.object.isRequired,
    currentUser: React.PropTypes.object,
    params: React.PropTypes.object.isRequired
  }

  static onEnter(state, transition){
    const {AppStore} = this.getStore();
    const {getProjectList} = bindActions(ProjectAction, this);

    if (AppStore.isFirstRender()){
      return Promise.resolve();
    }

    return getProjectList(state.params.userID, {
      order: '-updated_at'
    });
  }

  render(){
    const {pagination} = this.state;

    return (
      <div className="project-list">
        <header className="project-list__header">
          <h2 className="project-list__title">
            <FormattedMessage message="profile.projects"/>
          </h2>
          {this.renderPortal()}
        </header>
        <div className="project-list__content">
          {this.renderList()}
        </div>
        <footer className="project-list__footer">
          {pagination.get('has_more') && (
            <a className="project_list__more-btn" onClick={this.loadMoreProjects}>
              Load more...
            </a>
          )}
        </footer>
      </div>
    );
  }

  loadMoreProjects = (e) => {
    e.preventDefault();

    const {user} = this.props;
    const {pagination} = this.state;
    const {getProjectList} = bindActions(ProjectAction, this.context.flux);

    getProjectList(user.get('id'), {
      offset: pagination.get('offset') + pagination.get('limit')
    });
  }

  renderPortal(){
    const {user, currentUser} = this.props;
    if (!currentUser || user.get('id') !== currentUser.get('id')) return;

    let btn = (
      <button className="project-list__new-project-btn">
        <FontAwesome icon="plus"/><FormattedMessage message="profile.new_project"/>
      </button>
    );

    return (
      <ModalPortal trigger={btn}>
        <NewProjectModal user={user}/>
      </ModalPortal>
    );
  }

  renderList(){
    const {projects, pagination} = this.state;

    if (!projects.count()){
      return (
        <div className="project-list__empty">
          <FormattedMessage message="profile.no_projects"/>
        </div>
      );
    }

    return (
      <div className="project-list__list">
        {projects.take(pagination.get('offset') + pagination.get('limit')).map((item, key) => (
          <ProjectItem {...this.props} project={item} key={key}/>
        )).toArray()}
      </div>
    );
  }
}

export default ProjectList;
