import React from 'react';
import {DragSource} from 'react-dnd';
import ItemTypes from '../../constants/ItemTypes';
import cx from 'classnames';

if (process.env.BROWSER){
  require('../../styles/Project/ComponentItem.styl');
}

const spec = {
  beginDrag(props){
    return props.component.toJS();
  }
};

@DragSource(ItemTypes.CONTAINER, spec, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
class ComponentItem extends React.Component {
  static propTypes = {
    component: React.PropTypes.object.isRequired,

    // React DnD
    connectDragSource: React.PropTypes.func.isRequired,
    isDragging: React.PropTypes.bool.isRequired
  }

  render(){
    const {component, connectDragSource, isDragging} = this.props;

    let className = cx('component-item', {
      'component-item--dragging': isDragging
    });

    return connectDragSource(
      <div className={className}>
        {component.get('type')}
      </div>
    , 'copy');
  }
}

export default ComponentItem;
