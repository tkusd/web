import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import path from 'path';
import vm from 'vm';
import fs from 'graceful-fs';
import esprima from 'esprima';
import esmangle from 'esmangle';
import escodegen from 'escodegen';
import {DOMParser} from 'xmldom';
import View from '../embed/View';
import nunjucksRender from '../utils/nunjucksRender';

const TEMPLATE_PATH = path.join(__dirname, 'template.js');
const BLOCKLY_DIR = path.join(__dirname, '../../web_modules/blockly');

const BLOCKLY_SCRIPTS = [
  'blockly_compressed.js',
  'blocks_compressed.js',
  'javascript_compressed.js',
  'msg/js/en.js'
]
.map(p => path.join(BLOCKLY_DIR, p))
.map(path => fs.readFileSync(path, 'utf8'))
.map(content => new vm.Script(content));

function flattenArray(arr, item){
  return item ? arr.concat(item) : arr;
}

function flattenEvents(flux, projectID){
  const {ElementStore, EventStore} = flux.getStore();
  const elements = ElementStore.getElementsOfProject(projectID);

  return elements.toArray().map(element => {
    return EventStore.getEventsOfElement(element.get('id')).toArray();
  }).reduce(flattenArray, []);
}

function prepareBlocklyContext(){
  const ctx = {
    DOMParser,
    console
  };

  vm.createContext(ctx);
  BLOCKLY_SCRIPTS.forEach(script => script.runInContext(ctx));

  return ctx;
}

export default function generateScript(flux, projectID, options = {}){
  const {ProjectStore, ElementStore, ComponentStore} = flux.getStore();
  const project = ProjectStore.getProject(projectID);
  const elements = ElementStore.getElementsOfProject(projectID);
  const components = ComponentStore.getList();
  const props = {
    elements, project, components
  };

  let views = elements.filter(element => !element.get('element_id'))
    .map(element => (
      createElement(View, {
        ...options,
        elements,
        project,
        element
      })
    ))
    .map(renderToStaticMarkup)
    .map((markup, key) => ({key, markup}))
    .toArray();

  const {Blockly} = prepareBlocklyContext();

  require('../blockly/blocks')(Blockly, props);
  require('../blockly/generators')(Blockly, props);

  let events = flattenEvents(flux, projectID).map(event => {
    const workspace = new Blockly.Workspace();
    const xml = Blockly.Xml.textToDom(event.get('workspace'));
    Blockly.Xml.domToWorkspace(workspace, xml);
    const code = Blockly.JavaScript.workspaceToCode(workspace);

    return event.set('code', code);
  });

  return nunjucksRender(TEMPLATE_PATH, {
    project,
    views,
    events,
    elements
  }).then(code => {
    let ast = esprima.parse(code);

    if (options.mangle){
      ast = esmangle.mangle(ast);
    }

    return escodegen.generate(ast, {
      format: {
        indent: {
          style: '  '
        }
      }
    });
  });
}
