const {
  postPredictHandler,
  getPredictHistoriesHandler,
} = require('../server/handler');

const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
      },
    },
  },
  {
    path: '/predict/histories',
    method: 'GET',
    handler: getPredictHistoriesHandler,
    options: {},
  },
];

module.exports = routes;
