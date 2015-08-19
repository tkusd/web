import React from 'react';
import Palette from './Palette';
import ComponentItem from './ComponentItem';
import {FormattedMessage} from '../intl';
import pureRender from '../../decorators/pureRender';

@pureRender
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
      <Palette title={<FormattedMessage message="project.components"/>}>
        {list}
      </Palette>
    );
  }
}

export default ComponentPalette;
