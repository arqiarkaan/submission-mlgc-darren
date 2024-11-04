// server.js
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const routes = require('../server/routes');
const loadModel = require('../services/loadModel');
const PredictionError = require('../exceptions/PredictionError');

(async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
      payload: {
        maxBytes: 1000000, // 1MB limit
      },
    },
  });

  const model = await loadModel();
  server.app.model = model;

  server.route(routes);

  server.ext('onPreResponse', function (request, h) {
    const response = request.response;

    // Handle payload too large error
    if (response.output && response.output.statusCode === 413) {
      const newResponse = h.response({
        status: 'fail',
        message: 'Payload content length greater than maximum allowed: 1000000',
      });
      newResponse.code(413);
      return newResponse;
    }

    // Handle prediction-specific errors
    if (response instanceof PredictionError) {
      const newResponse = h.response({
        status: 'fail',
        message: 'Terjadi kesalahan dalam melakukan prediksi',
      });
      newResponse.code(400);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server start at: ${server.info.uri}`);
})();
