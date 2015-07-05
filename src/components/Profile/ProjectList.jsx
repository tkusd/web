import React from 'react';
import connectToStores from '../../decorators/connectToStores';
import * as ProjectAction from '../../actions/ProjectAction';
import {ModalPortal} from '../modal';
import NewProjectModal from './NewProjectModal';
import {Link} from 'react-router';
import pureRender from '../../decorators/pureRender';
import Translation from '../i18n/Translation';
import FontAwesome from '../common/FontAwesome';
import bindActions from '../../utils/bindActions';

if (process.env.BROWSER){
  require('../../styles/Profile/ProjectList.styl');
}

@connectToStores(['ProjectStore'], (stores, props) => ({
  projects: stores.ProjectStore.getList(props.params.userID).sort((a, b) => {
    // Sort by created date
    return new Date(b.get('created_at')).getTime() - new Date(a.get('created_at')).getTime();
  })
}))
@pureRender
class ProjectList extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired,
    __: React.PropTypes.func.isRequired
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

    return getProjectList(state.params.userID);
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
      <ModalPortal trigger={btn}>
        <NewProjectModal user={user}/>
      </ModalPortal>
    );
  }

  renderList(){
    const {projects} = this.state;

    if (projects.count()){
      return (
        <ul className="project-list__list">
          {projects.map((item, key) => {
            let linkTo = '/projects/' + key;

            if (item.get('main_screen')){
              linkTo += '/screens/' + item.get('main_screen');
            }

            return (
              <li className="project-list__item" key={key}>
                <Link className="project-list__item-link" to={linkTo}>
                  <strong>{item.get('title')}</strong>
                </Link>
              </li>
            );
          }).toArray()}
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
