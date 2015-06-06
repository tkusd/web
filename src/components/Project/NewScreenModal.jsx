import React from 'react';
import {Modal} from '../modal';
import {Input} from '../form';
import {createElement} from '../../actions/ElementAction';

class NewScreenModal extends React.Component {
  static propTypes = {
    project: React.PropTypes.object.isRequired
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
      <Modal title="New screen" onDismiss={this.props.closePortal}>
        <form onSubmit={this.handleSubmit}>
          {error && !error.field && <div className="form-error">{error.message}</div>}
          <Input
            id="new-screen-name"
            name="name"
            ref="name"
            label="Name"
            type="text"
            required
            maxLength={255}/>
          <button type="submit">Create</button>
        </form>
      </Modal>
    );
  }

  handleSubmit(e){
    e.preventDefault();

    let {name} = this.refs;
    let {context} = this.props;

    if (name.getError()){
      return;
    }

    context.executeAction(createElement, this.props.project.id, {
      name: name.getValue(),
      type: 'screen'
    }).then(element => {
      this.props.closePortal();
    }, err => {
      this.setState({error: err.body || err});
    });
  }
}

export default NewScreenModal;
