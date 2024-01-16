const Product = require('./product.model')

class Cart {
    constructor(items = [], totalQuantity = 0, totalPrice = 0) {
        this.items = items;
        this.totalQuantity = totalQuantity;
        this.totalPrice = totalPrice;
    }

    async updatePrices() {
        const productIDs = this.items.map(function(item) {
            return item.product.id
        });
        const products = await Product.findMultiple(productIDs);

        const cartItemIDsToDelete = [];

        for (const cartItem of this.items) {
            const product = products.find(function(prod) {
                return prod.id === cartItem.product.id
            });

            if (!product) {
                // => Product Deleted - schedule to remove from cart
                cartItemIDsToDelete.push(cartItem.product.id);
            } else {
                // => Product exists - update product data and price in cart
                cartItem.product = product;
                cartItem.totalPrice = cartItem.quantity * cartItem.product.price;
            }

            if (cartItemIDsToDelete.length > 0) {
                console.log(this.items)
                this.items = this.items.filter(function(item) {
                    return cartItemIDsToDelete.indexOf(item.product.id) < 0;
                }) // remove non-existent products from this.items by filter method
                console.log(this.items)
            }

            // Re-calculate Cart Totals
            this.totalPrice = 0
            this.totalQuantity = 0

            for (const item of this.items) {
                this.totalQuantity += item.quantity
                this.totalPrice += item.totalPrice
            }
        }
    }

    addItem(product) {
        const cartItem = {
            product: product,
            quantity: 1,
            totalPrice: product.price
        };

        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i]
            if (item.product.id === product.id) {
                cartItem.quantity = +item.quantity + 1;
                cartItem.totalPrice = item.totalPrice + product.price
                this.items[i] = cartItem;

                this.totalQuantity++;
                this.totalPrice += product.price;
                return;
            }
        }

        this.items.push(cartItem);
        this.totalQuantity++;
        this.totalPrice += product.price;
    }

    updateItem(productId, newQuantity) {
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i]
            if (item.product.id === productId && newQuantity > 0) {
                const cartItem = { ...item }
                const quantityChange = newQuantity - item.quantity
                cartItem.quantity = newQuantity;
                cartItem.totalPrice = newQuantity * item.product.price;
                this.items[i] = cartItem;

                this.totalQuantity = this.totalQuantity + quantityChange;
                this.totalPrice += quantityChange * item.product.price;

                return { updatedItemPrice: cartItem.totalPrice };
            } else if (item.product.id === productId && newQuantity <= 0) {
                this.items.splice(i, 1);

                this.totalQuantity -= item.quantity;
                this.totalPrice -= (item.totalPrice)
                console.log(this.totalPrice)

                return { updatedItemPrice: 0 }
            }
        }
    }
}

module.exports = Cart;