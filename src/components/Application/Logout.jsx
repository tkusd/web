import React from 'react';
import {logout} from '../../actions/TokenAction';
import {connectToStores} from 'fluxible/addons';
import TokenStore from '../../stores/TokenStore';

if (process.env.BROWSER){
  require('../../styles/Application/Logout.styl');
}

class Logout extends React.Component {
  static contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    router: React.PropTypes.func.isRequired
  }

  static propTypes = {
    isLoggedIn: React.PropTypes.bool
  }

  componentDidUpdate(){
    let {isLoggedIn} = this.props;

    if (!isLoggedIn){
      this.context.router.transitionTo('home');
    }
  }

  render(){
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <button type="submit" id="logout--button">Log out</button>
      </form>
    );
  }

  handleSubmit(e){
    e.preventDefault();
    this.context.executeAction(logout);
  }
}

Logout = connectToStores(Logout, [TokenStore], (stores, props) => ({
  isLoggedIn: stores.TokenStore.isLoggedIn()
}));

export default Logout;
