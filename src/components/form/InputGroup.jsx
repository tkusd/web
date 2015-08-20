import React, {PropTypes} from 'react';
import Input from 'react-form-input';
import omit from 'lodash/object/omit';
import pureRender from '../../decorators/pureRender';
import cx from 'classnames';

if (process.env.BROWSER){
  require('../../styles/form/InputGroup.styl');
}

function noop(){}

@pureRender
class InputGroup extends React.Component {
  static propTypes = {
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    onChange: PropTypes.func,
    className: PropTypes.string
  }

  static defaultProps = {
    onChange: noop
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      error: null
    };

    this.handleChange = this.handleChange.bind(this);
  }

  render(){
    const {label} = this.props;
    const {error} = this.state;

    return (
      <div className={cx('input-group', this.props.className)}>
        <label>
          {label && <span className="input-group__label">{label}</span>}
          <Input
            {...omit(this.props, 'label', 'className')}
            className="input-group__field"
            ref="input"
            onChange={this.handleChange}/>
          {error && <span className="input-group__error">{error}</span>}
        </label>
      </div>
    );
  }

  getValue(){
    return this.refs.input.getValue();
  }

  setValue(value){
    this.refs.input.setValue(value);
  }

  getError(){
    return this.refs.input.getError();
  }

  setError(error){
    this.setState({error});
    this.refs.input.setError(error);
  }

  reset(){
    this.refs.input.reset();

    setTimeout(() => {
      this.setState({
        error: this.refs.input.getError(),
        dirty: false
      });
    }, 0);
  }

  isDirty(){
    return this.refs.input.isDirty();
  }

  isPristine(){
    return this.refs.input.isPristine();
  }

  handleChange(data){
    this.setState({
      error: data.error
    });

    this.props.onChange(data);
  }
}

export default InputGroup;
