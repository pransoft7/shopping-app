const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('/products');
});

router.get('/401', (req, res) => {
    res.status(401).render('shared/error401');
})

router.get('/403', (req, res) => {
    res.status(403).render('shared/error403');
})

module.exports = router;