import React from 'react';
import {RouteHandler} from 'react-router';

if (process.env.BROWSER){
  require('../../styles/LoginContainer/LoginContainer.styl');
}

class LoginContainer extends React.Component {
  render(){
    return (
      <div className="login-container">
        <RouteHandler/>
      </div>
    );
  }
}

export default LoginContainer;
