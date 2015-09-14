import base62uuid from '../utils/base62uuid';

export default function(Blockly){
  Blockly.JavaScript.modal_alert = function(block){
    let content = Blockly.JavaScript.valueToCode(block, 'CONTENT', Blockly.JavaScript.ORDER_NONE) || `''`;
    let title = Blockly.JavaScript.valueToCode(block, 'TITLE', Blockly.JavaScript.ORDER_NONE) || `''`;
    let code = `app.alert(${content}, ${title})`;

    return code;
  };

  Blockly.JavaScript.modal_confirm = function(block){
    let content = Blockly.JavaScript.valueToCode(block, 'CONTENT', Blockly.JavaScript.ORDER_NONE) || `''`;
    let title = Blockly.JavaScript.valueToCode(block, 'TITLE', Blockly.JavaScript.ORDER_NONE) || `''`;
    let code = `app.confirm(${content}, ${title})`;

    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  };

  Blockly.JavaScript.modal_prompt = function(block){
    let content = Blockly.JavaScript.valueToCode(block, 'CONTENT', Blockly.JavaScript.ORDER_NONE) || `''`;
    let title = Blockly.JavaScript.valueToCode(block, 'TITLE', Blockly.JavaScript.ORDER_NONE) || `''`;
    let code = `app.prompt(${content}, ${title})`;

    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  };

  Blockly.JavaScript.transition_screen = function(block){
    let screen = block.getFieldValue('SCREEN');
    let code = '';

    if (screen){
      code = `view.router.load({
        content: v_${base62uuid(screen)}
      })`;
    }

    return code;
  };

  Blockly.JavaScript.transition_back = function(block){
    return 'view.router.back()';
  };
}
