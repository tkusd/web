import React from 'react';
import {assign} from 'lodash';

class DropdownDivider extends React.Component {
  static propTypes = {
    className: React.PropTypes.string
  }

  static defaultProps = {
    className: ''
  }

  render(){
    let {className} = this.props;
    if (className) className += ' ';
    className += 'dropdown-divider';

    let props = assign({}, this.props, {className});

    return React.DOM.li(props, this.props.children);
  }
}

export default DropdownDivider;
