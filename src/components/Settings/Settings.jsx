import React from 'react';
import TokenStore from '../../stores/TokenStore';
import UserStore from '../../stores/UserStore';
import {setPageTitle} from '../../actions/AppAction';
import ProfileForm from './ProfileForm';
import DeleteUser from './DeleteUser';
import ChangePassword from './ChangePassword';
import {connectToStores} from '../../flux';

@connectToStores([UserStore], (stores, props) => ({
  user: stores.UserStore.getCurrentUser()
}))
class Settings extends React.Component {
  static onEnter(transition, params, query){
    const tokenStore = this.context.getStore(TokenStore);

    if (tokenStore.isLoggedIn()){
      this.context.executeAction(setPageTitle, 'Settings');
    } else {
      transition.redirect('login');
    }
  }

  render(){
    let {user} = this.state;

    if (user){
      return (
        <div>
          <ProfileForm user={user}/>
          <ChangePassword user={user}/>
          <DeleteUser user={user}/>
        </div>
      );
    } else {
      return <div>You have not logged in yet.</div>;
    }
  }
}

export default Settings;
