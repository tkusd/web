import React from 'react';
import {Input} from '../form';
import TokenStore from '../../stores/TokenStore';
import {login} from '../../actions/TokenAction';
import {setPageTitle} from '../../actions/AppAction';

class Login extends React.Component {
  static contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    router: React.PropTypes.func.isRequired
  }

  static onEnter(transition, params, query){
    const tokenStore = this.context.getStore(TokenStore);

    if (tokenStore.isLoggedIn()){
      transition.redirect('profile', {id: tokenStore.getUserID()});
    } else {
      this.context.executeAction(setPageTitle, 'Log in');
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

    return (
      <form
        className="form"
        onSubmit={this.handleSubmit}>
        {error && !error.field && <div className="form-error">{error.message}</div>}
        <Input
          id="login-email"
          name="email"
          ref="email"
          label="Email"
          type="email"
          required/>
        <Input
          id="login-password"
          name="password"
          ref="password"
          label="Password"
          type="password"
          required
          minLength={6}
          maxLength={50}/>
        <button type="submit" className="btn">Log in</button>
      </form>
    );
  }

  handleSubmit(e){
    e.preventDefault();

    const {email, password} = this.refs;

    if (email.getError() || password.getError()){
      return;
    }

    this.context.executeAction(login, {
      email: email.getValue(),
      password: password.getValue()
    }).then(token => {
      this.setState({error: null});
      this.context.router.transitionTo('profile', {id: token.user_id});
    }, err => {
      this.setState({error: err.body || err});
    });
  }
}

export default Login;
