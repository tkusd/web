import express from 'express';
import {api} from '../utils/request';

const app = express();

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

app.use((req, res, next) => {
  res.header('X-CSRF-Token', req.csrfToken());
  next();
});

function checkToken(req, res, next){
  if (!req.session.token) return next();

  const {token} = req.session;

  api('tokens/' + token.id, {
    method: 'put'
  })
  .then(response => {
    if (response.status === 200) {
      res.status(400).send({
        error: 2000,
        message: 'You have already logged in.'
      });
    } else {
      req.session.token = null;
      next();
    }
  })
  .catch(next);
}

app.post('/tokens', checkToken, (req, res, next) => {
  api('tokens', {
    method: 'post',
    body: req.body
  })
  .then(response => {
    if (response.status !== 201){
      return proxy(res)(response);
    }

    return response.json().then(json => {
      req.session.token = json;
      res.status(response.status).json(json);
    });
  })
  .catch(next);
});

app.delete('/tokens', (req, res, next) => {
  let {token} = req.session;

  if (!token){
    return res.status(400).send({
      error: 2001,
      message: 'You have not logged in yet.'
    });
  }

  api('tokens/' + req.body.id, {
    method: 'delete'
  })
  .then(response => {
    if (response.status === 204){
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
