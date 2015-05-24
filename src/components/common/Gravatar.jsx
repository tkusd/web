import React from 'react';
import qs from 'qs';
import {assign, omit} from 'lodash';

class Gravatar extends React.Component {
  static propTypes = {
    size: React.PropTypes.number,
    src: React.PropTypes.string.isRequired,
    default: React.PropTypes.string,
    alt: React.PropTypes.string
  }

  static defaultProps = {
    size: 50,
    default: 'mm'
  }

  render(){
    let src = this.props.src + '?' + qs.stringify({
      s: this.props.size,
      d: this.props.default
    });

    let props = assign({}, omit(this.props, 'size', 'default'), {src});

    return React.DOM.img(props, this.props.children);
  }
}

export default Gravatar;
