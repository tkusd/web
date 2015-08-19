import React from 'react';
import cx from 'classnames';
import assign from 'lodash/object/assign';
import omit from 'lodash/object/omit';

if (process.env.BROWSER){
  require('../../styles/dropdown/Dropdown.styl');
}

class Dropdown extends React.Component {
  constructor(props, context){
    super(props, context);

    this.state = {
      active: false
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
      'dropdown--active': this.isActive()
    }, props.className);

    return <div ref="dropdown" {...props}>{this.props.children}</div>;
  }

  handleClick(e){
    e.preventDefault();
    this.toggle();
  }

  isActive(){
    return this.state.active;
  }

  open(){
    if (this.isActive()) return;
    this.setState({active: true});
  }

  close(){
    if (!this.isActive()) return;
    this.setState({active: false});
  }

  toggle(){
    if (this.isActive()){
      this.close();
    } else {
      this.open();
    }
  }

  handleDocumentClick(e){
    if (!this.isActive()) return;

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
    if (e.keyCode === 27 && this.isActive()){
      this.close();
    }
  }
}

export default Dropdown;
