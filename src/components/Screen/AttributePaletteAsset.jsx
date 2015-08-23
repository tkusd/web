import React from 'react';
import {InputGroup} from '../form';
import {validators} from 'react-form-input';
import bindActions from '../../utils/bindActions';
import * as AssetAction from '../../actions/AssetAction';
import pureRender from '../../decorators/pureRender';
import FontAwesome from '../common/FontAwesome';
import prettyBytes from 'pretty-bytes';

const MIME_TYPES = {
  'image/jpeg': 'JPEG image',
  'image/png': 'PNG image',
  'image/gif': 'GIF image'
};

@pureRender
class AttributePaletteAsset extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired
  }

  static propTypes = {
    assets: React.PropTypes.object.isRequired,
    selectedAsset: React.PropTypes.string.isRequired
  }

  getActiveAsset(){
    const {assets, selectedAsset} = this.props;
    return assets.get(selectedAsset);
  }

  render(){
    const asset = this.getActiveAsset();

    let attrs = {};

    if (asset.get('size')){
      attrs.Size = prettyBytes(asset.get('size'));
    }

    if (asset.get('width') && asset.get('height')){
      attrs.Dimension = `${asset.get('width')} x ${asset.get('height')}`;
    }

    if (asset.get('type')){
      attrs.Type = MIME_TYPES[asset.get('type')] || asset.get('type');
    }

    return (
      <div className="attribute-palette">
        <InputGroup
          type="text"
          label="Name"
          value={asset.get('name')}
          onChange={this.handleInputChange.bind(this, ['name'])}
          required
          validators={[
            validators.required('Name is required')
          ]}/>
        <InputGroup
          type="textarea"
          label="Description"
          value={asset.get('description')}
          onChange={this.handleInputChange.bind(this, ['description'])}/>
        <button className="attribute-palette__delete-btn" onClick={this.deleteAsset}>
          <FontAwesome icon="trash-o"/>Delete
        </button>
        <h4>Attributes</h4>
        {Object.keys(attrs).map(key => (
          <div className="input-group" key={key}>
            <label className="input-group__label">{key}</label>
            {attrs[key]}
          </div>
        ))}
      </div>
    );
  }

  handleInputChange(field, data){
    if (data.error) return;
    this.setValueInField(field, data.value);
  }

  setValueInField(field, value){
    const {updateAsset} = bindActions(AssetAction, this.context.flux);
    const asset = this.getActiveAsset();

    // New asset can't be modified
    if (asset.get('id')[0] === '_') return;

    updateAsset(asset.get('id'), asset.setIn(field, value));
  }

  deleteAsset = () => {
    const {selectAsset, deleteAsset} = bindActions(AssetAction, this.context.flux);
    const {selectedAsset} = this.props;

    if (!confirm('Are you sure?')) return;

    selectAsset(null);
    deleteAsset(selectedAsset);
  }
}

export default AttributePaletteAsset;
