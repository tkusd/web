import React from 'react';
import {validators} from 'react-form-input';
import bindActions from '../../utils/bindActions';
import * as ElementAction from '../../actions/ElementAction';
import * as ProjectAction from '../../actions/ProjectAction';
import EventList from './EventList';
import pureRender from '../../decorators/pureRender';
import FontAwesome from '../common/FontAwesome';
import ElementTypes from '../../constants/ElementTypes';
import {FormattedMessage} from '../intl';
import AttributeField from './AttributeField';

// @pureRender
class AttributePaletteElement extends React.Component {
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
      <div className="attribute-palette">
        {this.renderContent()}
      </div>
    );
  }

  renderContent(){
    const element = this.getActiveElement();
    const {components, events, activeElement, project, elements} = this.props;
    if (!element) return;

    const component = components.get(element.get('type'));
    if (!component) return;

    const parent = elements.get(element.get('element_id'));
    const elementEvents = events.filter(event => event.get('element_id') === activeElement);
    const isScreen = element.get('type') === ElementTypes.screen;
    let parentComponent;

    if (parent){
      parentComponent = components.get(parent.get('type'));
    }

    return (
      <div>
        <AttributeField
          type="text"
          label={<FormattedMessage message="common.name"/>}
          value={element.get('name')}
          onChange={this.setValueInField.bind(this, ['name'])}
          required
          validators={[
            validators.required('Name is required')
          ]}/>
        {!isScreen && (
          <AttributeField className="attribute-palette__visible-checkbox"
            type="boolean"
            value={element.get('is_visible')}
            label={<FormattedMessage message="project.visible"/>}
            onChange={this.setValueInField.bind(this, ['is_visible'])}/>
        )}
        {isScreen && (
          <button className="attribute-palette__main-screen-btn"
            onClick={this.updateMainScreen}
            disabled={project.get('main_screen') === element.get('id')}>
            <FontAwesome icon="mobile"/>
            <FormattedMessage message="project.set_as_main_screen"/>
          </button>
        )}
        <button className="attribute-palette__delete-btn" onClick={this.deleteElement}>
          <FontAwesome icon="trash-o"/>
          <FormattedMessage message="common.delete"/>
        </button>
        {component.has('attributes') && (
          <div>
            <h4>
              <FormattedMessage message="project.attributes"/>
            </h4>
            {component.get('attributes')
              .map(this.renderAttributeField.bind(this)).toArray()}
            {parentComponent && parentComponent.get('childAttributes') &&
              parentComponent.get('childAttributes')
              .map(this.renderAttributeField.bind(this)).toArray()}
          </div>
        )}
        {component.has('styles') && (
          <div>
            <h4>
              <FormattedMessage message="project.styles"/>
            </h4>
            {component.get('styles')
              .map(this.renderStyleField.bind(this)).toArray()}
          </div>
        )}
        {component.has('availableEventTypes') && component.get('availableEventTypes').count() && (
          <EventList {...this.props}
            events={elementEvents}
            element={element}
            component={component}/>
        )}
      </div>
    );
  }

  renderAttributeField(attr, key){
    const element = this.getActiveElement();

    return (
      <AttributeField {...this.props}
        key={key}
        value={element.getIn(['attributes', key])}
        values={attr.get('values')}
        label={attr.get('label')}
        type={attr.get('type')}
        onChange={this.setValueInField.bind(this, ['attributes', key])}/>
    );
  }

  renderStyleField(style, key){
    const element = this.getActiveElement();

    return (
      <AttributeField {...this.props}
        key={key}
        value={element.getIn(['styles', key])}
        label={style.get('label')}
        type={style.get('type')}
        onChange={this.setValueInField.bind(this, ['styles', key])}/>
    );
  }

  setValueInField(field, value){
    const element = this.getActiveElement();
    const {updateElement} = bindActions(ElementAction, this.context.flux);

    updateElement(element.get('id'), element.setIn(field, value));
  }

  deleteElement = () => {
    const element = this.getActiveElement();
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
    const element = this.getActiveElement();
    if (element.get('type') !== ElementTypes.screen || project.get('main_screen') === element.get('id')) return;

    const {updateProject} = bindActions(ProjectAction, this.context.flux);

    updateProject(project.get('id'), {
      main_screen: element.get('id')
    });
  }
}

export default AttributePaletteElement;
