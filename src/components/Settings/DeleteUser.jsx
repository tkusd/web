import React from 'react';
import Translation from '../i18n/Translation';
import Portal from 'react-portal';
import DeleteUserModal from './DeleteUserModal';

class DeleteUser extends React.Component {
  static contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    router: React.PropTypes.func.isRequired,
    __: React.PropTypes.func.isRequired
  }

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
      <Portal openByClickOn={btn} closeOnEsc={true}>
        <DeleteUserModal context={this.context} user={this.props.user}/>
      </Portal>
    );
  }
}

export default DeleteUser;
