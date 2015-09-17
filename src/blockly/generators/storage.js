export default function(Blockly, props){
  Blockly.JavaScript.storage_setItem = function(block){
    let key = block.getFieldValue('KEY');
    let value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC) || `null`;
    if (!key) return '';

    const projectID = props.project.get('id');
    let fn = Blockly.JavaScript.provideFunction_('setStorage', [
      `function ${Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_}(key, value){
        var data = JSON.parse(localStorage.getItem('diff_${projectID}') || '{}');

        data[key] = value;
        localStorage.setItem('diff_${projectID}', JSON.stringify(data));
      }`
    ]);

    return `${fn}(${JSON.stringify(key)}, ${value});`;
  };

  Blockly.JavaScript.storage_getItem = function(block){
    let key = block.getFieldValue('KEY');
    const projectID = props.project.get('id');
    let fn = Blockly.JavaScript.provideFunction_('getStorage', [
      `function ${Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_}(key){
        var data = localStorage.getItem('diff_${projectID}');
        if (!data) return;

        return JSON.parse(data)[key];
      }`
    ]);

    return [`${fn}(${JSON.stringify(key)})`, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  };

  Blockly.JavaScript.storage_removeItem = function(block){
    let key = block.getFieldValue('KEY');
    const projectID = props.project.get('id');
    let fn = Blockly.JavaScript.provideFunction_('removeStorage', [
      `function ${Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_}(key){
        var data = JSON.parse(localStorage.getItem('diff_${projectID}') || '{}');

        delete data[key];
        localStorage.setItem('diff_${projectID}', JSON.stringify(data));
      }`
    ]);

    return `${fn}(${JSON.stringify(key)});`;
  };

  Blockly.JavaScript.storage_clearAll = function(block){
    const projectID = props.project.get('id');

    return `localStorage.removeItem('diff_${projectID}');`;
  };
}
