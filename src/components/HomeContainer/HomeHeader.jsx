import React from 'react';
import {Link} from 'react-router';
import connectToStores from '../../decorators/connectToStores';
import pureRender from '../../decorators/pureRender';
import {FormattedMessage} from '../intl';

if (process.env.BROWSER){
  require('../../styles/HomeContainer/HomeHeader.styl');
}

@connectToStores(['UserStore'], (stores, props) => ({
  currentUser: stores.UserStore.getCurrentUser()
}))
// @pureRender
class HomeHeader extends React.Component {
  render(){
    return (
      <header className="home-header">
        <h1 className="home-header__logo-wrap">
          <Link to="/" className="home-header__logo">Diff</Link>
        </h1>
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
            to={`/users/${currentUser.get('id')}`}
            className="home-header__link--primary">
            <FormattedMessage message="home.myProjects"/>
          </Link>
        </div>
      );
    } else {
      return (
        <div>
          <Link to="/signup" className="home-header__link--primary">
            <FormattedMessage message="common.signup"/>
          </Link>
          <Link to="/login" className="home-header__link">
            <FormattedMessage message="common.login"/>
          </Link>
        </div>
      );
    }
  }
}

export default HomeHeader;
