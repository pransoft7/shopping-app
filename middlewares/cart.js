const Cart = require('../models/cart.model');

function initialiseCart(req, res, next) {
    let cart;

    if (!req.session.cart) {
        cart = new Cart()
    } else {
        const sessionCart = req.session.cart;
        cart = new Cart(sessionCart.items, sessionCart.totalQuantity, sessionCart.totalPrice ); // Re-initialising to access the cart methods
    }

    res.locals.cart = cart;
    next();
}

module.exports = initialiseCart;