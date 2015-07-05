import React from 'react';
import {Link} from 'react-router';
import {Form, Input} from '../form';
import * as TokenAction from '../../actions/TokenAction';
import bindActions from '../../utils/bindActions';
import * as AppAction from '../../actions/AppAction';
import Translation from '../i18n/Translation';

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
          <Link to="/signup" className="login-container__link">
            <Translation id="common.signup"/>
          </Link>
        </div>
      </Form>
    );
  }

  handleSubmit(e){
    e.preventDefault();

    const {email, password} = this.refs;
    const {login} = bindActions(TokenAction, this.context.flux);

    if (email.getError() || password.getError()){
      return;
    }

    login({
      email: email.getValue(),
      password: password.getValue()
    }).then(token => {
      this.setState({error: null});
      this.context.router.transitionTo('/users/' + token.user_id);
    }).catch(err => {
      this.setState({error: err.body || err});
    });
  }
}

export default Login;
