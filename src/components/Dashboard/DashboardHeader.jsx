import React from 'react';
import connectToStores from '../../decorators/connectToStores';
import pureRender from '../../decorators/pureRender';
import Gravatar from '../common/Gravatar';
import {Link} from 'react-router';
import {FormattedMessage} from '../intl';
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
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  render(){
    const {currentUser} = this.state;

    if (currentUser){
      return (
        <header className="dashboard-header">
          <div className="dashboard-header__left">
            <Link to={`/users/${currentUser.get('id')}`} className="dashboard-header__link">
              <FormattedMessage message="dashboard.projects"/>
            </Link>
            <Link to="/settings" className="dashboard-header__link">
              <FormattedMessage message="dashboard.account"/>
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
                    <FontAwesome icon="user"/><FormattedMessage message="dashboard.profile"/>
                  </Link>
                </DropdownItem>
                <DropdownItem>
                  <Link to="/settings">
                    <FontAwesome icon="cog"/><FormattedMessage message="common.settings"/>
                  </Link>
                </DropdownItem>
                <DropdownItem divider/>
                <DropdownItem>
                  <Link to="/logout">
                    <FontAwesome icon="sign-out"/><FormattedMessage message="common.logout"/>
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
              <FormattedMessage message="common.signup"/>
            </Link>
            <a href="/login" className="dashboard-header__link" onClick={this.handleLoginClick}>
              <FormattedMessage message="common.login"/>
            </a>
          </div>
        </header>
      );
    }
  }

  handleLoginClick = (e) => {
    e.preventDefault();

    const {router} = this.context;

    router.transitionTo('/login', {}, {
      from: router.state.location.pathname
    });
  }
}

export default DashboardHeader;
