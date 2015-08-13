require('framework7');
require('framework7/dist/css/framework7.material.css');
require('framework7/dist/css/framework7.material.colors.min.css');

const app = new window.Framework7();
const mainView = app.addView('.view-main', {
  domCache: true,
  material: true
});
