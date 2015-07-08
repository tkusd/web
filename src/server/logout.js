import {api} from '../utils/request';

export default function logout(req, res, next){
  let {token} = req.session;
  if (!token) return res.redirect('/');

  api('tokens/' + token.id, {
    method: 'delete'
  })
  .then(response => {
    if (response.status === 204){
      req.session.token = null;
    }

    res.redirect('/');
  }).catch(next);
}
