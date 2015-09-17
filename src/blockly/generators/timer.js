export default function(Blockly, props){
  Blockly.JavaScript.timer_timeout = function(block){
    let delay = block.getFieldValue('DELAY') || '0';
    let callback = Blockly.JavaScript.statementToCode(block, 'DO');

    return `setTimeout(function(){
      ${callback}
    }, ${delay});`;
  };

  Blockly.JavaScript.timer_interval = function(block){
    let delay = block.getFieldValue('DELAY') || '0';
    let callback = Blockly.JavaScript.statementToCode(block, 'DO');

    return `setInterval(function(){
      ${callback}
    }, ${delay});`;
  };
}
