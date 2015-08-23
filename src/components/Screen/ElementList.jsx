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
    selectElement: React.PropTypes.func.isRequired,

    // React DnD
    connectDropTarget: React.PropTypes.func.isRequired
  }

  getChildElements(props = this.props){
    return props.elements.filter(item => item.get('element_id') === props.parent);
  }

  render(){
    const list = this.getChildElements().map((item, id) => (
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
