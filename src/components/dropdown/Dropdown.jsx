import React from 'react';
import cx from 'classnames';
import {assign, omit} from 'lodash';

if (process.env.BROWSER){
  require('../../styles/dropdown/Dropdown.styl');
}

class Dropdown extends React.Component {
  constructor(props, context){
    super(props, context);

    this.state = {
      opened: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleDocumentKeydown = this.handleDocumentKeydown.bind(this);
  }

  componentDidMount(){
    document.addEventListener('click', this.handleDocumentClick);
    document.addEventListener('keydown', this.handleDocumentKeydown);
  }

  componentWillUnmount(){
    document.removeEventListener('click', this.handleDocumentClick);
    document.removeEventListener('keydown', this.handleDocumentKeydown);
  }

  render(){
    let props = assign({
      className: '',
      onClick: this.handleClick
    }, omit(this.props, 'children'));

    props.className = cx('dropdown', {
      'dropdown--active': this.state.opened
    }, props.className);

    return <div ref="dropdown" {...props}>{this.props.children}</div>;
  }

  handleClick(e){
    e.preventDefault();
    this.toggle();
  }

  open(){
    this.setState({opened: true});
  }

  close(){
    this.setState({opened: false});
  }

  toggle(){
    if (this.state.opened){
      this.close();
    } else {
      this.open();
    }
  }

  handleDocumentClick(e){
    if (!this.state.opened) return;

    const dropdown = this.refs.dropdown;
    let element = e.target;

    if (element === dropdown) return;

    while (element){
      if (element === dropdown) return;
      element = element.parentNode;
    }

    e.preventDefault();
    e.stopPropagation();
    this.close();
  }

  handleDocumentKeydown(e){
    if (!this.state.opened) return;

    if (e.keyCode === 27){
      this.close();
    }
  }
}

export default Dropdown;
