import React from 'react';
import {DropTarget} from 'react-dnd';
import {NativeTypes} from 'react-dnd/modules/backends/HTML5';
import bindActions from '../../utils/bindActions';
import * as AssetAction from '../../actions/AssetAction';
import cx from 'classnames';
import FontAwesome from '../common/FontAwesome';
import startsWith from 'lodash/string/startsWith';
import {getBlobURL} from '../../utils/getAssetBlobURL';
import {FormattedMessage} from '../intl';

if (process.env.BROWSER){
  require('../../styles/Project/AssetList.styl');
}

function noop(){}

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
class AssetList extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired
  }

  static propTypes = {
    assets: React.PropTypes.object.isRequired,
    projectID: React.PropTypes.string.isRequired,
    apiEndpoint: React.PropTypes.string.isRequired,
    viewMode: React.PropTypes.oneOf(['list', 'grid']),
    selectedAsset: React.PropTypes.string,
    onItemClick: React.PropTypes.func.isRequired,

    // React DnD
    connectDropTarget: React.PropTypes.func.isRequired,
    isOver: React.PropTypes.bool.isRequired,
    canDrop: React.PropTypes.bool.isRequired
  }

  static defaultProps = {
    viewMode: 'list',
    onItemClick: noop
  }

  render(){
    const {
      connectDropTarget,
      isOver,
      canDrop,
      assets,
      viewMode
    } = this.props;
    const isDragging = isOver && canDrop;

    return connectDropTarget(
      <div className="asset-list">
        <div className={'asset-list__' + viewMode}>
          {assets.map(this.renderListItem.bind(this)).toArray()}
        </div>
        {!assets.count() && !isDragging && (
          <div className="asset-list__overlay">
            <FormattedMessage message="project.dragAssetHint"/>
          </div>
        )}
        {isDragging && (
          <div className="asset-list__overlay--dragging">
            <FormattedMessage message="project.dropAssetHint"/>
          </div>
        )}
      </div>
    );
  }

  renderListItem(asset, key){
    const {selectedAsset} = this.props;

    let className = cx('asset-list__item', {
      'asset-list__item--active': selectedAsset === key,
      'asset-list__item--new': key[0] === '_'
    });

    return (
      <div key={key}
        className={className}
        onClick={this.handleItemClick.bind(this, key)}
        title={asset.get('name')}>
        <div className="asset-list__item-icon-wrap">
          <div className="asset-list__item-icon">
            {this.renderAssetIcon(asset)}
          </div>
        </div>
        <span className="asset-list__item-name">{asset.get('name')}</span>
      </div>
    );
  }

  renderAssetIcon(asset){
    const {apiEndpoint, viewMode} = this.props;
    const id = asset.get('id');

    if (id[0] === '_'){
      return <FontAwesome icon="circle-o-notch" spin/>;
    }

    if (viewMode === 'grid' && startsWith(asset.get('type'), 'image/')){
      return <img src={getBlobURL(apiEndpoint, id)}/>;
    }

    return <FontAwesome icon="file"/>;
  }

  handleItemClick(id){
    this.props.onItemClick(id);
  }
}

export default AssetList;
