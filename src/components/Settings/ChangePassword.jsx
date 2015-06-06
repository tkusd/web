import React from 'react';
import {Input} from '../form';
import {updateUser} from '../../actions/UserAction';

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

    return (
      <form
        className="form"
        onSubmit={this.handleSubmit}>
        {error && !error.field && <div className="form-error">{error.message}</div>}
        <Input
          id="password-old"
          name="old_password"
          ref="old_password"
          label="Current password"
          type="password"
          minLength={6}
          maxLength={50}/>
        <Input
          id="password-new"
          name="password"
          ref="password"
          label="New password"
          type="password"
          minLength={6}
          maxLength={50}/>
        <button type="submit">Change password</button>
      </form>
    );
  }

  handleSubmit(e){
    e.preventDefault();

    const {old_password, password} = this.refs;
    const {user} = this.props;

    if (old_password.getError() || password.getError()){
      return;
    }

    this.context.executeAction(updateUser, user.get('id'), {
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
