import React from 'react';
import {validators} from 'react-form-input';
import bindActions from '../../utils/bindActions';
import * as AssetAction from '../../actions/AssetAction';
import pureRender from '../../decorators/pureRender';
import FontAwesome from '../common/FontAwesome';
import prettyBytes from 'pretty-bytes';
import {FormattedMessage} from '../intl';
import AttributeField from './AttributeField';
import Palette from '../Project/Palette';

const MIME_TYPES = {
  'image/jpeg': 'mime.jpeg',
  'image/png': 'mime.png',
  'image/gif': 'mime.gif'
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

    let attrs = [];

    if (asset.get('size')){
      attrs.push([
        <FormattedMessage message="project.size"/>,
        prettyBytes(asset.get('size'))
      ]);
    }

    if (asset.get('width') && asset.get('height')){
      attrs.push([
        <FormattedMessage message="project.dimension"/>,
        `${asset.get('width')} x ${asset.get('height')}`
      ]);
    }

    if (asset.get('type')){
      let type = asset.get('type');

      attrs.push([
        <FormattedMessage message="project.type"/>,
        MIME_TYPES.hasOwnProperty(type)
          ? <FormattedMessage message={MIME_TYPES[type]}/>
          : type
      ]);
    }

    return (
      <Palette title={<FormattedMessage message="project.attributes"/>}>
        <div className="attribute-palette">
          <AttributeField
            type="text"
            label={<FormattedMessage message="common.name"/>}
            value={asset.get('name')}
            onChange={this.setValueInField.bind(this, ['name'])}
            required
            validators={[
              validators.required('Name is required')
            ]}/>
          <AttributeField
            type="textarea"
            label={<FormattedMessage message="project.description"/>}
            value={asset.get('description')}
            onChange={this.setValueInField.bind(this, ['description'])}/>
          <button className="attribute-palette__delete-btn" onClick={this.deleteAsset}>
            <FontAwesome icon="trash-o"/>
            <FormattedMessage message="common.delete"/>
          </button>
          {attrs.map(([key, value], i) => (
            <div className="input-group" key={i}>
              <label className="input-group__label">{key}</label>
              {value}
            </div>
          ))}
        </div>
      </Palette>
    );
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
