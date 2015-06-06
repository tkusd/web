import React from 'react';
import {deleteData} from '../../actions/UserAction';

class DeleteUser extends React.Component {
  static contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    router: React.PropTypes.func.isRequired
  }

  constructor(props, context){
    super(props, context);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render(){
    return (
      <form onSubmit={this.handleSubmit}>
        <button type="submit">Delete my account</button>
      </form>
    );
  }

  handleSubmit(e){
    e.preventDefault();
    if (!confirm('Are you sure?')) return;

    this.context.executeAction(deleteData).then(() => {
      this.context.router.transitionTo('home');
    });
  }
}

export default DeleteUser;
