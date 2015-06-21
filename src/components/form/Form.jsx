import React from 'react';
import cx from 'classnames';
import {assign, omit} from 'lodash';

function noop(){}

class Form extends React.Component {
  static propTypes = {
    onSubmit: React.PropTypes.func
  }

  static defaultProps = {
    onSubmit: noop
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      submitted: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render(){
    let props = assign({
      onSubmit: this.handleSubmit,
      className: ''
    }, omit(this.props, 'children', 'onSubmit'));

    if (this.state.submitted){
      props.className = cx(props.className, 'submitted');
    }

    return React.DOM.form(props, this.props.children);
  }

  handleSubmit(e){
    e.preventDefault();

    this.setState({submitted: true});
    this.props.onSubmit(e);
  }
}

export default Form;
