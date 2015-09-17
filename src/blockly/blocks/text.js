export default function(Blockly, props){
  Blockly.Blocks.text_encodeURI = {
    init(){
      this.setColour(Blockly.Blocks.texts.HUE);

      this.appendValueInput('TEXT')
        .setCheck('String')
        .appendField('encode URI');

      this.setOutput(true, 'String');
      this.setTooltip('Encode a string to a valid URI');
    }
  };

  Blockly.Blocks.text_parseJSON = {
    init(){
      this.setColour(Blockly.Blocks.texts.HUE);

      this.appendValueInput('TEXT')
        .setCheck('String')
        .appendField('parse JSON');

      this.setOutput(true, 'String');
      this.setTooltip('Parse a JSON string');
    }
  };
}
