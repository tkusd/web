import React from 'react';
import ElementItem from './ElementItem';
import {DropTarget} from 'react-dnd';
import ItemTypes from '../../constants/ItemTypes';

if (process.env.BROWSER){
  require('../../styles/Screen/ElementList.styl');
}

const spec = {
  drop(){}
};

@DropTarget(ItemTypes.ELEMENT_ITEM, spec, connect => ({
  connectDropTarget: connect.dropTarget()
}))
class ElementList extends React.Component {
  static propTypes = {
    elements: React.PropTypes.object.isRequired,
    activeElement: React.PropTypes.string,
    parent: React.PropTypes.string.isRequired,
    selectElement: React.PropTypes.func.isRequired,

    // React DnD
    connectDropTarget: React.PropTypes.func.isRequired
  }

  render(){
    const {
      elements,
      parent,
      activeElement,
      selectElement,
      connectDropTarget
    } = this.props;

    const list = elements
      .filter(item => item.get('element_id') === parent)
      .map((item, id) => (
        <ElementItem
          key={id}
          elements={elements}
          element={item}
          activeElement={activeElement}
          selectElement={selectElement}/>
      )).toArray();

    return connectDropTarget(
      <ul className="element-list">{list}</ul>
    );
  }
}

export default ElementList;
