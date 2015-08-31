import React from 'react';
import {SizeInput, ColorPicker, ButtonGroup, Checkbox} from '../form';
import FontAwesome from '../common/FontAwesome';
import {TabHost, TabPane} from '../tab';
import capitalize from 'lodash/string/capitalize';

if (process.env.BROWSER){
  require('../../styles/Screen/StylePalette.styl');
}

class StylePalette extends React.Component {
  static propTypes = {
    element: React.PropTypes.object.isRequired,
    setValueInField: React.PropTypes.func.isRequired
  }

  render(){
    return (
      <div>
        <h4>Font</h4>
        {this.renderFontSection()}
        <h4>Spacing</h4>
        {this.renderSpacingSection()}
        <h4>Text shadow</h4>
        {this.renderTextShadowSection()}
        <h4>Fills</h4>
        {this.renderFillSection()}
        <h4>Borders</h4>
        {this.renderBorderSection()}
        <h4>Shadow</h4>
        {this.renderShadowSection()}
      </div>
    );
  }

  renderFontSection(){
    const {element} = this.props;

    const textAlignOptions = [
      {value: 'left'},
      {value: 'center'},
      {value: 'right'},
      {value: 'justify'}
    ];

    const textTransformOptions = [
      {value: '', label: '—'},
      {value: 'capitalize', label: 'Abc'},
      {value: 'uppercase', label: 'ABC'},
      {value: 'lowercase', label: 'abc'}
    ];

    const textDecorationOptions = [
      {value: ''},
      {value: 'underline'},
      {value: 'line-through'},
      {value: 'overline'}
    ];

    return (
      <div className="style-palette__section">
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">Size</span>
          <SizeInput className="style-palette__input-field--border"
            value={element.getIn(['styles', 'fontSize'])}
            min={0}
            acceptZero={false}
            onChange={this.setValueInField.bind(this, ['styles', 'fontSize'])}/>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">Color</span>
          <div className="style-palette__input-field">
            <ColorPicker className="style-palette__color-picker"
              value={element.getIn(['styles', 'color'])}
              onChange={this.setValueInField.bind(this, ['styles', 'color'])}/>
          </div>
        </div>
        <div className="style-palette__input-group">
          <span className="style-palette__input-label">Weight</span>
          <select className="style-palette__input-field"
            value={element.getIn(['styles', 'fontWeight'], '')}
            onChange={this.handleSelectChange.bind(this, ['styles', 'fontWeight'])}>
            <option value=""></option>
            <option value="300">Light</option>
            <option value="400">Normal</option>
            <option value="700">Bold</option>
          </select>
        </div>
        <div className="style-palette__input-group">
          <span className="style-palette__input-label">Align</span>
          <ButtonGroup className="style-palette__btn-group"
            value={element.getIn(['styles', 'textAlign'], '')}
            options={textAlignOptions}
            renderer={this.renderTextAlignOption}
            onChange={this.setValueInField.bind(this, ['styles', 'textAlign'])}/>
        </div>
        <div className="style-palette__input-group">
          <span className="style-palette__input-label">Transform</span>
          <ButtonGroup className="style-palette__btn-group"
            value={element.getIn(['styles', 'textTransform'], '')}
            options={textTransformOptions}
            onChange={this.setValueInField.bind(this, ['styles', 'textTransform'])}/>
        </div>
        <div className="style-palette__input-group">
          <span className="style-palette__input-label">Decoration</span>
          <ButtonGroup className="style-palette__btn-group"
            value={element.getIn(['styles', 'textDecoration'], '')}
            options={textDecorationOptions}
            renderer={this.renderTextDecorationOption}
            onChange={this.setValueInField.bind(this, ['styles', 'textDecoration'])}/>
        </div>
      </div>
    );
  }

  renderTextAlignOption(option){
    return <FontAwesome icon={'align-' + option.value}/>;
  }

  renderTextDecorationOption(option){
    if (!option.value) return '—';
    return <span style={{textDecoration: option.value}}>Abc</span>;
  }

  renderSpacingSection(){
    const {element} = this.props;

    return (
      <div className="style-palette__section">
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">Line</span>
          <SizeInput className="style-palette__input-field--border"
            value={element.getIn(['styles', 'lineHeight'])}
            onChange={this.setValueInField.bind(this, ['styles', 'lineHeight'])}/>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">Letter</span>
          <SizeInput className="style-palette__input-field--border"
            value={element.getIn(['styles', 'letterSpacing'])}
            onChange={this.setValueInField.bind(this, ['styles', 'letterSpacing'])}/>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">Word</span>
          <SizeInput className="style-palette__input-field--border"
            value={element.getIn(['styles', 'wordSpacing'])}
            onChange={this.setValueInField.bind(this, ['styles', 'wordSpacing'])}/>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">Indent</span>
          <SizeInput className="style-palette__input-field--border"
            value={element.getIn(['styles', 'textIndent'])}
            onChange={this.setValueInField.bind(this, ['styles', 'textIndent'])}/>
        </div>
      </div>
    );
  }

