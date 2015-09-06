import React from 'react';
import pick from 'lodash/object/pick';
import bindActions from '../../utils/bindActions';
import * as ElementAction from '../../actions/ElementAction';

if (process.env.BROWSER){
  require('../../styles/Screen/ViewInput.styl');
}

class ViewInput extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired
  }

  static propTypes = {
    components: React.PropTypes.object.isRequired,
    elements: React.PropTypes.object.isRequired,
    focusElement: React.PropTypes.func.isRequired,
    focusedElement: React.PropTypes.string
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      value: null,
      rect: null
    };
  }

  componentDidUpdate(prevProps){
    if (this.props.focusedElement !== prevProps.focusedElement){
      const {focusedElement, components, elements} = this.props;
      let rect, value;

      if (focusedElement){
        const element = elements.get(focusedElement);
        const component = components.get(element.get('type'));
        const node = document.getElementById('e' + element.get('id'));

        if (node && component.getIn(['attributes', 'text'])){
          rect = node.getBoundingClientRect();
          value = element.getIn(['attributes', 'text']);
        }
      }

      this.setState({rect, value});
    }
  }

  render(){
    const {focusedElement, components, elements} = this.props;
    const {rect, value} = this.state;
    if (!focusedElement || !rect) return <div/>;

    const node = document.getElementById('e' + focusedElement);
    const styles = window.getComputedStyle(node);
    const element = elements.get(focusedElement);
    const component = components.get(element.get('type'));
    let tagName = 'input';

    if (component.getIn(['attributes', 'text', 'type']) === 'textarea'){
      tagName = 'textarea';
    }

    return React.createElement(tagName, {
      className: 'view-input',
      autoFocus: true,
      style: {
        ...pick(styles, [
          'fontSize', 'fontFamily', 'lineHeight', 'color', 'letterSpacing',
          'color', 'textAlign', 'textIndent', 'textShadow', 'fontWeight',
          'paddingTop', 'paddingLeft', 'paddingRight', 'paddingBottom',
          'textDecoration', 'fontStyle'
        ]),
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      },
      value,
      onChange: this.handleChange,
      onBlur: this.handleBlur,
      onKeyDown: this.handleKeyDown
    });
  }

  handleKeyDown = (e) => {
    switch (e.keyCode){
    case 27: // esc
      this.props.focusElement(null);
      break;
    }
  }

  handleChange = (e) => {
    this.setState({
      value: (e.target || e.currentTarget).value
    });
  }

  handleBlur = (e) => {
    const {focusedElement, focusElement, elements} = this.props;
    const {value} = this.state;
    const {updateElement} = bindActions(ElementAction, this.context.flux);
    const element = elements.get(focusedElement);

    focusElement(null);

    if (element.getIn(['attributes', 'text']) === value) return;

    updateElement(focusedElement, element.setIn(['attributes', 'text'], value));
  }
}

export default ViewInput;