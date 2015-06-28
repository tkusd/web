import React from 'react';
import {DropTarget} from 'react-dnd';
import cx from 'classnames';
import ItemTypes from '../../constants/ItemTypes';
import {merge} from 'lodash';
import ElementTypes from '../../constants/ElementTypes';

if (process.env.BROWSER){
  require('../../styles/Screen/Canvas.styl');
}

function getComponentType(props){
  const {element, components} = props;

  if (components.get(element.get('type')).get('container')){
    return ItemTypes.CONTAINER;
  } else {
    return ItemTypes.NON_CONTAINER;
  }
}

const spec = {
  drop(props, monitor) {
    if (monitor.didDrop()) return;

    const {element} = props;

    return {
      id: element.get('id'),
      type: element.get('type')
    };
  }
};

@DropTarget(getComponentType, spec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
class Canvas extends React.Component {
  static propTypes = {
    elements: React.PropTypes.object.isRequired,
    element: React.PropTypes.object.isRequired,
    selectedElement: React.PropTypes.string,
    components: React.PropTypes.object.isRequired,

    // React DnD
    connectDropTarget: React.PropTypes.func.isRequired,
    isOver: React.PropTypes.bool.isRequired,
    canDrop: React.PropTypes.bool.isRequired
  }

  render(){
    const {
      connectDropTarget,
      canDrop,
      isOver,
      selectedElement,
      element
    } = this.props;

    const node = this.renderNode();
    const id = element.get('id');
    // const component = this.getComponent();
    const isActive = canDrop && isOver;

    node.props.style = element.get('styles');
    node.props.children = merge(node.props.children || [], this.renderChildren());
    node.props.className = cx(node.props.className, 'canvas__' + element.get('type'), {
      'canvas--selected': selectedElement === id,
      'canvas--active': isActive
    });

    return connectDropTarget(node);
  }

  getComponent(){
    const {components, element} = this.props;
    return components.get(element.get('type'));
  }

  renderChildren(){
    const {elements, element} = this.props;
    const id = element.get('id');

    return elements
      .filter(item => item.get('element_id') === id)
      .map((item, id) => (
        <Canvas {...this.props} key={id} element={item}/>
      )).toArray();
  }

  renderNode(){
    const {element} = this.props;

    switch (element.get('type')){
      case ElementTypes.screen:
        return <div/>;

      case ElementTypes.text:
        return <span/>;

      case ElementTypes.layout:
        return <div/>;

      case ElementTypes.button:
        return <button/>;

      case ElementTypes.input:
        return <input/>;

      case ElementTypes.link:
        return <a/>;

      case ElementTypes.image:
        return <img/>;

      case ElementTypes.list:
        return <ul/>;
    }
  }
}

export default Canvas;
