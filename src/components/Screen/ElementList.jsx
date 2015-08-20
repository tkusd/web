import React from 'react';
import ElementItem from './ElementItem';
import pureRender from '../../decorators/pureRender';

if (process.env.BROWSER){
  require('../../styles/Screen/ElementList.styl');
}

@pureRender
class ElementList extends React.Component {
  static propTypes = {
    elements: React.PropTypes.object.isRequired,
    activeElement: React.PropTypes.string,
    parent: React.PropTypes.string.isRequired,
    selectElement: React.PropTypes.func.isRequired
  }

  render(){
    const {elements, parent} = this.props;

    const list = elements
      .filter(item => item.get('element_id') === parent)
      .map((item, id) => (
        <ElementItem {...this.props}
          key={id}
          element={item}/>
      )).toArray();

    return (
      <ul className="element-list">{list}</ul>
    );
  }
}

export default ElementList;
