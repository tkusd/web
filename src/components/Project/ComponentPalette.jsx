import React from 'react';
import Palette from './Palette';
import connectToStores from '../../utils/connectToStores';
import ComponentStore from '../../stores/ComponentStore';
import Component from './Component';

@connectToStores([ComponentStore], (stores, props) => ({
  components: stores.ComponentStore.getData()
}))
class ComponentPalette extends React.Component {
  render(){
    const {components} = this.state;

    return (
      <Palette title="Components">
        {components.map((item, i) => (
          <Component component={item} key={i}/>
        )).toArray()}
      </Palette>
    );
  }
}

export default ComponentPalette;
