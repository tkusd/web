export default function(Blockly, props){
  Blockly.JavaScript.modal_alert = function(block){
    let content = Blockly.JavaScript.valueToCode(block, 'CONTENT', Blockly.JavaScript.ORDER_ATOMIC) || `''`;
    let title = Blockly.JavaScript.valueToCode(block, 'TITLE', Blockly.JavaScript.ORDER_ATOMIC) || `''`;
    let callback = Blockly.JavaScript.statementToCode(block, 'CALLBACK');

    return `app.alert(${content}, ${title}, function(){
      ${callback}
    });`;
  };

  Blockly.JavaScript.modal_confirm = function(block){
    let content = Blockly.JavaScript.valueToCode(block, 'CONTENT', Blockly.JavaScript.ORDER_ATOMIC) || `''`;
    let title = Blockly.JavaScript.valueToCode(block, 'TITLE', Blockly.JavaScript.ORDER_ATOMIC) || `''`;
    let callbackOk = Blockly.JavaScript.statementToCode(block, 'CALLBACK_OK');
    let callbackCancel = Blockly.JavaScript.statementToCode(block, 'CALLBACK_CANCEL');

    return `app.confirm(${content}, ${title}, function(){
      ${callbackOk}
    }, function(){
      ${callbackCancel}
    });`;
  };

  Blockly.JavaScript.modal_prompt = function(block){
    let content = Blockly.JavaScript.valueToCode(block, 'CONTENT', Blockly.JavaScript.ORDER_ATOMIC) || `''`;
    let title = Blockly.JavaScript.valueToCode(block, 'TITLE', Blockly.JavaScript.ORDER_ATOMIC) || `''`;
    let callbackOk = Blockly.JavaScript.statementToCode(block, 'CALLBACK_OK');
    let callbackCancel = Blockly.JavaScript.statementToCode(block, 'CALLBACK_CANCEL');
    let resultVar = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('RESULT'), Blockly.Variables.NAME_TYPE);
    let resultArg0 = Blockly.JavaScript.variableDB_.getDistinctName('value', Blockly.Variables.NAME_TYPE);

    return `app.prompt(${content}, ${title}, function(${resultArg0}){
      ${resultVar} = ${resultArg0};
      ${callbackOk}
    }, function(){
      ${callbackCancel}
    });`;
  };

  Blockly.JavaScript.modal_showLoadingModal = function(block){
    let title = Blockly.JavaScript.valueToCode(block, 'TITLE', Blockly.JavaScript.ORDER_ATOMIC) || `'Loading'`;

    return `app.showPreloader(${title});`;
  };

  Blockly.JavaScript.modal_hideLoadingModal = function(block){
    return `app.hidePreloader();`;
  };

  Blockly.JavaScript.modal_showLoadingIndicator = function(block){
    return `app.showIndicator();`;
  };

  Blockly.JavaScript.modal_hideLoadingIndicator = function(block){
    return `app.hideIndicator();`;
  };
}
