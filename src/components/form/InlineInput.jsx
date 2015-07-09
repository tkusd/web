import React from 'react';
import Input from './Input';
import Form from './Form';
import omit from 'lodash/object/omit';

function noop(){}

class InlineInput extends React.Component {
  static propTypes = {
    onSubmit: React.PropTypes.func.isRequired
  }

  static defaultProps = {
    onSubmit: noop
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      inputing: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  render(){
    if (this.state.inputing){
      return (
        <Form onSubmit={this.handleSubmit}>
          <Input
            {...omit(this.props, 'children', 'onSubmit')}
            ref="input"
            onKeyDown={this.handleKeyDown}
            onBlur={this.handleBlur}/>
        </Form>
      );
    } else {
      return <div>{this.props.children}</div>;
    }
  }

  startInput(){
    this.setState({
      inputing: true
    });

    setTimeout(() => {
      this.refs.input.focus();
    }, 0);
  }

  stopInput(){
    this.setState({
      inputing: false
    });
  }

  toggleInput(){
    if (this.state.inputing){
      this.stopInput();
    } else {
      this.startInput();
    }
  }

  handleSubmit(e){
    e.preventDefault();
    this.props.onSubmit(e);
  }

  handleKeyDown(e){
    if (e.keyCode === 27){
      this.stopInput();
    }
  }

  handleBlur(){
    this.stopInput();
  }

  getValue(){
    return this.refs.input.getValue();
  }

  setValue(value){
    this.refs.input.setValue(value);
  }

  getError(){
    return this.refs.input.getError();
  }

  setError(err){
    this.refs.input.setError(err);
  }

  reset(){
    this.refs.input.reset();
  }
}

export default InlineInput;
