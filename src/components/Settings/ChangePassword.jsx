import React from 'react';
import {Form, Input} from '../form';
import * as UserAction from '../../actions/UserAction';
import Translation from '../i18n/Translation';
import bindActions from '../../utils/bindActions';

class ChangePassword extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired
  }

  static propTypes = {
    user: React.PropTypes.object.isRequired
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      error: null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate(){
    let {error} = this.state;

    if (error && error.field){
      this.refs[error.field].setError(error.message);
    }
  }

  render(){
    let {error} = this.state;

    return (
      <Form onSubmit={this.handleSubmit}>
        {error && !error.field && <div className="settings__form-error">{error.message}</div>}
        <Input
          name="old_password"
          ref="old_password"
          label={<Translation id="settings.current_password"/>}
          type="password"
          minLength={6}
          maxLength={50}/>
        <Input
          name="password"
          ref="password"
          label={<Translation id="settings.new_password"/>}
          type="password"
          minLength={6}
          maxLength={50}/>
        <button type="submit" className="settings__button--primary">
          <Translation id="settings.change_password"/>
        </button>
      </Form>
    );
  }

  handleSubmit(e){
    e.preventDefault();

    const {old_password, password} = this.refs;
    const {user} = this.props;
    const {updateUser} = bindActions(UserAction, this.context.flux);

    if (old_password.getError() || password.getError()){
      return;
    }

    updateUser(user.get('id'), {
      old_password: old_password.getValue(),
      password: password.getValue()
    }).then(() => {
      this.setState({error: null});
    }).catch(err => {
      this.setState({error: err.body || err});
    });
  }
}

export default ChangePassword;
