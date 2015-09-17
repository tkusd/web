export default function(Blockly, props){
  Blockly.JavaScript.variables_getProperty = function(block){
    let key = block.getFieldValue('KEY');
    let obj = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('OBJ'), Blockly.Variables.NAME_TYPE);

    return [`${obj}[${JSON.stringify(key)}]`, Blockly.JavaScript.ORDER_MEMBER];
  };

  Blockly.JavaScript.variables_setProperty = function(block){
    let key = block.getFieldValue('KEY');
    let obj = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('OBJ'), Blockly.Variables.NAME_TYPE);
    let value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);
    if (!value) return '';

    return `${obj}[${JSON.stringify(key)}] = ${value};`;
  };

  Blockly.JavaScript.variables_hasProperty = function(block){
    let key = block.getFieldValue('KEY');
    let obj = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('OBJ'), Blockly.Variables.NAME_TYPE);

    return [`typeof ${obj} === 'object' && ${obj}.hasOwnProperty(${JSON.stringify(key)})`, Blockly.JavaScript.ORDER_ATOMIC];
  };

  Blockly.JavaScript.variables_getKeyList = function(block){
    let obj = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('OBJ'), Blockly.Variables.NAME_TYPE);

    return [`Object.keys(${obj})`, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  };

  Blockly.JavaScript.variables_getValueList = function(block){
    let obj = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('OBJ'), Blockly.Variables.NAME_TYPE);
    let fn = Blockly.JavaScript.provideFunction_('getValueList', [
      `function ${Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_}(obj){
        if (typeof obj !== 'object') return [];

        var keys = Object.keys(obj);
        var result = [];

        for (var i = 0, len = keys.length; i < len; i++){
          result.push(obj[keys[i]]);
        }

        return result;
      }`
    ]);

    return [`${fn}(${obj})`, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  };
}
