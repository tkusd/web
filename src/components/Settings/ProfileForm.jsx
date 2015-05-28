import React from 'react';
import {Input, validators} from '../form';
import * as UserAction from '../../actions/UserAction';

class ProfileForm extends React.Component {
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
    let {user} = this.props;
    let {error} = this.state;
    let commonError = error && !error.field ? error.message : null;

    return (
      <form
        className="form"
        onSubmit={this.handleSubmit}>
        <div className="form-error">{commonError}</div>
        <Input
          id="profile-name"
          name="name"
          ref="name"
          label="Name"
          type="text"
          value={user.name}
          validator={[
            validators.required(),
            validators.length(0, 100)
          ]}/>
        <Input
          id="profile-email"
          name="email"
          ref="email"
          label="Email"
          type="email"
          value={user.email}
          validator={[
            validators.required(),
            validators.email()
          ]}/>
        <button type="submit" className="btn">Update</button>
      </form>
    );
  }

  handleSubmit(e){
    e.preventDefault();

    let {name, email} = this.refs;

    if (name.getError() || email.getError()){
      return;
    }

    this.setState({error: null});

    this.context.executeAction(UserAction.update, {
      id: this.props.user.id,
      name: name.getValue(),
      email: email.getValue()
    }).catch(err => {
      this.setState({error: err.body || err});
    });
  }
}

export default ProfileForm;
