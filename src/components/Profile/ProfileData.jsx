import React from 'react';
import {Link} from 'react-router';

class ProfileData extends React.Component {
  static propTypes = {
    user: React.PropTypes.object.isRequired,
    currentUser: React.PropTypes.object
  }

  render(){
    let {user, currentUser} = this.props;

    return (
      <div>
        <h1>{user.get('name')}</h1>
        {currentUser && user.get('id') === currentUser.get('id') && <Link to="settings">Edit profile</Link>}
      </div>
    );
  }
}

export default ProfileData;
