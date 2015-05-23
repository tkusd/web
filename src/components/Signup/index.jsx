import React from 'react';
import {Input, validators} from '../form';
import * as UserAction from '../../actions/UserAction';
import {setPageTitle} from '../../actions/AppAction';
import UserStore from '../../stores/UserStore';
import TokenStore from '../../stores/TokenStore';
import {connectToStores} from 'fluxible/addons';

class Signup extends React.Component {
  static contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    router: React.PropTypes.func.isRequired
  }

  static propTypes = {
    userError: React.PropTypes.object,
    isLoggedIn: React.PropTypes.bool
  }

  componentDidUpdate(){
    let {isLoggedIn, userError} = this.props;

    if (isLoggedIn){
      this.context.router.transitionTo('home');
      return;
    }

    if (userError && userError.field){
      this.refs[userError.field].setError(userError.message);
    }
  }

  componentWillUnmount(){
    this.context.executeAction(UserAction.resetError);
  }

  render(){
    let {userError} = this.props;
    let commonError = userError && !userError.field ? userError.message : null;

    return (
      <form
        className="form"
        onSubmit={this.handleSubmit.bind(this)}>
        <div className="form-error">{commonError}</div>
        <Input
          id="signup-name"
          name="name"
          ref="name"
          label="Name"
          type="text"
          validator={[
            validators.required,
            validators.length(0, 100)
          ]}/>
        <Input
          id="signup-email"
          name="email"
          ref="email"
          label="Email"
          type="email"
          validator={[
            validators.required,
            validators.email
          ]}/>
        <Input
          id="signup-password"
          name="password"
          ref="password"
          label="Password"
          type="password"
          validator={[
            validators.required,
            validators.length(6, 50)
          ]}/>
        <button type="submit" className="btn">Sign up</button>
      </form>
    );
  }

  handleSubmit(e){
    e.preventDefault();

    let {name, email, password} = this.refs;

    if (name.getError() || email.getError() || password.getError()){
      return;
    }

    this.context.executeAction(UserAction.create, {
      name: name.getValue(),
      email: email.getValue(),
      password: password.getValue()
    });
  }
}

Signup = connectToStores(Signup, [UserStore, TokenStore], (stores, props) => ({
  userError: stores.UserStore.getError(),
  isLoggedIn: stores.TokenStore.isLoggedIn()
}));

Signup.onEnter = function(transition, params, query, callback){
  let tokenStore = this.context.getStore(TokenStore);

  if (tokenStore.isLoggedIn()){
    transition.redirect('home');
    callback();
  } else {
    this.context.executeAction(setPageTitle, 'Sign up', callback);
  }
};

export default Signup;
