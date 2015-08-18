import React from 'react';
import SizeInput from './SizeInput';
import shallowEqual from '../../utils/shallowEqual';

if (process.env.BROWSER){
  require('../../styles/form/LayoutBox.styl');
}

function noop(){}

const layoutShape = React.PropTypes.shape({
  top: React.PropTypes.string,
  left: React.PropTypes.string,
  right: React.PropTypes.string,
  bottom: React.PropTypes.string
});

class LayoutBox extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func.isRequired,
    defaultValue: layoutShape,
    value: layoutShape
  }

  static defaultProps = {
    onChange: noop,
    defaultValue: {
      top: '',
      left: '',
      right: '',
      bottom: ''
    }
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      value: this.props.value != null ? this.props.value : this.props.defaultValue
    };
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.hasOwnProperty('value') && !shallowEqual(nextProps.value, this.props.value)){
      this.setState({value: nextProps.value});
    }
  }

  render(){
    const {value} = this.state;

    return (
      <div className="layout-box">
        <SizeInput
          className="layout-box__top"
          label="Top"
          value={value.top}
          onChange={this.handleInputChange.bind(this, 'top')}/>
        <SizeInput
          className="layout-box__left"
          label="Left"
          value={value.left}
          onChange={this.handleInputChange.bind(this, 'left')}/>
        <SizeInput
          className="layout-box__right"
          label="Right"
          value={value.right}
          onChange={this.handleInputChange.bind(this, 'right')}/>
        <SizeInput
          className="layout-box__bottom"
          label="Bottom"
          value={value.bottom}
          onChange={this.handleInputChange.bind(this, 'bottom')}/>
      </div>
    );
  }

  handleInputChange(key, value){
    this.setState({
      value: {
        [key]: value
      }
    });

    setTimeout(() => {
      this.props.onChange(this.state.value);
    }, 0);
  }
}

export default LayoutBox;
