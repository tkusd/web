import React from 'react';
import {Input, validators} from '../form';
import {connectToStores} from 'fluxible/addons';
import UserStore from '../../stores/UserStore';
import * as UserAction from '../../actions/UserAction';

class ProfileForm extends React.Component {
  static contextTypes = {
    executeAction: React.PropTypes.func.isRequired
  }

  static propTypes = {
    userData: React.PropTypes.object,
    userError: React.PropTypes.object
  }

  componentWillUnmount(){
    this.context.executeAction(UserAction.resetError);
  }

  render(){
    let {userData} = this.props;

    return (
      <form
        className="form"
        onSubmit={this.handleSubmit.bind(this)}>
        <Input
          id="profile-name"
          name="name"
          ref="name"
          label="Name"
          type="text"
          value={userData.name}
          validator={[
            validators.required,
            validators.length(0, 100)
          ]}/>
        <Input
          id="profile-email"
          name="email"
          ref="email"
          label="Email"
          type="email"
          value={userData.email}
          validator={[
            validators.required,
            validators.email
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

    this.context.executeAction(UserAction.update, {
      id: this.props.userData.id,
      name: name.getValue(),
      email: email.getValue()
    });
  }
}

ProfileForm = connectToStores(ProfileForm, [UserStore], (stores, props) => ({
  userData: stores.UserStore.getCurrentUser() || {},
  userError: stores.UserStore.getError()
}));

export default ProfileForm;
