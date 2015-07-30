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
    label: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element
    ]),
    initialValue: React.PropTypes.string,
    value: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired,
    min: React.PropTypes.number,
    max: React.PropTypes.number,
    className: React.PropTypes.string
  }

  static defaultProps = {
    onChange: noop
  }

  constructor(props, context){
    super(props, context);

    this.state = this.parseRawValue(this.props.value != null ? this.props.value : this.props.initialValue);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.hasOwnProperty('value') && nextProps.value !== this.props.value){
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
      data.value = Number(match[1]);
      data.unit = match[2];
    }

    return data;
  }

  render(){
    const {label} = this.props;
    let className = cx('size-input', {
      'size-input--full': this.isValueNeeded()
    }, this.props.className);

    return (
      <div className={className}>
        <label>
          {label && <span className="size-input__label">{label}</span>}
          <div className="size-input__field">
            <NumberInput
              className="size-input__value"
              value={this.state.value}
              onChange={this.handleInputChange}
              min={this.props.min}
              max={this.props.max}/>
            <select
              className="size-input__unit"
              value={this.state.unit}
              onChange={this.handleSelectChange}>
              <option value=""></option>
              <option value="auto">auto</option>
              <option value="px">px</option>
              <option value="pt">pt</option>
              <option value="em">em</option>
              <option value="%">%</option>
            </select>
          </div>
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
      this.props.onChange(this.getValue());
    }, 0);
  }

  handleInputChange(value){
    if (!this.isValueNeeded()) return;

    this.setValue({value});
  }

  handleSelectChange(e){
    this.setValue({
      unit: e.currentTarget.value
    });
  }
}

export default SizeInput;
