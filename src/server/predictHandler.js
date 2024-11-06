const predictClassification = require('../services/inferenceService');
const storeData = require('../services/storeData');
const crypto = require('crypto');

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  if (image._data.length > 1000000) {
    const response = h.response({
      status: 'fail',
      message: 'Payload content length greater than maximum allowed: 1000000',
    });
    response.code(413);
    return response;
  }

  const { model } = request.server.app;
  const { confidenceScore, label, suggestion } = await predictClassification(
    model,
    image._data
  );
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id,
    result: label,
    suggestion,
    createdAt,
  };

  await storeData(id, data);

  const response = h.response({
    status: 'success',
    message: 'Model is predicted successfully',
    data,
  });
  response.code(201);
  return response;
}

module.exports = postPredictHandler;
