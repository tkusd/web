import React from 'react';

class ProfileData extends React.Component {
  static propTypes = {
    user: React.PropTypes.object.isRequired
  }

  render(){
    let {user} = this.props;

    return <div>{user.name}</div>;
  }
}

export default ProfileData;
