import React from 'react';
import {SizeInput, ColorPicker, ButtonGroup, Checkbox} from '../form';
import FontAwesome from '../common/FontAwesome';
import {TabHost, TabPane} from '../tab';
import capitalize from 'lodash/string/capitalize';
import {FormattedMessage} from '../intl';
import {formatIntlFromContext} from '../../utils/formatIntl';

if (process.env.BROWSER){
  require('../../styles/Screen/StylePalette.styl');
}

const fontWeightOptions = [
  {value: ''},
  {value: '300'},
  {value: '400'},
  {value: '700'}
];

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

const borderStyleOptions = [
  {value: ''},
  {value: 'dotted'},
  {value: 'dashed'},
  {value: 'solid'},
  {value: 'double'},
  {value: 'groove'},
  {value: 'ridge'},
  {value: 'inset'},
  {value: 'outset'}
];

function getDimensionKey(prefix, field){
  if (!prefix) return field;
  return prefix + capitalize(field);
}

class StylePalette extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired
  }

  static propTypes = {
    element: React.PropTypes.object.isRequired,
    setValueInField: React.PropTypes.func.isRequired
  }

  render(){
    return (
      <div>
        <h4>
          <FormattedMessage message="style.dimensions"/>
        </h4>
        {this.renderDimensionSection()}
        <h4>
          <FormattedMessage message="style.font"/>
        </h4>
        {this.renderFontSection()}
        <h4>
          <FormattedMessage message="style.padding"/>
        </h4>
        {this.renderPaddingSection()}
        <h4>
          <FormattedMessage message="style.margin"/>
        </h4>
        {this.renderMarginSection()}
        <h4>
          <FormattedMessage message="style.spacing"/>
        </h4>
        {this.renderSpacingSection()}
        <h4>
          <FormattedMessage message="style.textShadow"/>
        </h4>
        {this.renderTextShadowSection()}
        <h4>
          <FormattedMessage message="style.fills"/>
        </h4>
        {this.renderFillSection()}
        <h4>
          <FormattedMessage message="style.borders"/>
        </h4>
        {this.renderBorderSection()}
        <h4>
          <FormattedMessage message="style.shadow"/>
        </h4>
        {this.renderShadowSection()}
      </div>
    );
  }

  renderDimensionSection(){
    return (
      <TabHost className="style-palette__tab-host">
        {this.renderDimensionTab('')}
        {this.renderDimensionTab('min')}
        {this.renderDimensionTab('max')}
      </TabHost>
    );
  }

  renderPaddingSection(){
    const {element} = this.props;

    return (
      <div className="style-palette__section">
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">
            <FormattedMessage message="style.top"/>
          </span>
          <SizeInput className="style-palette__input-field--border"
            min={0}
            value={element.getIn(['styles', 'paddingTop'])}
            onChange={this.setValueInField.bind(this, ['styles', 'paddingTop'])}/>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">
            <FormattedMessage message="style.bottom"/>
          </span>
          <SizeInput className="style-palette__input-field--border"
            min={0}
            value={element.getIn(['styles', 'paddingBottom'])}
            onChange={this.setValueInField.bind(this, ['styles', 'paddingBottom'])}/>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">
            <FormattedMessage message="style.left"/>
          </span>
          <SizeInput className="style-palette__input-field--border"
            min={0}
            value={element.getIn(['styles', 'paddingLeft'])}
            onChange={this.setValueInField.bind(this, ['styles', 'paddingLeft'])}/>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">
            <FormattedMessage message="style.right"/>
          </span>
          <SizeInput className="style-palette__input-field--border"
            min={0}
            value={element.getIn(['styles', 'paddingRight'])}
            onChange={this.setValueInField.bind(this, ['styles', 'paddingRight'])}/>
        </div>
      </div>
    );
  }

  renderMarginSection(){
    const {element} = this.props;

    return (
      <div className="style-palette__section">
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">
            <FormattedMessage message="style.top"/>
          </span>
          <SizeInput className="style-palette__input-field--border"
            value={element.getIn(['styles', 'marginTop'])}
            onChange={this.setValueInField.bind(this, ['styles', 'marginTop'])}/>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">
            <FormattedMessage message="style.bottom"/>
          </span>
          <SizeInput className="style-palette__input-field--border"
            value={element.getIn(['styles', 'marginBottom'])}
            onChange={this.setValueInField.bind(this, ['styles', 'marginBottom'])}/>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">
            <FormattedMessage message="style.left"/>
          </span>
          <SizeInput className="style-palette__input-field--border"
            value={element.getIn(['styles', 'marginLeft'])}
            onChange={this.setValueInField.bind(this, ['styles', 'marginLeft'])}/>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">
            <FormattedMessage message="style.right"/>
          </span>
          <SizeInput className="style-palette__input-field--border"
            value={element.getIn(['styles', 'marginRight'])}
            onChange={this.setValueInField.bind(this, ['styles', 'marginRight'])}/>
        </div>
      </div>
    );
  }

  renderDimensionTab(prefix){
    const {element} = this.props;
    let tab = prefix || 'default';

    return (
      <TabPane tab={<FormattedMessage message={'style.' + tab}/>}
        className="style-palette__section">
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">
            <FormattedMessage message="style.width"/>
          </span>
          <SizeInput className="style-palette__input-field--border"
            min={0}
            value={element.getIn(['styles', getDimensionKey(prefix, 'width')])}
            onChange={this.setValueInField.bind(this, ['styles', getDimensionKey(prefix, 'width')])}/>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">
            <FormattedMessage message="style.height"/>
          </span>
          <SizeInput className="style-palette__input-field--border"
            min={0}
            value={element.getIn(['styles', getDimensionKey(prefix, 'height')])}
            onChange={this.setValueInField.bind(this, ['styles', getDimensionKey(prefix, 'height')])}/>
        </div>
      </TabPane>
    );
  }

  renderFontSection(){
    const {element} = this.props;

    return (
      <div className="style-palette__section">
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">
            <FormattedMessage message="style.size"/>
          </span>
          <SizeInput className="style-palette__input-field--border"
            value={element.getIn(['styles', 'fontSize'])}
            min={0}
            acceptZero={false}
            onChange={this.setValueInField.bind(this, ['styles', 'fontSize'])}/>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">
            <FormattedMessage message="style.color"/>
          </span>
          <div className="style-palette__input-field">
            <ColorPicker className="style-palette__color-picker"
              value={element.getIn(['styles', 'color'])}
              onChange={this.setValueInField.bind(this, ['styles', 'color'])}/>
          </div>
        </div>
        <div className="style-palette__input-group">
          <span className="style-palette__input-label">
            <FormattedMessage message="style.weight"/>
          </span>
          <ButtonGroup className="style-palette__btn-group"
            value={element.getIn(['styles', 'fontWeight'], '')}
            options={fontWeightOptions}
            renderer={this.renderFontWeightOption}
            onChange={this.setValueInField.bind(this, ['styles', 'fontWeight'])}/>
        </div>
        <div className="style-palette__input-group">
          <span className="style-palette__input-label">
            <FormattedMessage message="style.align"/>
          </span>
          <ButtonGroup className="style-palette__btn-group"
            value={element.getIn(['styles', 'textAlign'], '')}
            options={textAlignOptions}
            renderer={this.renderTextAlignOption}
            onChange={this.setValueInField.bind(this, ['styles', 'textAlign'])}/>
        </div>
        <div className="style-palette__input-group">
          <span className="style-palette__input-label">
            <FormattedMessage message="style.textTransform"/>
          </span>
          <ButtonGroup className="style-palette__btn-group"
            value={element.getIn(['styles', 'textTransform'], '')}
            options={textTransformOptions}
            onChange={this.setValueInField.bind(this, ['styles', 'textTransform'])}/>
        </div>
        <div className="style-palette__input-group">
          <span className="style-palette__input-label">
            <FormattedMessage message="style.decoration"/>
          </span>
          <ButtonGroup className="style-palette__btn-group"
            value={element.getIn(['styles', 'textDecoration'], '')}
            options={textDecorationOptions}
            renderer={this.renderTextDecorationOption}
            onChange={this.setValueInField.bind(this, ['styles', 'textDecoration'])}/>
        </div>
      </div>
    );
  }

  renderFontWeightOption(option){
    if (!option.value) return '—';
    return <span style={{fontWeight: option.value}}>A</span>;
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
          <span className="style-palette__input-label">
            <FormattedMessage message="style.line"/>
          </span>
          <SizeInput className="style-palette__input-field--border"
            value={element.getIn(['styles', 'lineHeight'])}
            onChange={this.setValueInField.bind(this, ['styles', 'lineHeight'])}/>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">
            <FormattedMessage message="style.letter"/>
          </span>
          <SizeInput className="style-palette__input-field--border"
            value={element.getIn(['styles', 'letterSpacing'])}
            onChange={this.setValueInField.bind(this, ['styles', 'letterSpacing'])}/>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">
            <FormattedMessage message="style.word"/>
          </span>
          <SizeInput className="style-palette__input-field--border"
            value={element.getIn(['styles', 'wordSpacing'])}
            onChange={this.setValueInField.bind(this, ['styles', 'wordSpacing'])}/>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">
            <FormattedMessage message="style.indent"/>
          </span>
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
          <span className="style-palette__input-label">
            <FormattedMessage message="style.horizontal"/>
          </span>
          <SizeInput className="style-palette__input-field--border"
            value={element.getIn(['styles', 'textShadow', 'offsetX'])}
            onChange={this.setValueInField.bind(this, ['styles', 'textShadow', 'offsetX'])}/>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">
            <FormattedMessage message="style.vertical"/>
          </span>
          <SizeInput className="style-palette__input-field--border"
            value={element.getIn(['styles', 'textShadow', 'offsetY'])}
            onChange={this.setValueInField.bind(this, ['styles', 'textShadow', 'offsetY'])}/>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">
            <FormattedMessage message="style.color"/>
          </span>
          <div className="style-palette__input-field">
            <ColorPicker className="style-palette__color-picker"
              value={element.getIn(['styles', 'textShadow', 'color'])}
              onChange={this.setValueInField.bind(this, ['styles', 'textShadow', 'color'])}/>
          </div>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">
            <FormattedMessage message="style.blur"/>
          </span>
          <SizeInput className="style-palette__input-field--border"
            value={element.getIn(['styles', 'textShadow', 'blur'])}
            onChange={this.setValueInField.bind(this, ['styles', 'textShadow', 'blur'])}/>
        </div>
      </div>
    );
  }

  renderFillSection(){
    const {element} = this.props;

    return (
      <div className="style-palette__section">
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">
            <FormattedMessage message="style.color"/>
          </span>
          <div className="style-palette__input-field">
            <ColorPicker className="style-palette__color-picker"
              value={element.getIn(['styles', 'backgroundColor'])}
              onChange={this.setValueInField.bind(this, ['styles', 'backgroundColor'])}/>
          </div>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">
            <FormattedMessage message="style.radius"/>
          </span>
          <SizeInput className="style-palette__input-field--border"
            min={0}
            value={element.getIn(['styles', 'borderRadius'])}
            onChange={this.setValueInField.bind(this, ['styles', 'borderRadius'])}/>
        </div>
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
    const intl = formatIntlFromContext(this.context.flux);

    return (
      <TabPane tab={<FormattedMessage message={'style.' + direction}/>}
        className="style-palette__section">
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">
            <FormattedMessage message="style.width"/>
          </span>
          <SizeInput className="style-palette__input-field--border"
            acceptZero={false}
            min={0}
            value={element.getIn(['styles', borderKey + 'Width'])}
            onChange={this.setValueInField.bind(this, ['styles', borderKey + 'Width'])}/>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">
            <FormattedMessage message="style.color"/>
          </span>
          <div className="style-palette__input-field">
            <ColorPicker className="style-palette__color-picker"
              value={element.getIn(['styles', borderKey + 'Color'])}
              onChange={this.setValueInField.bind(this, ['styles', borderKey + 'Color'])}/>
          </div>
        </div>
        <div className="style-palette__input-group">
          <span className="style-palette__input-label">
            <FormattedMessage message="style.style"/>
          </span>
          <select className="style-palette__input-field"
            value={element.getIn(['styles', borderKey + 'Style'], '')}
            onChange={this.handleSelectChange.bind(this, ['styles', borderKey + 'Style'])}>
            {borderStyleOptions.map((option, i) => (
              <option key={i} value={option.value}>
                {option.value && intl.getIntlMessage('style.' + option.value)}
              </option>
            ))}
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
          <span className="style-palette__input-label">
            <FormattedMessage message="style.horizontal"/>
          </span>
          <SizeInput className="style-palette__input-field--border"
            value={element.getIn(['styles', 'boxShadow', 'offsetX'])}
            onChange={this.setValueInField.bind(this, ['styles', 'boxShadow', 'offsetX'])}/>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">
            <FormattedMessage message="style.vertical"/>
          </span>
          <SizeInput className="style-palette__input-field--border"
            value={element.getIn(['styles', 'boxShadow', 'offsetY'])}
            onChange={this.setValueInField.bind(this, ['styles', 'boxShadow', 'offsetY'])}/>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">
            <FormattedMessage message="style.blur"/>
          </span>
          <SizeInput className="style-palette__input-field--border"
            value={element.getIn(['styles', 'boxShadow', 'blur'])}
            onChange={this.setValueInField.bind(this, ['styles', 'boxShadow', 'blur'])}/>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">
            <FormattedMessage message="style.spread"/>
          </span>
          <SizeInput className="style-palette__input-field--border"
            value={element.getIn(['styles', 'boxShadow', 'spread'])}
            onChange={this.setValueInField.bind(this, ['styles', 'boxShadow', 'spread'])}/>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">
            <FormattedMessage message="style.color"/>
          </span>
          <div className="style-palette__input-field">
            <ColorPicker className="style-palette__color-picker"
              value={element.getIn(['styles', 'boxShadow', 'color'])}
              onChange={this.setValueInField.bind(this, ['styles', 'boxShadow', 'color'])}/>
          </div>
        </div>
        <div className="style-palette__input-group-half">
          <span className="style-palette__input-label">
            <FormattedMessage message="style.inset"/>
          </span>
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
