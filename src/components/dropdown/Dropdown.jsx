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

  render(){
    let props = assign({
      className: '',
      onClick: this.handleClick
    }, omit(this.props, 'children'));

    props.className = cx(props.className, 'dropdown');

    if (this.state.opened){
      props.className = cx(props.className, 'dropdown--open');
    }

    return <div ref="dropdown" {...props}>{this.props.children}</div>;
  }

  handleClick(e){
    e.preventDefault();
    this.toggle();
  }

  open(){
    this.setState({opened: true});

    if (process.env.BROWSER){
      document.addEventListener('click', this.handleDocumentClick);
      document.addEventListener('keydown', this.handleDocumentKeydown);
    }
  }

  close(){
    this.setState({opened: false});

    if (process.env.BROWSER){
      document.removeEventListener('click', this.handleDocumentClick);
      document.removeEventListener('keydown', this.handleDocumentKeydown);
    }
  }

  toggle(){
    if (this.state.opened){
      this.close();
    } else {
      this.open();
    }
  }

  handleDocumentClick(e){
    e.preventDefault();
    e.stopPropagation();
    this.close();
  }

  handleDocumentKeydown(e){
    if (e.keyCode === 27){
      this.close();
    }
  }
}

export default Dropdown;
