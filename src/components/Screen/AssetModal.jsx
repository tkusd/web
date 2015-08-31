import React from 'react';
import {Modal} from '../modal';
import {TabHost, TabPane} from '../tab';
import AssetList from '../Project/AssetList';
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

  constructor(props, context){
    super(props, context);

    this.state = {
      selectedAsset: null
    };
  }

  render(){
    const {closeModal} = this.props;

    return (
      <Modal title={<FormattedMessage message="project.chooseAsset"/>}
        onDismiss={closeModal} large>
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
    const {assets, apiEndpoint, selectedAsset} = this.state;

    return (
      <TabPane tab={<FormattedMessage message="project.assets"/>}>
        <div className="asset-modal__asset-list">
          <AssetList {...this.props}
            selectedAsset={selectedAsset}
            assets={assets}
            apiEndpoint={apiEndpoint}
            viewMode="grid"
            onItemClick={this.selectAsset}/>
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

  selectAsset = (id) => {
    this.setState({
      selectedAsset: id
    });
  }

  handleSubmit = () => {
    const {input} = this.refs;
    const {onSubmit, closeModal} = this.props;
    const {selectedAsset} = this.state;

    if (input){
      onSubmit(input.getValue());
    } else if (selectedAsset) {
      onSubmit(ASSET_PREFIX + selectedAsset);
    }

    closeModal();
  }
}

export default AssetModal;
