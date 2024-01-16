const mongodb = require('mongodb')
const db = require('../data/database')

class Order {
    // Status => pending, fulfilled, cancelled
    constructor(cart, userData, status = 'pending', date, orderId) {
        this.productData = cart;
        this.userData = userData;
        this.status = status;
        this.date = new Date(date);
        if (this.date) {
            this.formattedDate = this.date.toLocaleDateString('en-IN', {
                weekday: 'short',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
        }
        this.id = orderId;
    }

    static transformOrderDoc(orderDoc) {
        return new Order(
            orderDoc.productData,
            orderDoc.userData,
            orderDoc.status,
            orderDoc.date,
            orderDoc._id
        )
    }
    
    static transformOrderDocs(orderDocs) {
        return orderDocs.map(this.transformOrderDoc)
    }

    static async findById(orderId) {
        const order = await db.getDB().collection('orders').findOne({ _id: new mongodb.ObjectId(orderId) })

        return this.transformOrderDoc(order)
    }

    static async findAll() {
        const orders = await db.getDB().collection('orders').find().sort({ _id: -1 }).toArray();

        return this.transformOrderDocs(orders)
    } 

    static async findAllForUser(userId) {
        const uid = new mongodb.ObjectId(userId);

        const orders = await db.getDB().collection('orders').find({ 'userData._id': uid }).sort({ _id: -1 }).toArray(); // Sort in descending order (MongoDB contains timestamp in id)

        return this.transformOrderDocs(orders)
    }

    save() {
        if (this.id) {
            // Update Order
            const orderId = new mongodb.ObjectId(this.id);
            return db
                .getDB()
                .collection('orders')
                .updateOne({ _id: orderId }, { $set: { status: this.status } })
        } else {
            const orderDoc = {
                userData: this.userData,
                productData: this.productData,
                date: new Date(),
                status: this.status
            };

            return db.getDB().collection('orders').insertOne(orderDoc);
        }
    }
}

module.exports = Order;