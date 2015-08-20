import React from 'react';
import Palette from '../Project/Palette';
import {FormattedMessage} from '../intl';
import {InputGroup, Checkbox} from '../form';
import {validators} from 'react-form-input';
import bindActions from '../../utils/bindActions';
import * as ElementAction from '../../actions/ElementAction';
import * as ProjectAction from '../../actions/ProjectAction';
import EventList from './EventList';
import pureRender from '../../decorators/pureRender';
import debounce from 'lodash/function/debounce';
import FontAwesome from '../common/FontAwesome';
import ElementTypes from '../../constants/ElementTypes';

if (process.env.BROWSER){
  require('../../styles/Screen/AttributePalette.styl');
}

const DEBOUNCE_DELAY = 250;

@pureRender
class AttributePalette extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
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
    if (this.props.activeElement !== nextProps.activeElement || this.props.selectedScreen !== nextProps.selectedScreen){
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
        {element.get('type') === ElementTypes.screen && (
          <button className="attribute-palette__main-screen-btn"
            onClick={this.updateMainScreen}
            disabled={project.get('main_screen') === element.get('id')}>
            <FontAwesome icon="mobile"/>Set as main screen
          </button>
        )}
        <button className="attribute-palette__delete-btn" onClick={this.deleteElement}>
          <FontAwesome icon="trash-o"/>Delete
        </button>
        {component.has('attributes') && (
          <div>
            <h4>Attributes</h4>
            {component.get('attributes')
              .filter(attr => !attr.has('platform') || attr.get('platform') === platform)
              .map(this.renderAttributeField.bind(this)).toArray()}
          </div>
        )}
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

  deleteElement = () => {
    const {element} = this.state;
    const {selectElement, deleteElement} = bindActions(ElementAction, this.context.flux);

    if (element.get('type') === ElementTypes.screen){
      if (!confirm('Are you sure?')) return;
      this.context.router.replaceWith('/projects/' + element.get('project_id'));
    } else {
      selectElement(element.get('element_id'));
    }

    deleteElement(element.get('id'));
  }

  updateMainScreen = () => {
    const {project} = this.props;
    const {element} = this.state;
    if (element.get('type') !== ElementTypes.screen || project.get('main_screen') === element.get('id')) return;

    const {updateProject} = bindActions(ProjectAction, this.context.flux);

    updateProject(project.get('id'), {
      main_screen: element.get('id')
    });
  }
}

export default AttributePalette;
