import React from 'react';
import debounce from 'lodash/function/debounce';

if (process.env.BROWSER){
  require('../../styles/Screen/ViewResize.styl');
}

const DEBOUNCE_DELAY = 150;

class ViewResize extends React.Component {
  static propTypes = {
    activeElement: React.PropTypes.string,
    screenSize: React.PropTypes.string.isRequired,
    screenDimension: React.PropTypes.string.isRequired,
    screenScale: React.PropTypes.number.isRequired
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      rect: null
    };

    this.handleWindowResize = debounce(this.handleWindowResize.bind(this), DEBOUNCE_DELAY);
  }

  componentDidMount(){
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.handleWindowResize);
  }

  componentDidUpdate(prevProps){
    if (this.props.activeElement !== prevProps.activeElement ||
      this.props.screenSize !== prevProps.screenSize ||
      this.props.screenDimension !== prevProps.screenDimension ||
      this.props.screenScale !== prevProps.screenScale
    ){
      this.updateRect();
    }
  }

  render(){
    const {rect} = this.state;
    if (!rect) return <div/>;

    return (
      <div>
        <div className="view-resize__n"
          style={{
            top: rect.top,
            left: rect.left,
            width: rect.width
          }}/>
        <div className="view-resize__e"
          style={{
            top: rect.top,
            left: rect.right,
            height: rect.height
          }}/>
        <div className="view-resize__s"
          style={{
            top: rect.bottom,
            left: rect.left,
            width: rect.width
          }}/>
        <div className="view-resize__w"
          style={{
            top: rect.top,
            left: rect.left,
            height: rect.height
          }}/>
        <div className="view-resize__ne"
          style={{
            top: rect.top,
            left: rect.right
          }}/>
        <div className="view-resize__se"
          style={{
            top: rect.bottom,
            left: rect.right
          }}/>
        <div className="view-resize__sw"
          style={{
            top: rect.bottom,
            left: rect.left
          }}/>
        <div className="view-resize__nw"
          style={{
            top: rect.top,
            left: rect.left
          }}/>
      </div>
    );
  }

  handleWindowResize(){
    this.updateRect();
  }

  updateRect(){
    const {activeElement} = this.props;

    if (activeElement){
      const node = document.getElementById('e' + activeElement);

      if (node){
        return this.setState({
          rect: node.getBoundingClientRect()
        });
      }
    }

    return this.setState({
      rect: null
    });
  }
}

export default ViewResize;