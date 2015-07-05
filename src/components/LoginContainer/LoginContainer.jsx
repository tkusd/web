import React from 'react';

if (process.env.BROWSER){
  require('../../styles/LoginContainer/LoginContainer.styl');
}

class LoginContainer extends React.Component {
  render(){
    return (
      <div className="login-container">
        {this.props.children}
      </div>
    );
  }
}

export default LoginContainer;
