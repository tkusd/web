import React from 'react';
import Palette from '../Project/Palette';
import {FormattedMessage} from '../intl';
import {InputGroup} from '../form';
import {validators} from 'react-form-input';
import bindActions from '../../utils/bindActions';
import * as ElementAction from '../../actions/ElementAction';

if (process.env.BROWSER){
  require('../../styles/Screen/AttributePalette.styl');
}

class AttributePalette extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired
  }

  static propTypes = {
    components: React.PropTypes.object.isRequired,
    elements: React.PropTypes.object.isRequired,
    activeElement: React.PropTypes.string
  }

  getActiveElement(){
    const {elements, activeElement} = this.props;
    if (!activeElement) return;

    return elements.get(activeElement);
  }

  render(){
    return (
      <Palette title={<FormattedMessage message="project.attributes"/>}>
        {this.renderContent()}
      </Palette>
    );
  }

  renderContent(){
    const element = this.getActiveElement();
    const {components} = this.props;
    if (!element) return;

    const component = components.get(element.get('type'));
    if (!component) return;

    return (
      <div>
        <InputGroup
          type="text"
          label="Name"
          value={element.get('name')}
          onChange={this.handleInputChange.bind(this, ['name'])}
          required
          validators={[
            validators.required('Name is required')
          ]}/>
        {component.has('attributes') &&
          component.get('attributes').map(this.renderAttributeField.bind(this))}
      </div>
    );
  }

  renderAttributeField(attr, i){
    const element = this.getActiveElement();

    switch (attr.get('type')){
      case 'boolean':
        return (
          <div key={i}>
            <input
              type="checkbox"
              checked={element.getIn(['attributes', i])}
              onChange={this.handleCheckboxChange.bind(this, ['attributes', i])}/>
            <label>{attr.get('label')}</label>
          </div>
        );
    }

    return (
      <InputGroup
        type="text"
        label={attr.get('label')}
        onChange={this.handleInputChange.bind(this, ['attributes', i])}
        key={i}
        value={element.getIn(['attributes', i])}/>
    );
  }

  handleInputChange(field, data){
    const element = this.getActiveElement();
    const {updateElement} = bindActions(ElementAction, this.context.flux);

    if (data.error){
      return;
    }

    updateElement(element.setIn(field, data.value));
  }

  handleCheckboxChange(field, e){
    this.handleInputChange(field, {
      value: (e.target || e.currentTarget).checked
    });
  }
}

export default AttributePalette;
