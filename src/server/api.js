import express from 'express';
import {api} from '../utils/request';

const app = express();

function refreshCSRFToken(req, res, next){
  res.header('X-CSRF-Token', req.csrfToken());
  next();
}

function getText(res){
  return res.text();
}

app.post('/tokens', refreshCSRFToken, (req, res, next) => {
  api('tokens', {
    method: 'post',
    body: req.body
  }).then(response => {
    res.status(response.status);
    return response;
  })
  .then(getText)
  .then(txt => {
    if (txt){
      req.session.token = JSON.parse(txt);
    }

    res.send(txt);
  }).catch(next);
});

app.delete('/tokens', refreshCSRFToken, (req, res, next) => {
  api('tokens/' + req.body.id, {
    method: 'delete'
  }).then(response => {
    let {status} = response;

    if (status === 204){
      req.session.token = null;
    }

    res.status(status);
    return response;
  })
  .then(getText)
  .then(txt => {
    res.send(txt);
  }).catch(next);
});

app.delete('/users', refreshCSRFToken, (req, res, next) => {
  let {token} = req.session;

  if (!token || token.user_id !== req.body.id){
    return res.status(403).send({
      error: 1303,
      message: 'Token is invalid.'
    });
  }

  api('users/' + req.body.id, {
    method: 'delete',
    headers: {
      Authorization: 'Bearer ' + token.id
    }
  }).then(response => {
    let {status} = response;

    if (status === 204){
      req.session.token = null;
    }

    res.status(status);
    return response;
  })
  .then(getText)
  .then(txt => {
    res.send(txt);
  }).catch(next);
});

app.use((req, res, next) => {
  res.status(404).send({
    error: 1002,
    message: 'This is the internal API. Check http://tkusd.zespia.tw/v1 for more detail.'
  });
});

export default app;
