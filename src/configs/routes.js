export default {
  home: {
    path: '/',
    method: 'GET',
    handler: require('../components/Home'),
    label: 'Home',
    action: (context, payload, done) => {
      done();
    }
  }
};
