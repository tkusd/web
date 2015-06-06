import React from 'react';
/*
import {DropTarget} from 'react-dnd';
import ItemTypes from '../../constants/ItemTypes';
import cx from 'classnames';

if (process.env.BROWSER){
  require('../../styles/Project/Screen.styl');
}

const spec = {
  drop(){
    return {
      type: ItemTypes.SCREEN
    };
  }
};

@DropTarget(ItemTypes.COMPONENT, spec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
class Screen extends React.Component {
  static propTypes = {
    project: React.PropTypes.object.isRequired,
    elements: React.PropTypes.object.isRequired,
    selectedElement: React.PropTypes.string,

    // React DnD
    connectDropTarget: React.PropTypes.func.isRequired,
    isOver: React.PropTypes.bool.isRequired,
    canDrop: React.PropTypes.bool.isRequired
  }

  render(){
    const {selectedElement, connectDropTarget, canDrop, isOver} = this.props;

    if (selectedElement){
      const isActive = canDrop && isOver;
      let classname = cx('screen', {
        'screen--active': isActive
      });

      return connectDropTarget(
        <div className={classname}></div>
      );
    } else {
      return <div>Please select a screen</div>;
    }
  }
}*/

class Screen extends React.Component {
  static propTypes = {
    element: React.PropTypes.object.isRequired
  }

  render(){
    const {element} = this.props;

    return (
      <li>{element.get('name')}</li>
    );
  }
}

export default Screen;
