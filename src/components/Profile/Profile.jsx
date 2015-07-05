import React from 'react';
import ProfileData from './ProfileData';
import ProjectList from './ProjectList';
import * as AppAction from '../../actions/AppAction';
import * as UserAction from '../../actions/UserAction';
import bindActions from '../../utils/bindActions';
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
  static onEnter(state, transition){
    const {AppStore, UserStore} = this.getStore();
    const {setPageTitle, setStatusCode} = bindActions(AppAction, this);
    const {getUser} = bindActions(UserAction, this);

    if (AppStore.isFirstRender()) return;

    const currentUser = UserStore.getCurrentUser();

    if (currentUser && currentUser.get('id') === state.params.userID){
      setPageTitle(currentUser.get('name'));

      return ProjectList.onEnter.call(this, state, transition);
    }

    return getUser(state.params.userID).then(user => {
      this.executeAction(setPageTitle, user.name);

      return ProjectList.onEnter.call(this, state, transition);
    }).catch(err => {
      if (err.response && err.response.status === 404){
        setPageTitle('Not found');
        setStatusCode(404);
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
    const {user, currentUser} = this.state;

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
