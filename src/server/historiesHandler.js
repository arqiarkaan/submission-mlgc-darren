const { Firestore } = require('@google-cloud/firestore');

async function getHistoriesHandler(request, h) {
  const db = new Firestore();
  const predictCollection = db.collection('prediction');

  const snapshot = await predictCollection.get();
  const histories = snapshot.docs.map((doc) => ({
    id: doc.id,
    history: doc.data(),
  }));

  return h
    .response({
      status: 'success',
      data: histories,
    })
    .code(200);
}

module.exports = getHistoriesHandler;
