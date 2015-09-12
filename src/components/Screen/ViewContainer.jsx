import React from 'react';
import View from '../../embed/View';
import ItemTypes from '../../constants/ItemTypes';
import pureRender from '../../decorators/pureRender';
import SortableElementItem from './SortableElementItem';
import ComponentDropZone from './ComponentDropZone';

@SortableElementItem(ItemTypes.VIEW_ITEM)
@ComponentDropZone
@pureRender
class ViewContainer extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired
  }

  static propTypes = {
    element: React.PropTypes.object.isRequired,

    // React DnD
    isOver: React.PropTypes.bool.isRequired,
    canDrop: React.PropTypes.bool.isRequired
  }

  render(){
    return (
      <View {...this.props} Container={ViewContainer}/>
    );
  }
}

export default ViewContainer;
