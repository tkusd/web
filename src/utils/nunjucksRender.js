import nunjucks, {Environment} from 'nunjucks';
import fs from 'graceful-fs';
import promisify from '../utils/promisify';

const env = new Environment(null, {
  autoescape: false
});
const readFile = promisify(fs.readFile);
let compiledTemplates = {};

function getCompiledTemplate(path){
  if (process.env.NODE_ENV === 'production' && compiledTemplates.hasOwnProperty(path)){
    return Promise.resolve(compiledTemplates[path]);
  }

  return readFile(path, 'utf8').then(content => {
    let template = compiledTemplates[path] = nunjucks.compile(content, env, path);

    return template;
  });
}

export default function nunjucksRender(templatePath, data){
  return getCompiledTemplate(templatePath).then(template => {
    return new Promise((resolve, reject) => {
      template.render(data, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  });
}
