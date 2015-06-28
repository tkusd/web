import React from 'react';
import cx from 'classnames';
import {omit} from 'lodash';

if (process.env.BROWSER){
  require('font-awesome/css/font-awesome.css');
}

class FontAwesome extends React.Component {
  render(){
    let props = omit(this.props, 'icon');
    props.className = cx('fa', 'fa-' + this.props.icon, props.className);

    return <i {...props}/>;
  }
}

export default FontAwesome;
