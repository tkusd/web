import React from 'react';
import cx from 'classnames';
import {assign, omit, throttle} from 'lodash';

if (process.env.BROWSER){
  require('../../styles/dropdown/DropdownMenu.styl');
}

const THROTTLE_DELAY = 150;

class DropdownMenu extends React.Component {
  static propTypes = {
    position: React.PropTypes.oneOf(['left', 'right', 'fixed'])
  }

  static defaultProps = {
    position: 'left'
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      offset: {}
    };

    this.handleWindowResize = throttle(this.handleWindowResize.bind(this), THROTTLE_DELAY);
  }

  componentDidMount(){
    if (this.props.position === 'fixed'){
      this.updatePosition();
      window.addEventListener('resize', this.handleWindowResize);
    }
  }

  componentWillUnmount(){
    if (this.props.position === 'fixed'){
      window.removeEventListener('resize', this.handleWindowResize);
    }
  }

  render(){
    let props = assign({
      className: ''
    }, omit(this.props, 'children', 'position'));

    props.className = cx(props.className, 'dropdown-menu', 'dropdown-menu--' + this.props.position);

    if (this.props.position === 'fixed'){
      const {offset} = this.state;
      props.style = assign({
        left: offset.x,
        top: offset.y
      }, props.style);
    }

    return (
      <ul {...props} ref="menu">
        {this.props.children}
        <div className="dropdown-menu__triangle"/>
      </ul>
    );
  }

  handleWindowResize(){
    requestAnimationFrame(this.updatePosition.bind(this));
  }

  updatePosition(){
    const {menu} = this.refs;
    const menuRect = menu.getBoundingClientRect();
    const parent = menu.parentNode;
    const parentRect = parent.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let x = parentRect.left;
    let y = parentRect.bottom;

    if (x + menuRect.width > windowWidth){
      x = x - menuRect.width;
    }

    if (y + menuRect.height > windowHeight){
      y = y - menuRect.height;
    }

    this.setState({
      offset: {x, y}
    });
  }
}

export default DropdownMenu;
