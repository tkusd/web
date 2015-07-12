import React from 'react';
import throttle from 'lodash/function/throttle';

function noop(){}

const THROTTLE_DELAY = 50;

class NumberInput extends React.Component {
  static propTypes = {
    value: React.PropTypes.number,
    initialValue: React.PropTypes.number,
    step: React.PropTypes.number,
    min: React.PropTypes.number,
    max: React.PropTypes.number,
    onChange: React.PropTypes.func,
    onKeyDown: React.PropTypes.func
  }

  static defaultProps = {
    step: 1,
    initialValue: 0,
    onChange: noop,
    onKeyDown: noop
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      value: this.props.value != null ? this.props.value : this.props.initialValue
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = throttle(this.handleKeyDown.bind(this), THROTTLE_DELAY, {
      leading: true
    });
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.hasOwnProperty('value')){
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

    setTimeout(() => {
      this.props.onChange(this.getValue());
    }, 0);
  }

  handleChange(e){
    this.setValue(Number(e.currentTarget.value));
  }

  handleKeyDown(e){
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
}

export default NumberInput;
