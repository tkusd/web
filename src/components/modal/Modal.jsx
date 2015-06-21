import React from 'react';
import pureRender from '../../utils/pureRender';
import FontAwesome from '../common/FontAwesome';

if (process.env.BROWSER){
  require('../../styles/modal/Modal.styl');
}

@pureRender
class Modal extends React.Component {
  static propTypes = {
    title: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element
    ]),
    onDismiss: React.PropTypes.func
  }

  constructor(props, context){
    super(props, context);

    this.handleCloseBtnClick = this.handleCloseBtnClick.bind(this);
  }

  render(){
    return (
      <div className="modal">
        <div className="modal__back" onClick={this.handleCloseBtnClick}></div>
        <div className="modal__container">
          <div className="modal__dialog">
            <header className="modal__header">
              <h3 className="modal__title">{this.props.title}</h3>
              <button className="modal__btn-close" onClick={this.handleCloseBtnClick}>
                <FontAwesome icon="times"/>
              </button>
            </header>
            <div className="modal__content">{this.props.children}</div>
          </div>
        </div>
      </div>
    );
  }

  handleCloseBtnClick(e){
    e.preventDefault();

    if (typeof this.props.onDismiss === 'function'){
      this.props.onDismiss();
    }
  }
}

export default Modal;
