const postPredictHandler = require('./predictHandler');
const getHistoriesHandler = require('./historiesHandler');
const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        maxBytes: 1000000,
        failAction: (request, h, err) => {
          if (err.output && err.output.statusCode === 413) {
            return h
              .response({
                status: 'fail',
                message:
                  'Payload content length greater than maximum allowed: 1000000',
              })
              .code(413)
              .takeover();
          }
          throw err;
        },
      },
    },
  },
  {
    path: '/predict/histories',
    method: 'GET',
    handler: getHistoriesHandler,
  },
];

module.exports = routes;
