import React from 'react';
import {DragSource} from 'react-dnd';
import ItemTypes from '../../constants/ItemTypes';
import cx from 'classnames';
import * as ElementAction from '../../actions/ElementAction';
import bindActions from '../../utils/bindActions';
import pureRender from '../../decorators/pureRender';
import uuid from 'node-uuid';
import assign from 'lodash/object/assign';
import {FormattedMessage} from '../intl';
import kebabCase from 'lodash/string/kebabCase';

if (process.env.BROWSER){
  require('../../styles/Project/ComponentItem.styl');
}

function collectDefaultValue(data){
  let result = {};
  if (!data) return result;

  Object.keys(data).forEach(key => {
    const item = data[key];

    if (item.hasOwnProperty('defaultValue')) {
      result[key] = item.defaultValue;
    }
  });

  return result;
}

const spec = {
  beginDrag(props){
    return props.component.toJS();
  },

  endDrag(props, monitor, {context}){
    if (!monitor.didDrop()) return;

    const element = monitor.getDropResult();
    if (!element) return;

    const {components} = props;
    const item = monitor.getItem();
    const elementComponent = components.get(element.type);

    if (elementComponent.has('availableChildTypes') && !elementComponent.get('availableChildTypes').includes(item.type)){
      return;
    }

    const {createElement, selectElement} = bindActions(ElementAction, context.flux);
    const id = '_' + uuid.v4();
    let attributes = collectDefaultValue(item.attributes);

    if (elementComponent.has('childAttributes')){
      attributes = assign(attributes, collectDefaultValue(elementComponent.get('childAttributes').toJS()));
    }

    createElement({
      id,
      name: item.type,
      type: item.type,
      project_id: element.project_id,
      element_id: element.id,
      attributes,
      is_visible: true
    });

    setTimeout(() => {
      selectElement(id);
    }, 0);
  }
};

@DragSource(ItemTypes.CONTAINER, spec, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
@pureRender
class ComponentItem extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired
  }

  static propTypes = {
    component: React.PropTypes.object.isRequired,

    // React DnD
    connectDragSource: React.PropTypes.func.isRequired,
    isDragging: React.PropTypes.bool.isRequired
  }

  render(){
    const {component, connectDragSource, isDragging} = this.props;
    let type = component.get('type');

    let className = cx('component-item', {
      'component-item--dragging': isDragging
    });

    return connectDragSource(
      <div className={className}>
        <div className={'component-item__' + kebabCase(type) + '-icon'}/>
        <div className="component-item__name">
          <FormattedMessage message={'component.' + type}/>
        </div>
      </div>
    , 'copy');
  }
}

export default ComponentItem;
