import React from 'react';
import ElementList from './ElementList';
import cx from 'classnames';
import {selectElement, deleteElement} from '../../actions/ElementAction';
import FontAwesome from '../common/FontAwesome';
import {Dropdown, DropdownMenu, DropdownItem} from '../dropdown';
import Translation from '../i18n/Translation';

if (process.env.BROWSER){
  require('../../styles/Screen/ElementItem.styl');
}

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

    this.state = {
      expanded: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.toggleList = this.toggleList.bind(this);
    this.renameElement = this.renameElement.bind(this);
    this.deleteElement = this.deleteElement.bind(this);
  }

  render(){
    const {elements, element, selectedElement} = this.props;
    const {expanded} = this.state;

    const id = element.get('id');
    const children = elements.filter(item => item.get('element_id') === id);
    const hasChildren = children.count() > 0;

    let classname = cx('element-item', {
      'element-item--selected': selectedElement === element.get('id'),
      'element-item--expanded': expanded
    });

    return (
      <li className={classname}>
        <div className="element-item__content">
          <a className="element-item__toggle" onClick={this.toggleList}>
            {hasChildren && <FontAwesome icon={expanded ? 'caret-down' : 'caret-right'}/>}
          </a>
          <a className="element-item__name" onClick={this.handleClick}>{element.get('name')}</a>
          <Dropdown className="element-item__dropdown">
            <button className="element-item__more-btn">
              <FontAwesome icon="ellipsis-v"/>
            </button>
            <DropdownMenu position="fixed">
              <DropdownItem>
                <a onClick={this.renameElement}>
                  <Translation id="common.rename"/>
                </a>
              </DropdownItem>
              <DropdownItem>
                <a onClick={this.deleteElement}>
                  <Translation id="common.delete"/>
                </a>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        {expanded && <ElementList elements={elements} selectedElement={selectedElement} parent={id}/>}
      </li>
    );
  }

  handleClick(e){
    e.preventDefault();

    const {element} = this.props;

    this.context.executeAction(selectElement, element.get('id'));

    if (!this.state.expanded){
      this.expandList();
    }
  }

  expandList(){
    this.setState({
      expanded: true
    });
  }

  collapseList(){
    this.setState({
      expanded: false
    });
  }

  toggleList(){
    if (this.state.expanded){
      this.collapseList();
    } else {
      this.expandList();
    }
  }

  renameElement(e){
    e.preventDefault();
  }

  deleteElement(e){
    e.preventDefault();

    const {element} = this.props;

    this.context.executeAction(selectElement, null);
    this.context.executeAction(deleteElement, element.get('id'));
  }
}

export default ElementItem;
