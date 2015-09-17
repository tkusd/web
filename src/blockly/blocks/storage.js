export default function(Blockly, props){
  const STORAGE_HUE = 360;

  Blockly.Blocks.storage_setItem = {
    init() {
      this.setColour(STORAGE_HUE);

      this.appendValueInput('VALUE')
        .appendField('set')
        .appendField(new Blockly.FieldTextInput('key'), 'KEY')
        .appendField('to storage');

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip('Set an item to the storage.');
    }
  };

  Blockly.Blocks.storage_getItem = {
    init() {
      this.setColour(STORAGE_HUE);

      this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput('key'), 'KEY')
        .appendField('in storage');

      this.setOutput(true);
      this.setTooltip('Get an item in the storage.');
    }
  };

  Blockly.Blocks.storage_removeItem = {
    init() {
      this.setColour(STORAGE_HUE);

      this.appendDummyInput()
        .appendField('remove')
        .appendField(new Blockly.FieldTextInput('key'), 'KEY')
        .appendField('from storage');

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip('Remove an item from the storage');
    }
  };

  Blockly.Blocks.storage_clearAll = {
    init() {
      this.setColour(STORAGE_HUE);

      this.appendDummyInput()
        .appendField('clear storage');

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip('Clear everything in the storage.');
    }
  };
}
