import React from 'react';
import Palette from './Palette';
import AssetChooser from '../Screen/AssetChooser';

class AssetPalette extends React.Component {
  render(){
    const {project} = this.props;

    return (
      <Palette title="Assets">
        <AssetChooser {...this.props} projectID={project.get('id')} viewMode="list"/>
      </Palette>
    );
  }
}

export default AssetPalette;
