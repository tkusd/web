import React from 'react';
import {Input, validators} from '../form';
import * as UserAction from '../../actions/UserAction';

class ChangePassword extends React.Component {
  static contextTypes = {
    executeAction: React.PropTypes.func.isRequired
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
    let commonError = error && !error.field ? error.message : null;

    return (
      <form
        className="form"
        onSubmit={this.handleSubmit}>
        <div className="form-error">{commonError}</div>
        <Input
          id="password-old"
          name="old_password"
          ref="old_password"
          label="Current password"
          type="password"
          validator={[
            validators.length(6, 50)
          ]}/>
        <Input
          id="password-new"
          name="password"
          ref="password"
          label="New password"
          type="password"
          validator={[
            validators.length(6, 50)
          ]}/>
        <button type="submit">Change password</button>
      </form>
    );
  }

  handleSubmit(e){
    e.preventDefault();

    let {old_password, password} = this.refs;

    if (old_password.getError() || password.getError()){
      return;
    }

    this.setState({error: null});

    this.context.executeAction(UserAction.update, {
      id: this.props.user.id,
      old_password: old_password.getValue(),
      password: password.getValue()
    }).catch(err => {
      this.setState({error: err.body || err});
    });
  }
}

export default ChangePassword;
