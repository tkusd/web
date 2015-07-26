import React from 'react';
import ElementTypes from '../../constants/ElementTypes';

function noop(){}

class Canvas extends React.Component {
  static propTypes = {
    element: React.PropTypes.object.isRequired,
    onClick: React.PropTypes.func.isRequired
  }

  static defaultProps = {
    onClick: noop
  }

  render(){
    const {element, children} = this.props;

    let props = {
      style: element.get('styles').toObject(),
      className: 'canvas__' + element.get('type'),
      onClick: this.props.onClick
    };

    switch (element.get('type')){
      case ElementTypes.screen:
        return <div {...props}>{children}</div>;

      case ElementTypes.text:
        return <div {...props}>{element.getIn(['attributes', 'text'])}</div>;

      case ElementTypes.layout:
        return <div {...props}>{children}</div>;

      case ElementTypes.button:
        return <button {...props}>{children}</button>;

      case ElementTypes.input:
        return <input {...props}/>;

      case ElementTypes.link:
        return <a {...props}>{children}</a>;

      case ElementTypes.image:
        return <img {...props}/>;

      case ElementTypes.list:
        return <ul {...props}/>;
    }
  }
}

export default Canvas;
