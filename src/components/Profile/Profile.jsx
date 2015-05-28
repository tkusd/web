import React from 'react';
import ProfileData from './ProfileData';
import ProjectList from './ProjectList';
import {setPageTitle, setStatusCode} from '../../actions/AppAction';
import * as UserAction from '../../actions/UserAction';
import UserStore from '../../stores/UserStore';
import AppStore from '../../stores/AppStore';
import {connectToStores} from '../../flux';

class Profile extends React.Component {
  static onEnter(transition, params, query, callback){
    if (this.context.getStore(AppStore).isFirstRender()) return callback();
/*
    this.context.executeAction(UserAction.get, params).then(user => {
      this.context.executeAction(setPageTitle, user.name);
      ProjectList.onEnter(transition, params, query, callback);
    }).catch(err => {
      console.log(err);

      if (err.response.status !== 404) return callback(err);

      this.context.executeAction(setPageTitle, 'Not found');
      this.context.executeAction(setStatusCode, 404);
      callback();
    });*/

    return this.context.executeAction(UserAction.get, params).then(user => {
      this.context.executeAction(setPageTitle, user.name);
      callback();
    }).catch(err => {
      console.log(err);

      this.context.executeAction(setPageTitle, 'Not found');
      this.context.executeAction(setStatusCode, 404);

      callback();
    });
  }

  render(){
    let {user} = this.state;

    if (user){
      return (
        <div>
          <ProfileData user={user}/>
          <ProjectList user={user}/>
        </div>
      );
    } else {
      return <div>Not found</div>;
    }
  }
}

Profile = connectToStores(Profile, [UserStore], (stores, props) => ({
  user: stores.UserStore.getUser(props.params.id)
}));

export default Profile;
