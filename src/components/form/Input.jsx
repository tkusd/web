import React from 'react';
import cx from 'classnames';
import {assign, omit} from 'lodash';
import * as validators from './validators';
import {List} from 'immutable';
import pureRender from '../../utils/pureRender';

function noop(){}

@pureRender
class Input extends React.Component {
  static propTypes = {
    name: React.PropTypes.string.isRequired,
    label: React.PropTypes.string,
    validator: React.PropTypes.arrayOf(React.PropTypes.func),
    transform: React.PropTypes.arrayOf(React.PropTypes.func),
    onChange: React.PropTypes.func,
    required: React.PropTypes.bool,
    type: React.PropTypes.string,
    minLength: React.PropTypes.number,
    maxLength: React.PropTypes.number,
    initialValue: React.PropTypes.any
  }

  static defaultProps = {
    validator: [],
    transform: [],
    onChange: noop,
    type: 'text',
    required: false
  }

  constructor(props, context){
    super(props, context);

    let state = this.state = {
      value: null,
      error: null,
      dirty: false,
      validator: List(this.props.validator),
      transform: List(this.props.transform)
    };

    if (this.props.required){
      state.validator = state.validator.unshift(validators.required());
    }

    if (this.props.type === 'email'){
      state.validator = state.validator.push(validators.email());
    }

    if (this.props.minLength || this.props.maxLength){
      state.validator = state.validator.push(validators.length(this.props.minLength, this.props.maxLength));
    }

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount(){
    this.setValue(this.props.initialValue || '');
  }

  render(){
    let dirty = this.isDirty();

    let className = cx('input__group', {
      dirty: dirty,
      pristine: !dirty
    });

    let props = assign({
      className: 'input'
    }, this.props, {
      onChange: this.handleChange,
      value: this.getValue()
    });

    let input = React.DOM.input(omit(props, 'transform', 'validator'));

    return (
      <div className={className}>
        {this.props.label && <label htmlFor={this.props.id} className="input__label">{this.props.label}</label>}
        {input}
        {this.getError() && <span className="input_error">{this.getError()}</span>}
      </div>
    );
  }

  handleChange(e){
    let data = this.setValue(e.target.value);
    this.props.onChange(data);
  }

  checkData(data){
    let value = this.transform(data);
    let error = this.validate(value) || '';

    return {value, error};
  }

  getValue(){
    return this.state.value;
  }

  setValue(data){
    let {value, error} = this.checkData(data);
    let dirty = true;
    let newData = {value, error, dirty};

    this.setState(newData);
    return newData;
  }

  getError(){
    return this.state.error;
  }

  setError(error){
    this.setState({error});
  }

  reset(){
    let {value, error} = this.checkData('');
    let dirty = false;

    this.setState({value, error, dirty});
  }

  validate(value){
    if (!this.state.validator) return '';

    for (let validator of this.state.validator){
      let error = validator(this, value);
      if (error) return error;
    }
  }

  transform(value){
    if (!this.state.transform) return value;

    for (let transform of this.state.transform){
      value = transform(this, value);
    }

    return value;
  }

  isDirty(){
    return this.state.dirty;
  }

  isPristine(){
    return !this.isDirty();
  }
}

export default Input;
