export default function(Blockly, props){
  Blockly.JavaScript.transition_screen = function(block){
    let screen = block.getFieldValue('SCREEN');
    if (!screen) return '';

    return `view.router.load({
      content: viewContents[${JSON.stringify(screen)}]
    });`;
  };

  Blockly.JavaScript.transition_back = function(block){
    return 'view.router.back();';
  };
}
