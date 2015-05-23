import React from 'react';
import {Input, validators} from '../form';
import TokenStore from '../../stores/TokenStore';
import {connectToStores} from 'fluxible/addons';
import {login, resetError} from '../../actions/TokenAction';
import {setPageTitle} from '../../actions/AppAction';

class Login extends React.Component {
  static contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    router: React.PropTypes.func.isRequired
  }

  static propTypes = {
    isLoggedIn: React.PropTypes.bool,
    tokenError: React.PropTypes.object
  }

  componentDidUpdate(){
    let {isLoggedIn, tokenError} = this.props;

    if (isLoggedIn){
      this.context.router.transitionTo('home');
      return;
    }

    if (tokenError && tokenError.field){
      this.refs[tokenError.field].setError(tokenError.message);
    }
  }

  componentWillUnmount(){
    this.context.executeAction(resetError);
  }

  render(){
    let {tokenError} = this.props;
    let commonError = tokenError && !tokenError.field ? tokenError.message : null;

    return (
      <form
        className="form"
        onSubmit={this.handleSubmit.bind(this)}>
        <div className="form-error">{commonError}</div>
        <Input
          id="login-email"
          name="email"
          ref="email"
          label="Email"
          type="email"
          validator={[
            validators.required,
            validators.email
          ]}/>
        <Input
          id="login-password"
          name="password"
          ref="password"
          label="Password"
          type="password"
          validator={[
            validators.required,
            validators.length(6, 50)
          ]}/>
        <button type="submit" className="btn">Log in</button>
      </form>
    );
  }

  handleSubmit(e){
    e.preventDefault();

    let {email, password} = this.refs;

    if (email.getError() || password.getError()){
      return;
    }

    this.context.executeAction(login, {
      email: email.getValue(),
      password: password.getValue()
    });
  }
}

Login = connectToStores(Login, [TokenStore], (stores, props) => ({
  isLoggedIn: stores.TokenStore.isLoggedIn(),
  tokenError: stores.TokenStore.getError()
}));

Login.onEnter = function(transition, params, query, callback){
  let tokenStore = this.context.getStore(TokenStore);

  if (tokenStore.isLoggedIn()){
    transition.redirect('home');
    callback();
  } else {
    this.context.executeAction(setPageTitle, 'Log in', callback);
  }
};

export default Login;
