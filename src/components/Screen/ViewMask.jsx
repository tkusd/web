import React from 'react';
import {findDOMNode} from 'react-dom';
import ViewContainer from './ViewContainer';
import pureRender from '../../decorators/pureRender';
import ItemTypes from '../../constants/ItemTypes';
import SortableElementList from './SortableElementList';
import ScalableView from './ScalableView';
import ViewResize from './ViewResize';
import ViewHover from './ViewHover';
import ViewInput from './ViewInput';

if (process.env.BROWSER){
  require('../../styles/Screen/ViewMask.styl');
}

function findParentUntilElement(node){
  let target = node;

  while (target){
    if (target.id && target.id[0] === 'e') break;
    target = target.parentNode;
  }

  return target;
}

@SortableElementList(ItemTypes.VIEW_ITEM)
@pureRender
class ViewMask extends React.Component {
  static propTypes = {
    selectElement: React.PropTypes.func.isRequired,
    focusElement: React.PropTypes.func.isRequired,

    // React DnD
    connectDropTarget: React.PropTypes.func.isRequired
  }

  render(){
    const {connectDropTarget} = this.props;

    return connectDropTarget(
      <div className="view-mask" onClick={this.handleOutsideClick}>
        <ScalableView {...this.props}>
          <ViewContainer {...this.props}
            onClick={this.handleNodeClick}
            onScroll={this.handleScroll}
            onDoubleClick={this.handleDoubleClick}/>
        </ScalableView>
        <ViewResize {...this.props} ref="resize"/>
        <ViewHover {...this.props}/>
        <ViewInput {...this.props}/>
      </div>
    );
  }

  handleNodeClick = (e) => {
    e.preventDefault();

    let target = findParentUntilElement(e.target);
    if (!target) return;

    e.stopPropagation();

    this.props.selectElement(target.id.substring(1));
  }

  handleScroll = (e) => {
    const {resize} = this.refs;

    if (resize) resize.updateRect();
  }

  handleOutsideClick = (e) => {
    if (e.target !== findDOMNode(this)) return;

    const {selectElement} = this.props;
    selectElement(null);
  }

  handleDoubleClick = (e) => {
    e.preventDefault();

    let target = findParentUntilElement(e.target);
    if (!target) return;

    e.stopPropagation();

    this.props.focusElement(target.id.substring(1));
  }
}

export default ViewMask;
