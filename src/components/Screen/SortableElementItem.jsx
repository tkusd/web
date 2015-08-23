import React from 'react';
import {DragSource, DropTarget} from 'react-dnd';

const targetSpec = {
  canDrop(props, monitor){
    return false;
  },

  hover(props, monitor){
    const item = monitor.getItem();
    const {element} = props;

    // Only for same level so far
    if (item.id !== element.get('id') && item.parent === element.get('element_id')){
      props.moveElement(item.id, element.get('index'));
    }
  }
};

const sourceSpec = {
  beginDrag(props){
    const {element} = props;

    return {
      id: element.get('id'),
      originalIndex: element.get('index'),
      parent: element.get('element_id')
    };
  },

  endDrag(props, monitor){
    if (monitor.didDrop()){
      props.updateIndex();
    } else {
      const item = monitor.getItem();
      props.moveElement(item.id, item.originalIndex);
    }
  }
};

export default function SortableElementItem(type){
  return Component => {
    @DropTarget(type, targetSpec, (connect, monitor) => ({
      connectDropTarget: connect.dropTarget()
    }))
    @DragSource(type, sourceSpec, (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    }))
    class SortableElementItem extends React.Component {
      static propTypes = {
        element: React.PropTypes.object.isRequired,

        // React DnD
        connectDragSource: React.PropTypes.func.isRequired,
        isDragging: React.PropTypes.bool.isRequired,
        connectDropTarget: React.PropTypes.func.isRequired
      }

      render(){
        const {connectDragSource, connectDropTarget} = this.props;

        return connectDragSource(connectDropTarget(
          <Component {...this.props}/>
        ));
      }
    }

    return SortableElementItem;
  };
}
