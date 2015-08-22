import React from 'react';
import cx from 'classnames';
import {Link} from 'react-router';
import pureRender from '../../decorators/pureRender';
import {DragSource, DropTarget} from 'react-dnd';
import ItemTypes from '../../constants/ItemTypes';

if (process.env.BROWSER){
  require('../../styles/Project/ScreenItem.styl');
}

const sourceSpec = {
  beginDrag(props){
    const {element} = props;

    return {
      id: element.get('id'),
      originalIndex: element.get('index')
    };
  },

  endDrag(props, monitor){
    if (monitor.didDrop()){
      props.updateIndex();
    } else {
      const item = monitor.getItem();
      props.moveScreen(item.id, item.originalIndex, true);
    }
  }
};

const targetSpec = {
  canDrop(){
    return false;
  },

  hover(props, monitor){
    const item = monitor.getItem();
    const {element} = props;

    if (item.id !== element.get('id')){
      props.moveScreen(item.id, element.get('index'));
    }
  }
};

@DropTarget(ItemTypes.SCREEN_ITEM, targetSpec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource(ItemTypes.SCREEN_ITEM, sourceSpec, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
@pureRender
class ScreenItem extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    project: React.PropTypes.object.isRequired,
    element: React.PropTypes.object.isRequired,
    selectedScreen: React.PropTypes.string,
    editable: React.PropTypes.bool.isRequired,
    moveScreen: React.PropTypes.func.isRequired,
    updateIndex: React.PropTypes.func.isRequired,

    // React DnD
    connectDragSource: React.PropTypes.func.isRequired,
    connectDropTarget: React.PropTypes.func.isRequired,
    isDragging: React.PropTypes.bool.isRequired
  }

  render(){
    const {
      element,
      selectedScreen,
      project,
      connectDragSource,
      connectDropTarget,
      isDragging
    } = this.props;

    const id = element.get('id');
    let className = cx('screen-item', {
      'screen-item--selected': selectedScreen === id,
      'screen-item--main': project.get('main_screen') === id,
      'screen-item--dragging': isDragging
    });

    return connectDragSource(connectDropTarget(
      <div className={className}>
        <Link to={`/projects/${element.get('project_id')}/screens/${id}`} className="screen-item__name">
          {element.get('name')}
        </Link>
      </div>
    ));
  }
}

export default ScreenItem;
