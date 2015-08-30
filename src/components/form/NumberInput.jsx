import React from 'react';
import debounce from 'lodash/function/debounce';
import Big from 'big.js';

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
      value: new Big(this.props.value != null ? this.props.value : this.props.defaultValue)
    };

    this.commitChange = debounce(this.commitChange.bind(this), DEBOUNCE_DELAY, {
      leading: false
    });
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.value !== this.props.value){
      this.setState({
        value: new Big(nextProps.value)
      });
    }
  }

  render(){
    const {value} = this.state;

    return <input
      {...this.props}
      value={value.toString()}
      onChange={this.handleChange}
      onKeyDown={this.handleKeyDown}/>;
  }

  getValue(){
    return +this.state.value;
  }

  setValue(value_){
    const {min, max} = this.props;
    let value = new Big(value_);

    if (min != null && value.lt(min)) value = new Big(min);
    if (max != null && value.gt(max)) value = new Big(max);

    this.setState({value});
    this.commitChange();
  }

  handleChange = (e) => {
    this.setValue((e.currentTarget || e.target).value);
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

  increase(n = this.props.step){
    this.setValue(this.state.value.plus(n));
  }

  decrease(n = this.props.step){
    this.setValue(this.state.value.minus(n));
  }

  commitChange(){
    this.props.onChange(this.getValue());
  }
}

export default NumberInput;
