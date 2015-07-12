import React from 'react';
import Palette from './Palette';
import ComponentItem from './ComponentItem';
import Translation from '../i18n/Translation';

class ComponentPalette extends React.Component {
  static propTypes = {
    components: React.PropTypes.object.isRequired
  }

  render(){
    const {components} = this.props;

    let list = components
      .filter(item => !item.get('hidden'))
      .map((item, i) => (
        <ComponentItem {...this.props} component={item} key={i}/>
      )).toArray();

    return (
      <Palette title={<Translation id="project.components"/>}>
        {list}
      </Palette>
    );
  }
}

export default ComponentPalette;
