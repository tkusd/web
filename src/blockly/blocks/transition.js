export default function(Blockly, props){
  const TRANSITION_HUE = 240;

  Blockly.Blocks.transition_screen = {
    init() {
      const {elements} = props;
      const screens = elements.filter(element => !element.get('element_id'))
        .map(element => [element.get('name'), element.get('id')])
        .toArray();

      this.setColour(TRANSITION_HUE);

      let dropdown = new Blockly.FieldDropdown(screens);

      this.appendDummyInput()
        .appendField('transition to')
        .appendField(dropdown, 'SCREEN');

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip('Load the specified screen.');
    }
  };

  Blockly.Blocks.transition_back = {
    init() {
      this.setColour(TRANSITION_HUE);

      this.appendDummyInput()
        .appendField('go back');

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip('Go back to the previous page.');
    }
  };
}