  renderTextShadowSection(){
    const {element} = this.props;

    return (
      <div className="style-palette__section">
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">X</span>
          <SizeInput className="style-palette__input-field--border"
            value={element.getIn(['styles', 'textShadow', 'offsetX'])}
            onChange={this.setValueInField.bind(this, ['styles', 'textShadow', 'offsetX'])}/>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">Y</span>
          <SizeInput className="style-palette__input-field--border"
            value={element.getIn(['styles', 'textShadow', 'offsetY'])}
            onChange={this.setValueInField.bind(this, ['styles', 'textShadow', 'offsetY'])}/>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">Color</span>
          <div className="style-palette__input-field">
            <ColorPicker className="style-palette__color-picker"
              value={element.getIn(['styles', 'textShadow', 'color'])}
              onChange={this.setValueInField.bind(this, ['styles', 'textShadow', 'color'])}/>
          </div>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">Blur</span>
          <SizeInput className="style-palette__input-field--border"
            value={element.getIn(['styles', 'textShadow', 'blur'])}
            onChange={this.setValueInField.bind(this, ['styles', 'textShadow', 'blur'])}/>
        </div>
      </div>
    );
  }

  renderFillSection(){
    return (
      <div className="style-palette__section">
      </div>
    );
  }

  renderBorderSection(){
    return (
      <TabHost className="style-palette__tab-host">
        {this.renderBorderTab('top')}
        {this.renderBorderTab('right')}
        {this.renderBorderTab('bottom')}
        {this.renderBorderTab('left')}
      </TabHost>
    );
  }

  renderBorderTab(direction){
    const {element} = this.props;
    const borderKey = 'border' + capitalize(direction);

    return (
      <TabPane tab={direction} className="style-palette__section">
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">Width</span>
          <SizeInput className="style-palette__input-field--border"
            acceptZero={false}
            min={0}
            value={element.getIn(['styles', borderKey + 'Width'])}
            onChange={this.setValueInField.bind(this, ['styles', borderKey + 'Width'])}/>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">Color</span>
          <div className="style-palette__input-field">
            <ColorPicker className="style-palette__color-picker"
              value={element.getIn(['styles', borderKey + 'Color'])}
              onChange={this.setValueInField.bind(this, ['styles', borderKey + 'Color'])}/>
          </div>
        </div>
        <div className="style-palette__input-group">
          <span className="style-palette__input-label">Style</span>
          <select className="style-palette__input-field"
            value={element.getIn(['styles', borderKey + 'Style'], '')}
            onChange={this.handleSelectChange.bind(this, ['styles', borderKey + 'Style'])}>
            <option value=""></option>
            <option value="dotted">Dotted</option>
            <option value="dashed">Dashed</option>
            <option value="solid">Solid</option>
            <option value="double">Double</option>
            <option value="groove">Groove</option>
            <option value="ridge">Ridge</option>
            <option value="inset">Inset</option>
            <option value="outset">Outset</option>
          </select>
        </div>
      </TabPane>
    );
  }

  renderShadowSection(){
    const {element} = this.props;

    return (
      <div className="style-palette__section">
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">X</span>
          <SizeInput className="style-palette__input-field--border"
            value={element.getIn(['styles', 'boxShadow', 'offsetX'])}
            onChange={this.setValueInField.bind(this, ['styles', 'boxShadow', 'offsetX'])}/>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">Y</span>
          <SizeInput className="style-palette__input-field--border"
            value={element.getIn(['styles', 'boxShadow', 'offsetY'])}
            onChange={this.setValueInField.bind(this, ['styles', 'boxShadow', 'offsetY'])}/>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">Blur</span>
          <SizeInput className="style-palette__input-field--border"
            value={element.getIn(['styles', 'boxShadow', 'blur'])}
            onChange={this.setValueInField.bind(this, ['styles', 'boxShadow', 'blur'])}/>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">Spread</span>
          <SizeInput className="style-palette__input-field--border"
            value={element.getIn(['styles', 'boxShadow', 'spread'])}
            onChange={this.setValueInField.bind(this, ['styles', 'boxShadow', 'spread'])}/>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">Color</span>
          <div className="style-palette__input-field">
            <ColorPicker className="style-palette__color-picker"
              value={element.getIn(['styles', 'boxShadow', 'color'])}
              onChange={this.setValueInField.bind(this, ['styles', 'boxShadow', 'color'])}/>
          </div>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">Inset</span>
          <Checkbox
            value={element.getIn(['styles', 'boxShadow', 'inset'])}
            onChange={this.setValueInField.bind(this, ['styles', 'boxShadow', 'inset'])}/>
        </div>
      </div>
    );
  }

  handleSelectChange(field, e){
    this.setValueInField(field, (e.target || e.currentTarget || {}).value);
  }

  setValueInField(field, value){
    this.props.setValueInField(field, value);
  }
}

export default StylePalette;
