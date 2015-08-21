import React from 'react';
import Select from 'react-select';
import {InputGroup} from '../form';

if (process.env.BROWSER){
  require('../../styles/Screen/ActionNode.styl');
}

class ActionNode extends React.Component {
  static propTypes = {
    action: React.PropTypes.object.isRequired,
    actionDefinitions: React.PropTypes.object.isRequired,
    updateAction: React.PropTypes.func.isRequired
  }

  render(){
    const {action, actionDefinitions} = this.props;

    let options = actionDefinitions.map((definition, key) => ({
      value: key,
      label: definition.get('name'),
      description: definition.get('description')
    })).toArray();

    return (
      <div className="action-node">
        <header className="action-node__header">
          <Select className="action-node__select"
            value={action.get('action')}
            options={options}
            onChange={this.updateValue.bind(this, ['action'])}
            optionRenderer={this.renderSelectOption}
            clearable={false}/>
          <input className="action-node__input-name"
            value={action.get('name')}
            placeholder="Enter name..."
            onChange={this.handleInputChange.bind(this, ['name'])}/>
        </header>
        <div className="action-node__content">
          {this.renderDataList()}
        </div>
      </div>
    );
  }

  renderDataList(){
    const {action, actionDefinitions} = this.props;
    const definition = actionDefinitions.get(action.get('action'));

    if (!definition || !definition.has('data') || !definition.get('data').count()) return;

    return (
      <div className="action-node__data-list">
        {definition.get('data').map(this.renderInputField.bind(this)).toArray()}
      </div>
    );
  }

  renderInputField(data, key){
    const {action} = this.props;

    switch (data.get('type')){
    case 'select':
      let values = data.get('values') || [];

      if (typeof values === 'function'){
        values = values(this.props);
      }

      return (
        <label key={key} className="action-node__input">
          <span className="input-group__label">{data.get('label')}</span>
          <select
            className="action-node__input-select"
            value={action.getIn(['data', key])}
            onChange={this.handleInputChange.bind(this, ['data', key])}>
            {values.map((item, i) => (
              <option value={item.value} key={i}>{item.label}</option>
            ))}
          </select>
        </label>
      );
    }

    return (
      <InputGroup key={key}
        className="action-node__input"
        value={action.getIn(['data', key])}
        label={data.get('label')}
        onChange={this.handleInputGroupChange.bind(this, ['data', key])}/>
    );
  }

  renderSelectOption(data){
    return (
      <div>
        <strong className="action-node__option-name">{data.label}</strong>
        <div className="action-node__option-content">{data.description}</div>
      </div>
    );
  }

  handleInputChange(field, e){
    const value = (e.target || e.currentTarget).value;
    this.updateValue(field, value);
  }

  handleInputGroupChange(field, data){
    if (data.error) return;
    this.updateValue(field, data.value);
  }

  updateValue(field, value){
    const {updateAction, action} = this.props;
    updateAction(action.setIn(field, value));
  }
}

export default ActionNode;
