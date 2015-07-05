import React from 'react';
import {Link} from 'react-router';
import Gravatar from '../common/Gravatar';
import Translation from '../i18n/Translation';
import FontAwesome from '../common/FontAwesome';

if (process.env.BROWSER){
  require('../../styles/Profile/ProfileData.styl');
}

class ProfileData extends React.Component {
  static propTypes = {
    user: React.PropTypes.object.isRequired,
    currentUser: React.PropTypes.object
  }

  render(){
    const {user, currentUser} = this.props;

    return (
      <div className="profile-data">
        <Gravatar src={user.get('avatar')} size={150} className="profile-data__avatar"/>
        <h1 className="profile-data__name">{user.get('name')}</h1>
        {currentUser && user.get('id') === currentUser.get('id') && (
          <Link to="/settings" className="profile-data__edit-link">
            <FontAwesome icon="pencil"/><Translation id="profile.edit_profile"/>
          </Link>
        )}
      </div>
    );
  }
}

export default ProfileData;
