import React from 'react';
import connectToStores from '../../decorators/connectToStores';
import pureRender from '../../decorators/pureRender';
import Gravatar from '../common/Gravatar';
import {Link} from 'react-router';
import Translation from '../i18n/Translation';
import FontAwesome from '../common/FontAwesome';
import {Dropdown, DropdownMenu, DropdownItem} from '../dropdown';

if (process.env.BROWSER){
  require('../../styles/Dashboard/DashboardHeader.styl');
}

@connectToStores(['UserStore'], (stores, props) => ({
  currentUser: stores.UserStore.getCurrentUser()
}))
@pureRender
class DashboardHeader extends React.Component {
  render(){
    const {currentUser} = this.state;

    if (currentUser){
      return (
        <header className="dashboard-header">
          <div className="dashboard-header__left">
            <Link to={`/users/${currentUser.get('id')}`} className="dashboard-header__link">
              <Translation id="dashboard.projects"/>
            </Link>
            <Link to="/settings" className="dashboard-header__link">
              <Translation id="dashboard.account"/>
            </Link>
          </div>
          <div className="dashboard-header__right">
            <Dropdown>
              <div className="dashboard-header__avatar">
                <Gravatar src={currentUser.get('avatar')} size={64}/>
                <FontAwesome icon="caret-down"/>
              </div>
              <DropdownMenu position="right">
                <DropdownItem>
                  <strong className="dashboard-header__dropdown-name">{currentUser.get('name')}</strong>
                </DropdownItem>
                <DropdownItem>
                  <Link to={`/users/${currentUser.get('id')}`}>
                    <FontAwesome icon="user"/><Translation id="dashboard.profile"/>
                  </Link>
                </DropdownItem>
                <DropdownItem>
                  <Link to="/settings">
                    <FontAwesome icon="cog"/><Translation id="common.settings"/>
                  </Link>
                </DropdownItem>
                <DropdownItem divider/>
                <DropdownItem>
                  <Link to="/logout">
                    <FontAwesome icon="sign-out"/><Translation id="common.logout"/>
                  </Link>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </header>
      );
    } else {
      return (
        <header className="dashboard-header">
          <div className="dashboard-header__left"></div>
          <div className="dashboard-header__right">
            <Link to="/signup" className="dashboard-header__link--primary">
              <Translation id="common.signup"/>
            </Link>
            <Link to="/login" className="dashboard-header__link">
              <Translation id="common.login"/>
            </Link>
          </div>
        </header>
      );
    }
  }
}

export default DashboardHeader;
