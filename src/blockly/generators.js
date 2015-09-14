export default function(Blockly){
  Blockly.JavaScript.modal_alert = function(block){
    let content = Blockly.JavaScript.valueToCode(block, 'CONTENT', Blockly.JavaScript.ORDER_ATOMIC) || `''`;
    let title = Blockly.JavaScript.valueToCode(block, 'TITLE', Blockly.JavaScript.ORDER_ATOMIC) || `''`;

    return `app.alert(${content}, ${title})`;
  };

  Blockly.JavaScript.modal_confirm = function(block){
    let content = Blockly.JavaScript.valueToCode(block, 'CONTENT', Blockly.JavaScript.ORDER_ATOMIC) || `''`;
    let title = Blockly.JavaScript.valueToCode(block, 'TITLE', Blockly.JavaScript.ORDER_ATOMIC) || `''`;

    return `app.confirm(${content}, ${title})`;
  };

  Blockly.JavaScript.modal_prompt = function(block){
    let content = Blockly.JavaScript.valueToCode(block, 'CONTENT', Blockly.JavaScript.ORDER_ATOMIC) || `''`;
    let title = Blockly.JavaScript.valueToCode(block, 'TITLE', Blockly.JavaScript.ORDER_ATOMIC) || `''`;

    return `app.prompt(${content}, ${title})`;
  };

  Blockly.JavaScript.transition_screen = function(block){
    let screen = block.getFieldValue('SCREEN');
    if (!screen) return '';

    return `view.router.load({
      content: viewContents[${JSON.stringify(screen)}]
    })`;
  };

  Blockly.JavaScript.transition_back = function(block){
    return 'view.router.back()';
  };

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
        ${successResult} = ${successArg0};
        ${successCallback}
      },
      error: function(){
        ${errorCallback}
      }
    })`;
  };
}
