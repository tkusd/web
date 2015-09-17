export default function(Blockly, props){
  Blockly.JavaScript.text_encodeURI = function(block){
    let text = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_ATOMIC) || `''`;

    return [`encodeURIComponent(${text})`, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  };

  Blockly.JavaScript.text_parseJSON = function(block){
    let text = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_ATOMIC) || `''`;

    return [`JSON.parse(${text})`, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  };
}
