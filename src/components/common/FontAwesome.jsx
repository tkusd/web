import React from 'react';
import cx from 'classnames';
import {omit} from 'lodash';

if (process.env.BROWSER){
  require('font-awesome/css/font-awesome.css');
}

class FontAwesome extends React.Component {
  static propTypes = {
    icon: React.PropTypes.string.isRequired,
    spin: React.PropTypes.bool,
    pulse: React.PropTypes.bool,
    rotate: React.PropTypes.oneOf([90, 180, 270]),
    flip: React.PropTypes.oneOf(['horizontal', 'vertical'])
  }

  static defaultProps = {
    spin: false,
    pulse: false
  }

  render(){
    let props = omit(this.props, 'icon', 'spin', 'pulse', 'rotate', 'flip');
    let classes = ['fa', 'fa-' + this.props.icon];

    if (this.props.rotate){
      classes.push('fa-rotate-' + this.props.rotate);
    }

    if (this.props.flip){
      classes.push('fa-flip-' + this.props.flip);
    }

    props.className = cx(classes, {
      'fa-spin': this.props.spin,
      'fa-pulse': this.props.pulse
    }, props.className);

    return <i {...props}/>;
  }
}

export default FontAwesome;
