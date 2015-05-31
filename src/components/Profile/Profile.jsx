import React from 'react';
import ProfileData from './ProfileData';
import ProjectList from './ProjectList';
import {setPageTitle, setStatusCode} from '../../actions/AppAction';
import * as UserAction from '../../actions/UserAction';
import UserStore from '../../stores/UserStore';
import AppStore from '../../stores/AppStore';
import {connectToStores} from '../../flux';

@connectToStores([UserStore], (stores, props) => ({
  user: stores.UserStore.getUser(props.params.id),
  currentUser: stores.UserStore.getCurrentUser()
}))
class Profile extends React.Component {
  static onEnter(transition, params, query){
    if (this.context.getStore(AppStore).isFirstRender()) {
      return Promise.resolve();
    }

    const currentUser = this.context.getStore(UserStore).getCurrentUser();

    if (currentUser && currentUser.id === params.id){
      this.context.executeAction(setPageTitle, currentUser.name);

      return ProjectList.onEnter.call(this, transition, params, query);
    }

    return this.context.executeAction(UserAction.get, params).then(user => {
      this.context.executeAction(setPageTitle, user.name);

      return ProjectList.onEnter.call(this, transition, params, query);
    }).catch(() => {
      this.context.executeAction(setPageTitle, 'Not found');
      this.context.executeAction(setStatusCode, 404);
    });
  }

  componentDidUpdate(prevProps){
    if (this.props.params.id !== prevProps.params.id){
      this.updateState();
    }
  }

  render(){
    let {user, currentUser} = this.state;

    if (user){
      return (
        <div>
          <ProfileData user={user} currentUser={currentUser}/>
          <ProjectList user={user} currentUser={currentUser} params={this.props.params}/>
        </div>
      );
    } else {
      return <div>Not found</div>;
    }
  }
}

export default Profile;
