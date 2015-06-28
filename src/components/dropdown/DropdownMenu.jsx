import React from 'react';
import cx from 'classnames';
import {merge, omit} from 'lodash';

if (process.env.BROWSER){
  require('../../styles/dropdown/DropdownMenu.styl');
}

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
      style: {}
    };
  }

  componentDidMount(){
    if (this.props.position === 'fixed'){
      const menu = React.findDOMNode(this.refs.menu);
      const parent = menu.parentNode;
      const rect = parent.getBoundingClientRect();

      this.setState({
        style: {
          top: rect.bottom,
          left: rect.left - 8
        }
      });
    }
  }

  render(){
    let props = merge({
      className: '',
      style: this.state.style
    }, omit(this.props, 'children', 'position'));

    props.className = cx(props.className, 'dropdown-menu', 'dropdown-menu--' + this.props.position);

    return <ul {...props} ref="menu">{this.props.children}</ul>;
  }
}

export default DropdownMenu;
