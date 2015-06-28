import React from 'react';
import UserStore from '../../stores/UserStore';
import connectToStores from '../../decorators/connectToStores';
import pureRender from '../../decorators/pureRender';
import Gravatar from '../common/Gravatar';
import {Link} from 'react-router';
import Translation from '../i18n/Translation';
import FontAwesome from '../common/FontAwesome';
import {Dropdown, DropdownMenu, DropdownItem} from '../dropdown';
import {logout} from '../../actions/TokenAction';

if (process.env.BROWSER){
  require('../../styles/Dashboard/DashboardHeader.styl');
}

@connectToStores([UserStore], (stores, props) => ({
  currentUser: stores.UserStore.getCurrentUser()
}))
@pureRender
class DashboardHeader extends React.Component {
  static contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    router: React.PropTypes.func.isRequired
  }

  constructor(props, context){
    super(props, context);

    this.logout = this.logout.bind(this);
  }

  render(){
    const {currentUser} = this.state;

    if (currentUser){
      return (
        <header className="dashboard-header">
          <div className="dashboard-header__left">
            <Link to="profile" params={{userID: currentUser.get('id')}} className="dashboard-header__link">
              <Translation id="dashboard.projects"/>
            </Link>
            <Link to="settings" className="dashboard-header__link">
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
                  <Link to="profile" params={{userID: currentUser.get('id')}}>
                    <FontAwesome icon="user"/><Translation id="dashboard.profile"/>
                  </Link>
                </DropdownItem>
                <DropdownItem>
                  <Link to="settings">
                    <FontAwesome icon="cog"/><Translation id="common.settings"/>
                  </Link>
                </DropdownItem>
                <DropdownItem divider/>
                <DropdownItem>
                  <a onClick={this.logout}>
                    <FontAwesome icon="sign-out"/><Translation id="common.logout"/>
                  </a>
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
            <Link to="signup" className="dashboard-header__link--primary">
              <Translation id="common.signup"/>
            </Link>
            <Link to="login" className="dashboard-header__link">
              <Translation id="common.login"/>
            </Link>
          </div>
        </header>
      );
    }
  }

  logout(e){
    e.preventDefault();

    this.context.executeAction(logout).then(() => {
      this.context.router.transitionTo('home');
    });
  }
}

export default DashboardHeader;
