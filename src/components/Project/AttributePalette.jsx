import React from 'react';
import Palette from './Palette';
import {Input} from '../form';
import {updateElement} from '../../actions/ElementAction';

class AttributePalette extends React.Component {
  static contextTypes = {
    executeAction: React.PropTypes.func.isRequired
  }

  static propTypes = {
    elements: React.PropTypes.object.isRequired,
    selectedElement: React.PropTypes.string
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
    return (
      <Palette title="Attributes">
        {this.renderForm()}
      </Palette>
    );
  }

  renderForm(){
    const {elements, selectedElement} = this.props;
    if (!selectedElement) return;

    const {error} = this.state;
    const element = elements.get(selectedElement);

    return (
      <form onSubmit={this.handleSubmit}>
        {error && !error.field && <div className="form-error">{error.message}</div>}
        <Input
          id="attribute-name"
          name="name"
          ref="name"
          label="Name"
          type="text"
          initialValue={element.get('name')}
          required
          maxLength={255}/>
        <button type="submit">Upddate</button>
      </form>
    );
  }

  handleSubmit(e){
    e.preventDefault();

    const {name} = this.refs;
    const {selectedElement} = this.props;

    if (name.getError()) return;

    this.context.executeAction(updateElement, selectedElement, {
      name: name.getValue()
    }).then(() => {
      this.setState({error: null});
    }).catch(err => {
      this.setState({error: err.body || err});
    });
  }
}

export default AttributePalette;
