import React from 'react';
import Translation from '../i18n/Translation';
import {ModalPortal} from '../modal';
import DeleteUserModal from './DeleteUserModal';

class DeleteUser extends React.Component {
  static propTypes = {
    user: React.PropTypes.object.isRequired
  }

  render(){
    let btn = (
      <button className="settings__button--danger">
        <Translation id="settings.delete_account"/>
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
