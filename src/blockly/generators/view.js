export default function(Blockly, props){
  Blockly.JavaScript.view_setAttribute = function(block){
    let value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC) || `''`;
    let attr = block.getFieldValue('ATTRIBUTE');
    let element = block.getFieldValue('ELEMENT');

    return `Dom7('#e${element}').text(${value});`;
  };

  Blockly.JavaScript.view_setList = function(block){
    let value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC) || `[]`;
    let element = block.getFieldValue('ELEMENT');
    let arrName = Blockly.JavaScript.variableDB_.getDistinctName('arr', Blockly.Variables.NAME_TYPE);
    let elementDom = Blockly.JavaScript.variableDB_.getDistinctName('elementDom', Blockly.Variables.NAME_TYPE);
    let html = Blockly.JavaScript.variableDB_.getDistinctName('html', Blockly.Variables.NAME_TYPE);

    return `var ${arrName} = ${value};
    var ${elementDom} = Dom7('#e${element}');

    if (${elementDom}.length && Array.isArray(${arrName})){
      ${elementDom}.html('');

      var ${html} = '<ul>';

      ${arrName}.forEach(function(item, i){
        ${html} += '<li data-index="' + i + '">' +
          '<a class="item-content item-link" href="#">' +
            '<div class="item-inner">' +
              '<div class="item-title">' + item + '</div>' +
              '<div class="item-after"></div>' +
            '</div>' +
          '</a>' +
        '</li>';
      });

      ${html} += '</ul>';
      ${elementDom}.html(${html});
    }`;
  };

  Blockly.JavaScript.view_getInputValue = function(block){
    const {elements} = props;
    let id = block.getFieldValue('ELEMENT');
    const element = elements.get(id);
    let selector = '#e' + id;

    if (element && element.get('type') === 'searchBar'){
      selector += ' input';
    }

    return [`Dom7('${selector}').value()`, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  };

  Blockly.JavaScript.view_listGetSelection = function(block){
    let id = block.getFieldValue('ELEMENT');
    return [`listSelections[${JSON.stringify(id)}]`, Blockly.JavaScript.ORDER_MEMBER];
  };
}
