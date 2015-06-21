import React from 'react';
import cx from 'classnames';

if (process.env.BROWSER){
  require('font-awesome/css/font-awesome.css');
}

class FontAwesome extends React.Component {
  render(){
    let className = cx('fa', 'fa-' + this.props.icon);
    return <i className={className}/>;
  }
}

export default FontAwesome;
