import React from 'react';
import Palette from '../Project/Palette';
import {FormattedMessage} from '../intl';
import {InputGroup, Checkbox} from '../form';
import {validators} from 'react-form-input';
import bindActions from '../../utils/bindActions';
import * as ElementAction from '../../actions/ElementAction';
import EventList from './EventList';
import pureRender from '../../decorators/pureRender';
import debounce from 'lodash/function/debounce';

if (process.env.BROWSER){
  require('../../styles/Screen/AttributePalette.styl');
}

const DEBOUNCE_DELAY = 250;

@pureRender
class AttributePalette extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired
  }

  static propTypes = {
    project: React.PropTypes.object.isRequired,
    components: React.PropTypes.object.isRequired,
    elements: React.PropTypes.object.isRequired,
    activeElement: React.PropTypes.string,
    events: React.PropTypes.object.isRequired,
    selectedScreen: React.PropTypes.string.isRequired
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      element: this.getActiveElement()
    };

    this.commitChange = debounce(this.commitChange.bind(this), DEBOUNCE_DELAY);
  }

  componentWillReceiveProps(nextProps){
    if (this.props.activeElement !== nextProps.activeElement){
      this.setState({
        element: this.getActiveElement(nextProps)
      });
    }
  }

  getActiveElement(props = this.props){
    const {elements, activeElement, selectedScreen} = props;

    if (activeElement){
      return elements.get(activeElement);
    } else {
      return elements.get(selectedScreen);
    }
  }

  render(){
    return (
      <Palette title={<FormattedMessage message="project.attributes"/>}>
        {this.renderContent()}
      </Palette>
    );
  }

  renderContent(){
    const {element} = this.state;
    const {components, events, activeElement, project} = this.props;
    if (!element) return;

    const component = components.get(element.get('type'));
    if (!component) return;

    const elementEvents = events.filter(event => event.get('element_id') === activeElement);
    const platform = project.get('platform');

    return (
      <div className="attribute-palette">
        <InputGroup
          type="text"
          label="Name"
          value={element.get('name')}
          onChange={this.handleInputChange.bind(this, ['name'])}
          required
          validators={[
            validators.required('Name is required')
          ]}/>
        {component.has('attributes') && component.get('attributes')
          .filter(attr => !attr.has('platform') || attr.get('platform') === platform)
          .map(this.renderAttributeField.bind(this)).toArray()}
        <EventList {...this.props} events={elementEvents}/>
      </div>
    );
  }

  renderAttributeField(attr, i){
    const {element} = this.state;

    switch (attr.get('type')){
      case 'boolean':
        return (
          <Checkbox key={i}
            value={element.getIn(['attributes', i])}
            label={attr.get('label')}
            onChange={this.handleInputChange.bind(this, ['attributes', i])}/>
        );
    }

    return (
      <InputGroup
        key={i}
        type="text"
        label={attr.get('label')}
        onChange={this.handleInputChange.bind(this, ['attributes', i])}
        value={element.getIn(['attributes', i])}/>
    );
  }

  handleInputChange(field, data){
    if (data.error) return;

    this.setState({
      element: this.state.element.setIn(field, data.value)
    });

    this.commitChange();
  }

  commitChange(){
    const {element} = this.state;
    const {updateElement} = bindActions(ElementAction, this.context.flux);

    updateElement(element.get('id'), element);
  }
}

export default AttributePalette;
