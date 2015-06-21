import React from 'react';
import ElementList from './ElementList';
import cx from 'classnames';
import {selectElement} from '../../actions/ElementAction';

class ElementItem extends React.Component {
  static contextTypes = {
    executeAction: React.PropTypes.func.isRequired
  }

  static propTypes = {
    elements: React.PropTypes.object.isRequired,
    element: React.PropTypes.object.isRequired,
    selectedElement: React.PropTypes.string
  }

  constructor(props, context){
    super(props, context);

    this.handleClick = this.handleClick.bind(this);
  }

  render(){
    const {elements, element, selectedElement} = this.props;

    let classname = cx('element-item', {
      'element-item--selected': selectedElement === element.get('id')
    });

    return (
      <li className={classname}>
        <a className="element-item__name" onClick={this.handleClick}>{`${element.get('name')} (${element.get('type')})`}</a>
        <ElementList elements={elements} selectedElement={selectedElement} parent={element.get('id')}/>
      </li>
    );
  }

  handleClick(e){
    e.preventDefault();

    const {element} = this.props;

    this.context.executeAction(selectElement, element.get('id'));
  }
}

export default ElementItem;
