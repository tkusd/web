import React from 'react';
import * as UserAction from '../../actions/UserAction';
import {Modal} from '../modal';
import {Form} from '../form';
import bindActions from '../../utils/bindActions';
import {FormattedMessage} from '../intl';

class DeleteUserModal extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    user: React.PropTypes.object.isRequired
  }

  constructor(props, context){
    super(props, context);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render(){
    const {closeModal} = this.props;

    return (
      <Modal title={<FormattedMessage message="settings.deleteAccount"/>} onDismiss={closeModal}>
        <Form onSubmit={this.handleSubmit}>
          <p>
            <FormattedMessage message="settings.deleteAccountPrompt"/>
          </p>
          <div className="modal__btn-group">
            <a className="modal__btn" onClick={closeModal}>
              <FormattedMessage message="common.cancel"/>
            </a>
            <button className="modal__btn--danger" type="submit">
              <FormattedMessage message="common.delete"/>
            </button>
          </div>
        </Form>
      </Modal>
    );
  }

  handleSubmit(e){
    e.preventDefault();

    const {user} = this.props;
    const {deleteUser} = bindActions(UserAction, this.context.flux);

    deleteUser(user.get('id')).then(() => {
      this.context.router.transitionTo('/');
    });
  }
}

export default DeleteUserModal;
