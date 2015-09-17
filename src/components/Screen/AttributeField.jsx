import React from 'react';
import AssetModal from './AssetModal';
import {InputGroup, Checkbox, ThemePalette} from '../form';
import FontAwesome from '../common/FontAwesome';
import {ModalPortal} from '../modal';
import {FormattedMessage} from '../intl';

if (process.env.BROWSER) {
  require('../../styles/Screen/AttributeField.styl');
}

function noop() {}

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

  render() {
    const {type, label, project, values, value} = this.props;

    switch (type){
    case 'boolean':
      return (
        <Checkbox {...this.props}
          value={value}
          onChange={this.handleChange}/>
      );

    case 'select':
      let options = values;

      if (typeof values === 'function'){
        options = values(this.props);
      }

      return (
        <label className='input-group'>
          <span className='input-group__label'>{label}</span>
          <select className='attribute-field__select'
            {...this.props}
            value={value}
            onChange={this.handleSelectChange}>
            {options && options.map((item, i) => (
              <option key={i} value={item.get('value')}>{item.get('label')}</option>
            )).toArray()}
          </select>
        </label>
      );

    case 'asset':
      let btn = (
        <button className='attribute-palette__choose-asset-btn'>
          <FontAwesome icon='file-o'/>
          <FormattedMessage message='project.chooseAsset'/>
        </button>
      );

      return (
        <div className='input-group'>
          <label className='input-group__label'>{label}</label>
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
        <div className='input-group'>
          <label className='input-group__label'>{label}</label>
          <ThemePalette {...this.props}
            palette={project.get('theme')}
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
    this.props.onChange(value);
  }
}

export default AttributeField;
