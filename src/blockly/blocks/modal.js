export default function(Blockly, props){
  const MODAL_HUE = 210;

  Blockly.Blocks.modal_alert = {
    init() {
      this.setColour(MODAL_HUE);

      this.appendValueInput('TITLE')
        .setCheck('String')
        .appendField('show alert with title');

      this.appendValueInput('CONTENT')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('content');

      this.appendStatementInput('CALLBACK')
        .appendField('ok');

      this.setPreviousStatement(true);
      this.setTooltip('Open an alert modal.');
    }
  };

  Blockly.Blocks.modal_confirm = {
    init() {
      this.setColour(MODAL_HUE);

      this.appendValueInput('TITLE')
        .setCheck('String')
        .appendField('show confirm with title');

      this.appendValueInput('CONTENT')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('content');

      this.appendStatementInput('CALLBACK_OK')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('ok');

      this.appendStatementInput('CALLBACK_CANCEL')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('cancel');

      this.setPreviousStatement(true);
      this.setTooltip(`Open a confirm modal. It's used when it is required to confirm some action.`);
    }
  };

  Blockly.Blocks.modal_prompt = {
    init() {
      this.setColour(MODAL_HUE);

      this.appendValueInput('TITLE')
        .setCheck('String')
        .appendField('show prompt with title');

      this.appendValueInput('CONTENT')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('content');

      this.appendStatementInput('CALLBACK_OK')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('ok')
        .appendField(new Blockly.FieldVariable('result'), 'RESULT');

      this.appendStatementInput('CALLBACK_CANCEL')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('cancel');

      this.setPreviousStatement(true);
      this.setTooltip(`Open a prompt modal. It's used when it is required to get some data from user.`);
    }
  };

  Blockly.Blocks.modal_showLoadingModal = {
    init() {
      this.setColour(MODAL_HUE);

      this.appendValueInput('TITLE')
        .setCheck('String')
        .appendField('show loading with title');

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip('Open a loading modal.');
    }
  };

  Blockly.Blocks.modal_hideLoadingModal = {
    init() {
      this.setColour(MODAL_HUE);

      this.appendDummyInput()
        .appendField('hide loading');

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip('Hide loading modals.');
    }
  };

  Blockly.Blocks.modal_showLoadingIndicator = {
    init() {
      this.setColour(MODAL_HUE);

      this.appendDummyInput()
        .appendField('show loading indicator');

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip('Show the loading indicator.');
    }
  };

  Blockly.Blocks.modal_hideLoadingIndicator = {
    init() {
      this.setColour(MODAL_HUE);

      this.appendDummyInput()
        .appendField('hide loading indicator');

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip('Hide the loading indicator.');
    }
  };
}
