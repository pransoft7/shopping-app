const session = require('express-session');
const mongoDbStore = require('connect-mongodb-session')(session);

function createSessionStore() {
    const store = new mongoDbStore({
        uri: 'mongodb://localhost:27017',
        databaseName: 'shop-data',
        collection: 'sessions'
    });
    return store;
}

function createSessionConfig() {
    return {
        secret: 'jasoncammisaismyfavoriteautomotivejournalist',
        resave: false,
        saveUninitialized: false,
        store: createSessionStore(),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
        }
    }
}

module.exports = createSessionConfig;