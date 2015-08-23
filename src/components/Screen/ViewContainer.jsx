import React from 'react';
import View from '../preview/View';
import ItemTypes from '../../constants/ItemTypes';
import pureRender from '../../decorators/pureRender';
import getAssetBlobURL from '../../utils/getAssetBlobURL';
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
    apiEndpoint: React.PropTypes.string.isRequired,
    element: React.PropTypes.object.isRequired,

    // React DnD
    isOver: React.PropTypes.bool.isRequired,
    canDrop: React.PropTypes.bool.isRequired
  }

  render(){
    const {apiEndpoint} = this.props;

    return (
      <View {...this.props}
        Container={ViewContainer}
        getAssetURL={getAssetBlobURL.bind(this, apiEndpoint)}/>
    );
  }
}

export default ViewContainer;
