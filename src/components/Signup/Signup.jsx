import React from 'react';
import {Link} from 'react-router';
import {Form, Input} from '../form';
import * as UserAction from '../../actions/UserAction';
import * as AppAction from '../../actions/AppAction';
import * as TokenAction from '../../actions/TokenAction';
import Translation from '../i18n/Translation';
import bindActions from '../../utils/bindActions';

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
    let {error} = this.state;

    return (
      <Form onSubmit={this.handleSubmit}>
        <h1 className="login-container__title">
          <Translation id="common.signup"/>
        </h1>
        {error && !error.field && <div className="login-container__error">{error.message}</div>}
        <Input
          name="name"
          ref="name"
          label={<Translation id="common.name"/>}
          type="text"
          required
          maxLength={100}/>
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
          <Translation id="common.signup"/>
        </button>
        <div className="login-container__link-group">
          <Translation id="login.login_link_hint"/>
          {' '}
          <Link to="/login" className="login-container__link">
            <Translation id="common.login"/>
          </Link>
        </div>
      </Form>
    );
  }

  handleSubmit(e){
    e.preventDefault();

    const {name, email, password} = this.refs;
    const {createUser} = bindActions(UserAction, this);

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
    const {login} = bindActions(TokenAction, this);

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
