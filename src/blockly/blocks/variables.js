export default function(Blockly, props){
  Blockly.Blocks.variables_getProperty = {
    init(){
      this.setColour(Blockly.Blocks.variables.HUE);

      this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput('key'), 'KEY')
        .appendField('in')
        .appendField(new Blockly.FieldVariable('item'), 'OBJ');

      this.setOutput(true);
      this.setTooltip('Get a property in an object');
    }
  };

  Blockly.Blocks.variables_setProperty = {
    init(){
      this.setColour(Blockly.Blocks.variables.HUE);

      this.appendValueInput('VALUE')
        .appendField('set')
        .appendField(new Blockly.FieldTextInput('key'), 'KEY')
        .appendField('in')
        .appendField(new Blockly.FieldVariable('item'), 'OBJ')
        .appendField('to');

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip('Set a property in an object');
    }
  };

  Blockly.Blocks.variables_hasProperty = {
    init(){
      this.setColour(Blockly.Blocks.variables.HUE);

      this.appendDummyInput()
        .appendField(new Blockly.FieldVariable('item'), 'OBJ')
        .appendField('has')
        .appendField(new Blockly.FieldTextInput('key'), 'KEY');

      this.setOutput(true, 'Boolean');
      this.setTooltip('Check whether an object has the specified key set');
    }
  };

  Blockly.Blocks.variables_getKeyList = {
    init(){
      this.setColour(Blockly.Blocks.variables.HUE);

      this.appendDummyInput()
        .appendField('keys of')
        .appendField(new Blockly.FieldVariable('item'), 'OBJ');

      this.setOutput(true, 'Array');
      this.setTooltip('Get the list of keys of an object');
    }
  };

  Blockly.Blocks.variables_getValueList = {
    init(){
      this.setColour(Blockly.Blocks.variables.HUE);

      this.appendDummyInput()
        .appendField('values of')
        .appendField(new Blockly.FieldVariable('item'), 'OBJ');

      this.setOutput(true, 'Array');
      this.setTooltip('Get the list of values of an object');
    }
  };
}
