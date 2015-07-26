import React from 'react';
import {findDOMNode} from 'react-dom';
import {DropTarget} from 'react-dnd';
import ItemTypes from '../../constants/ItemTypes';
import throttle from 'lodash/function/throttle';
import Immutable from 'immutable';
import Canvas from './Canvas';

if (process.env.BROWSER){
  require('../../styles/Screen/CanvasContainer.styl');
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
  isOver: monitor.isOver({
    shallow: true
  }),
  canDrop: monitor.canDrop()
}))
class CanvasContainer extends React.Component {
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

  componentDidUpdate(prevProps){
    if (!Immutable.is(this.props.element, prevProps.element) || !Immutable.is(this.props.elements, prevProps.elements)){
      this.updateMaskStyle();
    }
  }

  isElementActive(){
    const {element, activeElement} = this.props;
    return activeElement === element.get('id');
  }

  render(){
    const {
      connectDropTarget,
      isOver,
      canDrop
    } = this.props;

    const isDragOver = isOver && canDrop;
    const isActive = this.isElementActive();
    const componentType = getComponentType(this.props);

    let result = (
      <div>
        <Canvas {...this.props} ref="node" onClick={this.handleNodeClick.bind(this)}>
          {this.renderChildren()}
        </Canvas>
        {isActive && this.renderResizeArea()}
        {isDragOver && this.renderDragOverMask()}
      </div>
    );

    if (componentType === ItemTypes.CONTAINER){
      return connectDropTarget(result);
    } else {
      return result;
    }
  }

  renderChildren(){
    const {elements, element} = this.props;
    const id = element.get('id');

    return elements
      .filter(item => item.get('element_id') === id)
      .map((item, id) => (
        <CanvasContainer {...this.props} key={id} element={item}/>
      )).toArray();
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
    if (!this.refs.node) return;

    this.setState({
      rect: findDOMNode(this.refs.node).getBoundingClientRect()
    });
  }
}

export default CanvasContainer;
