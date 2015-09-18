export default function(Blockly, props){
  Blockly.JavaScript.lists_contains = function(block){
    let list = Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.ORDER_MEMBER) || '[]';
    let value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC) || `''`;

    return [`~${list}.indexOf(${value})`, Blockly.JavaScript.ORDER_BITWISE_NOT];
  };

  Blockly.JavaScript.lists_remove = function(block){
    let list = Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.ORDER_MEMBER) || '[]';
    let value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC) || `''`;

    return `${list}.splice(${list}.indexOf(${value}), 1);`;
  };
}
