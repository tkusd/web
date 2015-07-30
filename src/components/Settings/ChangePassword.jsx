import React from 'react';
import {Form, InputGroup} from '../form';
import {validators} from 'react-form-input';
import * as UserAction from '../../actions/UserAction';
import bindActions from '../../utils/bindActions';
import {FormattedMessage} from '../intl';

class ChangePassword extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired
  }

  static propTypes = {
    user: React.PropTypes.object.isRequired
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
        {error && !error.field && <div className="settings__form-error">{error.message}</div>}
        <InputGroup
          ref="old_password"
          label={<FormattedMessage message="settings.current_password"/>}
          type="password"
          validators={[
            validators.length(6, 50, 'The length of the password must be between 6 to 50')
          ]}/>
        <InputGroup
          ref="password"
          label={<FormattedMessage message="settings.new_password"/>}
          type="password"
          validators={[
            validators.length(6, 50, 'The length of the password must be between 6 to 50')
          ]}/>
        <button type="submit" className="settings__button--primary">
          <FormattedMessage message="settings.change_password"/>
        </button>
      </Form>
    );
  }

  handleSubmit(e){
    e.preventDefault();

    const {old_password, password} = this.refs;
    const {user} = this.props;
    const {updateUser} = bindActions(UserAction, this.context.flux);

    if (old_password.getError() || password.getError()){
      return;
    }

    updateUser(user.get('id'), {
      old_password: old_password.getValue(),
      password: password.getValue()
    }).then(() => {
      this.setState({error: null});
    }).catch(err => {
      this.setState({error: err.body || err});
    });
  }
}

export default ChangePassword;
