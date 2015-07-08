import React from 'react';
import cloneWithProps from 'react/lib/cloneWithProps';
import * as ModalAction from '../../actions/ModalAction';
import bindActions from '../../utils/bindActions';

let modalID = 0;

class ModalPortal extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired
  }

  static propTypes = {
    trigger: React.PropTypes.element
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      id: -1
    };

    this.handleTriggerClick = this.handleTriggerClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount(){
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount(){
    document.removeEventListener('keydown', this.handleKeyDown);
    if (this.isActive()) this.close();
  }

  render(){
    if (this.props.trigger){
      return cloneWithProps(this.props.trigger, {
        onClick: this.handleTriggerClick
      });
    } else {
      return <div></div>;
    }
  }

  isActive(){
    return this.state.id > -1;
  }

  open(){
    if (this.isActive()) return;

    const id = modalID++;
    const {openModal} = bindActions(ModalAction, this.context.flux);

    this.setState({id});

    let modal = cloneWithProps(this.props.children, {
      closeModal: this.close.bind(this)
    });

    openModal(id, modal);
  }

  close(){
    if (!this.isActive()) return;

    const {closeModal} = bindActions(ModalAction, this.context.flux);

    this.setState({
      id: -1
    });

    closeModal(this.state.id);
  }

  toggle(){
    if (this.isActive()){
      this.close();
    } else {
      this.open();
    }
  }

  handleKeyDown(e){
    if (e.keyCode === 27 && this.isActive()){
      this.close();
    }
  }

  handleTriggerClick(e){
    e.preventDefault();
    this.toggle();
  }
}

export default ModalPortal;
