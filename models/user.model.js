const bcrypt = require('bcryptjs');
const db = require('../data/database');
const mongodb = require('mongodb')

class User {
    constructor(email, password, fullname, street, postal, city) {
        this.email = email;
        this.password = password;
        this.name = fullname;
        this.address = {
            street: street,
            postalCode: postal,
            city: city
        }
    };

    static findById(userId) {
        const uid = new mongodb.ObjectId(userId);
        return db.getDB().collection('users').findOne({ _id: uid }, { projection: { password: 0 } });
    }

    getUserWithEmail() {
        return db.getDB().collection('users').findOne({ email: this.email });
    }

    async signup() {
        const hashedPwd = await bcrypt.hash(this.password, 12);
        await db.getDB().collection('users').insertOne({
            email: this.email,
            password: hashedPwd,
            name: this.name,
            address: this.address
        });
    }

    async userExists() {
        const existingUser = await this.getUserWithEmail();
        if (existingUser) {
            return true;
        }
        return false;
    }

    isCorrectPassword(password) {
        return bcrypt.compare(this.password, password);
    }
}

module.exports = User;