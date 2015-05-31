import React from 'react';
import {Input, validators} from '../form';
import * as UserAction from '../../actions/UserAction';
import {setPageTitle} from '../../actions/AppAction';
import {login} from '../../actions/TokenAction';
import TokenStore from '../../stores/TokenStore';

class Signup extends React.Component {
  static contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    router: React.PropTypes.func.isRequired
  }

  static onEnter(transition, params, query){
    const tokenStore = this.context.getStore(TokenStore);

    if (tokenStore.isLoggedIn()){
      let token = tokenStore.getData();
      transition.redirect('profile', {id: token.user_id});
    } else {
      this.context.executeAction(setPageTitle, 'Sign up');
    }
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      error: null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate(){
    let {error} = this.state;

    if (error && error.field){
      this.refs[error.field].setError(error.message);
    }
  }

  render(){
    let {error} = this.state;
    let commonError = error && !error.field ? error.message : null;

    return (
      <form
        className="form"
        onSubmit={this.handleSubmit}>
        <div className="form-error">{commonError}</div>
        <Input
          id="signup-name"
          name="name"
          ref="name"
          label="Name"
          type="text"
          validator={[
            validators.required(),
            validators.length(0, 100)
          ]}/>
        <Input
          id="signup-email"
          name="email"
          ref="email"
          label="Email"
          type="email"
          validator={[
            validators.required(),
            validators.email()
          ]}/>
        <Input
          id="signup-password"
          name="password"
          ref="password"
          label="Password"
          type="password"
          validator={[
            validators.required(),
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
    }).then(user => {
      return this.createToken(user);
    }, err => {
      this.setState({error: err.body || err});
    });
  }

  createToken(user){
    let {email, password} = this.refs;

    this.context.executeAction(login, {
      email: email.getValue(),
      password: password.getValue()
    }).then(token => {
      this.context.router.transitionTo('profile', user);
    }, () => {
      // Let users login by themselves if token create failed
      this.context.router.transitionTo('login');
    });
  }
}

export default Signup;
