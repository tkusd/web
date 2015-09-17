import ElementTypes from '../../constants/ElementTypes';

export default function(Blockly, props){
  const VIEW_HUE = 330;

  Blockly.Blocks.view_setAttribute = {
    init(){
      const {components} = props;

      this.setColour(VIEW_HUE);

      let attrs = new Blockly.FieldDropdown([
        ['text', 'text']
      ]);

      let elements = props.elements
        .filter(element => {
          const component = components.get(element.get('type'));
          if (!component) return false;

          const attrs = component.get('attributes');
          if (!attrs) return false;

          return attrs.count();
        })
        .map(element => [element.get('name'), element.get('id')])
        .toArray();

      if (!elements.length){
        elements.push(['', '']);
      }

      this.appendValueInput('VALUE')
        .appendField('set')
        .appendField(attrs, 'ATTRIBUTE')
        .appendField('of')
        .appendField(new Blockly.FieldDropdown(elements), 'ELEMENT');

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip('Set the attribute of an element.');
    }
  };

  Blockly.Blocks.view_setList = {
    init(){
      this.setColour(VIEW_HUE);

      let elements = props.elements.filter(element => element.get('type') === ElementTypes.list)
        .map(element => [element.get('name'), element.get('id')])
        .toArray();

      if (!elements.length){
        elements.push(['', '']);
      }

      this.appendValueInput('VALUE')
        .setCheck('Array')
        .appendField('set list for')
        .appendField(new Blockly.FieldDropdown(elements), 'ELEMENT');

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip('Set list for an element.');
    }
  };

  const inputFieldTypes = [
    ElementTypes.inputText,
    ElementTypes.inputCheckbox,
    ElementTypes.inputSlider,
    ElementTypes.searchBar
  ];

  Blockly.Blocks.view_getInputValue = {
    init(){
      this.setColour(VIEW_HUE);

      let elements = props.elements
        .filter(element => ~inputFieldTypes.indexOf(element.get('type')))
        .map(element => [element.get('name'), element.get('id')])
        .toArray();

      if (!elements.length){
        elements.push(['', '']);
      }

      this.appendDummyInput()
        .appendField('value of')
        .appendField(new Blockly.FieldDropdown(elements), 'ELEMENT');

      this.setOutput(true, 'String');
      this.setTooltip('Get the value of an input field.');
    }
  };

  Blockly.Blocks.view_listGetSelection = {
    init(){
      this.setColour(VIEW_HUE);

      let elements = props.elements.filter(element => element.get('type') === ElementTypes.list)
        .map(element => [element.get('name'), element.get('id')])
        .toArray();

      if (!elements.length){
        elements.push(['', '']);
      }

      this.appendDummyInput()
        .appendField('selection of')
        .appendField(new Blockly.FieldDropdown(elements), 'ELEMENT');

      this.setOutput(true, 'Number');
      this.setTooltip('Set list for an element.');
    }
  };
}