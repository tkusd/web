import React from 'react';
import cx from 'classnames';
import {assign, omit} from 'lodash';

function noop(){}

class Input extends React.Component {
  static propTypes = {
    name: React.PropTypes.string.isRequired,
    label: React.PropTypes.string,
    validator: React.PropTypes.arrayOf(React.PropTypes.func),
    transform: React.PropTypes.arrayOf(React.PropTypes.func),
    onChange: React.PropTypes.func
  }

  static defaultProps = {
    validator: [],
    transform: [],
    onChange: noop
  }

  constructor(props, context){
    super(props, context);

    let data = this.checkData(this.props.value || '');
    let value = data.value;
    let error = data.error;
    let dirty = false;

    this.state = {value, error, dirty};
    this.handleChange = this.handleChange.bind(this);
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
        <label htmlFor={this.props.id} className="input__label">{this.props.label}</label>
        {input}
        <span className="input__error">{this.getError()}</span>
      </div>
    );
  }

  handleChange(e){
    let {value, error} = this.setValue(e.target.value);

    this.props.onChange({value, error});
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
    if (!this.props.validator) return '';

    for (let validator of this.props.validator){
      let error = validator(this, value);
      if (error) return error;
    }
  }

  transform(value){
    if (!this.props.transform) return value;

    for (let transform of this.props.transform){
      value = transform(this, value);
    }

    return value;
  }

  getName(){
    return this.props.name;
  }

  getLabel(){
    return this.props.label || this.getName();
  }

  isDirty(){
    return this.state.dirty;
  }

  isPristine(){
    return !this.isDirty();
  }
}

export default Input;
