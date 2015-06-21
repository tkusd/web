import React from 'react';
import {DragSource} from 'react-dnd';
import ItemTypes from '../../constants/ItemTypes';
import Translation from '../i18n/Translation';
import cx from 'classnames';
//import {createElement} from '../../actions/ElementAction';

if (process.env.BROWSER){
  require('../../styles/Project/ComponentItem.styl');
}

const spec = {
  beginDrag(props){
    return props.component.toObject();
  },

  endDrag(props, monitor){
    if (!monitor.didDrop()) return;

    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();
    if (!dropResult) return;

    console.log(item, dropResult);
  }
};

@DragSource(ItemTypes.CONTAINER, spec, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
class ComponentItem extends React.Component {
  static propTypes = {
    component: React.PropTypes.object.isRequired,
    components: React.PropTypes.object.isRequired,

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
        <Translation id={'project.' + component.get('type')}/>
      </div>
    );
  }
}

export default ComponentItem;
