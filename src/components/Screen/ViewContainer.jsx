import React from 'react';
import {DropTarget} from 'react-dnd';
import View from '../preview/View';
import ItemTypes from '../../constants/ItemTypes';
import * as ElementAction from '../../actions/ElementAction';
import bindActions from '../../utils/bindActions';

function getDropTargetType(props){
  const {element, components} = props;
  const component = components.get(element.get('type'));

  if (component && component.get('container')){
    return ItemTypes.CONTAINER;
  } else {
    return ItemTypes.NON_CONTAINER;
  }
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
  drop(props, monitor, {context}){
    if (monitor.didDrop()) return;

    const component = monitor.getItem();
    const {element} = props;
    const {createElement} = bindActions(ElementAction, context.flux);

    createElement({
      name: component.type,
      type: component.type,
      project_id: element.get('project_id'),
      element_id: element.get('id'),
      attributes: collectDefaultValue(component.attributes)
    });
  },

  canDrop(props, monitor){
    const {components, element} = props;
    const item = monitor.getItem();
    const component = components.get(element.get('type'));

    if (!component.has('availableChildTypes')) return true;

    return component.get('availableChildTypes').has(item.type);
  }
};

@DropTarget(getDropTargetType, spec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver({
    shallow: true
  }),
  canDrop: monitor.canDrop()
}))
class ViewContainer extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired
  }

  static propTypes = {
    components: React.PropTypes.object.isRequired,

    // React DnD
    connectDropTarget: React.PropTypes.func.isRequired,
    isOver: React.PropTypes.bool.isRequired,
    canDrop: React.PropTypes.bool.isRequired
  }

  componentWillReceiveProps(nextProps){
    const {pushHoverElement, popHoverElement} = bindActions(ElementAction, this.context.flux);
    const {element} = this.props;

    if (!this.props.isOver && nextProps.isOver && nextProps.canDrop){
      pushHoverElement(element.get('id'));
    }

    if (this.props.isOver && !nextProps.isOver){
      popHoverElement(element.get('id'));
    }
  }

  render(){
    const {connectDropTarget} = this.props;

    return connectDropTarget(
      <View {...this.props} Container={ViewContainer}/>
    );
  }
}

export default ViewContainer;
