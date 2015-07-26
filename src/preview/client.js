require('babel-core/polyfill');

import React from 'react';
import Router from 'react-router';
import {history} from 'react-router/lib/HashHistory';

require('../styles/preview/base.styl');

window.$INIT(React, Router, history);
