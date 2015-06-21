import React from 'react';
import {Link} from 'react-router';
import {Form, Input} from '../form';
import {createUser} from '../../actions/UserAction';
import {setPageTitle} from '../../actions/AppAction';
import {login} from '../../actions/TokenAction';
import TokenStore from '../../stores/TokenStore';
import Translation from '../i18n/Translation';

class Signup extends React.Component {
  static contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    router: React.PropTypes.func.isRequired
  }

  static onEnter(transition, params, query){
    const tokenStore = this.context.getStore(TokenStore);

    if (tokenStore.isLoggedIn()){
      transition.redirect('profile', {id: tokenStore.getUserID()});
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

    return (
      <Form onSubmit={this.handleSubmit}>
        <h1 className="login-container__title">
          <Translation id="common.signup"/>
        </h1>
        {error && !error.field && <div className="login-container__error">{error.message}</div>}
        <Input
          id="signup-name"
          name="name"
          ref="name"
          label={<Translation id="common.name"/>}
          type="text"
          required
          maxLength={100}/>
        <Input
          id="signup-email"
          name="email"
          ref="email"
          label={<Translation id="common.email"/>}
          type="email"
          required/>
        <Input
          id="signup-password"
          name="password"
          ref="password"
          label={<Translation id="common.password"/>}
          type="password"
          required
          minLength={6}
          maxLength={50}/>
        <button type="submit" className="login-container__button">
          <Translation id="common.signup"/>
        </button>
        <div className="login-container__link-group">
          <Translation id="login.login_link_hint"/>
          {' '}
          <Link to="login" className="login-container__link">
            <Translation id="common.login"/>
          </Link>
        </div>
      </Form>
    );
  }

  handleSubmit(e){
    e.preventDefault();

    const {name, email, password} = this.refs;

    if (name.getError() || email.getError() || password.getError()){
      return;
    }

    this.context.executeAction(createUser, {
      name: name.getValue(),
      email: email.getValue(),
      password: password.getValue()
    }).then(user => {
      this.setState({error: null});
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
