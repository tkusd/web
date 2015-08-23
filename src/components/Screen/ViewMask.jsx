import React from 'react';
import ViewContainer from './ViewContainer';
import debounce from 'lodash/function/debounce';
import Immutable from 'immutable';
import pureRender from '../../decorators/pureRender';
import ItemTypes from '../../constants/ItemTypes';
import SortableElementList from './SortableElementList';

if (process.env.BROWSER){
  require('../../styles/Screen/ViewMask.styl');
}

const DEBOUNCE_DELAY = 250;
const RESIZE_AREA_SIZE = 4;

@SortableElementList(ItemTypes.VIEW_ITEM)
@pureRender
class ViewMask extends React.Component {
  static propTypes = {
    project: React.PropTypes.object.isRequired,
    selectElement: React.PropTypes.func.isRequired,
    activeElement: React.PropTypes.string,
    hoverElements: React.PropTypes.object.isRequired,

    // React DnD
    connectDropTarget: React.PropTypes.func.isRequired
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      activeNode: null,
      activeNodeRect: null,
      maskNode: null,
      maskRect: null
    };

    this.handleWindowResize = debounce(this.handleWindowResize.bind(this), DEBOUNCE_DELAY, {
      leading: true
    });
    this.handleNodeClick = this.handleNodeClick.bind(this);
    this.updateRect = this.updateRect.bind(this);
  }

  componentDidMount(){
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.handleWindowResize);
  }

  componentWillReceiveProps(nextProps){
    if (this.props.activeElement !== nextProps.activeElement){
      let node;

      if (nextProps.activeElement){
        node = document.getElementById('e' + nextProps.activeElement);
      }

      if (node){
        this.setState({
          activeNode: node,
          activeNodeRect: node.getBoundingClientRect()
        });
      } else {
        this.setState({
          activeNode: null,
          activeNodeRect: null
        });
      }
    }

    if (!Immutable.is(this.props.hoverElements, nextProps.hoverElements)){
      let node;

      if (nextProps.hoverElements.count()){
        node = document.getElementById('e' + nextProps.hoverElements.last());
      }

      if (node){
        this.setState({
          maskNode: node,
          maskNodeRect: node.getBoundingClientRect()
        });
      } else {
        this.setState({
          maskNode: null,
          maskNodeRect: null
        });
      }
    }
  }

  componentDidUpdate(prevProps){
    if (!Immutable.is(this.props.elements, prevProps.elements)){
      this.updateRect();
    }
  }

  render(){
    const {connectDropTarget} = this.props;

    return connectDropTarget(
      <div className="view-mask">
        <ViewContainer {...this.props}
          onClick={this.handleNodeClick}
          onScroll={this.updateRect}/>
        {this.renderResizeArea()}
        {this.renderMask()}
      </div>
    );
  }

  renderResizeArea(){
    const rect = this.state.activeNodeRect;
    if (!rect) return;

    return (
      <div className="view-mask__resize-area">
        <div className="view-mask__resize-n"
          style={{
            top: rect.top - RESIZE_AREA_SIZE / 2,
            left: rect.left,
            width: rect.width,
            height: RESIZE_AREA_SIZE
          }}/>
        <div className="view-mask__resize-e"
          style={{
            top: rect.top,
            left: rect.right - RESIZE_AREA_SIZE / 2,
            width: RESIZE_AREA_SIZE,
            height: rect.height
          }}/>
        <div className="view-mask__resize-s"
          style={{
            top: rect.bottom - RESIZE_AREA_SIZE / 2,
            left: rect.left,
            width: rect.width,
            height: RESIZE_AREA_SIZE
          }}/>
        <div className="view-mask__resize-w"
          style={{
            top: rect.top,
            left: rect.left - RESIZE_AREA_SIZE / 2,
            width: RESIZE_AREA_SIZE,
            height: rect.height
          }}/>
        <div className="view-mask__resize-ne"
          style={{
            top: rect.top - RESIZE_AREA_SIZE / 2,
            left: rect.right - RESIZE_AREA_SIZE / 2,
            width: RESIZE_AREA_SIZE,
            height: RESIZE_AREA_SIZE
          }}/>
        <div className="view-mask__resize-se"
          style={{
            top: rect.bottom - RESIZE_AREA_SIZE / 2,
            left: rect.right - RESIZE_AREA_SIZE / 2,
            width: RESIZE_AREA_SIZE,
            height: RESIZE_AREA_SIZE
          }}/>
        <div className="view-mask__resize-sw"
          style={{
            top: rect.bottom - RESIZE_AREA_SIZE / 2,
            left: rect.left - RESIZE_AREA_SIZE / 2,
            width: RESIZE_AREA_SIZE,
            height: RESIZE_AREA_SIZE
          }}/>
        <div className="view-mask__resize-nw"
          style={{
            top: rect.top - RESIZE_AREA_SIZE / 2,
            left: rect.left - RESIZE_AREA_SIZE / 2,
            width: RESIZE_AREA_SIZE,
            height: RESIZE_AREA_SIZE
          }}/>
      </div>
    );
  }

  renderMask(){
    const rect = this.state.maskNodeRect;
    if (!rect) return;

    return (
      <div className="view-mask__mask"
        style={{
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        }}/>
    );
  }

  updateRect(){
    const {activeNode, maskNode} = this.state;

    this.setState({
      activeNodeRect: activeNode && activeNode.getBoundingClientRect(),
      maskNodeRect: maskNode && maskNode.getBoundingClientRect()
    });
  }

  handleWindowResize(){
    this.updateRect();
  }

  handleNodeClick(e){
    e.preventDefault();

    let target = e.target;

    while (target){
      if (target.id && target.id[0] === 'e') break;
      target = target.parentNode;
    }

    if (!target) return;

    this.props.selectElement(target.id.substring(1));
  }
}

export default ViewMask;
