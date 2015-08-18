import React from 'react';
import {DropTarget} from 'react-dnd';
import View from '../preview/View';
import ItemTypes from '../../constants/ItemTypes';
import * as ElementAction from '../../actions/ElementAction';
import bindActions from '../../utils/bindActions';

const spec = {
  drop(props, monitor, {context}){
    if (monitor.didDrop()) return;

    const component = monitor.getItem();
    const {element} = props;
    const {createElement} = bindActions(ElementAction, context.flux);

    createElement({
      name: component.type,
      type: component.type,
      element_id: element.get('id')
    });
  }
};

@DropTarget(ItemTypes.CONTAINER, spec, (connect, monitor) => ({
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
    // React DnD
    connectDropTarget: React.PropTypes.func.isRequired,
    isOver: React.PropTypes.bool.isRequired,
    canDrop: React.PropTypes.bool.isRequired
  }

  componentWillReceiveProps(nextProps){
    const {pushHoverElement, popHoverElement} = bindActions(ElementAction, this.context.flux);
    const {element} = this.props;

    if (!this.props.isOver && nextProps.isOver){
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
