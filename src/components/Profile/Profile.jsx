import React from 'react';
import ProfileData from './ProfileData';
import ProjectList from './ProjectList';
import {setPageTitle, setStatusCode} from '../../actions/AppAction';
import {getUser} from '../../actions/UserAction';
import UserStore from '../../stores/UserStore';
import AppStore from '../../stores/AppStore';
import connectToStores from '../../decorators/connectToStores';
import NotFound from '../NotFound';
import pureRender from '../../decorators/pureRender';

if (process.env.BROWSER){
  require('../../styles/Profile/Profile.styl');
}

@connectToStores([UserStore], (stores, props) => ({
  user: stores.UserStore.getUser(props.params.id),
  currentUser: stores.UserStore.getCurrentUser()
}))
@pureRender
class Profile extends React.Component {
  static onEnter(transition, params, query){
    if (this.context.getStore(AppStore).isFirstRender()) {
      return Promise.resolve();
    }

    const currentUser = this.context.getStore(UserStore).getCurrentUser();

    if (currentUser && currentUser.get('id') === params.id){
      this.context.executeAction(setPageTitle, currentUser.get('name'));

      return ProjectList.onEnter.call(this, transition, params, query);
    }

    return this.context.executeAction(getUser, params.id).then(user => {
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

  componentDidUpdate(prevProps){
    if (this.props.params.id !== prevProps.params.id){
      this.updateState();
    }
  }

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
