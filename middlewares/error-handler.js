function errorHandler(error, req, res, next) {
    console.log(error);
    res.status(500).render('shared/error500');
}

module.exports = errorHandler;