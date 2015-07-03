import React from 'react';
import ProfileData from './ProfileData';
import ProjectList from './ProjectList';
import {setPageTitle, setStatusCode} from '../../actions/AppAction';
import {getUser} from '../../actions/UserAction';
import connectToStores from '../../decorators/connectToStores';
import NotFound from '../NotFound';
import pureRender from '../../decorators/pureRender';

if (process.env.BROWSER){
  require('../../styles/Profile/Profile.styl');
}

@connectToStores(['UserStore'], (stores, props) => ({
  user: stores.UserStore.getUser(props.params.userID),
  currentUser: stores.UserStore.getCurrentUser()
}))
@pureRender
class Profile extends React.Component {
  static onEnter(transition, params, query){
    const {AppStore, UserStore} = this.context.getStore();

    if (AppStore.isFirstRender()) {
      return Promise.resolve();
    }

    const currentUser = UserStore.getCurrentUser();

    if (currentUser && currentUser.get('id') === params.userID){
      this.context.executeAction(setPageTitle, currentUser.get('name'));

      return ProjectList.onEnter.call(this, transition, params, query);
    }

    return this.context.executeAction(getUser, params.userID).then(user => {
      this.context.executeAction(setPageTitle, user.name);

      return ProjectList.onEnter.call(this, transition, params, query);
    }).catch(err => {
      if (err.response && err.response.status === 404){
        this.context.executeAction(setPageTitle, 'Not found');
        this.context.executeAction(setStatusCode, 404);
      } else {
        throw err;
      }
    });
  }
/*
  componentDidUpdate(prevProps){
    if (this.props.params.userID !== prevProps.params.userID){
      this.updateState();
    }
  }*/

  render(){
    let {user, currentUser} = this.state;

    if (user){
      return (
        <div className="profile">
          <ProfileData user={user} currentUser={currentUser}/>
          <ProjectList user={user} currentUser={currentUser} params={this.props.params}/>
        </div>
      );
    } else {
      return <NotFound/>;
    }
  }
}

export default Profile;
