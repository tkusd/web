import {Flux} from './flux';

const app = new Flux();

app.registerStore(require('./stores/AppStore'));
app.registerStore(require('./stores/UserStore'));
app.registerStore(require('./stores/TokenStore'));
app.registerStore(require('./stores/ProjectStore'));
app.registerStore(require('./stores/ElementStore'));
app.registerStore(require('./stores/ComponentStore'));

export default app;
