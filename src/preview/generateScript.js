import escodegen from 'escodegen';
import {
  generateLiteral,
  generateIdentifier,
  generateExpressionStatement,
  generateCallExpression,
  generateBlockStatement,
  generateMemberExpression
} from '../utils/esprima';
import base62uuid from '../utils/base62uuid';

function getElementID(element){
  return '#e' + base62uuid(element.get('id'));
}

function flattenArray(arr, item){
  return item ? arr.concat(item) : arr;
}

function generateEventAction(flux, event){
  const {ProjectStore, ActionStore} = flux.getStore();
  const action = ActionStore.getAction(event.get('action_id'));
  const project = ProjectStore.getProject(action.get('project_id'));

  switch (action.get('action')){
    case 'alert':
      return generateCallExpression(
        generateMemberExpression('app.alert'),
        [
          generateLiteral(action.getIn(['data', 'text'])),
          generateLiteral(action.getIn(['data', 'title'], project.get('title')))
        ]
      );

    case 'confirm':
      return generateCallExpression(
        generateMemberExpression('app.confirm'),
        [
          generateLiteral(action.getIn(['data', 'text'])),
          generateLiteral(action.getIn(['data', 'title'], project.get('title')))
        ]
      );

    case 'prompt':
      return generateCallExpression(
        generateMemberExpression('app.prompt'),
        [
          generateLiteral(action.getIn(['data', 'text'])),
          generateLiteral(action.getIn(['data', 'title'], project.get('title')))
        ]
      );
  }
}

function generateEventBindings(flux, projectID){
  const {ElementStore, EventStore} = flux.getStore();
  const elements = ElementStore.getElementsOfProject(projectID);

  return elements.toArray().map(element => {
    const events = EventStore.getEventsOfElement(element.get('id'));

    return events.toArray().map(event => {
      return generateExpressionStatement(
        generateCallExpression({
          type: 'MemberExpression',
          object: generateCallExpression(
            generateIdentifier('Dom7'),
            [generateLiteral(getElementID(element))]
          ),
          property: generateIdentifier('on')
        }, [
          generateLiteral(event.get('event')),
          {
            type: 'FunctionExpression',
            params: [],
            body: generateBlockStatement([
              generateEventAction(flux, event)
            ])
          }
        ])
      );
    });
  }).reduce(flattenArray, []);
}

function generateProgram(flux, projectID){
  return [].concat(
    generateEventBindings(flux, projectID)
  );
}

export default function generateScript(flux, projectID){
  let ast = {
    type: 'Program',
    body: generateProgram(flux, projectID)
  };

  return escodegen.generate(ast, {
    format: {
      indent: {
        style: '  '
      }
    }
  });
}
