import React from 'react';
import {selectElement} from '../../actions/ElementAction';
import ElementList from './ElementList';
import cx from 'classnames';

if (process.env.BROWSER){
  require('../../styles/Project/Element.styl');
}

class Element extends React.Component {
  static contextTypes = {
    executeAction: React.PropTypes.func.isRequired
  }

  static propTypes = {
    element: React.PropTypes.object.isRequired,
    selectedElement: React.PropTypes.string
  }

  constructor(props, context){
    super(props, context);

    this.handleClick = this.handleClick.bind(this);
  }

  render(){
    const {element, selectedElement} = this.props;

    let classname = cx('element', {
      'element--selected': selectedElement === element.get('id')
    });

    return (
      <li className={classname}>
        <a className="element__name" onClick={this.handleClick}>{`${element.get('name')} (${element.get('type')})`}</a>
        {element.has('elements') && <ElementList elements={element.get('elements')} selectedElement={selectedElement}/>}
      </li>
    );
  }

  handleClick(e){
    e.preventDefault();

    const {element} = this.props;

    this.context.executeAction(selectElement, element.get('id'));
  }
}

export default Element;
