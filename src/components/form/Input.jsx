import React from 'react';
import cx from 'classnames';

if (process.env.BROWSER){
  require('../../styles/form/Input.css');
}

function noop(){}

class Input extends React.Component {
  static propTypes = {
    id: React.PropTypes.string,
    name: React.PropTypes.string.isRequired,
    type: React.PropTypes.string,
    label: React.PropTypes.string,
    hint: React.PropTypes.string,
    validator: React.PropTypes.arrayOf(React.PropTypes.func),
    transform: React.PropTypes.arrayOf(React.PropTypes.func),
    value: React.PropTypes.any,
    onChange: React.PropTypes.func,
    error: React.PropTypes.string,
    disabled: React.PropTypes.bool
  }

  static defaultProps = {
    validator: [],
    transform: [],
    onChange: noop
  }

  constructor(props, context){
    super(props, context);

    let data = this.checkData(this.props.value || '');
    let value = data.value;
    let error = this.props.error || data.error;
    let dirty = false;

    this.state = {value, error, dirty};
  }

  render(){
    let dirty = this.isDirty();

    let className = cx('input-group', {
      dirty: dirty,
      pristine: !dirty
    });

    return (
      <div className={className}>
        <label htmlFor={this.props.id} className="input-label">{this.props.label}</label>
        <input
          id={this.props.id}
          className="input"
          name={this.getName()}
          type={this.props.type || 'text'}
          placeholder={this.props.hint}
          value={this.getValue()}
          onChange={this.handleChange.bind(this)}
          disabled={this.props.disabled}/>
        <span className="input-error">{this.getError()}</span>
      </div>
    );
  }

  handleChange(e){
    let {value, error} = this.setValue(e.target.value);

    this.props.onChange({value, error});
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
    let dirty = true;
    let newData = {value, error, dirty};

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
    let {value, error} = this.checkData('');
    let dirty = false;

    this.setState({value, error, dirty});
  }

  validate(value){
    if (!this.props.validator) return '';

    for (let validator of this.props.validator){
      let error = validator(this, value);
      if (error) return error;
    }
  }

  transform(value){
    if (!this.props.transform) return value;

    for (let transform of this.props.transform){
      value = transform(this, value);
    }

    return value;
  }

  getName(){
    return this.props.name;
  }

  getLabel(){
    return this.props.label || this.getName();
  }

  isDirty(){
    return this.state.dirty;
  }

  isPristine(){
    return !this.isDirty();
  }
}

export default Input;
