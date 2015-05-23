import React from 'react';
import TokenStore from '../../stores/TokenStore';
import {setPageTitle} from '../../actions/AppAction';
import ProfileForm from './ProfileForm';
import DeleteUser from './DeleteUser';
import ChangePassword from './ChangePassword';

class Settings extends React.Component {
  render(){
    return (
      <div>
        <ProfileForm/>
        <ChangePassword/>
        <DeleteUser/>
      </div>
    );
  }
}

Settings.onEnter = function(transition, params, query, callback){
  let tokenStore = this.context.getStore(TokenStore);

  if (tokenStore.isLoggedIn()){
    this.context.executeAction(setPageTitle, 'Settings', callback);
  } else {
    transition.redirect('login');
    callback();
  }
};

export default Settings;
