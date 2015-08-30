import React from 'react';
import cx from 'classnames';
import NumberInput from './NumberInput';

if (process.env.BROWSER){
  require('../../styles/form/SizeInput.styl');
}

function noop(){}

const UNIT_REGEX = /^(\d+)(px|pt|em|%)$/;

class SizeInput extends React.Component {
  static propTypes = {
    defaultValue: React.PropTypes.string,
    value: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired,
    className: React.PropTypes.string
  }

  static defaultProps = {
    onChange: noop
  }

  constructor(props, context){
    super(props, context);

    this.state = this.parseRawValue(this.props.value != null ? this.props.value : this.props.defaultValue);
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.value !== this.props.value){
      this.setState(this.parseRawValue(nextProps.value));
    }
  }

  parseRawValue(value){
    let data = {
      value: 0,
      unit: ''
    };

    if (!value) return data;

    if (value === 'auto'){
      data.unit = 'auto';
    } else if (UNIT_REGEX.test(value)){
      let match = value.match(UNIT_REGEX);
      data.value = +match[1];
      data.unit = match[2];
    }

    return data;
  }

  render(){
    let className = cx('size-input', {
      'size-input--full': this.isValueNeeded()
    }, this.props.className);

    return (
      <div className={className}>
        <NumberInput {...this.props}
          className="size-input__value"
          value={this.state.value}
          onChange={this.handleInputChange}/>
        <label className="size-input__unit">
          {this.state.unit}
          <select className="size-input__unit-select"
            value={this.state.unit}
            onChange={this.handleSelectChange}>
            <option value=""></option>
            <option value="auto">auto</option>
            <option value="px">px</option>
            <option value="pt">pt</option>
            <option value="em">em</option>
            <option value="%">%</option>
          </select>
        </label>
      </div>
    );
  }

  isValueNeeded(){
    const {unit} = this.state;
    return unit && unit !== 'auto';
  }

  getValue(){
    const {value, unit} = this.state;

    if (!unit) return;

    if (this.isValueNeeded()){
      return value + unit;
    } else {
      return unit;
    }
  }

  setValue(value){
    let newState = {};

    switch (typeof value){
    case 'object':
      newState = value;
      break;

    case 'number':
      newState = {value};
      break;

    case 'string':
      newState = this.parseRawValue(value);
      break;
    }

    this.setState(newState);

    setTimeout(() => {
      if (this.isValueNeeded() && !this.state.value) return;
      this.props.onChange(this.getValue());
    }, 0);
  }

  handleInputChange = (value) => {
    if (!this.isValueNeeded()) return;

    this.setValue({value});
  }

  handleSelectChange = (e) => {
    this.setValue({
      unit: (e.currentTarget || e.target).value
    });
  }
}

export default SizeInput;
