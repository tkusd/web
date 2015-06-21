import express from 'express';
import {api} from '../utils/request';

const app = express();

function refreshCSRFToken(req, res, next){
  res.header('X-CSRF-Token', req.csrfToken());
  next();
}

function proxy(res){
  return function(response){
    let contentType = response.headers.get('Content-Type');

    res.status(response.status);
    if (contentType) res.header('Content-Type', contentType);

    return response.text().then(txt => {
      res.send(txt);
      return response;
    });
  };
}

app.post('/tokens', refreshCSRFToken, (req, res, next) => {
  api('tokens', {
    method: 'post',
    body: req.body
  })
  .then(response => {
    if (response.status !== 201) return response;

    return response.text().then(txt => {
      let json = JSON.parse(txt);
      req.session.token = json;

      // Replace response.text and response.json because the body has been decoded.
      response.text = () => Promise.resolve(txt);
      response.json = () => Promise.resolve(json);

      return response;
    });
  })
  .then(proxy(res))
  .catch(next);
});

app.delete('/tokens', refreshCSRFToken, (req, res, next) => {
  let {token} = req.session;

  api('tokens/' + req.body.id, {
    method: 'delete'
  })
  .then(response => {
    if (response.status === 204 && token.id === req.body.id){
      req.session.token = null;
    }

    return response;
  })
  .then(proxy(res))
  .catch(next);
});

app.use((req, res, next) => {
  res.status(404).send({
    error: 1002,
    message: 'This is the internal API. Check http://tkusd.zespia.tw/v1 for more detail.'
  });
});

export default app;
