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
import {actions} from '../constants/ElementTypes';

function getElementID(element){
  return '#e' + element.get('id');
}

function getActionID(actionID){
  return 'a_' + base62uuid(actionID);
}

function flattenArray(arr, item){
  return item ? arr.concat(item) : arr;
}

function generateActionContent(flux, action){
  let args = [];

  switch (action.get('action')){
  case actions.alert:
    args = [
      generateLiteral(action.getIn(['data', 'text'], ''))
    ];

    if (action.getIn(['data', 'title'])){
      args.push(action.getIn(['data', 'title']));
    }

    return generateCallExpression(generateMemberExpression('app.alert'), args);

  case actions.confirm:
    args = [
      generateLiteral(action.getIn(['data', 'text'], ''))
    ];

    if (action.getIn(['data', 'title'])){
      args.push(action.getIn(['data', 'title']));
    }

    return generateCallExpression(generateMemberExpression('app.confirm'), args);

  case actions.prompt:
    args = [
      generateLiteral(action.getIn(['data', 'text'], ''))
    ];

    if (action.getIn(['data', 'title'])){
      args.push(action.getIn(['data', 'title']));
    }

    return generateCallExpression(generateMemberExpression('app.prompt'), args);

  case actions.transition:
    const screen = action.getIn(['data', 'screen']);
    if (!screen) return [];

    return generateCallExpression(generateMemberExpression('view.router.load'), [
      generateObjectExpression({
        pageName: generateLiteral(screen)
      })
    ]);

  case actions.back:
    return generateCallExpression(generateMemberExpression('view.router.back'), []);
  }

  return [];
}

function generateActions(flux, projectID){
  const {ActionStore} = flux.getStore();
  const actions = ActionStore.getActionsOfProject(projectID);

  return actions.map((action, id) => {
    return {
      type: 'FunctionDeclaration',
      id: generateIdentifier(getActionID(id)),
      params: [],
      body: generateBlockStatement(
        generateActionContent(flux, action)
      )
    };
  }).toArray();
}

function generateEvents(flux, projectID){
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
          generateIdentifier(getActionID(event.get('action_id')))
        ])
      );
    });
  }).reduce(flattenArray, []);
}

function generateProgram(flux, projectID){
  const {ProjectStore} = flux.getStore();
  const project = ProjectStore.getProject(projectID);

  return [].concat(
    generateExpressionStatement(
      generateLiteral('use strict')
    ),
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
    generateVariable('view',
      generateCallExpression(generateMemberExpression('app.addView'), [
        generateLiteral('.view-main'),
        generateObjectExpression({
          domCache: generateLiteral(true)
        })
      ])
    ),
    generateExpressionStatement(
      generateCallExpression(generateMemberExpression('view.router.load'), [
        generateObjectExpression({
          pageName: generateLiteral(project.get('main_screen', '')),
          animatePages: generateLiteral(false)
        })
      ])
    ),
    generateActions(flux, projectID),
    generateEvents(flux, projectID)
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
