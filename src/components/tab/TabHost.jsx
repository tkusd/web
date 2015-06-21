import React from 'react';
import TabPane from './TabPane';
import cx from 'classnames';
import pureRender from '../../utils/pureRender';

@pureRender
class TabHost extends React.Component {
  static propTypes = {
    initialIndex: React.PropTypes.number,
    className: React.PropTypes.string
  }

  static defaultProps = {
    initialIndex: 0,
    className: ''
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      currentIndex: this.props.initialIndex
    };
  }

  render(){
    const {currentIndex} = this.state;
    const {children, className} = this.props;
    let tabs = [];
    let tabContent = [];

    React.Children.forEach(children, child => {
      if (child.type !== TabPane) return;

      let i = tabs.length;
      let className = cx('tab-host__tab', {
        active: i === currentIndex
      });

      tabs.push(
        <a className={className} onClick={this.switchTab.bind(this, i)} key={i}>{child.props.tab}</a>
      );
      tabContent.push(child.props.children);
    });

    return (
      <div className={cx(className, 'tab-host')}>
        <div className="tab-host__tabs">{tabs}</div>
        <div className="tab-host__content">{tabContent[currentIndex]}</div>
      </div>
    );
  }

  switchTab(index){
    this.setState({
      currentIndex: index
    });
  }
}

export default TabHost;
