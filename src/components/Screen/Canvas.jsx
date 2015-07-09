import React from 'react';
import {DropTarget} from 'react-dnd';
import ItemTypes from '../../constants/ItemTypes';
import ElementTypes from '../../constants/ElementTypes';
import assign from 'lodash/object/assign';
import throttle from 'lodash/function/throttle';

if (process.env.BROWSER){
  require('../../styles/Screen/Canvas.styl');
}

const THROTTLE_DELAY = 100;
const RESIZE_AREA_SIZE = 4;

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
    activeElement: React.PropTypes.string,
    components: React.PropTypes.object.isRequired,
    selectElement: React.PropTypes.func.isRequired,

    // React DnD
    connectDropTarget: React.PropTypes.func.isRequired,
    isOver: React.PropTypes.bool.isRequired,
    canDrop: React.PropTypes.bool.isRequired
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      rect: {}
    };

    this.handleWindowResize = throttle(this.handleWindowResize.bind(this), THROTTLE_DELAY, {
      leading: true
    });
  }

  componentDidMount(){
    this.updateMaskStyle();
    window.addEventListener('resize', this.handleWindowResize);
  }

  componeentWillUnmount(){
    window.removeEventListener('resize', this.handleWindowResize);
  }

  render(){
    const {
      connectDropTarget,
      isOver,
      canDrop,
      activeElement,
      element
    } = this.props;

    const node = this.renderNode();
    const isDragOver = isOver && canDrop;
    const isActive = activeElement === element.get('id');

    return connectDropTarget(
      <div className="canvas">
        {node}
        {isActive && this.renderResizeArea()}
        {isDragOver && this.renderDragOverMask()}
      </div>
    );
  }

  renderResizeArea(){
    const {rect} = this.state;

    return (
      <div className="canvas__resize-area">
        <div className="canvas__resize-n"
          style={{
            top: rect.top - RESIZE_AREA_SIZE / 2,
            left: rect.left,
            width: rect.width,
            height: RESIZE_AREA_SIZE
          }}/>
        <div className="canvas__resize-e"
          style={{
            top: rect.top,
            left: rect.right - RESIZE_AREA_SIZE / 2,
            width: RESIZE_AREA_SIZE,
            height: rect.height
          }}/>
        <div className="canvas__resize-s"
          style={{
            top: rect.bottom - RESIZE_AREA_SIZE / 2,
            left: rect.left,
            width: rect.width,
            height: RESIZE_AREA_SIZE
          }}/>
        <div className="canvas__resize-w"
          style={{
            top: rect.top,
            left: rect.left - RESIZE_AREA_SIZE / 2,
            width: RESIZE_AREA_SIZE,
            height: rect.height
          }}/>
        <div className="canvas__resize-ne"
          style={{
            top: rect.top - RESIZE_AREA_SIZE / 2,
            left: rect.right - RESIZE_AREA_SIZE / 2,
            width: RESIZE_AREA_SIZE,
            height: RESIZE_AREA_SIZE
          }}/>
        <div className="canvas__resize-se"
          style={{
            top: rect.bottom - RESIZE_AREA_SIZE / 2,
            left: rect.right - RESIZE_AREA_SIZE / 2,
            width: RESIZE_AREA_SIZE,
            height: RESIZE_AREA_SIZE
          }}/>
        <div className="canvas__resize-sw"
          style={{
            top: rect.bottom - RESIZE_AREA_SIZE / 2,
            left: rect.left - RESIZE_AREA_SIZE / 2,
            width: RESIZE_AREA_SIZE,
            height: RESIZE_AREA_SIZE
          }}/>
        <div className="canvas__resize-nw"
          style={{
            top: rect.top - RESIZE_AREA_SIZE / 2,
            left: rect.left - RESIZE_AREA_SIZE / 2,
            width: RESIZE_AREA_SIZE,
            height: RESIZE_AREA_SIZE
          }}/>
      </div>
    );
  }

  renderDragOverMask(){
    const {rect} = this.state;

    return (
      <div className="canvas__mask" style={{
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        }}/>
    );
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

    let props = {
      // It's kinda weird that the style can't be mutated and I have to clone
      // the object to do it.
      style: assign({}, element.get('styles')),
      className: 'canvas__' + element.get('type'),
      ref: 'node',
      onClick: this.handleNodeClick.bind(this)
    };

    let children = this.renderChildren();

    switch (element.get('type')){
      case ElementTypes.screen:
        return <div {...props}>{children}</div>;

      case ElementTypes.text:
        return <div {...props}>{element.get('attributes').text}</div>;

      case ElementTypes.layout:
        return <div {...props}>{children}</div>;

      case ElementTypes.button:
        return <button {...props}>{children}</button>;

      case ElementTypes.input:
        return <input {...props}/>;

      case ElementTypes.link:
        return <a {...props}>{children}</a>;

      case ElementTypes.image:
        return <img {...props}/>;

      case ElementTypes.list:
        return <ul {...props}/>;
    }
  }

  handleNodeClick(e){
    e.preventDefault();
    e.stopPropagation();

    const {activeElement, element, selectElement} = this.props;

    if (activeElement !== element.get('id')){
      selectElement(element.get('id'));
    }
  }

  handleWindowResize(){
    this.updateMaskStyle();
  }

  updateMaskStyle(){
    this.setState({
      rect: this.refs.node.getBoundingClientRect()
    });
  }
}

export default Canvas;
