import React from 'react';
import {deleteUser} from '../../actions/UserAction';
import {Modal} from '../modal';
import {Form} from '../form';

class DeleteUserModal extends React.Component {
  static propTypes = {
    user: React.PropTypes.object.isRequired,
    context: React.PropTypes.object.isRequired
  }

  constructor(props, context){
    super(props, context);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render(){
    const {closePortal, context} = this.props;
    const {__} = context;

    return (
      <Modal title={__('settings.delete_account')} onDismiss={closePortal}>
        <Form onSubmit={this.handleSubmit}>
          <p>{__('settings.delete_account_prompt')}</p>
          <div className="modal__btn-group">
            <a className="modal__btn" onClick={closePortal}>{__('common.cancel')}</a>
            <button className="modal__btn--danger" type="submit">{__('common.delete')}</button>
          </div>
        </Form>
      </Modal>
    );
  }

  handleSubmit(e){
    e.preventDefault();

    const {user, context} = this.props;

    context.executeAction(deleteUser, user.get('id')).then(() => {
      context.router.transitionTo('home');
    });
  }
}

export default DeleteUserModal;
