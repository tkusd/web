import React from 'react';
import {Modal} from '../modal';
import {Form, Input} from '../form';
import * as ProjectAction from '../../actions/ProjectAction';
import Translation from '../i18n/Translation';
import bindActions from '../../utils/bindActions';

class NewProjectModal extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
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
    const {error} = this.state;

    if (error && error.field){
      this.refs[error.field].setError(error.message);
    }
  }

  render(){
    const {error} = this.state;
    const {closeModal} = this.props;

    return (
      <Modal title={<Translation id="profile.new_project"/>} onDismiss={closeModal}>
        <Form onSubmit={this.handleSubmit}>
          {error && !error.field && <div>{error.message}</div>}
          <Input
            name="title"
            ref="title"
            label={<Translation id="common.title"/>}
            type="text"
            required
            maxLength={255}/>
          <div className="modal__btn-group">
            <a className="modal__btn" onClick={closeModal}>
              <Translation id="common.cancel"/>
            </a>
            <button className="modal__btn--primary" type="submit">
              <Translation id="common.create"/>
            </button>
          </div>
        </Form>
      </Modal>
    );
  }

  handleSubmit(e){
    e.preventDefault();

    const {title} = this.refs;
    const {createProject} = bindActions(ProjectAction, this.context.flux);

    if (title.getError()){
      return;
    }

    createProject(this.props.user.get('id'), {
      title: title.getValue()
    }).then(project => {
      this.setState({error: null});
      this.context.router.transitionTo('/projects/' + project.id);
    }, err => {
      this.setState({error: err.body || err});
    });
  }
}

export default NewProjectModal;
