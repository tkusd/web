import React from 'react';
import {assign} from 'lodash';

if (process.env.BROWSER){
  require('../../styles/dropdown/DropdownItem.styl');
}

class DropdownItem extends React.Component {
  static propTypes = {
    className: React.PropTypes.string
  }

  static defaultProps = {
    className: ''
  }

  render(){
    let {className} = this.props;
    if (className) className += ' ';
    className += 'dropdown-item';

    let props = assign({}, this.props, {className});

    return React.DOM.li(props, this.props.children);
  }
}

export default DropdownItem;
