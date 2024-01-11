const { MongoClient } = require('mongodb');

let database;

async function conntoDB() {
    const client = await MongoClient.connect('mongodb://localhost:27017');
    database = client.db('shop-data');
}

function getDB() {
    if (!database) {
        throw new Error('Database not initialized');
    }
    return database;
}

module.exports = {
    conntoDB,
    getDB
}
