import escodegen from 'escodegen';
import {
  generateLiteral,
  generateIdentifier,
  generateExpressionStatement,
  generateCallExpression,
  generateBlockStatement,
  generateMemberExpression,
  generateObjectExpression,
  generateVariable
} from '../utils/esprima';
import base62uuid from '../utils/base62uuid';

function getElementID(element){
  return '#e' + base62uuid(element.get('id'));
}

function flattenArray(arr, item){
  return item ? arr.concat(item) : arr;
}

function generateEventAction(flux, event){
  const {ActionStore} = flux.getStore();
  const action = ActionStore.getAction(event.get('action_id'));
  let args = [];

  switch (action.get('action')){
    case 'alert':
      args = [
        generateLiteral(action.getIn(['data', 'text']))
      ];

      if (action.getIn(['data', 'title'])){
        args.push(action.getIn(['data', 'title']));
      }

      return generateCallExpression(generateMemberExpression('app.alert'), args);

    case 'confirm':
      args = [
        generateLiteral(action.getIn(['data', 'text']))
      ];

      if (action.getIn(['data', 'title'])){
        args.push(action.getIn(['data', 'title']));
      }

      return generateCallExpression(generateMemberExpression('app.confirm'), args);

    case 'prompt':
      args = [
        generateLiteral(action.getIn(['data', 'text']))
      ];

      if (action.getIn(['data', 'title'])){
        args.push(action.getIn(['data', 'title']));
      }

      return generateCallExpression(generateMemberExpression('app.prompt'), args);
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
  const {ProjectStore} = flux.getStore();
  const project = ProjectStore.getProject(projectID);

  return [].concat(
    generateVariable('app', {
      type: 'NewExpression',
      callee: generateIdentifier('Framework7'),
      arguments: [
        generateObjectExpression({
          material: generateLiteral(project.get('theme') === 'material'),
          modalTitle: generateLiteral(project.get('title', '')),
          modalCloseByOutside: generateLiteral(true)
        })
      ]
    }),
    generateVariable('mainView',
      generateCallExpression(generateMemberExpression('app.addView'), [
        generateLiteral('.view-main'),
        generateObjectExpression({
          domCache: generateLiteral(true)
        })
      ])
    ),
    generateExpressionStatement(
      generateCallExpression(generateMemberExpression('mainView.router.load'), [
        generateObjectExpression({
          pageName: generateLiteral(project.get('main_screen', '')),
          animatePages: generateLiteral(false)
        })
      ])
    ),
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
