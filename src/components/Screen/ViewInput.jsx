import React from 'react';
import pick from 'lodash/object/pick';
import bindActions from '../../utils/bindActions';
import * as ElementAction from '../../actions/ElementAction';

if (process.env.BROWSER){
  require('../../styles/Screen/ViewInput.styl');
}

function getPureNumber(str){
  return Number(str.replace(/px$/, ''));
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
      rect: null
    };
  }

  componentDidUpdate(prevProps){
    if (this.props.focusedElement !== prevProps.focusedElement){
      const {focusedElement, components, elements} = this.props;
      let rect;

      if (focusedElement){
        const element = elements.get(focusedElement);
        const component = components.get(element.get('type'));
        const node = document.getElementById('e' + element.get('id'));

        if (node && component.getIn(['attributes', 'text'])){
          rect = node.getBoundingClientRect();
        }
      }

      this.setState({rect});
    }
  }

  render(){
    const {focusedElement, components, elements} = this.props;
    const {rect} = this.state;
    if (!focusedElement || !rect) return <div/>;

    const node = document.getElementById('e' + focusedElement);
    if (!node) return <div/>;

    const styles = window.getComputedStyle(node);
    const element = elements.get(focusedElement);
    const component = components.get(element.get('type'));
    let tagName = 'input';
    let {paddingTop, paddingLeft, paddingRight, paddingBottom} = styles;

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
          'textDecoration', 'fontStyle', 'textTransform'
        ]),
        top: rect.top + getPureNumber(paddingTop),
        left: rect.left + getPureNumber(paddingLeft),
        width: rect.width - getPureNumber(paddingLeft) - getPureNumber(paddingRight),
        height: rect.height - getPureNumber(paddingTop) - getPureNumber(paddingBottom)
      },
      value: element.getIn(['attributes', 'text']),
      onChange: this.handleChange,
      onBlur: this.handleBlur,
      onKeyDown: this.handleKeyDown
    });
  }

  handleKeyDown = (e) => {
    switch (e.keyCode){
    case 27: // esc
      this.handleBlur(e);
      break;
    }
  }

  handleChange = (e) => {
    const {focusedElement, elements} = this.props;
    const {updateElement} = bindActions(ElementAction, this.context.flux);
    const element = elements.get(focusedElement);
    let value = (e.target || e.currentTarget).value;

    updateElement(focusedElement, element.setIn(['attributes', 'text'], value));
  }

  handleBlur = (e) => {
    const {focusElement} = this.props;

    focusElement(null);
  }
}

export default ViewInput;