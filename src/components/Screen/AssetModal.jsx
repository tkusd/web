import React from 'react';
import {Modal} from '../modal';
import {TabHost, TabPane} from '../tab';
import AssetChooser from './AssetChooser';
import {FormattedMessage} from '../intl';
import connectToStores from '../../decorators/connectToStores';
import {InputGroup} from '../form';
import {extractAssetID} from '../../utils/getAssetBlobURL';

if (process.env.BROWSER){
  require('../../styles/Screen/AssetModal.styl');
}

const ASSET_PREFIX = 'asset:';

function noop(){}

@connectToStores(['AssetStore', 'AppStore'], (stores, props) => ({
  assets: stores.AssetStore.getAssetsOfProject(props.projectID),
  apiEndpoint: stores.AppStore.getAPIEndpoint()
}))
class AssetModal extends React.Component {
  static propTypes = {
    projectID: React.PropTypes.string.isRequired,
    url: React.PropTypes.string.isRequired,
    onSubmit: React.PropTypes.func.isRequired
  }

  static defaultProps = {
    onSubmit: noop
  }

  render(){
    const {closeModal} = this.props;

    return (
      <Modal title="Choose asset" onDismiss={closeModal} large>
        <TabHost className="asset-modal__tabs">
          {this.renderUploadTab()}
          {this.renderURLTab()}
        </TabHost>
        <div className="modal__btn-group">
          <button className="modal__btn" onClick={closeModal}>
            <FormattedMessage message="common.cancel"/>
          </button>
          <button className="modal__btn--primary" onClick={this.handleSubmit}>
            <FormattedMessage message='common.update'/>
          </button>
        </div>
      </Modal>
    );
  }

  renderUploadTab(){
    const {assets, apiEndpoint} = this.state;

    return (
      <TabPane tab="Assets">
        <div className="asset-modal__asset-list">
          <AssetChooser {...this.props}
            assets={assets}
            apiEndpoint={apiEndpoint}
            ref="chooser"
            viewMode="grid"/>
        </div>
      </TabPane>
    );
  }

  renderURLTab(){
    const {url} = this.props;

    return (
      <TabPane tab="URL">
        <InputGroup
          label="URL"
          value={extractAssetID(url) ? '' : url}
          ref="input"/>
      </TabPane>
    );
  }

  handleSubmit = () => {
    const {chooser, input} = this.refs;
    const {onSubmit, closeModal} = this.props;

    if (chooser){
      onSubmit(ASSET_PREFIX + chooser.decoratedComponentInstance.getSelectedAsset());
    } else if (input){
      onSubmit(input.getValue());
    }

    closeModal();
  }
}

export default AssetModal;
