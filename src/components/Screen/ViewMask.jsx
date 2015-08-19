import React from 'react';
import cx from 'classnames';
import ViewContainer from './ViewContainer';
import debounce from 'lodash/function/debounce';
import Immutable from 'immutable';
import pureRender from '../../decorators/pureRender';

if (process.env.BROWSER){
  require('../../styles/Screen/ViewMask.styl');
}

const DEBOUNCE_DELAY = 250;
const RESIZE_AREA_SIZE = 4;

@pureRender
class ViewMask extends React.Component {
  static propTypes = {
    project: React.PropTypes.object.isRequired,
    selectElement: React.PropTypes.func.isRequired,
    activeElement: React.PropTypes.string,
    hoverElements: React.PropTypes.object.isRequired,
    screenSize: React.PropTypes.string.isRequired
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
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
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
    return (
      <div className="view-mask" onClick={this.handleOutsideClick} ref="container">
        {this.renderScreen()}
        {this.renderResizeArea()}
        {this.renderMask()}
      </div>
    );
  }

  renderScreen(){
    const {project, screenSize, screenDimension} = this.props;
    let [width, height] = screenSize.split('x');

    if (screenDimension === 'horizontal'){
      [height, width] = [width, height];
    }

    let style = {width, height};

    return (
      <div className={cx('view-mask__screen', project.get('theme'))} style={style}>
        <ViewContainer {...this.props} onClick={this.handleNodeClick}/>
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

  handleOutsideClick(e){
    if (e.target !== this.refs.container) return;

    this.props.selectElement(null);
  }
}

export default ViewMask;
