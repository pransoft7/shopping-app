const multer  = require('multer');
const uuid = require('uuid');

const storage = multer.diskStorage({
    destination: 'productData/images',
    filename: (req, file, cb) => {
        cb(null, uuid.v4() + '-' + file.originalname);
    }
})

const upload = multer({ storage: storage });

const imageUpload = upload.single('image');

module.exports = imageUpload;