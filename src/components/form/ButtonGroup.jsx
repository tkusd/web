import React from 'react';
import cx from 'classnames';

function noop(){}

function defaultRenderer(option){
  return option.label;
}

class ButtonGroup extends React.Component {
  static propTypes = {
    value: React.PropTypes.any,
    defaultValue: React.PropTypes.any,
    onChange: React.PropTypes.func.isRequired,
    options: React.PropTypes.arrayOf(
      React.PropTypes.any
    ),
    renderer: React.PropTypes.func.isRequired
  }

  static defaultProps = {
    onChange: noop,
    renderer: defaultRenderer
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      value: this.props.value != null ? this.props.value : this.props.defaultValue
    };
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.value !== this.props.value){
      this.setState({
        value: nextProps.value
      });
    }
  }

  getValue(){
    return this.state.value;
  }

  render(){
    const {options, renderer} = this.props;
    const value = this.getValue();

    return (
      <div {...this.props}>
        {options.map((option, i) => (
          <button key={i}
            className={cx({
              active: option.value === value
            })}
            onClick={this.handleChange.bind(this, option.value)}>
            {renderer(option)}
          </button>
        ))}
      </div>
    );
  }

  handleChange(value){
    this.setState({value});
    this.props.onChange(value);
  }
}

export default ButtonGroup;
