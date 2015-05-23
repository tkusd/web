import express from 'express';
import {api} from '../utils/request';
import {assign} from 'lodash';

const app = express();

function refreshCSRFToken(req, res, next){
  res.header('X-CSRF-Token', req.csrfToken());
  next();
}

app.post('/tokens', refreshCSRFToken, (req, res, next) => {
  api('post', 'tokens')
    .send(req.body)
    .end((err, data) => {
      let {status, body} = data;

      if (!err){
        req.session.token = body;
      }

      res.status(status).send(body);
    });
});

app.delete('/tokens', refreshCSRFToken, (req, res, next) => {
  api('delete', 'tokens/' + req.body.id).end((err, data) => {
    let {status, body} = data;

    if (!err){
      req.session.token = null;
    }

    res.status(status).send(body);
  });
});

app.delete('/users', refreshCSRFToken, (req, res, next) => {
  let {token} = req.session;

  if (!token || token.user_id !== req.body.id){
    return res.status(403).send({
      error: 1303,
      message: 'Token is invalid.'
    });
  }

  api('delete', 'users/' + req.body.id)
    .set('Authorization', 'Bearer ' + token.id)
    .end((err, data) => {
      let {status, body} = data;

      if (!err){
        req.session.token = null;
      }

      res.status(status).send(body);
    });
});

app.use((req, res, next) => {
  res.status(404).send({
    error: 1002,
    message: 'This is the internal API. Check http://tkusd.zespia.tw/v1 for more detail.'
  });
});

export default app;
