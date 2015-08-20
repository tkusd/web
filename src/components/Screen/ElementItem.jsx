import React from 'react';
import ElementList from './ElementList';
import cx from 'classnames';
import FontAwesome from '../common/FontAwesome';
import {DropTarget} from 'react-dnd';
import ItemTypes from '../../constants/ItemTypes';

if (process.env.BROWSER){
  require('../../styles/Screen/ElementItem.styl');
}

function getDropTargetType(props){
  const {element, components} = props;
  const component = components.get(element.get('type'));

  if (component && component.get('container')){
    return ItemTypes.CONTAINER;
  } else {
    return ItemTypes.NON_CONTAINER;
  }
}

const spec = {
  drop(props, monitor, {context}){
    if (monitor.didDrop()) return;
    return props.element.toJS();
  }
};

@DropTarget(getDropTargetType, spec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver({
    shallow: true
  }),
  canDrop: monitor.canDrop()
}))
class ElementItem extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired
  }

  static propTypes = {
    components: React.PropTypes.object.isRequired,
    elements: React.PropTypes.object.isRequired,
    element: React.PropTypes.object.isRequired,
    activeElement: React.PropTypes.string,
    selectElement: React.PropTypes.func.isRequired,

    // React DnD
    connectDropTarget: React.PropTypes.func.isRequired,
    isOver: React.PropTypes.bool.isRequired,
    canDrop: React.PropTypes.bool.isRequired
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      expanded: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.toggleList = this.toggleList.bind(this);
  }

  render(){
    const {
      elements,
      element,
      activeElement,
      connectDropTarget,
      isOver,
      canDrop
    } = this.props;
    const {expanded} = this.state;

    const id = element.get('id');
    const children = elements.filter(item => item.get('element_id') === id);
    const hasChildren = children.count() > 0;

    let classname = cx('element-item', {
      'element-item--selected': activeElement === element.get('id'),
      'element-item--expanded': expanded,
      'element-item--over': isOver && canDrop
    });

    return connectDropTarget(
      <li className={classname}>
        <div className="element-item__content">
          <a className="element-item__toggle" onClick={this.toggleList}>
            {hasChildren && <FontAwesome icon={expanded ? 'caret-down' : 'caret-right'}/>}
          </a>
          <a className="element-item__name" onClick={this.handleClick}>{element.get('name')}</a>
        </div>
        {expanded && <ElementList {...this.props} parent={id}/>}
      </li>
    );
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
}

export default ElementItem;
