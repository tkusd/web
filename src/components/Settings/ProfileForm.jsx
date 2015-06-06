import React from 'react';
import {Input} from '../form';
import {updateUser} from '../../actions/UserAction';

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

    return (
      <form
        className="form"
        onSubmit={this.handleSubmit}>
        {error && !error.field && <div className="form-error">{error.message}</div>}
        <Input
          id="profile-name"
          name="name"
          ref="name"
          label="Name"
          type="text"
          initialValue={user.get('name')}
          required
          maxLength={100}/>
        <Input
          id="profile-email"
          name="email"
          ref="email"
          label="Email"
          type="email"
          initialValue={user.get('email')}
          required/>
        <button type="submit" className="btn">Update</button>
      </form>
    );
  }

  handleSubmit(e){
    e.preventDefault();

    const {name, email} = this.refs;
    const {user} = this.props;

    if (name.getError() || email.getError()){
      return;
    }

    this.context.executeAction(updateUser, user.get('id'), {
      name: name.getValue(),
      email: email.getValue()
    }).then(() => {
      this.setState({error: null});
    }).catch(err => {
      this.setState({error: err.body || err});
    });
  }
}

export default ProfileForm;
