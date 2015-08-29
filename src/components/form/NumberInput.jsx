import React from 'react';
import debounce from 'lodash/function/debounce';

function noop(){}

const DEBOUNCE_DELAY = 100;

class NumberInput extends React.Component {
  static propTypes = {
    value: React.PropTypes.number,
    defaultValue: React.PropTypes.number,
    step: React.PropTypes.number,
    min: React.PropTypes.number,
    max: React.PropTypes.number,
    onChange: React.PropTypes.func,
    onKeyDown: React.PropTypes.func
  }

  static defaultProps = {
    step: 1,
    defaultValue: 0,
    onChange: noop,
    onKeyDown: noop
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      value: this.props.value != null ? this.props.value : this.props.defaultValue
    };

    this.commitChange = debounce(this.commitChange.bind(this), DEBOUNCE_DELAY, {
      leading: false
    });
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.value !== this.props.value){
      this.setState({
        value: nextProps.value
      });
    }
  }

  render(){
    return <input
      {...this.props}
      value={this.state.value}
      onChange={this.handleChange}
      onKeyDown={this.handleKeyDown}/>;
  }

  getValue(){
    return this.state.value;
  }

  setValue(value){
    const {min, max} = this.props;

    if (typeof min === 'number' && value < min) value = min;
    if (typeof max === 'number' && value > max) value = max;

    this.setState({
      value: value
    });

    this.commitChange();
  }

  handleChange = (e) => {
    this.setValue(Number((e.currentTarget || e.target).value));
  }

  handleKeyDown = (e) => {
    switch (e.keyCode){
    case 38: // up
      this.increase();
      break;

    case 40: // down
      this.decrease();
      break;
    }

    this.props.onKeyDown(e);
  }

  increase(){
    this.setValue(this.getValue() + this.props.step);
  }

  decrease(){
    this.setValue(this.getValue() - this.props.step);
  }

  commitChange(){
    this.props.onChange(this.getValue());
  }
}

export default NumberInput;
