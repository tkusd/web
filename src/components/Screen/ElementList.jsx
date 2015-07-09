import React from 'react';
import ElementItem from './ElementItem';

if (process.env.BROWSER){
  require('../../styles/Screen/ElementList.styl');
}

class ElementList extends React.Component {
  static propTypes = {
    elements: React.PropTypes.object.isRequired,
    activeElement: React.PropTypes.string,
    parent: React.PropTypes.string.isRequired,
    selectElement: React.PropTypes.func.isRequired
  }

  render(){
    const {elements, parent, activeElement, selectElement} = this.props;

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

    return (
      <ul className="element-list">{list}</ul>
    );
  }
}

export default ElementList;
