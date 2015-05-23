import Fluxible from 'fluxible';

let app = new Fluxible({
  stores: [
    require('./stores/AppStore'),
    require('./stores/UserStore'),
    require('./stores/TokenStore')
  ]
});

export default app;
