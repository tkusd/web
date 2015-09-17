export default function(Blockly, props){
  const NETWORK_HUE = 270;

  Blockly.Blocks.network_loadJSON = {
    init() {
      this.setColour(NETWORK_HUE);

      this.appendValueInput('URL')
        .setCheck('String')
        .appendField('load JSON from URL');

      this.appendStatementInput('SUCCESS')
        .appendField('success')
        .appendField(new Blockly.FieldVariable('result'), 'SUCCESS_RES');

      this.appendStatementInput('ERROR')
        .appendField('failed');

      this.setPreviousStatement(true);
      this.setTooltip('Load JSON from the specified URL.');
    }
  };
}
