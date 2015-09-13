import express from 'express';
import request from 'request';
import omit from 'lodash/object/omit';
import bodyParser from 'body-parser';

const app = express();

function getAPIEndpoint(req){
  return req.flux.getStore().AppStore.getAPIEndpoint();
}

app.use((req, res, next) => {
  res.header('X-CSRF-Token', req.csrfToken());
  next();
});

function checkToken(req, res, next){
  if (!req.session.token) return next();

  const apiEndpoint = getAPIEndpoint(req);
  const {token} = req.session;

  request.put(apiEndpoint + 'tokens/' + token.id, (err, res) => {
    if (err) return next(err);

    if (res.statusCode === 200){
      res.status(400).send({
        error: 2000,
        message: 'You have already logged in.'
      });
    } else {
      req.session.token = null;
      next();
    }
  });
}

app.post('/tokens', checkToken, bodyParser.json(), (req, res, next) => {
  const apiEndpoint = getAPIEndpoint(req);

  request.post(apiEndpoint + 'tokens', {
    body: req.body,
    json: true
  }, (err, response, body) => {
    if (err) return next(err);

    if (response.statusCode === 201){
      req.session.token = body;
    }

    res.set('Content-Type', 'application/json');
    res.status(response.statusCode);
    res.send(omit(body, 'secret'));
  });
});

app.delete('/tokens', bodyParser.json(), (req, res, next) => {
  const apiEndpoint = getAPIEndpoint(req);
  let {token} = req.session;

  if (!token){
    return res.status(400).send({
      error: 2001,
      message: 'You have not logged in yet.'
    });
  }

  request.del(apiEndpoint + 'tokens/' + req.body.id, (err, response, body) => {
    if (err) return next(err);

    if (response.statusCode === 204){
      req.session.token = null;
    }

    res.status(response.statusCode);
    res.send(body);
  });
});

app.use((req, res, next) => {
  const apiEndpoint = getAPIEndpoint(req);
  const {token} = req.session;
  let headers = {
    'Content-Type': req.get('Content-Type')
  };

  if (token){
    headers.Authorization = 'Bearer ' + token.secret;
  }

  let url = apiEndpoint + req.url.substring(1);
  let stream = request(url, {
    method: req.method,
    headers
  });

  req.pipe(stream).on('error', next)
    .pipe(res).on('error', next);
});

export default app;
