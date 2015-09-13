import createRoute from './utils/createRoute';

export default function(context){
  const r = createRoute.bind(null, context);

  return {
    ...r(require('./components/Application')),
    childRoutes: [
      {
        ...r(require('./components/HomeContainer')),
        childRoutes: [
          {
            path: '/',
            ...r(require('./components/Home'))
          }
        ]
      },
      {
        ...r(require('./components/LoginContainer')),
        childRoutes: [
          {
            path: '/signup',
            ...r(require('./components/Signup'))
          },
          {
            path: '/login',
            ...r(require('./components/Login'))
          },
          {
            path: '/reset_password/:resetToken',
            ...r(require('./components/ResetPassword'))
          }
        ]
      },
      {
        ...r(require('./components/Dashboard')),
        childRoutes: [
          {
            path: '/settings',
            ...r(require('./components/Settings'))
          },
          {
            path: '/users/:userID',
            ...r(require('./components/Profile'))
          },
          {
            path: '/projects/:projectID',
            ...r(require('./components/Project')),
            childRoutes: [
              {
                path: 'screens/:screenID',
                ...r(require('./components/Screen'))
              }
            ]
          },
          {
            path: '/projects/:projectID/preview',
            ...r(require('./components/Preview'))
          }
        ]
      },
      {
        path: '/logout',
        ...r(require('./components/Logout'))
      },
      {
        path: '*',
        ...r(require('./components/NotFound'))
      }
    ]
  };
}
