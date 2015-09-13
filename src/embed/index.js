import path from 'path';

import readWebpackStats from '../server/readWebpackStats';
import generateScript from './generateScript';
import prepareFullProject from '../server/prepareFullProject';
import nunjucksRender from '../utils/nunjucksRender';

const TEMPLATE_PATH = path.join(__dirname, 'template.html');

export default function(req, res, next){
  const projectID = req.params.id;
  const flux = req.flux;

  return prepareFullProject(req).then(() => {
    return Promise.all([
      readWebpackStats(req),
      generateScript(flux, projectID)
    ]);
  }).then(([stats, script]) => {
    const {ProjectStore} = flux.getStore();
    const project = ProjectStore.getProject(projectID);

    return nunjucksRender(TEMPLATE_PATH, {
      script: `window.$INIT = function(){${script}}`,
      stats,
      project
    });
  }).then(html => {
    res.send(html);
  }).catch(err => {
    if (err.response && err.response.status === 404){
      return res.status(404).send('Not found');
    }

    next(err);
  });
}
