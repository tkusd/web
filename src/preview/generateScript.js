import escodegen from 'escodegen';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
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
import View from '../components/preview/View';
import getAssetBlobURL from '../utils/getAssetBlobURL';
import merge from 'lodash/object/merge';

function getElementID(element){
  return '#e' + element.get('id');
}

function getActionID(actionID){
  return 'a_' + base62uuid(actionID);
}

function getViewID(elementID){
  return 'v_' + base62uuid(elementID);
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
      args.push(
        generateLiteral(action.getIn(['data', 'title']))
      );
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
        content: generateIdentifier(getViewID(screen))
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
            [generateIdentifier('document')]
          ),
          property: generateIdentifier('on')
        }, [
          generateLiteral(event.get('event')),
          generateLiteral(getElementID(element)),
          generateIdentifier(getActionID(event.get('action_id')))
        ])
      );
    });
  }).reduce(flattenArray, []);
}

function generateViews(flux, projectID, options){
  const {ProjectStore, ElementStore} = flux.getStore();
  const project = ProjectStore.getProject(projectID);
  const elements = ElementStore.getElementsOfProject(projectID);
  const mainScreen = project.get('main_screen');

  let result = elements.filter(element => !element.get('element_id'))
    .map(element => (
      createElement(View, {
        ...options,
        elements,
        project,
        element
      })
    ))
    .map(renderToStaticMarkup)
    .map((str, key) => (
      generateVariable(getViewID(key), generateLiteral(str))
    ))
    .toArray();

  if (mainScreen){
    result.push(generateExpressionStatement(
      generateCallExpression(generateMemberExpression('view.router.load'), [
        generateObjectExpression({
          content: generateIdentifier(getViewID(mainScreen)),
          animatePages: generateLiteral(false)
        })
      ])
    ));
  }

  return result;
}

function generateProgram(flux, projectID, options){
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
        generateLiteral('.view-main')
      ])
    ),
    generateViews(flux, projectID, options),
    generateActions(flux, projectID),
    generateEvents(flux, projectID)
  );
}

export default function generateScript(flux, projectID, options){
  const {AppStore} = flux.getStore();

  options = merge({
    getAssetURL: getAssetBlobURL.bind(this, AppStore.getAPIEndpoint())
  }, options);

  let ast = {
    type: 'Program',
    body: generateProgram(flux, projectID, options)
  };

  return escodegen.generate(ast, {
    format: {
      indent: {
        style: '  '
      }
    }
  });
}
