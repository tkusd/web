import React from 'react';
import {Link} from 'react-router';
import UserStore from '../../stores/UserStore';
import {connectToStores} from 'fluxible/addons';
import Logout from './Logout';

class Header extends React.Component {
  render(){
    let {currentUser} = this.props;
    let profileNav;

    if (currentUser){
      profileNav = (
        <div>
          Hello, {currentUser.name}
          <Link to="settings">Settings</Link>
          <Logout/>
        </div>
      );
    } else {
      profileNav = (
        <div>
          <Link to="signup">Sign up</Link>
          <Link to="login">Log in</Link>
        </div>
      );
    }

    return (
      <header id="header">
        <nav id="main-nav">
          <Link to="app">Home</Link>
          {profileNav}
        </nav>
      </header>
    );
  }
}

Header = connectToStores(Header, [UserStore], (stores, props) => ({
  currentUser: stores.UserStore.getCurrentUser()
}));

export default Header;
