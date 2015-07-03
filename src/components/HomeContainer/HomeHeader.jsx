import React from 'react';
import {Link} from 'react-router';
import connectToStores from '../../decorators/connectToStores';
import pureRender from '../../decorators/pureRender';
import Translation from '../i18n/Translation';

if (process.env.BROWSER){
  require('../../styles/HomeContainer/HomeHeader.styl');
}

@connectToStores(['UserStore'], (stores, props) => ({
  currentUser: stores.UserStore.getCurrentUser()
}))
@pureRender
class HomeHeader extends React.Component {
  render(){
    return (
      <header className="home-header">
        <nav className="home-header__right">{this.renderRightNav()}</nav>
      </header>
    );
  }

  renderRightNav(){
    const {currentUser} = this.state;

    if (currentUser){
      return (
        <div>
          <Link
            to="profile"
            params={{userID: currentUser.get('id')}}
            className="home-header__link--primary">
            <Translation id="home.my_projects"/>
          </Link>
        </div>
      );
    } else {
      return (
        <div>
          <Link to="signup" className="home-header__link--primary">
            <Translation id="common.signup"/>
          </Link>
          <Link to="login" className="home-header__link">
            <Translation id="common.login"/>
          </Link>
        </div>
      );
    }
  }
}

export default HomeHeader;
