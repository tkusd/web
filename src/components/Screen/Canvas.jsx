import React from 'react';
import {DropTarget} from 'react-dnd';
import cx from 'classnames';
import ItemTypes from '../../constants/ItemTypes';
import ElementTypes from '../../constants/ElementTypes';
import {assign, throttle} from 'lodash';

if (process.env.BROWSER){
  require('../../styles/Screen/Canvas.styl');
}

const THROTTLE_DELAY = 150;

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
  static contextTypes = {
    updateElement: React.PropTypes.func.isRequired
  }

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

  constructor(props, context){
    super(props, context);

    this.state = {
      maskStyle: {}
    };

    this.handleWindowResize = throttle(this.handleWindowResize.bind(this), THROTTLE_DELAY, {
      leading: true
    });
  }

  componentDidMount(){
    this.updateMaskStyle();
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.handleWindowResize);
  }

  componentWillReceiveProps(){
    this.updateMaskStyle();
  }

  render(){
    const {
      connectDropTarget,
      canDrop,
      isOver,
      selectedElement,
      element,
      components
    } = this.props;

    const component = components.get(element.get('type'));
    const node = this.renderNode();
    const isActive = canDrop && isOver;

    let className = cx('canvas', {
      'canvas--selected': selectedElement === element.get('id'),
      'canvas--active': isActive
    });

    return connectDropTarget(
      <div className={className}>
        {node}
        <div className="canvas__mask" style={this.state.maskStyle}>
          {component.get('resizable') && (
            <div>
              <div className="canvas__mask-n"/>
              <div className="canvas__mask-ne"/>
              <div className="canvas__mask-e"/>
              <div className="canvas__mask-se"/>
              <div className="canvas__mask-s"/>
              <div className="canvas__mask-sw"/>
              <div className="canvas__mask-w"/>
              <div className="canvas__mask-nw"/>
            </div>
          )}
        </div>
      </div>
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
      ref: 'node'
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

  handleWindowResize(){
    requestAnimationFrame(this.updateMaskStyle.bind(this));
  }

  updateMaskStyle(){
    const rect = this.refs.node.getBoundingClientRect();

    this.setState({
      maskStyle: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      }
    });
  }

  handleNodeResize(deltaWidth, deltaHeight){
    //
  }
}

export default Canvas;
