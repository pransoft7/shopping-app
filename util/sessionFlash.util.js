function getSessionData(req) {
    const sessionData = req.session.enteredData;
    req.session.enteredData = null;
    return sessionData;
}

function flashDataToSession(req, data, action) {
    req.session.enteredData = data;
    req.session.save(action);
}

module.exports = {
    getSessionData,
    flashDataToSession
}