import React from 'react';
import AssetModal from './AssetModal';
import {InputGroup, Checkbox, ThemePalette} from '../form';
import FontAwesome from '../common/FontAwesome';
import {ModalPortal} from '../modal';
import {FormattedMessage} from '../intl';
import debounce from 'lodash/function/debounce';

if (process.env.BROWSER){
  require('../../styles/Screen/AttributeField.styl');
}

function noop(){}

const DEBOUNCE_DELAY = 200;

class AttributeField extends React.Component {
  static propTypes = {
    type: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    label: React.PropTypes.oneOfType([
      React.PropTypes.element,
      React.PropTypes.string
    ]),
    project: React.PropTypes.object,
    value: React.PropTypes.any,
    values: React.PropTypes.any
  }

  static defaultProps = {
    type: 'text',
    onChange: noop
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      value: this.props.value,
      displayColorPicker: false,
      colorPickerStyle: {}
    };

    this.commitChange = debounce(this.commitChange.bind(this), DEBOUNCE_DELAY, {
      leading: false
    });
  }

  componentWillReceiveProps(nextProps){
    if (this.props.value !== nextProps.value){
      this.setState({
        value: nextProps.value
      });
    }
  }

  render(){
    const {type, label, project, values} = this.props;
    const {value} = this.state;

    switch (type){
    case 'boolean':
      return (
        <Checkbox {...this.props}
          value={value}
          onChange={this.handleInputChange}/>
      );

    case 'select':
      return (
        <label className="input-group">
          <span className="input-group__label">{label}</span>
          <select className="attribute-field__select"
            {...this.props}
            value={value}
            onChange={this.handleSelectChange}>
            {values && values.map((item, i) => (
              <option key={i} value={item.get('value')}>{item.get('label')}</option>
            )).toArray()}
          </select>
        </label>
      );

    case 'asset':
      let btn = (
        <button className="attribute-palette__choose-asset-btn">
          <FontAwesome icon="file-o"/>
          <FormattedMessage message="project.choose_asset"/>
        </button>
      );

      return (
        <div className="input-group">
          <label className="input-group__label">{label}</label>
          <ModalPortal trigger={btn}>
            <AssetModal {...this.props}
              projectID={project.get('id')}
              url={value}
              onSubmit={this.handleChange}/>
          </ModalPortal>
        </div>
      );

    case 'theme':
      return (
        <div className="input-group">
          <label className="input-group__label">{label}</label>
          <ThemePalette {...this.props}
            value={value}
            onChange={this.handleChange}/>
        </div>
      );
    }

    return (
      <InputGroup {...this.props}
        value={value}
        onChange={this.handleInputChange}/>
    );
  }

  handleInputChange = (data) => {
    if (data.error) return;
    this.handleChange(data.value);
  }

  handleSelectChange = (e) => {
    this.handleChange((e.target || e.currentTarget || {}).value);
  }

  handleChange = (value) => {
    this.setState({value});
    this.commitChange();
  }

  commitChange(){
    this.props.onChange(this.state.value);
  }
}

export default AttributeField;
