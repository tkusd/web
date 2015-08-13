require('framework7');
require('framework7/dist/css/framework7.ios.css');
require('framework7/dist/css/framework7.ios.colors.min.css');

const app = new window.Framework7();
const mainView = app.addView('.view-main', {
  domCache: true
});
