import React from 'react';
import Palette from './Palette';
import AssetList from './AssetList';
import * as AssetAction from '../../actions/AssetAction';
import bindActions from '../../utils/bindActions';
import {FormattedMessage} from '../intl';

class AssetPalette extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired
  }

  componentWillUnmount(){
    const {selectAsset} = bindActions(AssetAction, this.context.flux);
    selectAsset(null);
  }

  render(){
    const {project} = this.props;

    return (
      <Palette title={<FormattedMessage message="project.assets"/>}>
        <AssetList {...this.props}
          projectID={project.get('id')}
          viewMode="list"
          onItemClick={this.selectAsset}/>
      </Palette>
    );
  }

  selectAsset = (id) => {
    const {selectAsset} = bindActions(AssetAction, this.context.flux);
    selectAsset(id);
  }
}

export default AssetPalette;
