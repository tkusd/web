require('babel-core/polyfill');

import React from 'react';
import Router from 'react-router';
import {history} from 'react-router/lib/HashHistory';

window.$INIT(React, Router, history);
