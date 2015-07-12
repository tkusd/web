import React from 'react';
import throttle from 'lodash/function/throttle';
import cx from 'classnames';

if (process.env.BROWSER){
  require('../../styles/form/SizeInput.styl');
}

function noop(){}

const THROTTLE_DELAY = 50;

const PIXEL_REGEX = /^(\d+)px$/;
const EM_REGEX = /^(\d+)em$/;
const PERCENT_REGEX = /^(\d+)%$/;

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
    this.handleInputKeyDown = throttle(this.handleInputKeyDown.bind(this), THROTTLE_DELAY, {
      leading: true
    });
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.hasOwnProperty('value')){
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
    } else if (PIXEL_REGEX.test(value)){
      data.value = Number(value.match(PIXEL_REGEX)[1]);
      data.unit = 'px';
    } else if (EM_REGEX.test(value)){
      data.value = Number(value.match(EM_REGEX)[1]);
      data.unit = 'em';
    } else if (PERCENT_REGEX.test(value)){
      data.value = Number(value.match(PERCENT_REGEX)[1]);
      data.unit = '%';
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
            <input
              className="size-input__value"
              value={this.state.value}
              onChange={this.handleInputChange}
              onKeyDown={this.handleInputKeyDown}
              min={this.props.min}
              max={this.props.max}/>
            <select
              className="size-input__unit"
              value={this.state.unit}
              onChange={this.handleSelectChange}>
              <option value=""></option>
              <option value="auto">auto</option>
              <option value="px">px</option>
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

    if (this.isValueNeeded()){
      return value + unit;
    } else {
      return unit;
    }
  }

  setValue(value){
    const {min, max} = this.props;
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

    if (typeof newState.value === 'number'){
      if (typeof min === 'number' && newState.value < min) newState.value = min;
      if (typeof max === 'number' && newState.value > max) newState.value = max;
    }

    this.setState(newState);

    setTimeout(() => {
      this.props.onChange(this.getValue());
    }, 0);
  }

  handleInputChange(e){
    if (!this.isValueNeeded()) return;

    this.setValue({
      value: Number(e.currentTarget.value)
    });
  }

  handleInputKeyDown(e){
    if (!this.isValueNeeded()) return;

    switch (e.keyCode){
      case 38: // up
        this.increase();
        break;

      case 40: // down
        this.decrease();
        break;
    }
  }

  handleSelectChange(e){
    this.setValue({
      unit: e.currentTarget.value
    });
  }

  increase(){
    const {value} = this.state;
    this.setValue({value: value ? value + 1 : 1});
  }

  decrease(){
    const {value} = this.state;
    this.setValue({value: value ? value - 1 : -1});
  }
}

export default SizeInput;
