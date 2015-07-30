import React from 'react';
import {Link} from 'react-router';
import {Form, InputGroup} from '../form';
import {validators} from 'react-form-input';
import * as UserAction from '../../actions/UserAction';
import * as AppAction from '../../actions/AppAction';
import * as TokenAction from '../../actions/TokenAction';
import bindActions from '../../utils/bindActions';
import {FormattedMessage} from '../intl';

class Signup extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
  }

  static onEnter(state, transition){
    const {TokenStore} = this.getStore();
    const {setPageTitle} = bindActions(AppAction, this);

    if (TokenStore.isLoggedIn()){
      transition.to('/users/' + TokenStore.getUserID());
    } else {
      setPageTitle('Sign up');
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
    const {error} = this.state;

    return (
      <Form onSubmit={this.handleSubmit}>
        <h1 className="login-container__title">
          <FormattedMessage message="common.signup"/>
        </h1>
        {error && !error.field && <div className="login-container__error">{error.message}</div>}
        <InputGroup
          ref="name"
          label={<FormattedMessage message="common.name"/>}
          type="text"
          required
          validators={[
            validators.required('Name is required'),
            validators.maxLength(100, 'The maximum length of name is 100')
          ]}/>
        <InputGroup
          ref="email"
          label={<FormattedMessage message="common.email"/>}
          type="email"
          required
          validators={[
            validators.required('Email is required'),
            validators.email('Email is invalid')
          ]}/>
        <InputGroup
          ref="password"
          label={<FormattedMessage message="common.password"/>}
          type="password"
          required
          validators={[
            validators.required('Password is required'),
            validators.length(6, 50, 'The length of the password must be between 6 to 50')
          ]}/>
        <button type="submit" className="login-container__button">
          <FormattedMessage message="common.signup"/>
        </button>
        <div className="login-container__link-group">
          <FormattedMessage message="login.login_link_hint"/>
          {' '}
          <Link to="/login" className="login-container__link">
            <FormattedMessage message="common.login"/>
          </Link>
        </div>
      </Form>
    );
  }

  handleSubmit(e){
    e.preventDefault();

    const {name, email, password} = this.refs;
    const {createUser} = bindActions(UserAction, this.context.flux);

    if (name.getError() || email.getError() || password.getError()){
      return;
    }

    createUser({
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
    const {login} = bindActions(TokenAction, this.context.flux);

    login({
      email: email.getValue(),
      password: password.getValue()
    }).then(token => {
      this.context.router.transitionTo('/users/' + user.id);
    }, () => {
      // Let users login by themselves if token create failed
      this.context.router.transitionTo('/login');
    });
  }
}

export default Signup;
