import React from 'react';
import * as UserAction from '../../actions/UserAction';
import {Modal} from '../modal';
import {Form} from '../form';
import bindActions from '../../utils/bindActions';
import Translation from '../i18n/Translation';

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
      <Modal title={<Translation id="settings.delete_account"/>} onDismiss={closeModal}>
        <Form onSubmit={this.handleSubmit}>
          <p>
            <Translation id="settings.delete_account_prompt"/>
          </p>
          <div className="modal__btn-group">
            <a className="modal__btn" onClick={closeModal}>
              <Translation id="common.cancel"/>
            </a>
            <button className="modal__btn--danger" type="submit">
              <Translation id="common.delete"/>
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
