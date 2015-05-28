import React from 'react';
import cx from 'classnames';
import {assign, omit} from 'lodash';

if (process.env.BROWSER){
  require('../../styles/dropdown/DropdownMenu.styl');
}

class DropdownMenu extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    position: React.PropTypes.oneOf(['left', 'right'])
  }

  static defaultProps = {
    className: '',
    position: 'left'
  }

  render(){
    let {className} = this.props;
    if (className) className += ' ';
    className += cx('dropdown-menu', {
      'dropdown-menu--left': this.props.position === 'left',
      'dropdown-menu--right': this.props.position === 'right'
    });

    let props = assign({}, omit(this.props, 'position'), {className});

    return React.DOM.ul(props, this.props.children);
  }
}

export default DropdownMenu;
