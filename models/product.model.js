const mongodb = require('mongodb')
const db = require('../data/database');

class Product {
    constructor(productData) {
        this.title = productData.title;
        this.summary = productData.summary;
        this.price = +productData.price;
        this.description = productData.description;
        this.image = productData.image; // name of image file
        this.updateImageData();
        if (productData._id){
            this.id = productData._id.toString();
        }
    }
    
    static async findAll() {
        const products = await db.getDB().collection('products').find().toArray();
        return products.map(function(productDoc) {
            return new Product(productDoc);
        });
    }

    static async findById(productId) {
        let prodId;
        try {
            prodId = new mongodb.ObjectId(productId);
        } catch (error) {
            error.code = 404;
            throw error;
        }
        const product = await db.getDB().collection('products').findOne({ _id: prodId });

        if (!product) {
            const error = new Error('Could not find product with the given ID');
            error.code = 404;
            throw error;
        }
        
        return new Product(product); // return new instance of Product class to have this.id property
    }

    static async findMultiple(ids) {
        const productIDs = ids.map(function(id) {
            return new mongodb.ObjectId(id);
        });

        const products = await db
            .getDB()
            .collection('products')
            .find({ _id: { $in: productIDs } })
            .toArray();

        return products.map(function (productDoc) {
            return new Product(productDoc);
        })
    }

    updateImageData() {
        this.imagePath = `/productData/images/${this.image}`; // path to image file
        this.imageUrl = `/products/assets/images/${this.image}`; // url to image file for frontend
    }

    async save() {
        const productData = {
            title: this.title,
            summary: this.summary,
            price: this.price,
            description: this.description,
            image: this.image
            // no need to store path and url in database as they can be derived from image name dynamically
        }

        if (this.id) {
            if (!this.image) {
                delete productData.image // If no new image is uploaded, don't update image field
            }

            await db.getDB().collection('products').updateOne(
                { _id: new mongodb.ObjectId(this.id) },
                { $set: productData }
            );
        } else {
            await db.getDB().collection('products').insertOne(productData);
        }
    }

    async replaceImage(newImage) {
        this.image = newImage
        this.updateImageData();
    }

    async remove() {
        const productId = new mongodb.ObjectId(this.id);
        return db.getDB().collection('products').deleteOne({ _id: productId });
    }
}

module.exports = Product;