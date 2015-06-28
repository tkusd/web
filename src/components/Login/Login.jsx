import React from 'react';
import {Link} from 'react-router';
import {Form, Input} from '../form';
import TokenStore from '../../stores/TokenStore';
import {login} from '../../actions/TokenAction';
import {setPageTitle} from '../../actions/AppAction';
import Translation from '../i18n/Translation';

class Login extends React.Component {
  static contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    router: React.PropTypes.func.isRequired
  }

  static onEnter(transition, params, query){
    const tokenStore = this.context.getStore(TokenStore);

    if (tokenStore.isLoggedIn()){
      transition.redirect('profile', {userID: tokenStore.getUserID()});
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
      <Form onSubmit={this.handleSubmit}>
        <h1 className="login-container__title">
          <Translation id="common.login"/>
        </h1>
        {error && !error.field && <div className="login-container__error">{error.message}</div>}
        <Input
          name="email"
          ref="email"
          label={<Translation id="common.email"/>}
          type="email"
          required/>
        <Input
          name="password"
          ref="password"
          label={<Translation id="common.password"/>}
          type="password"
          required
          minLength={6}
          maxLength={50}/>
        <button type="submit" className="login-container__button">
          <Translation id="common.login"/>
        </button>
        <div className="login-container__link-group">
          <Translation id="login.signup_link_hint"/>
          {' '}
          <Link to="signup" className="login-container__link">
            <Translation id="common.signup"/>
          </Link>
        </div>
      </Form>
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
      this.context.router.transitionTo('profile', {userID: token.user_id});
    }, err => {
      this.setState({error: err.body || err});
    });
  }
}

export default Login;
