import React, {PropTypes} from 'react';
import cx from 'classnames';
import omit from 'lodash/object/omit';

if (process.env.BROWSER){
  require('../../styles/form/Checkbox.styl');
}

function noop(){}

class Checkbox extends React.Component {
  static propTypes = {
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    onChange: PropTypes.func,
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    className: PropTypes.string
  }

  static defaultProps = {
    onChange: noop
  }

  constructor(props, context){
    super(props, context);

    var defaultValue = this.props.hasOwnProperty('value') ? this.props.value : this.props.defaultValue;

    this.state = {
      value: defaultValue
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.value !== this.props.value){
      this.setState({
        value: nextProps.value
      });
    }
  }

  render(){
    const {label} = this.props;

    return (
      <label className={cx('checkbox', this.props.className)}>
        <input {...omit(this.props, 'label', 'className')}
          className="checkbox__input"
          type="checkbox"
          onChange={this.handleChange}
          checked={this.state.value}/>
        {label && <span className="checkbox__label">{label}</span>}
      </label>
    );
  }

  getValue(){
    return this.state.value;
  }

  getError(){
    return null;
  }

  handleChange(e){
    let value = (e.target || e.currentTarget).checked;

    this.setState({value});
    this.props.onChange(value);
  }
}

export default Checkbox;
