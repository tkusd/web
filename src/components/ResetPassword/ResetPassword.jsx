import React from 'react';
import {Form, InputGroup} from '../form';
import {FormattedMessage} from '../intl';
import {validators} from 'react-form-input';
import bindActions from '../../utils/bindActions';
import * as AppAction from '../../actions/AppAction';
import * as PasswordAction from '../../actions/PasswordAction';

class ResetPassword extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
  }

  static onEnter(state, transition){
    const {setPageTitle} = bindActions(AppAction, this);
    setPageTitle('Reset password');
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      error: null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render(){
    const {error} = this.state;

    return (
      <Form onSubmit={this.handleSubmit}>
        <h1 className="login-container__title">
          Reset password
        </h1>
        {error && !error.field && <div className="login-container__error">{error.message}</div>}
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
          Reset password
        </button>
      </Form>
    );
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const {password} = this.refs;
    const {sendPasswordReset} = bindActions(PasswordAction, this.context.flux);

    sendPasswordReset(this.props.params.resetToken, {
      password: password.getValue()
    }).then(() => {
      this.context.router.transitionTo('/');
    }).catch(err => {
      this.setState({error: err.body || err});
    });
  }
}

export default ResetPassword;
