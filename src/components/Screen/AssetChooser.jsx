import React from 'react';
import {DropTarget} from 'react-dnd';
import {NativeTypes} from 'react-dnd/modules/backends/HTML5';
import bindActions from '../../utils/bindActions';
import * as AssetAction from '../../actions/AssetAction';
import cx from 'classnames';
import FontAwesome from '../common/FontAwesome';
import startsWith from 'lodash/string/startsWith';

if (process.env.BROWSER){
  require('../../styles/Screen/AssetChooser.styl');
}

const ACCEPT_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

const spec = {
  drop(props, monitor, {context}){
    const {projectID} = props;
    const {files} = monitor.getItem();
    const {createAsset} = bindActions(AssetAction, context.flux);

    files.filter(file => ~ACCEPT_TYPES.indexOf(file.type))
      .forEach(file => {
        createAsset({
          name: file.name,
          data: file,
          type: file.type,
          size: file.size,
          project_id: projectID
        });
      });
  }
};

@DropTarget(NativeTypes.FILE, spec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
class AssetChooser extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired
  }

  static propTypes = {
    assets: React.PropTypes.object.isRequired,
    projectID: React.PropTypes.string.isRequired,
    apiEndpoint: React.PropTypes.string.isRequired,

    // React DnD
    connectDropTarget: React.PropTypes.func.isRequired,
    isOver: React.PropTypes.bool.isRequired,
    canDrop: React.PropTypes.bool.isRequired
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      selectedAsset: null
    };
  }

  render(){
    const {
      connectDropTarget,
      isOver,
      canDrop,
      assets
    } = this.props;
    const isDragging = isOver && canDrop;

    return connectDropTarget(
      <div className="asset-chooser">
        <div className="asset-chooser__list">
          {assets.map(this.renderListItem.bind(this)).toArray()}
        </div>
        {!assets.count() && !isDragging && <div className="asset-chooser__overlay">Drag to upload files...</div>}
        {isDragging && <div className="asset-chooser__overlay--dragging">Drop to upload files...</div>}
      </div>
    );
  }

  renderListItem(asset, key){
    const {selectedAsset} = this.state;

    let className = cx('asset-chooser__item', {
      'asset-chooser__item--active': selectedAsset === key,
      'asset-chooser__item--new': key[0] === '_'
    });

    return (
      <div key={key}
        className={className}
        onClick={this.selectAsset.bind(this, key)}>
        <div className="asset-chooser__item-icon-wrap">
          <div className="asset-chooser__item-icon">
            {this.renderAssetIcon(asset)}
          </div>
        </div>
        <strong className="asset-chooser__item-name">{asset.get('name')}</strong>
      </div>
    );
  }

  renderAssetIcon(asset){
    const {apiEndpoint} = this.props;

    if (asset.get('id')[0] === '_'){
      return <FontAwesome icon="circle-o-notch" spin/>;
    }

    if (startsWith(asset.get('type'), 'image/')){
      return <img src={`${apiEndpoint}assets/${asset.get('id')}/blob`}/>;
    }

    return <FontAwesome icon="file"/>;
  }

  getSelectedAsset(){
    return this.state.selectedAsset;
  }

  selectAsset(id){
    if (id[0] === '_') return;

    this.setState({
      selectedAsset: id
    });
  }
}

export default AssetChooser;
