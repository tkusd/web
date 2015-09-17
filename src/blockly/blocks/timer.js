export default function(Blockly, props){
  const TIMER_HUE = 300;

  Blockly.Blocks.timer_timeout = {
    init() {
      this.setColour(TIMER_HUE);

      this.appendDummyInput()
        .appendField('wait for')
        .appendField(new Blockly.FieldTextInput('1000', Blockly.FieldTextInput.numberValidator), 'DELAY')
        .appendField('ms');

      this.appendStatementInput('DO')
        .appendField('do');

      this.setPreviousStatement(true);
      this.setTooltip('Execute after a specified delay.');
    }
  };

  Blockly.Blocks.timer_interval = {
    init() {
      this.setColour(TIMER_HUE);

      this.appendDummyInput()
        .appendField('every')
        .appendField(new Blockly.FieldTextInput('1000', Blockly.FieldTextInput.numberValidator), 'DELAY')
        .appendField('ms');

      this.appendStatementInput('DO')
        .appendField('do');

      this.setPreviousStatement(true);
      this.setTooltip('Execute after a specified delay.');
    }
  };
}