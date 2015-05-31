import React from 'react';

class ProfileData extends React.Component {
  static propTypes = {
    user: React.PropTypes.object.isRequired,
    currentUser: React.PropTypes.object
  }

  render(){
    let {user} = this.props;

    return <div>{user.name}</div>;
  }
}

export default ProfileData;
