import React from 'react';
import FontAwesome from '../common/FontAwesome';
import cx from 'classnames';

if (process.env.BROWSER){
  require('../../styles/modal/Modal.styl');
}

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

    this.state = {
      active: false
    };

    this.dismiss = this.dismiss.bind(this);
  }

  componentDidMount(){
    setTimeout(() => {
      this.setState({
        active: true
      });
    }, 0);
  }

  render(){
    let className = cx('modal', {
      'modal--active': this.state.active
    });

    return (
      <div className={className}>
        <div className="modal__back" onClick={this.dismiss}></div>
        <div className="modal__container">
          <div className="modal__dialog">
            <header className="modal__header">
              <h3 className="modal__title">{this.props.title}</h3>
              <button className="modal__btn-close" onClick={this.dismiss}>
                <FontAwesome icon="times"/>
              </button>
            </header>
            <div className="modal__content">{this.props.children}</div>
          </div>
        </div>
      </div>
    );
  }

  dismiss(e){
    e.preventDefault();

    if (typeof this.props.onDismiss === 'function'){
      this.props.onDismiss();
    }
  }
}

export default Modal;
