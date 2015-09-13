export default function(Blockly, props){
  const COLORS = {
    modal: 210,
    transition: 240
  };

  Blockly.Blocks.modal_alert = {
    init(){
      this.setColour(COLORS.modal);

      this.appendValueInput('TITLE')
        .setCheck('String')
        .appendField('Alert with title');

      this.appendValueInput('CONTENT')
        .setCheck('String')
        .appendField('and content');

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip('Open an alert modal.');
    }
  };

  Blockly.Blocks.modal_confirm = {
    init(){
      this.setColour(COLORS.modal);

      this.appendValueInput('TITLE')
        .setCheck('String')
        .appendField('Confirm with title');

      this.appendValueInput('CONTENT')
        .setCheck('String')
        .appendField('and content');

      this.setOutput(true, 'Boolean');
      this.setTooltip(`Open a confirm modal. It's used when it is required to confirm some action.`);
    }
  };

  Blockly.Blocks.modal_prompt = {
    init(){
      this.setColour(COLORS.modal);

      this.appendValueInput('TITLE')
        .setCheck('String')
        .appendField('Prompt with title');

      this.appendValueInput('CONTENT')
        .setCheck('String')
        .appendField('and content');

      this.setOutput(true, 'String');
      this.setTooltip(`Open a prompt modal. It's used when it is required to get some data from user.`);
    }
  };

  Blockly.Blocks.transition_screen = {
    init(){
      const {elements} = props;
      const screens = elements.filter(element => !element.get('element_id'))
        .map(element => [element.get('name'), element.get('id')])
        .toArray();

      this.setColour(COLORS.transition);

      let dropdown = new Blockly.FieldDropdown(screens);

      this.appendDummyInput()
        .appendField('Transition to')
        .appendField(dropdown, 'SCREEN');

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip('Load the specified screen.');
    }
  };

  Blockly.Blocks.transition_back = {
    init(){
      this.setColour(COLORS.transition);

      this.appendDummyInput()
        .appendField('Go back');

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip('Go back to the previous page.');
    }
  };
}