import React from 'react';
import {Modal} from '../modal';
import {Form, InputGroup} from '../form';
import {validators} from 'react-form-input';
import {FormattedMessage} from '../intl';
import * as PasswordAction from '../../actions/PasswordAction';
import bindActions from '../../utils/bindActions';

class ResetPasswordModal extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      error: null
    };
  }

  componentDidUpdate(){
    const {error} = this.state;

    if (error && error.field){
      this.refs[error.field].setError(error.message);
    }
  }

  render(){
    const {error} = this.state;
    const {closeModal} = this.props;

    return (
      <Modal title="Reset password" onDismiss={closeModal}>
        <Form onSubmit={this.handleSubmit}>
          <p>
            Enter your email here and we will send you an email with the instruction to help you reset your password.
          </p>
          {error && !error.field && <div>{error.message}</div>}
          <InputGroup
            ref="email"
            label={<FormattedMessage message="common.email"/>}
            type="email"
            required
            validators={[
              validators.required('Email is required'),
              validators.email('Email is invalid')
            ]}/>
          <div className="modal__btn-group">
            <a className="modal__btn" onClick={closeModal}>
              <FormattedMessage message="common.cancel"/>
            </a>
            <button className="modal__btn--primary" type="submit">
              Submit
            </button>
          </div>
        </Form>
      </Modal>
    );
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const {email} = this.refs;
    const {createPasswordReset} = bindActions(PasswordAction, this.context.flux);

    if (email.getError()) return;

    createPasswordReset({
      email: email.getValue()
    }).then(() => {
      this.setState({error: null});
      this.props.closeModal();
    }).catch(err => {
      this.setState({error: err.body || err});
    });
  }
}

export default ResetPasswordModal;
