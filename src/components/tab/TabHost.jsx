import React from 'react';
import TabPane from './TabPane';
import cx from 'classnames';
import pureRender from '../../decorators/pureRender';

function noop(){}

@pureRender
class TabHost extends React.Component {
  static propTypes = {
    defaultIndex: React.PropTypes.number,
    index: React.PropTypes.number,
    className: React.PropTypes.string,
    onChange: React.PropTypes.func
  }

  static defaultProps = {
    defaultIndex: 0,
    className: '',
    onChange: noop
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      currentIndex: this.props.hasOwnProperty('index') ? this.props.index : this.props.defaultIndex
    };
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.hasOwnProperty('index') && nextProps.index !== this.state.currentIndex){
      this.setState({
        index: nextProps.index
      });
    }
  }

  render(){
    const {currentIndex} = this.state;
    const {children} = this.props;
    let tabs = [];
    let tabContent = [];

    React.Children.forEach(children, child => {
      if (!child || child.type !== TabPane) return;

      let i = tabs.length;
      let className = cx('tab-host__tab', {
        active: i === currentIndex
      });

      tabs.push(
        <a className={className}
          onClick={this.switchTab.bind(this, i)}
          key={i}
          title={child.props.title}>
          {child.props.tab}
        </a>
      );

      tabContent.push(child);
    });

    let className = cx('tab-host', this.props.className);

    return (
      <div className={className}>
        <div className="tab-host__tabs">{tabs}</div>
        <div className="tab-host__content">{tabContent[currentIndex]}</div>
      </div>
    );
  }

  switchTab(index){
    this.setState({
      currentIndex: index
    });

    this.props.onChange(index);
  }
}

export default TabHost;
