import React from 'react';
import ElementTypes from '../../constants/ElementTypes';

if (process.env.BROWSER){
  require('../../styles/Screen/BlocklyWorkspace.styl');
}

let defaultToolbox;

function loadBlockly(){
  if (global.Blockly) return Promise.resolve(global.Blockly);

  return new Promise((resolve, reject) => {
    require.ensure([
      'blockly/blockly_compressed',
      'blockly/blocks_compressed',
      'blockly/msg/js/en',
      '!!raw!../../assets/blocklyToolbox.xml'
    ], require => {
      const {Blockly, goog} = require('imports?this=>window!exports?Blockly,goog!blockly/blockly_compressed');
      global.Blockly = Blockly;
      global.goog = goog;

      require('blockly/blocks_compressed');
      require('blockly/msg/js/en');

      defaultToolbox = require('!!raw!../../assets/blocklyToolbox.xml');

      resolve(Blockly);
    }, 'blockly');
  });
}

class BlocklyWorkspace extends React.Component {
  static propTypes = {
    elements: React.PropTypes.object.isRequired,
    workspace: React.PropTypes.string,
    components: React.PropTypes.object.isRequired
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
      // const toolbox = '<xml>' + defaultToolbox + this.makeElementToolbox() + '</xml>';
      const workspace = this.workspace = Blockly.inject(this.refs.workspace, {
        toolbox: this.prepareToolbox()
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

  prepareToolbox(){
    let result = '<xml>' + defaultToolbox;
    result += '</xml>';

    return result;
  }

  // makeElementToolbox(){
  //   const {elements} = this.props;
  //   let toolbox = '<sep></sep>';
  //
  //   elements.filter(element => !element.get('element_id'))
  //     .forEach(element => {
  //       toolbox += this.makeScreenCategory(element);
  //     });
  //
  //   return toolbox;
  // }
  //
  // makeScreenCategory(element){
  //   let result = `<category name="Screen ${element.get('name')}">`;
  //   result += `<block type="transition_screen">
  //     <field name="SCREEN">${element.get('id')}</field>
  //   </block>`;
  //   result += this.makeChildrenBlocks(element);
  //   result += '</category>';
  //
  //   return result;
  // }
  //
  // makeChildrenBlocks(element){
  //   const {elements} = this.props;
  //   const parentID = element.get('id');
  //   let result = '';
  //
  //   elements.filter(element => element.get('element_id') === parentID)
  //     .forEach(element => {
  //       result += this.makeElementBlock(element);
  //
  //       if (element.get('type') === ElementTypes.inputText){
  //         result += `<block type="view_getInputValue">
  //           <field name="ELEMENT">${element.get('id')}</field>
  //         </block>`;
  //       }
  //     });
  //
  //   return result;
  // }
  //
  // makeElementBlock(element){
  //   let result = '<block type="view_setAttribute">';
  //
  //   result += `<field name="ELEMENT">${element.get('id')}</field>`;
  //   result += '</block>';
  //   result += this.makeChildrenBlocks(element);
  //
  //   return result;
  // }
}

export default BlocklyWorkspace;
