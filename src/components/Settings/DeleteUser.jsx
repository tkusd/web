import React from 'react';
import * as UserAction from '../../actions/UserAction';
import {connectToStores} from 'fluxible/addons';
import UserStore from '../../stores/UserStore';

class DeleteUser extends React.Component {
  static contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    router: React.PropTypes.func.isRequired
  }

  static propTypes = {
    currentUser: React.PropTypes.object
  }

  componentDidUpdate(){
    let {currentUser} = this.props;

    if (!currentUser){
      this.context.router.transitionTo('home');
    }
  }

  componentWillUnmount(){
    this.context.executeAction(UserAction.resetError);
  }

  render(){
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <button type="submit">Delete my account</button>
      </form>
    );
  }

  handleSubmit(e){
    e.preventDefault();
    if (!confirm('Are you sure?')) return;

    this.context.executeAction(UserAction.destroy);
  }
}

DeleteUser = connectToStores(DeleteUser, [UserStore], (stores, props) => ({
  currentUser: stores.UserStore.getCurrentUser()
}));

export default DeleteUser;
