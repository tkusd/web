import React from 'react';
import cx from 'classnames';
import assign from 'lodash/object/assign';
import omit from 'lodash/object/omit';

if (process.env.BROWSER){
  require('../../styles/dropdown/DropdownItem.styl');
}

class DropdownItem extends React.Component {
  static propTypes = {
    divider: React.PropTypes.bool
  }

  static defaultProps = {
    divider: false
  }

  render(){
    let props = assign({
      className: ''
    }, omit(this.props, 'children', 'divider'));

    props.className = cx(props.className, 'dropdown-item');

    if (this.props.divider){
      props.className = cx(props.className, 'dropdown-item--divider');
    }

    return <li {...props}>{this.props.children}</li>;
  }
}

export default DropdownItem;
