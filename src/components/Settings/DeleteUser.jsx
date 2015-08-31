import React from 'react';
import {FormattedMessage} from '../intl';
import {ModalPortal} from '../modal';
import DeleteUserModal from './DeleteUserModal';

class DeleteUser extends React.Component {
  static propTypes = {
    user: React.PropTypes.object.isRequired
  }

  render(){
    let btn = (
      <button className="settings__button--danger">
        <FormattedMessage message="settings.deleteAccount"/>
      </button>
    );

    return (
      <ModalPortal trigger={btn}>
        <DeleteUserModal user={this.props.user}/>
      </ModalPortal>
    );
  }
}

export default DeleteUser;
