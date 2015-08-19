import React from 'react';
import {DropTarget} from 'react-dnd';
import View from '../preview/View';
import ItemTypes from '../../constants/ItemTypes';
import * as ElementAction from '../../actions/ElementAction';
import bindActions from '../../utils/bindActions';
import pureRender from '../../decorators/pureRender';

function getDropTargetType(props){
  const {element, components} = props;
  const component = components.get(element.get('type'));

  if (component && component.get('container')){
    return ItemTypes.CONTAINER;
  } else {
    return ItemTypes.NON_CONTAINER;
  }
}

const spec = {
  drop(props, monitor, {context}){
    if (monitor.didDrop()) return;
    return props.element.toJS();
  }
};

@DropTarget(getDropTargetType, spec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver({
    shallow: true
  }),
  canDrop: monitor.canDrop()
}))
@pureRender
class ViewContainer extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired
  }

  static propTypes = {
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
