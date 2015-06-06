import React from 'react';
import {DragSource} from 'react-dnd';
import ItemTypes from '../../constants/ItemTypes';
//import {createElement} from '../../actions/ElementAction';

const spec = {
  beginDrag(props){
    return props.component;
  },

  endDrag(props, monitor){
    if (!monitor.didDrop()) return;

    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();
    if (!dropResult || dropResult.type !== ItemTypes.SCREEN) return;

    console.log(item);
  }
};

@DragSource(ItemTypes.COMPONENT, spec, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
class Component extends React.Component {
  static propTypes = {
    connectDragSource: React.PropTypes.func.isRequired,
    isDragging: React.PropTypes.bool.isRequired,
    component: React.PropTypes.object.isRequired
  }

  render(){
    const {component, connectDragSource} = this.props;

    return connectDragSource(
      <div>{component.get('name')}</div>
    );
  }
}

export default Component;
