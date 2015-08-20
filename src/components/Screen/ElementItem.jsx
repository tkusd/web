import React from 'react';
import ElementList from './ElementList';
import cx from 'classnames';
import * as ElementAction from '../../actions/ElementAction';
import FontAwesome from '../common/FontAwesome';
import {Dropdown, DropdownMenu, DropdownItem} from '../dropdown';
import bindActions from '../../utils/bindActions';
import {FormattedMessage} from '../intl';
import {DragSource, DropTarget} from 'react-dnd';
import ItemTypes from '../../constants/ItemTypes';

if (process.env.BROWSER){
  require('../../styles/Screen/ElementItem.styl');
}

const targetSpec = {
  canDrop(){
    return false;
  }
};

const sourceSpec = {
  beginDrag(props){
    return {};
  }
};

@DropTarget(ItemTypes.ELEMENT_ITEM, targetSpec, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource(ItemTypes.ELEMENT_ITEM, sourceSpec, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
class ElementItem extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired
  }

  static propTypes = {
    elements: React.PropTypes.object.isRequired,
    element: React.PropTypes.object.isRequired,
    activeElement: React.PropTypes.string,
    selectElement: React.PropTypes.func.isRequired,

    // React DnD
    connectDropTarget: React.PropTypes.func.isRequired,
    connectDragSource: React.PropTypes.func.isRequired,
    isDragging: React.PropTypes.bool.isRequired
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      expanded: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.toggleList = this.toggleList.bind(this);
    this.deleteElement = this.deleteElement.bind(this);
  }

  render(){
    const {
      elements,
      element,
      activeElement,
      selectElement,
      connectDragSource,
      connectDropTarget
    } = this.props;
    const {expanded} = this.state;

    const id = element.get('id');
    const children = elements.filter(item => item.get('element_id') === id);
    const hasChildren = children.count() > 0;

    let classname = cx('element-item', {
      'element-item--selected': activeElement === element.get('id'),
      'element-item--expanded': expanded
    });

    return connectDragSource(connectDropTarget(
      <li className={classname}>
        <div className="element-item__content">
          <a className="element-item__toggle" onClick={this.toggleList}>
            {hasChildren && <FontAwesome icon={expanded ? 'caret-down' : 'caret-right'}/>}
          </a>
          <a className="element-item__name" onClick={this.handleClick}>{element.get('name')}</a>
        </div>
        {expanded && (
          <ElementList
            elements={elements}
            activeElement={activeElement}
            parent={id}
            selectElement={selectElement}/>
        )}
      </li>
    ));
  }

  handleClick(e){
    e.preventDefault();

    const {element, selectElement} = this.props;

    selectElement(element.get('id'));

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

  deleteElement(e){
    e.preventDefault();

    const {element, selectElement} = this.props;
    const {deleteElement} = bindActions(ElementAction, this.context.flux);

    selectElement(null);
    deleteElement(element.get('id'));
  }
}

export default ElementItem;
