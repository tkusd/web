import React from 'react';

if (process.env.BROWSER){
  require('../../styles/Screen/BlocklyWorkspace.styl');
}

function loadBlockly(){
  if (global.Blockly) return Promise.resolve(global.Blockly);

  return new Promise((resolve, reject) => {
    require.ensure([
      'blockly/blockly_compressed',
      'blockly/blocks_compressed',
      'blockly/msg/js/en'
    ], require => {
      const {Blockly, goog} = require('imports?this=>window!exports?Blockly,goog!blockly/blockly_compressed');
      global.Blockly = Blockly;
      global.goog = goog;

      require('blockly/blocks_compressed');
      require('blockly/msg/js/en');

      resolve(Blockly);
    }, 'blockly');
  });
}


const toolbox = `<xml>
<category name="Logic">
  <block type="controls_if"></block>
  <block type="logic_compare"></block>
  <block type="logic_operation"></block>
  <block type="logic_negate"></block>
  <block type="logic_boolean"></block>
  <block type="logic_null"></block>
</category>
<category name="Loops">
  <block type="controls_repeat_ext">
    <value name="TIMES">
      <block type="math_number">
        <field name="NUM">10</field>
      </block>
    </value>
  </block>
  <block type="controls_whileUntil"></block>
  <block type="controls_for"></block>
  <block type="controls_forEach"></block>
</category>
<category name="Math">
  <block type="math_number"></block>
  <block type="math_arithmetic"></block>
  <block type="math_single"></block>
  <block type="math_constrain"></block>
  <block type="math_random_int"></block>
  <block type="math_random_float"></block>
</category>
<category name="Text">
  <block type="text"></block>
  <block type="text_join"></block>
  <block type="text_append"></block>
  <block type="text_length"></block>
  <block type="text_isEmpty"></block>
  <block type="text_indexOf"></block>
  <block type="text_charAt"></block>
  <block type="text_getSubstring"></block>
  <block type="text_changeCase"></block>
  <block type="text_trim"></block>
</category>
<category name="Variables" custom="VARIABLE"></category>
<category name="Functions" custom="PROCEDURE"></category>
<sep></sep>
<category name="Modal">
  <block type="modal_alert"></block>
  <block type="modal_confirm"></block>
  <block type="modal_prompt"></block>
</category>
<category name="Transition">
  <block type="transition_screen"></block>
  <block type="transition_back"></block>
</category>
<category name="Network">
  <block type="network_loadJSON"></block>
</category>
</xml>`;

class BlocklyWorkspace extends React.Component {
  static propTypes = {
    elements: React.PropTypes.object.isRequired,
    workspace: React.PropTypes.string
  }

  static defaultProps = {
    workspace: '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>'
  }

  constructor(props, context){
    super(props, context);

    this.Blockly = null;
    this.workspace = null;
  }

  componentDidMount(){
    loadBlockly().then(Blockly => {
      const workspace = this.workspace = Blockly.inject(this.refs.workspace, {
        toolbox
      });
      this.Blockly = Blockly;
      require('../../blockly/blocks')(Blockly, this.props);

      let xml = Blockly.Xml.textToDom(this.props.workspace);
      Blockly.Xml.domToWorkspace(workspace, xml);
    });
  }

  componentWillUnmount(){
    this.workspace.clear();

    let toolboxs = document.getElementsByClassName('blocklyToolboxDiv');
    toolboxs[toolboxs.length - 1].style.display = 'none';
  }

  render(){
    return (
      <div className={this.props.className}>
        <div className="blockly-workspace" ref="workspace"/>
        <xml ref="state" style={{display: 'none'}}/>
      </div>
    );
  }

  getWorkspace(){
    return this.workspace;
  }

  getXMLString(){
    let xml = this.Blockly.Xml.workspaceToDom(this.workspace);
    return this.Blockly.Xml.domToText(xml);
  }
}

export default BlocklyWorkspace;
