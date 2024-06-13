import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    imagen: {
        data: Buffer,
        contentType: String
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
    itemType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ItemType',
        required: true,
    }
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
