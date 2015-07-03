import {Flux} from './flux';
import * as stores from './stores';

const app = new Flux(stores);

export default app;
