import React from 'react';
import {logout} from '../../actions/TokenAction';

if (process.env.BROWSER){
  require('../../styles/Application/Logout.styl');
}

class Logout extends React.Component {
  static contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    router: React.PropTypes.func.isRequired
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

    this.context.executeAction(logout).then(() => {
      this.context.router.transitionTo('home');
    });
  }
}

export default Logout;
