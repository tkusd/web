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
      active: false,
      id: modalID++
    };

    this.handleTriggerClick = this.handleTriggerClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount(){
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount(){
    document.removeEventListener('keydown', this.handleKeyDown);
    this.close();
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

  open(){
    if (this.state.active) return;

    const {openModal} = bindActions(ModalAction, this.context.flux);

    this.setState({
      active: true
    });

    let modal = cloneWithProps(this.props.children, {
      closeModal: this.close.bind(this)
    });

    openModal(this.state.id, modal);
  }

  close(){
    if (!this.state.active) return;

    const {closeModal} = bindActions(ModalAction, this.context.flux);

    this.setState({
      active: false
    });

    closeModal(this.state.id);
  }

  toggle(){
    if (this.state.active){
      this.close();
    } else {
      this.open();
    }
  }

  handleKeyDown(e){
    if (e.keyCode === 27 && this.state.active){
      this.close();
    }
  }

  handleTriggerClick(e){
    e.preventDefault();
    this.toggle();
  }
}

export default ModalPortal;
