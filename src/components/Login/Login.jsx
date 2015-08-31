import React from 'react';
import {Link} from 'react-router';
import {Form, InputGroup} from '../form';
import * as TokenAction from '../../actions/TokenAction';
import bindActions from '../../utils/bindActions';
import * as AppAction from '../../actions/AppAction';
import {FormattedMessage} from '../intl';
import {validators} from 'react-form-input';

class Login extends React.Component {
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
      setPageTitle('Log in');
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
          <FormattedMessage message="common.login"/>
        </h1>
        {error && !error.field && <div className="login-container__error">{error.message}</div>}
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
          <FormattedMessage message="common.login"/>
        </button>
        <div className="login-container__link-group">
          <FormattedMessage message="login.signupLinkHint"/>
          {' '}
          <Link to="/signup" className="login-container__link">
            <FormattedMessage message="common.signup"/>
          </Link>
        </div>
      </Form>
    );
  }

  handleSubmit(e){
    e.preventDefault();

    const {email, password} = this.refs;
    const {location} = this.props;
    const {login} = bindActions(TokenAction, this.context.flux);

    if (email.getError() || password.getError()){
      return;
    }

    login({
      email: email.getValue(),
      password: password.getValue()
    }).then(token => {
      this.setState({error: null});

      if (location.state && location.state.from){
        this.context.router.transitionTo(location.state.from);
      } else {
        this.context.router.transitionTo('/users/' + token.user_id);
      }
    }).catch(err => {
      this.setState({error: err.body || err});
    });
  }
}

export default Login;
