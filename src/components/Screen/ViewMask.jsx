import React from 'react';
import {findDOMNode} from 'react-dom';
import ViewContainer from './ViewContainer';
import debounce from 'lodash/function/debounce';
import Immutable from 'immutable';
import pureRender from '../../decorators/pureRender';
import ItemTypes from '../../constants/ItemTypes';
import SortableElementList from './SortableElementList';
import ScalableView from './ScalableView';

if (process.env.BROWSER){
  require('../../styles/Screen/ViewMask.styl');
}

const DEBOUNCE_DELAY = 150;

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

  componentDidUpdate(prevProps){
    if (this.props.activeElement !== prevProps.activeElement){
      let node;

      if (this.props.activeElement){
        node = document.getElementById('e' + this.props.activeElement);
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

    if (!Immutable.is(this.props.hoverElements, prevProps.hoverElements)){
      let node;

      if (this.props.hoverElements.count()){
        node = document.getElementById('e' + this.props.hoverElements.last());
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

    if (!Immutable.is(this.props.elements, prevProps.elements) ||
      this.props.screenSize !== prevProps.screenSize ||
      this.props.screenDimension !== prevProps.screenDimension ||
      this.props.screenScale !== prevProps.screenScale){
      this.updateRect();
    }
  }

  render(){
    const {connectDropTarget} = this.props;

    return connectDropTarget(
      <div className="view-mask" onClick={this.handleOutsideClick}>
        <ScalableView {...this.props}>
          <ViewContainer {...this.props}
            onClick={this.handleNodeClick}
            onScroll={this.updateRect}/>
        </ScalableView>
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
            top: rect.top,
            left: rect.left,
            width: rect.width
          }}/>
        <div className="view-mask__resize-e"
          style={{
            top: rect.top,
            left: rect.right,
            height: rect.height
          }}/>
        <div className="view-mask__resize-s"
          style={{
            top: rect.bottom,
            left: rect.left,
            width: rect.width
          }}/>
        <div className="view-mask__resize-w"
          style={{
            top: rect.top,
            left: rect.left,
            height: rect.height
          }}/>
        <div className="view-mask__resize-ne"
          style={{
            top: rect.top,
            left: rect.right
          }}/>
        <div className="view-mask__resize-se"
          style={{
            top: rect.bottom,
            left: rect.right
          }}/>
        <div className="view-mask__resize-sw"
          style={{
            top: rect.bottom,
            left: rect.left
          }}/>
        <div className="view-mask__resize-nw"
          style={{
            top: rect.top,
            left: rect.left
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

  handleOutsideClick = (e) => {
    if (e.target !== findDOMNode(this)) return;

    const {selectElement} = this.props;
    selectElement(null);
  }
}

export default ViewMask;
