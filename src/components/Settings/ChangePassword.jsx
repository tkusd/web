import React from 'react';
import {Input, validators} from '../form';

class ChangePassword extends React.Component {
  render(){
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
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
  }
}

export default ChangePassword;
