import React from 'react';
import {Modal} from '../modal';
import {Input, validators} from '../form';
import * as ProjectAction from '../../actions/ProjectAction';

class NewProjectModal extends React.Component {
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
    let commonError = error && !error.field ? error.message : null;

    return (
      <Modal title="New project" onDismiss={this.props.closePortal}>
        <form onSubmit={this.handleSubmit}>
          <div className="form-error">{commonError}</div>
          <Input
            id="new-project-title"
            name="title"
            ref="title"
            label="Title"
            type="text"
            validator={[
              validators.required(),
              validators.length(0, 255)
            ]}/>
          <button type="submit">Create</button>
        </form>
      </Modal>
    );
  }

  handleSubmit(e){
    e.preventDefault();

    let {title} = this.refs;
    let {context} = this.props;

    if (title.getError()){
      return;
    }

    context.executeAction(ProjectAction.create, {
      user_id: this.props.user.id,
      title: title.getValue()
    }).then(project => {
      context.router.transitionTo('project', project);
    }, err => {
      this.setState({error: err.body || err});
    });
  }
}

export default NewProjectModal;
