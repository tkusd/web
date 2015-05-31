import React from 'react';
import {Link} from 'react-router';
import UserStore from '../../stores/UserStore';
import {connectToStores} from '../../flux';
import {Dropdown, DropdownMenu, DropdownItem, DropdownDivider} from '../../components/dropdown';
import Logout from './Logout';
import Gravatar from '../../components/common/Gravatar';

if (process.env.BROWSER){
  require('../../styles/Application/HeaderActions.styl');
}

@connectToStores([UserStore], (stores, props) => ({
  currentUser: stores.UserStore.getCurrentUser()
}))
class HeaderActions extends React.Component {
  static propTypes = {
    currentUser: React.PropTypes.object
  }

  render(){
    let {currentUser} = this.state;

    if (currentUser){
      return (
        <nav id="header-actions">
          <Link to="profile" params={currentUser} className="header-actions__primary-link">My projects</Link>
          <Dropdown className="header-actions__dropdown" mode="hover">
            <Link to="profile" params={currentUser} className="header-actions__avatar">
              <Gravatar src={currentUser.avatar} size={50} className="header-actions__avatar-img"/>
            </Link>
            <DropdownMenu position="right">
              <DropdownItem>
                <Link to="settings">Settings</Link>
              </DropdownItem>
              <DropdownDivider/>
              <DropdownItem>
                <Logout/>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </nav>
      );
    } else {
      return (
        <nav id="header-actions">
          <Link to="signup" className="header-actions__primary-link">Sign up</Link>
          <Link to="login" className="header-actions__link">Log in</Link>
        </nav>
      );
    }
  }
}

export default HeaderActions;
