import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        default:"EJEMPLO DE ITEM",
    },
    price: {
        type: Number,
        required: true,
    },
    imageUrl: {
        type: String, 
        required: true,
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

export default Item;

