import React from 'react';
import {Modal} from '../modal';
import {Form, Input} from '../form';
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
    const {context, closePortal} = this.props;
    const {__} = context;

    return (
      <Modal title={__('project.new_screen')} onDismiss={closePortal}>
        <Form onSubmit={this.handleSubmit}>
          {error && !error.field && <div>{error.message}</div>}
          <Input
            id="new-screen-name"
            name="name"
            ref="name"
            label={__('common.name')}
            type="text"
            required
            maxLength={255}/>
          <div className="modal__btn-group">
            <a className="modal__btn" onClick={closePortal}>{__('common.cancel')}</a>
            <button type="submit" className="modal__btn--primary">{__('common.create')}</button>
          </div>
        </Form>
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
