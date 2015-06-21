import React from 'react';
import cx from 'classnames';
import {assign, omit} from 'lodash';

if (process.env.BROWSER){
  require('../../styles/dropdown/DropdownMenu.styl');
}

class DropdownMenu extends React.Component {
  static propTypes = {
    position: React.PropTypes.oneOf(['left', 'right'])
  }

  static defaultProps = {
    position: 'left'
  }

  render(){
    let props = assign({
      className: ''
    }, omit(this.props, 'children', 'position'));

    props.className = cx(props.className, 'dropdown-menu', 'dropdown-menu--' + this.props.position);

    return React.DOM.ul(props, this.props.children);
  }
}

export default DropdownMenu;
