import React from 'react';
import cx from 'classnames';

if (process.env.BROWSER){
  require('../../styles/tab/TabPane.styl');
}

class TabPane extends React.Component {
  render(){
    return <div {...this.props} className={cx('tab-pane', this.props.className)}/>;
  }
}

export default TabPane;
