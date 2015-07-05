import React from 'react';
import cx from 'classnames';
import {assign, omit} from 'lodash';
import * as validators from './validators';
import {List} from 'immutable';
import pureRender from '../../decorators/pureRender';

if (process.env.BROWSER){
  require('../../styles/form/Input.styl');
}

let inputID = 0;

function noop(){}

@pureRender
class Input extends React.Component {
  static propTypes = {
    name: React.PropTypes.string.isRequired,
    label: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element
    ]),
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
      transform: List(this.props.transform),
      id: inputID++
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

  componentWillUpdate(nextProps){
    if (nextProps.initialValue !== this.props.initialValue){
      this.setValue(nextProps.initialValue || '');
    }
  }

  render(){
    let {label, id} = this.props;
    let dirty = this.isDirty();
    let error = this.getError();
    let className = cx('input', {
      dirty: dirty,
      pristine: !dirty,
      invalid: error,
      valid: !error
    }, this.props.className);

    if (!id){
      id = 'input-' + this.state.id;
    }

    let props = assign({
      className: 'input__field'
    }, omit(this.props, 'className', 'transform', 'validator', 'label', 'children'), {
      onChange: this.handleChange,
      value: this.getValue(),
      id: id,
      ref: 'input'
    });

    let element;

    if (props.type === 'select'){
      element = (
        <div className="input__select">
          <select {...omit(props, 'type')}>
            {this.props.children}
          </select>
        </div>
      );
    } else if (props.type === 'textarea'){
      element = <textarea {...omit(props, 'type')}/>;
    } else {
      element = <input {...props}/>;
    }

    return (
      <div className={className}>
        {label && <label htmlFor={id} className="input__label">{label}</label>}
        {element}
        {error && <span className="input__error">{error}</span>}
      </div>
    );
  }

  handleChange(e){
    let data = this.setValue(e.currentTarget.value);
    this.props.onChange(data);

    this.setState({
      dirty: true
    });
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
    let newData = {value, error};

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
    let {value, error} = this.checkData(this.props.initialValue);
    let dirty = false;

    this.setState({value, error, dirty});
  }

  validate(value){
    let error = '';

    // Don't use for..of because it may cause errors on Safari
    this.state.validator.forEach(validator => {
      error = validator(this, value);
      if (error) return false;
    });

    return error;
  }

  transform(value){
    this.state.transform.forEach(transform => {
      value = transform(this, value);
    });

    return value;
  }

  isDirty(){
    return this.state.dirty;
  }

  isPristine(){
    return !this.isDirty();
  }

  focus(){
    this.refs.input.focus();
  }

  blur(){
    this.refs.input.blur();
  }
}

export default Input;
