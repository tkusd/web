export default function(Blockly, props){
  Blockly.Blocks.lists_contains = {
    init(){
      this.setColour(Blockly.Blocks.lists.HUE);

      this.appendValueInput('LIST')
        .setCheck('Array');

      this.appendValueInput('VALUE')
        .appendField('contains');

      this.setOutput(true, 'Boolean');
      this.setInputsInline(true);
      this.setTooltip('Check whether a list contains the specified value.');
    }
  };

  Blockly.Blocks.lists_remove = {
    init(){
      this.setColour(Blockly.Blocks.lists.HUE);

      this.appendValueInput('VALUE')
        .appendField('remove');

      this.appendValueInput('LIST')
        .appendField('from list');

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setInputsInline(true);
      this.setTooltip('Remove the specified value from a list.');
    }
  };
}
