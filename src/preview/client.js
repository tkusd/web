require('framework7');
require('framework7/dist/css/framework7.ios.css');

const app = new window.Framework7();
// const $ = window.Dom7;
const mainView = app.addView('.view-main', {
  domCache: true
});
