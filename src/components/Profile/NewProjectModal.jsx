import React from 'react';
import {Modal} from '../modal';
import {Form, Input} from '../form';
import {createProject} from '../../actions/ProjectAction';

class NewProjectModal extends React.Component {
  static propTypes = {
    user: React.PropTypes.object.isRequired,
    context: React.PropTypes.object.isRequired
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
    const {context, closePortal} = this.props;
    const {__} = context;

    return (
      <Modal title={__('profile.new_project')} onDismiss={closePortal}>
        <Form onSubmit={this.handleSubmit}>
          {error && !error.field && <div>{error.message}</div>}
          <Input
            id="new-project-title"
            name="title"
            ref="title"
            label={__('common.title')}
            type="text"
            required
            maxLength={255}/>
          <div className="modal__btn-group">
            <a className="modal__btn" onClick={closePortal}>{__('common.cancel')}</a>
            <button className="modal__btn--primary" type="submit">{__('common.create')}</button>
          </div>
        </Form>
      </Modal>
    );
  }

  handleSubmit(e){
    e.preventDefault();

    const {title} = this.refs;
    const {context} = this.props;

    if (title.getError()){
      return;
    }

    context.executeAction(createProject, this.props.user.get('id'), {
      title: title.getValue()
    }).then(project => {
      this.setState({error: null});
      context.router.transitionTo('project', project);
    }, err => {
      this.setState({error: err.body || err});
    });
  }
}

export default NewProjectModal;
