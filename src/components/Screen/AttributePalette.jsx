import React from 'react';
import pureRender from '../../decorators/pureRender';
import AttributePaletteElement from './AttributePaletteElement';
import AttributePaletteAsset from './AttributePaletteAsset';

if (process.env.BROWSER){
  require('../../styles/Screen/AttributePalette.styl');
}

@pureRender
class AttributePalette extends React.Component {
  static propTypes = {
    selectedAsset: React.PropTypes.string
  }

  render(){
    const {selectedAsset} = this.props;

    if (selectedAsset){
      return <AttributePaletteAsset {...this.props}/>;
    }

    return (
      <AttributePaletteElement {...this.props}/>
    );
  }
}

export default AttributePalette;
