export default function(Blockly, props){
  Blockly.JavaScript.network_loadJSON = function(block){
    let url = Blockly.JavaScript.valueToCode(block, 'URL', Blockly.JavaScript.ORDER_ATOMIC);
    if (!url) return '';

    let successCallback = Blockly.JavaScript.statementToCode(block, 'SUCCESS');
    let errorCallback = Blockly.JavaScript.statementToCode(block, 'ERROR');
    let successResult = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('SUCCESS_RES'), Blockly.Variables.NAME_TYPE);
    let successArg0 = Blockly.JavaScript.variableDB_.getDistinctName('data', Blockly.Variables.NAME_TYPE);

    return `Dom7.ajax({
      url: ${url},
      success: function(${successArg0}){
        ${successResult} = JSON.parse(${successArg0});
        ${successCallback}
      },
      error: function(){
        ${errorCallback}
      }
    });`;
  };
}
