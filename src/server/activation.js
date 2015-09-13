import {api} from '../utils/request';

export default function(req, res, next){
  api('activation/' + req.params.id, {
    method: 'post'
  }, req.flux)
    .then(res => {
      res.redirect('/');
    });
}
