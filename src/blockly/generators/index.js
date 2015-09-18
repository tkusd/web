export default function(Blockly, props){
  require('./modal')(Blockly, props);
  require('./transition')(Blockly, props);
  require('./network')(Blockly, props);
  require('./timer')(Blockly, props);
  require('./storage')(Blockly, props);
  require('./text')(Blockly, props);
  require('./variables')(Blockly, props);
  require('./view')(Blockly, props);
  require('./lists')(Blockly, props);
}
