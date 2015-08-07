import React from 'react';
import Palette from '../Project/Palette';
import {FormattedMessage} from '../intl';

if (process.env.BROWSER){
  require('../../styles/Screen/AttributePalette.styl');
}

class AttributePalette extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired
  }

  static propTypes = {
    components: React.PropTypes.object.isRequired,
    elements: React.PropTypes.object.isRequired,
    activeElement: React.PropTypes.string
  }

  render(){
    return (
      <Palette title={<FormattedMessage message="project.attributes"/>}>

      </Palette>
    );
  }
}

export default AttributePalette;
