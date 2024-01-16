function errorHandler(error, req, res, next) {
    console.log(error);

    if (error.code === 404) {
        return res.status(404).render('shared/error404');
    }

    res.status(500).render('shared/error500');
}

module.exports = errorHandler;