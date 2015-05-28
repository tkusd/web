import React from 'react';
import cx from 'classnames';
import {assign} from 'lodash';

if (process.env.BROWSER){
  require('../../styles/dropdown/Dropdown.styl');
}

class Dropdown extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    mode: React.PropTypes.oneOf(['hover', 'click'])
  }

  static defaultProps = {
    className: '',
    mode: 'click'
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      isOpen: false
    };
  }

  render(){
    let {className} = this.props;
    if (className) className += ' ';
    className += cx('dropdown', {
      'dropdown--open': this.state.isOpen,
      'dropdown--hover': this.props.mode === 'hover'
    });

    let props = assign({}, this.props, {className});

    return React.DOM.div(props, this.props.children);
  }

  open(){
    this.setState({
      isOpen: true
    });
  }

  close(){
    this.setState({
      isOpen: false
    });
  }

  toggle(){
    if (this.state.isOpen){
      this.close();
    } else {
      this.open();
    }
  }
}

export default Dropdown;
