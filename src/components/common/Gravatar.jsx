import React from 'react';
import qs from 'querystring';
import {omit} from 'lodash';

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

    return <img src={src} {...omit(this.props, 'src', 'size', 'default')}/>;
  }
}

export default Gravatar;
